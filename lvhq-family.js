const HELP_KEY = 'lvhq-help-tips-enabled';

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

function setHelpEnabled(enabled) {
  localStorage.setItem(HELP_KEY, String(enabled));
  document.body.classList.toggle('help-tips-off', !enabled);
  document.getElementById('helpTipsToggle')?.setAttribute('aria-checked', String(enabled));
  document.getElementById('helpTipsCheckbox')?.toggleAttribute('checked', enabled);
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
    const label = button.textContent.trim();
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
      <label class="help-toggle" title="Show or hide optional explanations throughout the product">
        <input id="helpTipsCheckbox" type="checkbox" ${helpEnabled() ? 'checked' : ''} />
        <span>Help Tips</span>
      </label>`;
    actions.prepend(controls);
    document.getElementById('learningBtn').addEventListener('click', openLearningCenter);
    document.getElementById('helpTipsCheckbox').addEventListener('change', event => setHelpEnabled(event.target.checked));
  }

  setHelpEnabled(helpEnabled());
  replaceTechnicalLanguage();
  applyContextHelp();
}

const observer = new MutationObserver(() => {
  replaceTechnicalLanguage();
  applyContextHelp();
});

window.addEventListener('DOMContentLoaded', () => {
  installFamilyExperience();
  observer.observe(document.getElementById('workspace'), { childList: true, subtree: true });
});
