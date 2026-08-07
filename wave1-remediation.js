(() => {
  const COMPANION_KEY = 'lvhq-career-companion-open';
  const restoreCompanionOpen = localStorage.getItem(COMPANION_KEY) === 'true';

  // Prevent build-mode initialization from restoring an open Companion by moving focus
  // without a current-session user action. The visual state is restored after initialization.
  if (restoreCompanionOpen) localStorage.setItem(COMPANION_KEY, 'false');

  // Keep the safety-first reply override aligned with every caution class detected by p0-tools.js.
  // A visible caution must never fall through to an engagement-oriented default draft.
  const riskPattern = /\b(ssn|social security number|passport number|driver'?s license number|bank account|routing number|credit card|debit card|gift card|bitcoin|crypto(?:currency)?|processing fee|pay a fee|password|passcode|authentication code|verification code|one[- ]?time code|otp|telegram|whatsapp|bit\.ly|tinyurl\.com|t\.co|goo\.gl|guaranteed job|guaranteed employment|instant hire|immediate payment|earn money today)\b/i;
  const interviewPattern = /\b(interview|phone screen|technical screen|calendar invite|schedule\s+(?:a|an|the)?\s*(?:call|interview|screen))\b/i;

  function clean(value = '') {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function sentence(value = '') {
    const text = clean(value).replace(/[.!?]+$/, '');
    return text ? `${text}.` : '';
  }

  function includesLoose(haystack = '', needle = '') {
    const normalizedNeedle = clean(needle).toLowerCase();
    if (!normalizedNeedle) return false;
    return clean(haystack).toLowerCase().includes(normalizedNeedle);
  }

  function buildEvidenceOnlyDraft(evidence, type) {
    const action = clean(evidence?.evidence);
    const tools = clean(evidence?.tools);
    const result = clean(evidence?.result);
    const role = clean(evidence?.role) || 'Reviewed experience';
    const timeframe = clean(evidence?.timeframe);

    if (!action) return '';

    if (type === 'Achievement bullet') {
      let draft = action.replace(/[.!?]+$/, '');
      if (tools && !includesLoose(draft, tools)) draft += ` using ${tools}`;
      draft += '.';
      if (result && !includesLoose(draft, result)) draft += ` Result: ${sentence(result)}`;
      return draft;
    }

    if (type === 'Professional summary evidence') {
      let draft = `${role}: ${sentence(action)}`;
      if (tools && !includesLoose(draft, tools)) draft += ` Tools: ${sentence(tools)}`;
      if (result && !includesLoose(draft, result)) draft += ` Result: ${sentence(result)}`;
      return draft;
    }

    if (type === 'Skills evidence') {
      const prefix = tools ? `${tools} — ` : '';
      let draft = `${prefix}${sentence(action)}`;
      if (result && !includesLoose(draft, result)) draft += ` Result: ${sentence(result)}`;
      return draft;
    }

    let draft = `Context: ${role}${timeframe ? ` (${timeframe})` : ''}. Action: ${sentence(action)}`;
    if (result) draft += ` Result: ${sentence(result)}`;
    return draft;
  }

  function installResumeDrafting() {
    const form = document.getElementById('componentForm');
    if (!form || form.dataset.wave1Ready === 'true') return;
    form.dataset.wave1Ready = 'true';

    const toolbar = form.querySelector('.toolbar');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'outline';
    button.id = 'draftFromEvidence';
    button.textContent = 'Draft from reviewed evidence';
    toolbar?.prepend(button);

    const note = document.createElement('div');
    note.className = 'callout';
    note.innerHTML = '<strong>Transparent local draft</strong><p>This helper only rearranges the reviewed evidence you selected. It does not use a connected AI model or add new facts. Review and edit every draft before approval.</p>';
    form.insertBefore(note, toolbar || null);

    button.addEventListener('click', () => {
      const evidenceId = form.querySelector('#evidenceId')?.value;
      const type = form.querySelector('#componentType')?.value || 'Achievement bullet';
      const evidence = typeof state !== 'undefined' ? state.evidence.find(item => item.id === evidenceId) : null;
      if (!evidence) {
        if (typeof showToast === 'function') showToast('Select reviewed evidence before creating a draft.');
        return;
      }
      const draft = buildEvidenceOnlyDraft(evidence, type);
      const textArea = form.querySelector('#componentText');
      const label = form.querySelector('#label');
      if (textArea) textArea.value = draft;
      if (label && !clean(label.value)) label.value = `${clean(evidence.role) || 'Experience'} — ${type}`;
      if (typeof showToast === 'function') showToast('Local draft created from reviewed evidence only. Review it before approval.');
    });
  }

  function improveEvidencePrompts() {
    const evidence = document.getElementById('evidence');
    if (!evidence || evidence.dataset.wave1Ready === 'true') return;
    evidence.dataset.wave1Ready = 'true';
    const label = document.querySelector('label[for="evidence"]');
    const hint = evidence.parentElement?.querySelector('.field-hint');
    if (label) label.textContent = 'What was happening, and what did you do?';
    if (hint) hint.textContent = 'Include context, your actions, scope or volume, people or systems affected, tools, constraints, and what changed. Estimates and recovered memories are okay when labeled honestly.';
    evidence.placeholder = 'Example: The team needed a repeatable way to track ownership. I gathered the source data, reconciled mappings, updated the governed board, and escalated exceptions for review.';

    const result = document.getElementById('result');
    if (result) result.placeholder = 'What changed, completed, improved, or became easier? Add a measurable result when you can support it.';
  }

  function softenResumeGateLanguage() {
    document.querySelectorAll('.callout.warning strong').forEach(strong => {
      if (strong.textContent.trim() !== 'Truth Gate closed.') return;
      strong.textContent = 'One review step remains.';
      const detail = strong.parentElement?.querySelector('p');
      if (detail) detail.textContent = 'Review one experience before creating resume wording. You can start from memory and add supporting information later.';
    });
  }

  function repairHelpTipFocus() {
    document.querySelectorAll('.nav-button .info-tip').forEach((tip, index) => {
      const parent = tip.closest('.nav-button');
      if (!parent || tip.dataset.wave1Ready === 'true') return;
      tip.dataset.wave1Ready = 'true';
      const description = tip.getAttribute('aria-label') || tip.title || '';
      tip.tabIndex = -1;
      tip.setAttribute('aria-hidden', 'true');
      if (description) {
        const id = `nav-help-${parent.dataset.panel || index}`;
        let help = document.getElementById(id);
        if (!help) {
          help = document.createElement('span');
          help.id = id;
          help.className = 'sr-only';
          help.textContent = description.replace(/^[^:]+:\s*/, '');
          parent.insertAdjacentElement('afterend', help);
        }
        parent.setAttribute('aria-describedby', id);
        parent.title = help.textContent;
      }
    });
  }

  function saferRecruiterDraft(text, draft) {
    const normalized = clean(text);
    if (riskPattern.test(normalized)) {
      draft.value = 'Do not reply yet. Independently verify the employer, role, and recruiting contact through an official company channel before continuing. Do not provide identity numbers, authentication codes, banking or payment information, passwords, or other sensitive information. If you independently verify the opportunity and choose to continue, return to the original message and draft a new response using only verified contact information.';
      const block = document.querySelector('#emailReviewResult .risk-block');
      if (block && !block.querySelector('[data-wave1-safety]')) {
        const note = document.createElement('p');
        note.dataset.wave1Safety = 'true';
        note.className = 'plain-language-note';
        note.innerHTML = '<strong>Safety-first default:</strong> No reply is recommended until you independently verify the employer and recruiting contact through an official channel.';
        block.appendChild(note);
      }
      return;
    }

    if (interviewPattern.test(normalized)) {
      draft.value = 'Thank you for the interview invitation. I am interested in continuing the conversation. I will review the scheduling details and confirm an available time. Please let me know the interview format, expected length, who I will be meeting with, and whether there is anything specific I should prepare in advance.';
    }
  }

  function installRecruiterDraftRemediation() {
    const form = document.getElementById('emailReviewForm');
    if (!form || form.dataset.wave1Ready === 'true') return;
    form.dataset.wave1Ready = 'true';
    form.addEventListener('submit', () => {
      window.setTimeout(() => {
        const input = document.getElementById('recruiterEmailText');
        const draft = document.getElementById('emailReplyDraft');
        if (input && draft) saferRecruiterDraft(input.value, draft);
      }, 0);
    });
  }

  function applyWorkspaceRemediation() {
    improveEvidencePrompts();
    installResumeDrafting();
    softenResumeGateLanguage();
    repairHelpTipFocus();
    installRecruiterDraftRemediation();
  }

  function restoreCompanionWithoutFocusTransfer() {
    if (!restoreCompanionOpen) return;
    const panel = document.getElementById('careerCompanionPanel');
    const toggle = document.getElementById('careerCompanionToggle');
    if (!panel || !toggle) return;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    localStorage.setItem(COMPANION_KEY, 'true');
  }

  window.addEventListener('DOMContentLoaded', () => {
    restoreCompanionWithoutFocusTransfer();
    applyWorkspaceRemediation();
    const workspace = document.getElementById('workspace');
    if (workspace) {
      const observer = new MutationObserver(applyWorkspaceRemediation);
      observer.observe(workspace, { childList: true, subtree: true });
    }
    const navObserver = new MutationObserver(repairHelpTipFocus);
    const nav = document.querySelector('.module-nav');
    if (nav) navObserver.observe(nav, { childList: true, subtree: true });
  });
})();