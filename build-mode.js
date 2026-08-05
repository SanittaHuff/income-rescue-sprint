const COMFORT_KEY = 'lvhq-comfort-view';
const MOTION_KEY = 'lvhq-reduce-motion';

function applyExperiencePreferences() {
  const comfort = localStorage.getItem(COMFORT_KEY) === 'true';
  const reduceMotion = localStorage.getItem(MOTION_KEY) === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    <summary>Display Options</summary>
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
  applyExperiencePreferences();
}

function improveWelcomeKeyboardSafety() {
  const overlay = document.getElementById('welcomeOverlay');
  if (!overlay || overlay.dataset.keyboardReady === 'true') return;
  overlay.dataset.keyboardReady = 'true';
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
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

const buildModeObserver = new MutationObserver(() => improveWelcomeKeyboardSafety());
window.addEventListener('DOMContentLoaded', () => {
  installExperiencePreferences();
  improveWelcomeKeyboardSafety();
  buildModeObserver.observe(document.body, { childList: true, subtree: true });
});
