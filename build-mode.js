const COMFORT_KEY = 'lvhq-comfort-view';
const MOTION_KEY = 'lvhq-reduce-motion';

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

function initializeBuildMode() {
  installExperiencePreferences();
  improveWelcomeKeyboardSafety();
  const observer = new MutationObserver(() => improveWelcomeKeyboardSafety());
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initializeBuildMode, { once: true });
} else {
  initializeBuildMode();
}
