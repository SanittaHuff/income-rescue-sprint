(() => {
  const customPanels = new Set(['email-review', 'capabilities']);
  const coreSetActivePanel = setActivePanel;

  function setCustomPanelActive(panel) {
    activePanel = panel;
    document.querySelectorAll('.nav-button').forEach(button => {
      button.classList.toggle('active', button.dataset.panel === panel);
    });
  }

  setActivePanel = function setActivePanelWithP0Tools(panel) {
    if (!customPanels.has(panel)) {
      coreSetActivePanel(panel);
      return;
    }
    setCustomPanelActive(panel);
    if (panel === 'email-review') renderEmailReview();
    if (panel === 'capabilities') renderCapabilityCenter();
    workspace.focus({ preventScroll: true });
  };

  function extractLine(text, labels) {
    const pattern = new RegExp(`(?:${labels.join('|')})\\s*[:\\-]\\s*([^\\n]{2,100})`, 'i');
    return text.match(pattern)?.[1]?.trim() || '';
  }

  function detectFirst(text, definitions, fallback) {
    return definitions.find(item => item.pattern.test(text))?.label || fallback;
  }

  function uniqueMatches(text, definitions) {
    return definitions.filter(item => item.pattern.test(text)).map(item => item.label);
  }

  function analyzeRecruiterEmail(text) {
    const role = extractLine(text, ['role', 'position', 'job title', 'opening']);
    const company = extractLine(text, ['company', 'client', 'organization']);
    const pay = text.match(/\$\s?\d+(?:,\d{3})*(?:\.\d{1,2})?(?:\s*(?:-|–|to)\s*\$?\s?\d+(?:,\d{3})*(?:\.\d{1,2})?)?(?:\s*(?:\/\s*(?:hr|hour|yr|year)|per\s+(?:hour|year)|annually))?/i)?.[0] || '';

    const messageType = detectFirst(text, [
      { label: 'Interview or scheduling request', pattern: /\b(interview|schedule|availability|calendar invite)\b/i },
      { label: 'Recruiter outreach or job lead', pattern: /\b(opportunity|position|opening|role|job description)\b/i },
      { label: 'Application follow-up', pattern: /\b(follow[- ]?up|application status|next steps)\b/i }
    ], 'General recruiting message');

    const workArrangement = detectFirst(text, [
      { label: 'Remote', pattern: /\b(remote|work from home|wfh)\b/i },
      { label: 'Hybrid', pattern: /\bhybrid\b/i },
      { label: 'Onsite', pattern: /\b(on[- ]?site|in office)\b/i }
    ], 'Not clearly stated');

    const employmentType = detectFirst(text, [
      { label: 'Contract', pattern: /\b(contract|consulting assignment|temporary)\b/i },
      { label: 'W-2 contract', pattern: /\bw-?2\b/i },
      { label: 'C2C / corp-to-corp', pattern: /\b(c2c|corp[- ]?to[- ]?corp)\b/i },
      { label: 'Full time', pattern: /\b(full[- ]?time|permanent|direct hire)\b/i },
      { label: 'Part time', pattern: /\bpart[- ]?time\b/i }
    ], 'Not clearly stated');

    const requestedActions = uniqueMatches(text, [
      { label: 'Send or update a resume', pattern: /\b(send|share|attach|submit|update).{0,30}\bresume\b|\bresume.{0,30}(send|share|attach|submit|update)\b/is },
      { label: 'Provide availability', pattern: /\b(availability|available times|schedule a call|time to connect)\b/i },
      { label: 'Confirm pay or rate', pattern: /\b(rate confirmation|confirm.{0,20}rate|desired rate|salary expectation)\b/i },
      { label: 'Confirm work authorization', pattern: /\b(work authorization|authorized to work|visa status|sponsorship)\b/i },
      { label: 'Confirm location or commute', pattern: /\b(location|commute|relocation|zip code|onsite days)\b/i },
      { label: 'Complete an application or form', pattern: /\b(complete|fill out|submit).{0,30}\b(application|form|questionnaire)\b/is }
    ]);

    const cautionFlags = uniqueMatches(text, [
      { label: 'Requests a Social Security number or similar identity data', pattern: /\b(ssn|social security number|passport number|driver'?s license number)\b/i },
      { label: 'Requests banking, card, payment, gift-card, or cryptocurrency information', pattern: /\b(bank account|routing number|credit card|debit card|gift card|bitcoin|crypto(?:currency)?|processing fee|pay a fee)\b/i },
      { label: 'Requests passwords or authentication codes', pattern: /\b(password|passcode|authentication code|verification code|one[- ]?time code|otp)\b/i },
      { label: 'Moves the conversation to Telegram or WhatsApp', pattern: /\b(telegram|whatsapp)\b/i },
      { label: 'Contains a shortened link that deserves separate verification', pattern: /\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl)\b/i },
      { label: 'Promises guaranteed hiring or unusually immediate payment', pattern: /\b(guaranteed job|guaranteed employment|instant hire|immediate payment|earn money today)\b/i }
    ]);

    return {
      role,
      company,
      pay,
      messageType,
      workArrangement,
      employmentType,
      requestedActions,
      cautionFlags
    };
  }

  function buildReplyDraft(analysis) {
    const opportunity = analysis.role || 'the opportunity';
    const organization = analysis.company ? ` with ${analysis.company}` : '';
    const questions = [];
    if (!analysis.pay) questions.push('the pay range');
    if (analysis.employmentType === 'Not clearly stated') questions.push('the employment type');
    if (analysis.workArrangement === 'Not clearly stated') questions.push('the work arrangement and location expectations');
    questions.push('the complete job description', 'the interview process and next steps');

    const details = questions.length > 1
      ? `${questions.slice(0, -1).join(', ')}, and ${questions.at(-1)}`
      : questions[0];
    const caution = analysis.cautionFlags.length
      ? '\n\nFor security, I do not provide sensitive identity, authentication, banking, or payment information before independently verifying the employer and hiring process.'
      : '';

    return `Thank you for reaching out about ${opportunity}${organization}. I am interested in learning more. Please send ${details}.\n\nOnce I review those details, I can confirm my interest and availability.${caution}`;
  }

  function listMarkup(items, emptyText) {
    const values = items.length ? items : [emptyText];
    return `<ul>${values.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function renderEmailResult(analysis) {
    const result = document.getElementById('emailReviewResult');
    const draft = buildReplyDraft(analysis);
    result.innerHTML = `
      <div class="email-review-summary" aria-live="polite">
        <section class="signal-card"><span class="status">Message type</span><strong>${escapeHtml(analysis.messageType)}</strong></section>
        <section class="signal-card"><span class="status">Work arrangement</span><strong>${escapeHtml(analysis.workArrangement)}</strong></section>
        <section class="signal-card"><span class="status">Employment type</span><strong>${escapeHtml(analysis.employmentType)}</strong></section>
        <section class="signal-card"><span class="status">Pay found</span><strong>${escapeHtml(analysis.pay || 'Not clearly stated')}</strong></section>
      </div>
      <div class="review-columns">
        <section class="review-block"><h3>Requested actions detected</h3>${listMarkup(analysis.requestedActions, 'No clear requested action detected. Review the original message carefully.')}</section>
        <section class="review-block ${analysis.cautionFlags.length ? 'risk-block' : ''}"><h3>Safety cautions</h3>${listMarkup(analysis.cautionFlags, 'No high-risk phrase was detected by this limited local check. This is not sender verification.')}</section>
      </div>
      <section class="draft-block">
        <div><h3>Editable reply draft</h3><p class="muted">Created locally by transparent prototype rules—not by a connected AI model. Nothing is sent.</p></div>
        <label class="sr-only" for="emailReplyDraft">Editable reply draft</label>
        <textarea id="emailReplyDraft"></textarea>
        <div class="toolbar"><button id="copyEmailDraft" type="button">Copy Draft</button><button id="clearEmailReview" class="outline" type="button">Clear Review</button></div>
      </section>`;
    document.getElementById('emailReplyDraft').value = draft;
    document.getElementById('copyEmailDraft').addEventListener('click', async () => {
      const value = document.getElementById('emailReplyDraft').value;
      try {
        await navigator.clipboard.writeText(value);
        showToast('Draft copied. Review it before using it anywhere.');
      } catch {
        document.getElementById('emailReplyDraft').select();
        document.execCommand('copy');
        showToast('Draft copied. Review it before using it anywhere.');
      }
    });
    document.getElementById('clearEmailReview').addEventListener('click', renderEmailReview);
  }

  function renderEmailReview() {
    workspace.innerHTML = `
      <div class="workspace-header">
        <div><h2>Recruiter Email Review</h2><p>Paste a redacted recruiting message for a local pattern review and editable response draft.</p></div>
        <span class="status">User-supplied text only</span>
      </div>
      <div class="callout warning"><strong>No mailbox is connected.</strong><p>This tool cannot read, verify, monitor, reply to, or send email. Remove passwords, authentication codes, financial details, government identifiers, and confidential customer or employer information before pasting.</p></div>
      <form id="emailReviewForm">
        <div class="field full"><label for="recruiterEmailText">Redacted recruiter message</label><textarea id="recruiterEmailText" name="emailText" maxlength="12000" required placeholder="Paste the redacted message here..."></textarea><span class="field-hint">The pasted text remains only in this page while it is open and is not added to the workspace export.</span></div>
        <label class="safety-check"><input id="emailSafetyAcknowledge" type="checkbox" required /> <span>I removed sensitive and confidential information before pasting.</span></label>
        <div class="toolbar"><button type="submit">Review Message</button><button id="clearEmailInput" class="outline" type="button">Clear</button></div>
      </form>
      <div id="emailReviewResult"></div>
      <div class="callout"><strong>Review boundary</strong><p>Results are limited pattern matches and drafting assistance. They are not employer verification, legal advice, scam certification, or a hiring recommendation.</p></div>`;

    document.getElementById('emailReviewForm').addEventListener('submit', event => {
      event.preventDefault();
      const text = document.getElementById('recruiterEmailText').value.trim();
      if (text.length < 20) {
        showToast('Paste a longer redacted recruiting message to review.');
        return;
      }
      renderEmailResult(analyzeRecruiterEmail(text));
    });
    document.getElementById('clearEmailInput').addEventListener('click', () => {
      document.getElementById('emailReviewForm').reset();
      document.getElementById('emailReviewResult').replaceChildren();
      document.getElementById('recruiterEmailText').focus();
    });
  }

  function capabilityCard(title, status, description, items) {
    return `<section class="capability-card"><div><span class="capability-state">${escapeHtml(status)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></div>${listMarkup(items, 'None listed.')}</section>`;
  }

  function renderCapabilityCenter() {
    workspace.innerHTML = `
      <div class="workspace-header">
        <div><h2>Connections & Agent Controls</h2><p>See exactly what the prototype can do, what requires your approval, and what is not connected.</p></div>
        <span class="status">Truthful capability map</span>
      </div>
      <section class="permission-ladder" aria-labelledby="permissionTitle">
        <h3 id="permissionTitle">Agent permission levels</h3>
        <ol>
          <li class="permission-active"><strong>1. Explain and navigate — Available</strong><span>The Companion can explain product areas and move to a selected internal screen.</span></li>
          <li class="permission-active"><strong>2. Suggest — Available locally</strong><span>The prototype can show Next Best Action and limited pattern-based suggestions from information you provide.</span></li>
          <li class="permission-active"><strong>3. Draft internally — Available</strong><span>It can prepare editable resume components and a local recruiter-email response draft.</span></li>
          <li class="permission-review"><strong>4. Prepare for your approval — User controlled</strong><span>You must review, edit, approve, copy, or export any consequential wording.</span></li>
          <li class="permission-off"><strong>5. External action — Unavailable</strong><span>No sending, scheduling, applying, purchasing, sharing, deleting external data, or background monitoring.</span></li>
        </ol>
      </section>
      <div class="capability-grid">
        ${capabilityCard('Available now', 'Working locally', 'Capabilities that operate inside this browser prototype.', ['Local browser workspace', 'JSON export and import', 'Experience and resume-component workflows', 'Opportunity prioritization', 'User-supplied recruiter-email review'])}
        ${capabilityCard('Prototype demonstration', 'Bounded', 'Useful product behavior without a live AI model or external service.', ['Career Companion guidance', 'Next Best Action suggestions', 'Editable internal drafts', 'Permission and approval boundaries'])}
        ${capabilityCard('Planned connectors', 'Not connected', 'Future integrations require architecture, security, privacy, consent, and independent review.', ['Gmail and Outlook', 'Google and Microsoft calendars', 'Job boards and applicant systems', 'Cloud document storage'])}
        ${capabilityCard('Prohibited in this build', 'Unavailable', 'Actions intentionally blocked in the current prototype.', ['Reading a mailbox', 'Sending or replying to messages', 'Automatic job applications', 'Silent monitoring or memory', 'Handling production credentials or sensitive participant data'])}
      </div>
      <div class="toolbar"><button data-p0-go="email-review" type="button">Open Recruiter Email Review</button><button data-p0-go="settings" class="outline" type="button">Open Data & Settings</button></div>
      <div class="callout warning"><strong>Connector boundary</strong><p>No connector can be enabled from this screen. Status labels describe verified current capability, not future promises or certification.</p></div>`;
    workspace.querySelectorAll('[data-p0-go]').forEach(button => button.addEventListener('click', () => setActivePanel(button.dataset.p0Go)));
  }

  function installCompanionP0Actions() {
    const actions = document.querySelector('#careerCompanionPanel .companion-actions');
    if (!actions || actions.querySelector('[data-companion-custom]')) return;
    const emailButton = document.createElement('button');
    emailButton.type = 'button';
    emailButton.className = 'outline';
    emailButton.dataset.companionCustom = 'email-review';
    emailButton.textContent = 'Review a recruiter email';
    const capabilityButton = document.createElement('button');
    capabilityButton.type = 'button';
    capabilityButton.className = 'outline';
    capabilityButton.dataset.companionCustom = 'capabilities';
    capabilityButton.textContent = 'Show connection status';
    actions.append(emailButton, capabilityButton);
    actions.querySelectorAll('[data-companion-custom]').forEach(button => {
      button.addEventListener('click', () => {
        setActivePanel(button.dataset.companionCustom);
        document.getElementById('careerCompanionClose')?.click();
      });
    });
  }

  function initializeP0Tools() {
    installCompanionP0Actions();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initializeP0Tools, { once: true });
  } else {
    initializeP0Tools();
  }

  window.incomeRescueP0Tools = Object.freeze({ analyzeRecruiterEmail, buildReplyDraft });
})();
