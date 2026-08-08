const COMFORT_KEY = 'lvhq-comfort-view';
const MOTION_KEY = 'lvhq-reduce-motion';
const COMPANION_KEY = 'lvhq-career-companion-open';

function systemPrefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function applyExperiencePreferences() {
  const comfort = localStorage.getItem(COMFORT_KEY) === 'true';
  const savedMotion = localStorage.getItem(MOTION_KEY);
  const reduceMotion = savedMotion === null ? systemPrefersReducedMotion() : savedMotion === 'true';
  document.body.classList.toggle('comfort-view', comfort);
  document.body.classList.toggle('reduce-motion', reduceMotion);
  const comfortInput = document.getElementById('comfortViewCheckbox');
  const motionInput = document.getElementById('reduceMotionCheckbox');
  if (comfortInput) comfortInput.checked = comfort;
  if (motionInput) motionInput.checked = reduceMotion;
}

function installExperiencePreferences() {
  const actions = document.querySelector('.topbar-actions');
  if (!actions || document.getElementById('experiencePreferences')) return;

  const details = document.createElement('details');
  details.id = 'experiencePreferences';
  details.className = 'experience-preferences';
  details.innerHTML = `
    <summary aria-label="Open display options">Display Options</summary>
    <div class="preference-menu" role="group" aria-label="Display options">
      <label><input id="comfortViewCheckbox" type="checkbox" /> <span>Comfort View</span></label>
      <small>Larger text and roomier spacing.</small>
      <label><input id="reduceMotionCheckbox" type="checkbox" /> <span>Reduce Motion</span></label>
      <small>Minimizes animation and movement.</small>
    </div>`;
  actions.appendChild(details);

  document.getElementById('comfortViewCheckbox').addEventListener('change', event => {
    localStorage.setItem(COMFORT_KEY, String(event.target.checked));
    applyExperiencePreferences();
  });
  document.getElementById('reduceMotionCheckbox').addEventListener('change', event => {
    localStorage.setItem(MOTION_KEY, String(event.target.checked));
    applyExperiencePreferences();
  });
  details.addEventListener('keydown', event => {
    if (event.key === 'Escape' && details.open) {
      details.open = false;
      details.querySelector('summary')?.focus();
    }
  });
  document.addEventListener('click', event => {
    if (details.open && !details.contains(event.target)) details.open = false;
  });
  applyExperiencePreferences();
}

function enableWorkspaceProgrammaticFocus() {
  const workspace = document.getElementById('workspace');
  if (workspace && !workspace.hasAttribute('tabindex')) workspace.setAttribute('tabindex', '-1');
}

function improveWelcomeKeyboardSafety() {
  const overlay = document.getElementById('welcomeOverlay');
  if (!overlay || overlay.dataset.keyboardReady === 'true') return;
  overlay.dataset.keyboardReady = 'true';
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      document.getElementById('welcomeExplore')?.click();
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.disabled && element.offsetParent !== null);
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function installModuleNavigationStatus() {
  const nav = document.querySelector('.module-nav');
  if (!nav || document.getElementById('moduleNavStatus')) return;

  const moduleLabels = {
    dashboard: 'Overview',
    evidence: 'Experience Evidence',
    resume: 'Resume Readiness',
    jobs: 'Opportunity Priority',
    next: 'Next Best Action',
    'email-review': 'Recruiter Email Review',
    capabilities: 'Connections & Agent Controls',
    settings: 'Data & Settings'
  };
  const buttons = [...nav.querySelectorAll('.nav-button')];
  buttons.forEach(button => {
    const label = moduleLabels[button.dataset.panel] || button.getAttribute('aria-label') || button.textContent.trim();
    button.dataset.moduleLabel = label;
    button.setAttribute('aria-label', label);
  });

  const status = document.createElement('section');
  status.id = 'moduleNavStatus';
  status.className = 'module-nav-status card';
  status.setAttribute('aria-label', 'Module navigation status');
  status.innerHTML = `
    <span class="module-status current-status"><strong>Current section:</strong> <span id="moduleCurrentValue">Overview</span></span>
    <span class="module-status focus-status"><strong>Keyboard focus:</strong> <span id="moduleFocusValue">Not on module navigation</span></span>`;
  nav.parentNode.insertBefore(status, nav);

  const currentValue = document.getElementById('moduleCurrentValue');
  const focusValue = document.getElementById('moduleFocusValue');

  const syncCurrent = () => {
    const active = buttons.find(button => button.classList.contains('active')) || buttons[0];
    if (!active) return;
    currentValue.textContent = active.dataset.moduleLabel;
    buttons.forEach(button => {
      let badge = button.querySelector('.nav-current-badge');
      if (button === active) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'nav-current-badge';
          badge.setAttribute('aria-hidden', 'true');
          badge.textContent = 'Current';
          button.appendChild(badge);
        }
      } else {
        badge?.remove();
      }
    });
  };

  const setFocusStatus = button => {
    focusValue.textContent = button?.dataset.moduleLabel || 'Not on module navigation';
    status.classList.toggle('keyboard-focus-active', Boolean(button));
  };

  buttons.forEach(button => {
    button.addEventListener('focus', () => setFocusStatus(button));
    button.addEventListener('blur', () => {
      window.setTimeout(() => {
        const focusedButton = buttons.find(candidate => candidate === document.activeElement);
        setFocusStatus(focusedButton || null);
      }, 0);
    });
    button.addEventListener('click', () => window.setTimeout(syncCurrent, 0));
  });

  const observer = new MutationObserver(syncCurrent);
  observer.observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
  syncCurrent();
}

// Only patch known legacy controls. Never rewrite user-authored content or governed status labels.
function replaceVisibleText(root = document.body) {
  if (!root || root.nodeType !== Node.ELEMENT_NODE) return;

  root.querySelectorAll('button[data-action="verify-evidence"], button[data-action="review-evidence"]').forEach(button => {
    button.textContent = 'Mark reviewed by me';
    button.setAttribute('aria-label', 'Mark this evidence as reviewed by you');
  });
  root.querySelectorAll('.chip').forEach(chip => {
    const value = chip.textContent.trim().toLowerCase();
    if (value === 'verified') chip.textContent = 'Reviewed by you';
    if (value === 'pending') chip.textContent = 'Needs your review';
  });
}

function installCareerCompanion() {
  if (document.getElementById('careerCompanion')) return;
  const companion = document.createElement('aside');
  companion.id = 'careerCompanion';
  companion.className = 'career-companion';
  companion.setAttribute('aria-label', 'Career Companion');
  companion.innerHTML = `
    <button id="careerCompanionToggle" class="companion-toggle" type="button" aria-expanded="false" aria-controls="careerCompanionPanel">
      <span aria-hidden="true">✦</span> Career Companion
    </button>
    <section id="careerCompanionPanel" class="companion-panel" hidden>
      <div class="companion-header">
        <div><strong>Career Companion</strong><small>Prototype guidance — not a live autonomous agent</small></div>
        <button id="careerCompanionClose" class="companion-close" type="button" aria-label="Close Career Companion">×</button>
      </div>
      <p>I can guide you through the current workspace, explain what each step does, and help you choose the next deliberate action.</p>
      <div class="companion-boundary" role="note">
        <strong>Available now</strong>
        <span>Guidance, explanations, and navigation inside this browser prototype.</span>
      </div>
      <div class="companion-boundary" role="note">
        <strong>Not connected</strong>
        <span>No mailbox, calendar, job board, external AI service, or automatic application access.</span>
      </div>
      <div class="companion-actions">
        <button type="button" data-companion-go="next">Show my next best action</button>
        <button type="button" class="outline" data-companion-go="evidence">Help me capture experience</button>
        <button type="button" class="outline" data-companion-go="resume">Explain resume readiness</button>
      </div>
      <p class="companion-permissions"><strong>Permission level:</strong> Explain and navigate only. External or consequential actions are unavailable.</p>
    </section>`;
  document.body.appendChild(companion);

  const toggle = document.getElementById('careerCompanionToggle');
  const panel = document.getElementById('careerCompanionPanel');
  const setOpen = open => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    localStorage.setItem(COMPANION_KEY, String(open));
    if (open) panel.querySelector('button')?.focus();
  };
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  document.getElementById('careerCompanionClose').addEventListener('click', () => {
    setOpen(false);
    toggle.focus();
  });
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });
  panel.querySelectorAll('[data-companion-go]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.querySelector(`.nav-button[data-panel="${button.dataset.companionGo}"]`);
      target?.click();
      setOpen(false);
    });
  });
  if (localStorage.getItem(COMPANION_KEY) === 'true') setOpen(true);
}

function initializeBuildMode() {
  enableWorkspaceProgrammaticFocus();
  installExperiencePreferences();
  improveWelcomeKeyboardSafety();
  installModuleNavigationStatus();
  installCareerCompanion();
  replaceVisibleText();
  const observer = new MutationObserver(mutations => {
    improveWelcomeKeyboardSafety();
    mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) replaceVisibleText(node);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initializeBuildMode, { once: true });
} else {
  initializeBuildMode();
}
