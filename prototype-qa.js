(() => {
  const GENERAL_SENSITIVE_PATTERNS = [
    /\b\d{3}-\d{2}-\d{4}\b/,
    /\b(?:\d[ -]*?){13,19}\b/,
    /password|passcode|authentication code|social security|medical record|bank account/i
  ];

  // A redacted recruiting message may legitimately mention a risky request.
  // In that bounded review surface, reject actual secret-shaped values—not the warning phrase itself.
  const RISK_REVIEW_SECRET_PATTERNS = [
    /\b\d{3}-\d{2}-\d{4}\b/,
    /\b(?:\d[ -]*?){13,19}\b/,
    /\b(?:password|passcode|authentication code|verification code|one[- ]?time code|otp)\s*[:=\-]\s*\S{4,}\b/i,
    /\b(?:bank account|account number|routing number)\s*[:=\-]\s*(?:\d[ -]*?){4,}\b/i,
    /\b(?:passport|driver'?s license|medical record)\s*(?:number|id)?\s*[:=\-]\s*[a-z0-9-]{5,}\b/i
  ];

  function patternsFor(field) {
    const isRiskReview = field.id === 'recruiterEmailText' || field.dataset.prototypeSafetyMode === 'risk-review';
    return isRiskReview ? RISK_REVIEW_SECRET_PATTERNS : GENERAL_SENSITIVE_PATTERNS;
  }

  function showSafetyMessage() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = 'Sensitive information was not accepted in this prototype.';
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function addInputSafety() {
    document.querySelectorAll('input:not([type="hidden"]):not([type="file"]), textarea').forEach(field => {
      if (field.dataset.prototypeSafetyBound === 'true') return;
      field.dataset.prototypeSafetyBound = 'true';
      field.setAttribute('autocomplete', 'off');
      field.addEventListener('input', () => {
        const value = String(field.value || '');
        const looksSensitive = patternsFor(field).some(pattern => pattern.test(value));
        field.setAttribute('aria-invalid', String(looksSensitive));
        if (!looksSensitive) return;
        field.value = '';
        field.dispatchEvent(new Event('change', { bubbles: true }));
        showSafetyMessage();
      });
    });
  }

  function improveDialogAccess() {
    document.querySelectorAll('dialog').forEach(dialog => {
      dialog.addEventListener('close', () => {
        const returnId = dialog.dataset.returnFocus;
        if (returnId) document.getElementById(returnId)?.focus();
      });
    });

    const learningButton = document.getElementById('learningBtn');
    const learningDialog = document.getElementById('learningDialog');
    learningButton?.addEventListener('click', () => {
      learningDialog.dataset.returnFocus = 'learningBtn';
    });

    const privacyButton = document.getElementById('privacyBtn');
    const privacyDialog = document.getElementById('privacyDialog');
    privacyButton?.addEventListener('click', () => {
      privacyDialog.dataset.returnFocus = 'privacyBtn';
    });
  }

  function labelDynamicControls() {
    document.querySelectorAll('button').forEach(button => {
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        button.setAttribute('aria-label', 'Action');
      }
    });
    document.querySelectorAll('select, input, textarea').forEach(field => {
      if (!field.id) return;
      const label = document.querySelector(`label[for="${CSS.escape(field.id)}"]`);
      if (!label && !field.getAttribute('aria-label')) {
        field.setAttribute('aria-label', field.name || field.id);
      }
    });
    document.querySelectorAll('[role="progressbar"]').forEach(progress => {
      if (!progress.getAttribute('aria-label') && !progress.getAttribute('aria-labelledby')) {
        progress.setAttribute('aria-label', 'Sprint readiness');
      }
    });
  }

  function loadExperienceEnhancements() {
    if (!document.querySelector('link[href="build-mode.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'build-mode.css';
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[src="build-mode.js"]')) {
      const script = document.createElement('script');
      script.src = 'build-mode.js';
      script.defer = true;
      document.body.appendChild(script);
    }
  }

  function runPrototypeQA() {
    addInputSafety();
    improveDialogAccess();
    labelDynamicControls();
    loadExperienceEnhancements();
    document.documentElement.dataset.prototypeQa = 'active';
  }

  const observer = new MutationObserver(() => {
    addInputSafety();
    labelDynamicControls();
  });

  window.addEventListener('DOMContentLoaded', () => {
    runPrototypeQA();
    const workspace = document.getElementById('workspace');
    if (workspace) observer.observe(workspace, { childList: true, subtree: true });
  });
})();
