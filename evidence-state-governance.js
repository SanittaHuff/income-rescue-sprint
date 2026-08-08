(() => {
  const REVIEWED = 'reviewed-by-user';
  const NEEDS_REVIEW = 'needs-review';
  const SOURCE_SUPPORTED = 'supported-by-source';
  const INDEPENDENT = 'independently-verified';
  const ALLOWED = new Set([REVIEWED, NEEDS_REVIEW, SOURCE_SUPPORTED, INDEPENDENT, 'rejected']);

  function normalizeEvidenceStatus(value) {
    if (value === 'verified') return REVIEWED;
    if (value === 'pending') return NEEDS_REVIEW;
    return ALLOWED.has(value) ? value : NEEDS_REVIEW;
  }

  function isReviewed(item) {
    return item?.status === REVIEWED || item?.status === SOURCE_SUPPORTED || item?.status === INDEPENDENT;
  }

  function statusLabel(status) {
    return {
      [REVIEWED]: 'Reviewed by you',
      [NEEDS_REVIEW]: 'Needs your review',
      [SOURCE_SUPPORTED]: 'Supported by a source',
      [INDEPENDENT]: 'Independently verified',
      rejected: 'Rejected'
    }[status] || 'Needs your review';
  }

  function migrateEvidenceCollection(items) {
    return Array.isArray(items) ? items.map(item => ({
      ...item,
      status: normalizeEvidenceStatus(item?.status),
      reviewedAt: item?.reviewedAt || item?.verifiedAt || null
    })) : [];
  }

  function migrateWorkspace(input) {
    if (!input || typeof input !== 'object') return input;
    return {
      ...input,
      version: Math.max(Number(input.version) || 1, 2),
      evidence: migrateEvidenceCollection(input.evidence)
    };
  }

  // Migrate the active in-memory and persisted workspace without deleting user data.
  state = migrateWorkspace(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  calculateProgress = function calculateProgressGoverned() {
    const reviewedEvidence = state.evidence.filter(isReviewed).length;
    const approvedComponents = state.components.filter(item => item.status === 'approved').length;
    const activeJobs = state.jobs.filter(item => item.status !== 'Skipped').length;
    const profileComplete = Boolean(state.profile.name && state.profile.targetRole);
    const score =
      (profileComplete ? 10 : 0) +
      Math.min(30, reviewedEvidence * 10) +
      Math.min(25, approvedComponents * 10) +
      Math.min(25, activeJobs * 8) +
      Math.min(10, state.completedActions.length * 2);
    return Math.min(100, score);
  };

  getNextAction = function getNextActionGoverned() {
    const needsReview = state.evidence.find(item => !isReviewed(item));
    const reviewed = state.evidence.filter(isReviewed);
    const unconverted = reviewed.find(item => !state.components.some(component => component.evidenceId === item.id));
    const draftComponent = state.components.find(item => item.status !== 'approved');
    const urgentJob = [...state.jobs]
      .filter(job => job.status !== 'Skipped' && job.status !== 'Applied')
      .sort((a, b) => scoreJob(b) - scoreJob(a))[0];

    if (!state.profile.targetRole) return { key: 'profile', title: 'Set your target role', detail: 'A target role makes evidence and opportunity guidance more useful.', panel: 'settings' };
    if (!state.evidence.length) return { key: 'evidence-add', title: 'Add one high-confidence experience example', detail: 'Capture a real accomplishment, the tools used, and the result.', panel: 'evidence' };
    if (needsReview) return { key: `review-${needsReview.id}`, title: `Review evidence from ${needsReview.role}`, detail: 'Check the facts yourself before allowing them into resume content.', panel: 'evidence' };
    if (unconverted) return { key: `component-${unconverted.id}`, title: 'Create a resume component from reviewed evidence', detail: `Convert the facts you reviewed from ${unconverted.role} into editable recruiter-facing language.`, panel: 'resume' };
    if (draftComponent) return { key: `approve-${draftComponent.id}`, title: 'Review and approve a resume component', detail: 'Only wording you approve should be eligible for later resume assembly.', panel: 'resume' };
    if (!state.jobs.length) return { key: 'job-add', title: 'Add one target opportunity', detail: 'Record a role so the system can compare fit, urgency, pay, and work arrangement.', panel: 'jobs' };
    if (urgentJob) return { key: `job-${urgentJob.id}`, title: `Advance ${urgentJob.title} at ${urgentJob.company}`, detail: `Current priority score: ${scoreJob(urgentJob)}/100. Review the next step and deadline.`, panel: 'jobs' };
    return { key: 'review', title: 'Review your sprint dashboard', detail: 'Your core workflow is current. Confirm priorities and choose the next deliberate action.', panel: 'dashboard' };
  };

  updateDashboardChrome = function updateDashboardChromeGoverned() {
    const reviewed = state.evidence.filter(isReviewed).length;
    const approved = state.components.filter(item => item.status === 'approved').length;
    const highPriority = state.jobs.filter(item => scoreJob(item) >= 70 && item.status !== 'Skipped').length;
    const progress = calculateProgress();
    const next = getNextAction();
    document.getElementById('evidenceCount').textContent = state.evidence.length;
    document.getElementById('verifiedCount').textContent = `${reviewed} reviewed`;
    document.getElementById('componentCount').textContent = approved;
    document.getElementById('jobCount').textContent = state.jobs.length;
    document.getElementById('priorityCount').textContent = `${highPriority} high priority`;
    document.getElementById('actionCount').textContent = next ? 1 : 0;
    progressBar.style.width = `${progress}%`;
    progressBar.parentElement.setAttribute('aria-valuenow', String(progress));
    progressText.textContent = `Sprint readiness: ${progress}%`;
    progressHint.textContent = next.title;
  };

  evidenceCard = function evidenceCardGoverned(item, includeActions = true) {
    const reviewed = isReviewed(item);
    const statusClass = reviewed ? 'success' : item.status === 'rejected' ? 'danger' : 'warning';
    return `<article class="item" data-id="${item.id}">
      <div class="item-top"><div><h4>${escapeHtml(item.role)}</h4><div class="item-meta"><span class="chip ${statusClass}">${escapeHtml(statusLabel(item.status))}</span><span class="chip">${escapeHtml(item.confidence)}</span><span class="chip">${formatDate(item.createdAt)}</span></div></div></div>
      <p>${escapeHtml(item.evidence)}</p>
      ${item.tools ? `<p><strong>Tools:</strong> ${escapeHtml(item.tools)}</p>` : ''}
      ${item.result ? `<p><strong>Result:</strong> ${escapeHtml(item.result)}</p>` : ''}
      ${includeActions ? `<div class="item-actions">
        ${!reviewed ? `<button data-action="review-evidence" data-id="${item.id}" type="button" aria-label="Mark this evidence as reviewed by you">Mark reviewed by you</button>` : ''}
        <button class="outline" data-action="edit-evidence" data-id="${item.id}" type="button">Edit</button>
        <button class="outline" data-action="delete-evidence" data-id="${item.id}" type="button">Delete</button>
      </div>` : ''}
    </article>`;
  };

  handleEvidenceAction = function handleEvidenceActionGoverned(event) {
    const { action, id: itemId } = event.currentTarget.dataset;
    const item = state.evidence.find(entry => entry.id === itemId);
    if (!item) return;
    if (action === 'review-evidence') {
      askConfirmation('Confirm that you reviewed this evidence yourself and believe it is factually accurate.', () => {
        item.status = REVIEWED;
        item.reviewedAt = new Date().toISOString();
        delete item.verifiedAt;
        saveState('Evidence marked reviewed by you.');
        renderEvidence();
      });
    }
    if (action === 'edit-evidence') renderEvidence(itemId);
    if (action === 'delete-evidence') {
      askConfirmation('Delete this evidence and any resume component created from it?', () => {
        state.evidence = state.evidence.filter(entry => entry.id !== itemId);
        state.components = state.components.filter(component => component.evidenceId !== itemId);
        saveState('Evidence deleted.');
        renderEvidence();
      });
    }
  };

  renderEvidence = function renderEvidenceGoverned(editId = '') {
    const editing = state.evidence.find(item => item.id === editId);
    const reviewedCount = state.evidence.filter(isReviewed).length;
    workspace.innerHTML = `
      <div class="workspace-header"><div><h2>Experience Evidence</h2><p>Capture facts before resume wording. Self-review is explicit and is not third-party verification.</p></div><span class="status">${reviewedCount} reviewed by you</span></div>
      <form id="evidenceForm">
        <input type="hidden" name="id" value="${editing?.id || ''}" />
        <div class="form-grid">
          <div class="field"><label for="role">Role or project</label><input id="role" name="role" value="${escapeHtml(editing?.role || '')}" required /></div>
          <div class="field"><label for="timeframe">Timeframe</label><input id="timeframe" name="timeframe" value="${escapeHtml(editing?.timeframe || '')}" placeholder="Example: 2023–2024" /></div>
          <div class="field full"><label for="evidence">What did you actually do?</label><textarea id="evidence" name="evidence" required>${escapeHtml(editing?.evidence || '')}</textarea><span class="field-hint">Use observable facts. Avoid inflated titles, tools, or outcomes.</span></div>
          <div class="field"><label for="tools">Tools and systems</label><input id="tools" name="tools" value="${escapeHtml(editing?.tools || '')}" placeholder="Azure DevOps, PowerShell, Jira..." /></div>
          <div class="field"><label for="result">Result or business impact</label><input id="result" name="result" value="${escapeHtml(editing?.result || '')}" placeholder="What improved, changed, or completed?" /></div>
          <div class="field"><label for="confidence">Evidence confidence</label><select id="confidence" name="confidence">${['High confidence','Needs verification','Recovered memory'].map(value => `<option ${editing?.confidence === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
          <div class="field"><label for="source">Source or support note</label><input id="source" name="source" value="${escapeHtml(editing?.source || '')}" placeholder="Resume, manager email, personal recollection..." /></div>
        </div>
        <div class="toolbar"><button type="submit">${editing ? 'Save Changes' : 'Save Evidence'}</button>${editing ? '<button id="cancelEvidenceEdit" class="outline" type="button">Cancel</button>' : ''}</div>
      </form>
      <div class="section-divider"></div><h3>Evidence Library</h3>
      ${state.evidence.length ? `<div class="item-list">${[...state.evidence].reverse().map(item => evidenceCard(item)).join('')}</div>` : '<div class="empty-state">No evidence has been saved.</div>'}`;

    document.getElementById('evidenceForm').addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const existing = state.evidence.find(item => item.id === data.id);
      if (existing) {
        Object.assign(existing, data, { status: isReviewed(existing) ? NEEDS_REVIEW : normalizeEvidenceStatus(existing.status), reviewedAt: null, updatedAt: new Date().toISOString() });
        delete existing.verifiedAt;
        saveState('Evidence updated. Your review status was reset because the facts changed.');
      } else {
        state.evidence.push({ ...data, id: id('evidence'), status: NEEDS_REVIEW, createdAt: new Date().toISOString() });
        saveState('Evidence saved. Review it when ready.');
      }
      renderEvidence();
    });
    document.getElementById('cancelEvidenceEdit')?.addEventListener('click', () => renderEvidence());
    workspace.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', handleEvidenceAction));
  };

  renderResume = function renderResumeGoverned(editId = '') {
    const reviewed = state.evidence.filter(isReviewed);
    const available = reviewed.filter(item => !state.components.some(component => component.evidenceId === item.id));
    const editing = state.components.find(item => item.id === editId);
    workspace.innerHTML = `
      <div class="workspace-header"><div><h2>Resume Readiness</h2><p>Only evidence you reviewed can become a resume component. Drafting never changes the source evidence.</p></div><span class="status">${state.components.filter(item => item.status === 'approved').length} approved</span></div>
      ${reviewed.length ? '' : '<div class="callout warning"><strong>Truth Gate closed.</strong><p>Review at least one evidence item yourself before drafting resume content.</p></div>'}
      <form id="componentForm"><input type="hidden" name="id" value="${editing?.id || ''}" /><div class="form-grid">
        <div class="field"><label for="evidenceId">Reviewed evidence source</label><select id="evidenceId" name="evidenceId" required><option value="">Select evidence</option>${reviewed.map(item => `<option value="${item.id}" ${(editing?.evidenceId === item.id) ? 'selected' : ''}>${escapeHtml(item.role)} — ${escapeHtml(item.result || item.evidence.slice(0,60))}</option>`).join('')}</select></div>
        <div class="field"><label for="componentType">Component type</label><select id="componentType" name="type">${['Achievement bullet','Professional summary evidence','Skills evidence','Interview story'].map(value => `<option ${editing?.type === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
        <div class="field"><label for="label">Component label</label><input id="label" name="label" value="${escapeHtml(editing?.label || '')}" placeholder="Example: ADO governance achievement" required /></div>
        <div class="field full"><label for="componentText">Recruiter-facing wording</label><textarea id="componentText" name="text" required>${escapeHtml(editing?.text || '')}</textarea><span class="field-hint">Keep wording truthful, specific, and supported by the selected evidence.</span></div>
      </div><div class="toolbar"><button type="submit" ${reviewed.length ? '' : 'disabled'}>${editing ? 'Save Changes' : 'Save Draft Component'}</button>${editing ? '<button id="cancelComponentEdit" class="outline" type="button">Cancel</button>' : ''}</div></form>
      ${available.length ? `<div class="callout"><strong>${available.length} reviewed evidence item(s)</strong> are ready to become resume components.</div>` : ''}
      <div class="section-divider"></div><h3>Resume Component Library</h3>${state.components.length ? `<div class="item-list">${state.components.map(componentCard).join('')}</div>` : '<div class="empty-state">No resume components have been drafted.</div>'}`;

    document.getElementById('componentForm').addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const evidence = state.evidence.find(item => item.id === data.evidenceId && isReviewed(item));
      if (!evidence) return showToast('Select evidence you reviewed first.');
      const existing = state.components.find(item => item.id === data.id);
      if (existing) Object.assign(existing, data, { status: 'draft', updatedAt: new Date().toISOString() });
      else state.components.push({ ...data, id: id('component'), status: 'draft', createdAt: new Date().toISOString() });
      saveState(existing ? 'Resume component updated and returned to draft.' : 'Draft resume component saved.');
      renderResume();
    });
    document.getElementById('cancelComponentEdit')?.addEventListener('click', () => renderResume());
    workspace.querySelectorAll('[data-component-action]').forEach(button => button.addEventListener('click', handleComponentAction));
  };

  const governedExport = () => {
    const exported = migrateWorkspace(state);
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `income-rescue-sprint-export-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Workspace export created with governed evidence states.');
  };
  exportData = governedExport;

  document.getElementById('exportBtn')?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    governedExport();
  }, true);

  importInput.addEventListener('change', async event => {
    event.stopImmediatePropagation();
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.evidence) || !Array.isArray(parsed.jobs)) throw new Error('Invalid format');
      const migrated = migrateWorkspace(parsed);
      askConfirmation('Replace this browser workspace with the imported data? Legacy evidence states will be migrated safely.', () => {
        state = { ...structuredClone(defaultState), ...migrated, profile: { ...defaultState.profile, ...(migrated.profile || {}) } };
        saveState('Workspace imported and evidence states migrated.');
        setActivePanel('dashboard');
      });
    } catch {
      showToast('Import failed. Select a valid Income Rescue Sprint JSON export.');
    } finally {
      importInput.value = '';
    }
  }, true);

  updateDashboardChrome();
  setActivePanel(activePanel || 'dashboard');

  window.incomeRescueEvidenceGovernance = Object.freeze({
    normalizeEvidenceStatus,
    migrateWorkspace,
    statusLabel,
    isReviewed,
    statuses: { REVIEWED, NEEDS_REVIEW, SOURCE_SUPPORTED, INDEPENDENT }
  });
})();
