const STORAGE_KEY = 'income-rescue-sprint-v1';
const workspace = document.getElementById('workspace');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressHint = document.getElementById('progressHint');
const privacyDialog = document.getElementById('privacyDialog');
const confirmDialog = document.getElementById('confirmDialog');
const confirmMessage = document.getElementById('confirmMessage');
const toast = document.getElementById('toast');
const importInput = document.getElementById('importInput');

const defaultState = {
  version: 1,
  profile: { name: '', targetRole: '', workPreference: 'Remote first' },
  evidence: [],
  components: [],
  jobs: [],
  completedActions: [],
  lastUpdated: new Date().toISOString()
};

let state = loadState();
let pendingConfirmation = null;
let activePanel = 'dashboard';

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') return structuredClone(defaultState);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      profile: { ...defaultState.profile, ...(parsed.profile || {}) },
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
      components: Array.isArray(parsed.components) ? parsed.components : [],
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      completedActions: Array.isArray(parsed.completedActions) ? parsed.completedActions : []
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState(message = '') {
  state.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateDashboardChrome();
  if (message) showToast(message);
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(value) {
  if (!value) return 'Not set';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? escapeHtml(value) : date.toLocaleDateString();
}

function calculateProgress() {
  const verifiedEvidence = state.evidence.filter(item => item.status === 'verified').length;
  const approvedComponents = state.components.filter(item => item.status === 'approved').length;
  const activeJobs = state.jobs.filter(item => item.status !== 'Skipped').length;
  const profileComplete = Boolean(state.profile.name && state.profile.targetRole);
  const score =
    (profileComplete ? 10 : 0) +
    Math.min(30, verifiedEvidence * 10) +
    Math.min(25, approvedComponents * 10) +
    Math.min(25, activeJobs * 8) +
    Math.min(10, state.completedActions.length * 2);
  return Math.min(100, score);
}

function getNextAction() {
  const unverified = state.evidence.find(item => item.status !== 'verified');
  const verified = state.evidence.filter(item => item.status === 'verified');
  const unconverted = verified.find(item => !state.components.some(component => component.evidenceId === item.id));
  const draftComponent = state.components.find(item => item.status !== 'approved');
  const urgentJob = [...state.jobs]
    .filter(job => job.status !== 'Skipped' && job.status !== 'Applied')
    .sort((a, b) => scoreJob(b) - scoreJob(a))[0];

  if (!state.profile.targetRole) {
    return { key: 'profile', title: 'Set your target role', detail: 'A target role makes evidence and opportunity guidance more useful.', panel: 'settings' };
  }
  if (!state.evidence.length) {
    return { key: 'evidence-add', title: 'Add one high-confidence experience example', detail: 'Capture a real accomplishment, the tools used, and the result.', panel: 'evidence' };
  }
  if (unverified) {
    return { key: `verify-${unverified.id}`, title: `Verify evidence from ${unverified.role}`, detail: 'Confirm the facts before allowing them into resume content.', panel: 'evidence' };
  }
  if (unconverted) {
    return { key: `component-${unconverted.id}`, title: 'Create a resume component from verified evidence', detail: `Convert the approved facts from ${unconverted.role} into editable recruiter-facing language.`, panel: 'resume' };
  }
  if (draftComponent) {
    return { key: `approve-${draftComponent.id}`, title: 'Review and approve a resume component', detail: 'Only approved wording should be eligible for later resume assembly.', panel: 'resume' };
  }
  if (!state.jobs.length) {
    return { key: 'job-add', title: 'Add one target opportunity', detail: 'Record a role so the system can compare fit, urgency, pay, and work arrangement.', panel: 'jobs' };
  }
  if (urgentJob) {
    return { key: `job-${urgentJob.id}`, title: `Advance ${urgentJob.title} at ${urgentJob.company}`, detail: `Current priority score: ${scoreJob(urgentJob)}/100. Review the next step and deadline.`, panel: 'jobs' };
  }
  return { key: 'review', title: 'Review your sprint dashboard', detail: 'Your core workflow is current. Confirm priorities and choose the next deliberate action.', panel: 'dashboard' };
}

function updateDashboardChrome() {
  const verified = state.evidence.filter(item => item.status === 'verified').length;
  const approved = state.components.filter(item => item.status === 'approved').length;
  const highPriority = state.jobs.filter(item => scoreJob(item) >= 70 && item.status !== 'Skipped').length;
  const progress = calculateProgress();
  const next = getNextAction();

  document.getElementById('evidenceCount').textContent = state.evidence.length;
  document.getElementById('verifiedCount').textContent = `${verified} verified`;
  document.getElementById('componentCount').textContent = approved;
  document.getElementById('jobCount').textContent = state.jobs.length;
  document.getElementById('priorityCount').textContent = `${highPriority} high priority`;
  document.getElementById('actionCount').textContent = next ? 1 : 0;
  progressBar.style.width = `${progress}%`;
  progressBar.parentElement.setAttribute('aria-valuenow', String(progress));
  progressText.textContent = `Sprint readiness: ${progress}%`;
  progressHint.textContent = next.title;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function askConfirmation(message, callback) {
  confirmMessage.textContent = message;
  pendingConfirmation = callback;
  confirmDialog.showModal();
}

function setActivePanel(panel) {
  activePanel = panel;
  document.querySelectorAll('.nav-button').forEach(button => {
    button.classList.toggle('active', button.dataset.panel === panel);
  });
  const renderers = {
    dashboard: renderDashboard,
    evidence: renderEvidence,
    resume: renderResume,
    jobs: renderJobs,
    next: renderNext,
    settings: renderSettings
  };
  renderers[panel]();
  workspace.focus({ preventScroll: true });
}

function renderDashboard() {
  const next = getNextAction();
  const topJobs = [...state.jobs].sort((a, b) => scoreJob(b) - scoreJob(a)).slice(0, 3);
  const recentEvidence = [...state.evidence].reverse().slice(0, 3);
  const greeting = state.profile.name ? `Welcome back, ${escapeHtml(state.profile.name)}.` : 'Welcome to your private workspace.';

  workspace.innerHTML = `
    <div class="workspace-header">
      <div><h2>Command Overview</h2><p>${greeting} Your work stays visible, editable, and under your control.</p></div>
      <button data-go="next" type="button">Open Next Best Action</button>
    </div>
    <div class="next-action">
      <div class="next-number">1</div>
      <div><span class="status">Highest ROI</span><h3>${escapeHtml(next.title)}</h3><p>${escapeHtml(next.detail)}</p><button data-go="${next.panel}" type="button">Go to this action</button></div>
    </div>
    <div class="section-divider"></div>
    <div class="form-grid">
      <section>
        <h3>Recent Experience Evidence</h3>
        ${recentEvidence.length ? `<div class="item-list">${recentEvidence.map(item => evidenceCard(item, false)).join('')}</div>` : emptyState('No evidence yet', 'Start by recording one real work example.', 'evidence', 'Add evidence')}
      </section>
      <section>
        <h3>Top Opportunities</h3>
        ${topJobs.length ? `<div class="item-list">${topJobs.map(item => jobCard(item, false)).join('')}</div>` : emptyState('No opportunities yet', 'Add a target role when you are ready to compare fit.', 'jobs', 'Add opportunity')}
      </section>
    </div>`;
  bindGoButtons();
}

function emptyState(title, detail, panel, buttonText) {
  return `<div class="empty-state"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p><button data-go="${panel}" type="button">${escapeHtml(buttonText)}</button></div>`;
}

function evidenceCard(item, includeActions = true) {
  const statusClass = item.status === 'verified' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning';
  return `<article class="item" data-id="${item.id}">
    <div class="item-top"><div><h4>${escapeHtml(item.role)}</h4><div class="item-meta"><span class="chip ${statusClass}">${escapeHtml(item.status)}</span><span class="chip">${escapeHtml(item.confidence)}</span><span class="chip">${formatDate(item.createdAt)}</span></div></div></div>
    <p>${escapeHtml(item.evidence)}</p>
    ${item.tools ? `<p><strong>Tools:</strong> ${escapeHtml(item.tools)}</p>` : ''}
    ${item.result ? `<p><strong>Result:</strong> ${escapeHtml(item.result)}</p>` : ''}
    ${includeActions ? `<div class="item-actions">
      ${item.status !== 'verified' ? `<button data-action="verify-evidence" data-id="${item.id}" type="button">Verify</button>` : ''}
      <button class="outline" data-action="edit-evidence" data-id="${item.id}" type="button">Edit</button>
      <button class="outline" data-action="delete-evidence" data-id="${item.id}" type="button">Delete</button>
    </div>` : ''}
  </article>`;
}

function renderEvidence(editId = '') {
  const editing = state.evidence.find(item => item.id === editId);
  workspace.innerHTML = `
    <div class="workspace-header"><div><h2>Experience Evidence</h2><p>Capture facts before resume wording. Verification is always explicit.</p></div><span class="status">${state.evidence.filter(item => item.status === 'verified').length} verified</span></div>
    <form id="evidenceForm">
      <input type="hidden" name="id" value="${editing?.id || ''}" />
      <div class="form-grid">
        <div class="field"><label for="role">Role or project</label><input id="role" name="role" value="${escapeHtml(editing?.role || '')}" required /></div>
        <div class="field"><label for="timeframe">Timeframe</label><input id="timeframe" name="timeframe" value="${escapeHtml(editing?.timeframe || '')}" placeholder="Example: 2023–2024" /></div>
        <div class="field full"><label for="evidence">What did you actually do?</label><textarea id="evidence" name="evidence" required>${escapeHtml(editing?.evidence || '')}</textarea><span class="field-hint">Use observable facts. Avoid inflated titles, tools, or outcomes.</span></div>
        <div class="field"><label for="tools">Tools and systems</label><input id="tools" name="tools" value="${escapeHtml(editing?.tools || '')}" placeholder="Azure DevOps, PowerShell, Jira..." /></div>
        <div class="field"><label for="result">Result or business impact</label><input id="result" name="result" value="${escapeHtml(editing?.result || '')}" placeholder="What improved, changed, or completed?" /></div>
        <div class="field"><label for="confidence">Evidence confidence</label><select id="confidence" name="confidence">${['High confidence','Needs verification','Recovered memory'].map(value => `<option ${editing?.confidence === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
        <div class="field"><label for="source">Source or verification note</label><input id="source" name="source" value="${escapeHtml(editing?.source || '')}" placeholder="Resume, manager email, personal recollection..." /></div>
      </div>
      <div class="toolbar"><button type="submit">${editing ? 'Save Changes' : 'Save Evidence'}</button>${editing ? '<button id="cancelEvidenceEdit" class="outline" type="button">Cancel</button>' : ''}</div>
    </form>
    <div class="section-divider"></div>
    <h3>Evidence Library</h3>
    ${state.evidence.length ? `<div class="item-list">${[...state.evidence].reverse().map(item => evidenceCard(item)).join('')}</div>` : '<div class="empty-state">No evidence has been saved.</div>'}`;

  document.getElementById('evidenceForm').addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const existing = state.evidence.find(item => item.id === data.id);
    if (existing) {
      Object.assign(existing, data, { status: existing.status === 'verified' ? 'pending' : existing.status, updatedAt: new Date().toISOString() });
      saveState('Evidence updated. Verification reset after editing.');
    } else {
      state.evidence.push({ ...data, id: id('evidence'), status: data.confidence === 'High confidence' ? 'pending' : 'needs-review', createdAt: new Date().toISOString() });
      saveState('Evidence saved.');
    }
    renderEvidence();
  });
  document.getElementById('cancelEvidenceEdit')?.addEventListener('click', () => renderEvidence());
  workspace.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', handleEvidenceAction));
}

function handleEvidenceAction(event) {
  const { action, id: itemId } = event.currentTarget.dataset;
  const item = state.evidence.find(entry => entry.id === itemId);
  if (!item) return;
  if (action === 'verify-evidence') {
    askConfirmation('Confirm that you have reviewed this evidence and believe it is factually accurate.', () => {
      item.status = 'verified';
      item.verifiedAt = new Date().toISOString();
      saveState('Evidence verified.');
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
}

function componentCard(component) {
  return `<article class="item">
    <div class="item-top"><div><h4>${escapeHtml(component.label)}</h4><div class="item-meta"><span class="chip ${component.status === 'approved' ? 'success' : 'warning'}">${escapeHtml(component.status)}</span><span class="chip">${escapeHtml(component.type)}</span></div></div></div>
    <p>${escapeHtml(component.text)}</p>
    <div class="item-actions">
      ${component.status !== 'approved' ? `<button data-component-action="approve" data-id="${component.id}" type="button">Approve</button>` : ''}
      <button class="outline" data-component-action="edit" data-id="${component.id}" type="button">Edit</button>
      <button class="outline" data-component-action="delete" data-id="${component.id}" type="button">Delete</button>
    </div>
  </article>`;
}

function renderResume(editId = '') {
  const verified = state.evidence.filter(item => item.status === 'verified');
  const available = verified.filter(item => !state.components.some(component => component.evidenceId === item.id));
  const editing = state.components.find(item => item.id === editId);
  workspace.innerHTML = `
    <div class="workspace-header"><div><h2>Resume Readiness</h2><p>Only verified evidence can become a resume component. Drafting never changes the source evidence.</p></div><span class="status">${state.components.filter(item => item.status === 'approved').length} approved</span></div>
    ${verified.length ? '' : '<div class="callout warning"><strong>Truth Gate closed.</strong><p>Verify at least one evidence item before drafting resume content.</p></div>'}
    <form id="componentForm">
      <input type="hidden" name="id" value="${editing?.id || ''}" />
      <div class="form-grid">
        <div class="field"><label for="evidenceId">Verified evidence source</label><select id="evidenceId" name="evidenceId" required><option value="">Select evidence</option>${verified.map(item => `<option value="${item.id}" ${(editing?.evidenceId === item.id) ? 'selected' : ''}>${escapeHtml(item.role)} — ${escapeHtml(item.result || item.evidence.slice(0,60))}</option>`).join('')}</select></div>
        <div class="field"><label for="componentType">Component type</label><select id="componentType" name="type">${['Achievement bullet','Professional summary evidence','Skills evidence','Interview story'].map(value => `<option ${editing?.type === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
        <div class="field"><label for="label">Component label</label><input id="label" name="label" value="${escapeHtml(editing?.label || '')}" placeholder="Example: ADO governance achievement" required /></div>
        <div class="field full"><label for="componentText">Recruiter-facing wording</label><textarea id="componentText" name="text" required>${escapeHtml(editing?.text || '')}</textarea><span class="field-hint">Keep wording truthful, specific, and supported by the selected evidence.</span></div>
      </div>
      <div class="toolbar"><button type="submit" ${verified.length ? '' : 'disabled'}>${editing ? 'Save Changes' : 'Save Draft Component'}</button>${editing ? '<button id="cancelComponentEdit" class="outline" type="button">Cancel</button>' : ''}</div>
    </form>
    ${available.length ? `<div class="callout"><strong>${available.length} verified evidence item(s)</strong> are ready to be converted into resume components.</div>` : ''}
    <div class="section-divider"></div>
    <h3>Resume Component Library</h3>
    ${state.components.length ? `<div class="item-list">${state.components.map(componentCard).join('')}</div>` : '<div class="empty-state">No resume components have been drafted.</div>'}`;

  document.getElementById('componentForm').addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const evidence = state.evidence.find(item => item.id === data.evidenceId && item.status === 'verified');
    if (!evidence) return showToast('Select verified evidence first.');
    const existing = state.components.find(item => item.id === data.id);
    if (existing) {
      Object.assign(existing, data, { status: 'draft', updatedAt: new Date().toISOString() });
      saveState('Resume component updated and returned to draft.');
    } else {
      state.components.push({ ...data, id: id('component'), status: 'draft', createdAt: new Date().toISOString() });
      saveState('Draft resume component saved.');
    }
    renderResume();
  });
  document.getElementById('cancelComponentEdit')?.addEventListener('click', () => renderResume());
  workspace.querySelectorAll('[data-component-action]').forEach(button => button.addEventListener('click', handleComponentAction));
}

function handleComponentAction(event) {
  const item = state.components.find(component => component.id === event.currentTarget.dataset.id);
  if (!item) return;
  const action = event.currentTarget.dataset.componentAction;
  if (action === 'approve') {
    askConfirmation('Approve this exact wording for use in later resume assembly?', () => {
      item.status = 'approved';
      item.approvedAt = new Date().toISOString();
      saveState('Resume component approved.');
      renderResume();
    });
  }
  if (action === 'edit') renderResume(item.id);
  if (action === 'delete') {
    askConfirmation('Delete this resume component?', () => {
      state.components = state.components.filter(component => component.id !== item.id);
      saveState('Resume component deleted.');
      renderResume();
    });
  }
}

function scoreJob(job) {
  const fit = { Strong: 35, Possible: 22, Stretch: 10 }[job.fit] || 0;
  const arrangement = job.arrangement === 'Remote' ? 20 : job.arrangement === 'Hybrid' ? 12 : 5;
  const urgency = { 'Apply now': 20, 'This week': 14, 'Research': 6, Hold: 0 }[job.urgency] || 0;
  const evidence = Number(job.evidenceStrength || 0) * 5;
  const pay = job.payAlignment === 'Meets target' ? 15 : job.payAlignment === 'Unknown' ? 7 : 2;
  return Math.min(100, fit + arrangement + urgency + evidence + pay);
}

function priorityClass(job) {
  const score = scoreJob(job);
  return score >= 70 ? 'priority-high' : score >= 45 ? 'priority-medium' : 'priority-low';
}

function jobCard(job, includeActions = true) {
  const score = scoreJob(job);
  return `<article class="item ${priorityClass(job)}">
    <div class="item-top"><div><h4>${escapeHtml(job.title)} · ${escapeHtml(job.company)}</h4><div class="item-meta"><span class="chip">${escapeHtml(job.fit)} fit</span><span class="chip">${escapeHtml(job.arrangement)}</span><span class="chip">${escapeHtml(job.status)}</span>${job.deadline ? `<span class="chip warning">Due ${formatDate(job.deadline)}</span>` : ''}</div></div><span class="score" aria-label="Priority score ${score}">${score}</span></div>
    ${job.nextStep ? `<p><strong>Next step:</strong> ${escapeHtml(job.nextStep)}</p>` : ''}
    ${includeActions ? `<div class="item-actions"><button data-job-action="advance" data-id="${job.id}" type="button">Advance Status</button><button class="outline" data-job-action="edit" data-id="${job.id}" type="button">Edit</button><button class="outline" data-job-action="delete" data-id="${job.id}" type="button">Delete</button></div>` : ''}
  </article>`;
}

function renderJobs(editId = '') {
  const editing = state.jobs.find(item => item.id === editId);
  workspace.innerHTML = `
    <div class="workspace-header"><div><h2>Opportunity Priority</h2><p>Prioritize roles using explicit fit, work arrangement, urgency, evidence strength, and pay alignment.</p></div><span class="status">${state.jobs.filter(job => scoreJob(job) >= 70).length} high priority</span></div>
    <form id="jobForm">
      <input type="hidden" name="id" value="${editing?.id || ''}" />
      <div class="form-grid">
        <div class="field"><label for="jobTitle">Job title</label><input id="jobTitle" name="title" value="${escapeHtml(editing?.title || '')}" required /></div>
        <div class="field"><label for="company">Company</label><input id="company" name="company" value="${escapeHtml(editing?.company || '')}" required /></div>
        <div class="field"><label for="fit">Fit</label><select id="fit" name="fit">${['Strong','Possible','Stretch'].map(value => `<option ${editing?.fit === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
        <div class="field"><label for="arrangement">Work arrangement</label><select id="arrangement" name="arrangement">${['Remote','Hybrid','Onsite','Unknown'].map(value => `<option ${editing?.arrangement === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
        <div class="field"><label for="urgency">Urgency</label><select id="urgency" name="urgency">${['Apply now','This week','Research','Hold'].map(value => `<option ${editing?.urgency === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
        <div class="field"><label for="payAlignment">Pay alignment</label><select id="payAlignment" name="payAlignment">${['Meets target','Unknown','Below target'].map(value => `<option ${editing?.payAlignment === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
        <div class="field"><label for="evidenceStrength">Evidence strength (1–5)</label><input id="evidenceStrength" name="evidenceStrength" type="number" min="1" max="5" value="${escapeHtml(editing?.evidenceStrength || '3')}" required /></div>
        <div class="field"><label for="deadline">Deadline</label><input id="deadline" name="deadline" type="date" value="${escapeHtml(editing?.deadline || '')}" /></div>
        <div class="field"><label for="jobStatus">Status</label><select id="jobStatus" name="status">${['Investigating','Ready to apply','Applied','Follow-up due','Interview','Hold','Skipped'].map(value => `<option ${editing?.status === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
        <div class="field"><label for="nextStep">Next step</label><input id="nextStep" name="nextStep" value="${escapeHtml(editing?.nextStep || '')}" placeholder="Tailor resume, research company, follow up..." /></div>
        <div class="field full"><label for="jobUrl">Job posting URL</label><input id="jobUrl" name="url" type="url" value="${escapeHtml(editing?.url || '')}" placeholder="https://" /></div>
      </div>
      <div class="toolbar"><button type="submit">${editing ? 'Save Changes' : 'Add Opportunity'}</button>${editing ? '<button id="cancelJobEdit" class="outline" type="button">Cancel</button>' : ''}</div>
    </form>
    <div class="section-divider"></div>
    <h3>Priority Queue</h3>
    ${state.jobs.length ? `<div class="item-list">${[...state.jobs].sort((a,b) => scoreJob(b)-scoreJob(a)).map(job => jobCard(job)).join('')}</div>` : '<div class="empty-state">No opportunities have been added.</div>'}`;

  document.getElementById('jobForm').addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const existing = state.jobs.find(item => item.id === data.id);
    if (existing) Object.assign(existing, data, { updatedAt: new Date().toISOString() });
    else state.jobs.push({ ...data, id: id('job'), createdAt: new Date().toISOString() });
    saveState(existing ? 'Opportunity updated.' : 'Opportunity added.');
    renderJobs();
  });
  document.getElementById('cancelJobEdit')?.addEventListener('click', () => renderJobs());
  workspace.querySelectorAll('[data-job-action]').forEach(button => button.addEventListener('click', handleJobAction));
}

function handleJobAction(event) {
  const job = state.jobs.find(item => item.id === event.currentTarget.dataset.id);
  if (!job) return;
  const action = event.currentTarget.dataset.jobAction;
  if (action === 'edit') renderJobs(job.id);
  if (action === 'advance') {
    const flow = ['Investigating','Ready to apply','Applied','Follow-up due','Interview'];
    const current = flow.indexOf(job.status);
    job.status = flow[Math.min(flow.length - 1, current + 1)] || 'Ready to apply';
    saveState(`Status advanced to ${job.status}.`);
    renderJobs();
  }
  if (action === 'delete') {
    askConfirmation('Delete this opportunity?', () => {
      state.jobs = state.jobs.filter(item => item.id !== job.id);
      saveState('Opportunity deleted.');
      renderJobs();
    });
  }
}

function renderNext() {
  const next = getNextAction();
  const completed = state.completedActions.includes(next.key);
  workspace.innerHTML = `
    <div class="workspace-header"><div><h2>Next Best Action</h2><p>One recommendation, based only on the information currently stored in this workspace.</p></div><span class="status">Highest ROI</span></div>
    <div class="next-action"><div class="next-number">1</div><div><h3>${escapeHtml(next.title)}</h3><p>${escapeHtml(next.detail)}</p><div class="toolbar"><button data-go="${next.panel}" type="button">Open the work area</button><button id="completeAction" class="outline" type="button" ${completed ? 'disabled' : ''}>${completed ? 'Marked complete' : 'Mark complete'}</button></div></div></div>
    <div class="section-divider"></div>
    <div class="callout"><strong>Recommendation boundary</strong><p>This prototype does not apply to jobs, send messages, change documents, or take external action. It organizes the next decision for you.</p></div>`;
  bindGoButtons();
  document.getElementById('completeAction').addEventListener('click', () => {
    if (!state.completedActions.includes(next.key)) state.completedActions.push(next.key);
    saveState('Action marked complete.');
    renderNext();
  });
}

function renderSettings() {
  workspace.innerHTML = `
    <div class="workspace-header"><div><h2>Data & Settings</h2><p>Set your working target and control the information stored in this browser.</p></div><span class="status">Local storage</span></div>
    <form id="profileForm">
      <div class="form-grid">
        <div class="field"><label for="profileName">Your name</label><input id="profileName" name="name" value="${escapeHtml(state.profile.name)}" /></div>
        <div class="field"><label for="targetRole">Primary target role</label><input id="targetRole" name="targetRole" value="${escapeHtml(state.profile.targetRole)}" placeholder="Azure DevOps Administrator" /></div>
        <div class="field"><label for="workPreference">Work preference</label><select id="workPreference" name="workPreference">${['Remote first','Hybrid acceptable','Onsite acceptable','No preference'].map(value => `<option ${state.profile.workPreference === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
      </div>
      <button type="submit">Save Profile</button>
    </form>
    <div class="section-divider"></div>
    <h3>Portability and control</h3>
    <div class="checklist">
      <div class="check-row"><div><strong>Export all workspace data</strong><p class="muted">Download a readable JSON backup containing your profile, evidence, resume components, opportunities, and action history.</p><button id="settingsExport" type="button">Export JSON</button></div></div>
      <div class="check-row"><div><strong>Import a prior export</strong><p class="muted">Import replaces the current local workspace only after confirmation.</p><button id="importBtn" class="outline" type="button">Choose JSON File</button></div></div>
      <div class="check-row"><div><strong>Delete local workspace</strong><p class="muted">Permanently remove this prototype's data from this browser.</p><button id="resetBtn" class="danger" type="button">Delete Local Data</button></div></div>
    </div>
    <div class="callout warning"><strong>Prototype limitation</strong><p>There is no cloud backup or account recovery. Export before clearing browser data or changing devices.</p></div>`;
  document.getElementById('profileForm').addEventListener('submit', event => {
    event.preventDefault();
    state.profile = { ...state.profile, ...Object.fromEntries(new FormData(event.currentTarget)) };
    saveState('Profile saved.');
    renderSettings();
  });
  document.getElementById('settingsExport').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', () => importInput.click());
  document.getElementById('resetBtn').addEventListener('click', () => {
    askConfirmation('Permanently delete all Income Rescue Sprint data stored in this browser?', () => {
      state = structuredClone(defaultState);
      localStorage.removeItem(STORAGE_KEY);
      saveState('Local workspace deleted.');
      renderDashboard();
    });
  });
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `income-rescue-sprint-export-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('Workspace export created.');
}

function bindGoButtons() {
  workspace.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => setActivePanel(button.dataset.go)));
}

document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => setActivePanel(button.dataset.panel)));
document.getElementById('privacyBtn').addEventListener('click', () => privacyDialog.showModal());
document.getElementById('closePrivacy').addEventListener('click', () => privacyDialog.close());
document.getElementById('exportBtn').addEventListener('click', exportData);
document.getElementById('cancelConfirm').addEventListener('click', () => { pendingConfirmation = null; confirmDialog.close(); });
document.getElementById('acceptConfirm').addEventListener('click', () => {
  const callback = pendingConfirmation;
  pendingConfirmation = null;
  confirmDialog.close();
  callback?.();
});
importInput.addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.evidence) || !Array.isArray(parsed.jobs)) throw new Error('Invalid format');
    askConfirmation('Replace this browser workspace with the imported data?', () => {
      state = { ...structuredClone(defaultState), ...parsed, profile: { ...defaultState.profile, ...(parsed.profile || {}) } };
      saveState('Workspace imported.');
      setActivePanel('dashboard');
    });
  } catch {
    showToast('Import failed. Select a valid Income Rescue Sprint JSON export.');
  } finally {
    importInput.value = '';
  }
});

updateDashboardChrome();
setActivePanel('dashboard');
