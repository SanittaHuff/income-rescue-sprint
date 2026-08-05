const HELP_KEY = 'lvhq-help-tips-enabled';
const GUIDED_KEY = 'lvhq-guided-mode-enabled';

const helpContent = {
  'Overview': 'See your current progress, priorities, and the clearest next action.',
  'Experience Evidence': 'Record what you remember about your work. Documents or examples can be added later, but they are not required to begin.',
  'Resume Readiness': 'Review resume content that has been drafted from your experience and decide what you want to use.',
  'Opportunity Priority': 'Compare opportunities and focus on the roles that best match your goals, experience, timing, and work preferences.',
  'Next Best Action': 'Get one clear recommendation for what to do next.',
  'Data & Settings': 'Manage your profile, local data, backups, and help preferences.',
  'Sprint readiness': 'A simple progress indicator showing how much of your current setup is complete.'
};

function helpEnabled() {
  return localStorage.getItem(HELP_KEY) !== 'false';
}

function guidedEnabled() {
  return localStorage.getItem(GUIDED_KEY) === 'true';
}

function setHelpEnabled(enabled) {
  localStorage.setItem(HELP_KEY, String(enabled));
  document.body.classList.toggle('help-tips-off', !enabled);
  const checkbox = document.getElementById('helpTipsCheckbox');
  if (checkbox) checkbox.checked = enabled;
}

function setGuidedEnabled(enabled) {
  localStorage.setItem(GUIDED_KEY, String(enabled));
  document.body.classList.toggle('guided-mode-on', enabled);
  const checkbox = document.getElementById('guidedModeCheckbox');
  if (checkbox) checkbox.checked = enabled;
  renderCoachStrip();
}

function addInfoTip(element, label, text) {
  if (!element || element.querySelector('.info-tip')) return;
  const tip = document.createElement('span');
  tip.className = 'info-tip';
  tip.tabIndex = 0;
  tip.setAttribute('role', 'img');
  tip.setAttribute('aria-label', `${label}: ${text}`);
  tip.title = text;
  tip.textContent = 'i';
  element.appendChild(tip);
}

function applyContextHelp() {
  document.querySelectorAll('.nav-button').forEach(button => {
    const label = button.childNodes[0]?.textContent?.trim() || button.textContent.trim();
    addInfoTip(button, label, helpContent[label] || 'Open this section for more information.');
  });
  const progress = document.querySelector('.progress-wrap strong');
  if (progress) addInfoTip(progress, 'Sprint readiness', helpContent['Sprint readiness']);
}

function replaceTechnicalLanguage() {
  document.querySelectorAll('.workspace-header p, .field-hint, .topbar-subtitle, .trust-strip span').forEach(node => {
    const text = node.textContent.trim();
    if (text === 'Capture facts before resume wording. Verification is always explicit.') {
      node.textContent = 'Start with what you remember. We will help you organize your experience into clear, truthful resume content. Supporting documents are helpful, but not required to begin.';
    }
    if (text === 'Use observable facts. Avoid inflated titles, tools, or outcomes.') {
      node.textContent = 'Describe the experience in your own words. It is okay to estimate dates or add supporting details later.';
    }
    if (text === 'Evidence first. Truth gated. User controlled.') {
      node.textContent = 'Your experience, organized with care and kept under your control.';
    }
    if (text === 'No unverified claims become resume content.') {
      node.textContent = 'You decide what is ready to use. You can begin with memory and add supporting information later.';
    }
  });
}

function openLearningCenter() {
  const dialog = document.getElementById('learningDialog');
  if (dialog?.showModal) dialog.showModal();
}

function addWrittenGuide() {
  const card = document.querySelector('#learningDialog .learning-card');
  if (!card || document.getElementById('writtenGuide')) return;
  const guide = document.createElement('section');
  guide.id = 'writtenGuide';
  guide.className = 'written-guide';
  guide.innerHTML = `
    <h3>How to use Income Rescue Sprint</h3>
    <ol>
      <li><strong>Start with one experience.</strong> Write what you remember in your own words.</li>
      <li><strong>Review it when ready.</strong> Add dates, tools, examples, or supporting information later.</li>
      <li><strong>Create resume wording.</strong> Keep, edit, or reject every suggestion.</li>
      <li><strong>Add opportunities.</strong> Compare fit, timing, pay, and work arrangement.</li>
      <li><strong>Follow one next action.</strong> Guided Mode keeps the clearest next step visible.</li>
    </ol>
    <p>You remain in control. Nothing is submitted, shared, or applied for automatically.</p>`;
  card.appendChild(guide);
}

function renderCoachStrip() {
  let strip = document.getElementById('coachStrip');
  if (!guidedEnabled()) {
    strip?.remove();
    return;
  }
  const workspace = document.getElementById('workspace');
  if (!workspace || typeof getNextAction !== 'function') return;
  const next = getNextAction();
  if (!strip) {
    strip = document.createElement('section');
    strip.id = 'coachStrip';
    strip.className = 'coach-strip card';
    workspace.parentNode.insertBefore(strip, workspace);
  }
  strip.innerHTML = `
    <div><span class="coach-label">Guided Mode</span><strong>${escapeHtml(next.title)}</strong><p>${escapeHtml(next.detail)}</p></div>
    <button id="coachActionBtn" type="button">Take this step</button>`;
  document.getElementById('coachActionBtn')?.addEventListener('click', () => {
    document.querySelector(`[data-panel="${next.panel}"]`)?.click();
  });
}

function installFamilyExperience() {
  const headerIdentity = document.querySelector('.topbar > div:first-child');
  if (headerIdentity && !document.querySelector('.lvhq-family')) {
    const badge = document.createElement('div');
    badge.className = 'lvhq-family';
    badge.innerHTML = '<strong>Life Vault HQ Family</strong><span>Income Rescue Sprint is an independent LVHQ product.</span>';
    headerIdentity.appendChild(badge);
  }

  const actions = document.querySelector('.topbar-actions');
  if (actions && !document.getElementById('learningBtn')) {
    const controls = document.createElement('div');
    controls.className = 'help-controls';
    controls.innerHTML = `
      <button id="learningBtn" class="secondary learn-button" type="button">Getting Started</button>
      <label class="help-toggle" title="Keep the clearest next step visible">
        <input id="guidedModeCheckbox" type="checkbox" ${guidedEnabled() ? 'checked' : ''} />
        <span>Guided Mode</span>
      </label>
      <label class="help-toggle" title="Show or hide optional explanations throughout the product">
        <input id="helpTipsCheckbox" type="checkbox" ${helpEnabled() ? 'checked' : ''} />
        <span>Help Tips</span>
      </label>`;
    actions.prepend(controls);
    document.getElementById('learningBtn').addEventListener('click', openLearningCenter);
    document.getElementById('guidedModeCheckbox').addEventListener('change', event => setGuidedEnabled(event.target.checked));
    document.getElementById('helpTipsCheckbox').addEventListener('change', event => setHelpEnabled(event.target.checked));
  }

  setHelpEnabled(helpEnabled());
  document.body.classList.toggle('guided-mode-on', guidedEnabled());
  addWrittenGuide();
  replaceTechnicalLanguage();
  applyContextHelp();
  renderCoachStrip();
}

const observer = new MutationObserver(() => {
  replaceTechnicalLanguage();
  applyContextHelp();
  renderCoachStrip();
});

window.addEventListener('DOMContentLoaded', () => {
  installFamilyExperience();
  observer.observe(document.getElementById('workspace'), { childList: true, subtree: true });
});
