(() => {
  const SENSITIVE_PATTERNS = [
    /\b\d{3}-\d{2}-\d{4}\b/,
    /\b(?:\d[ -]*?){13,19}\b/,
    /password|passcode|authentication code|social security|medical record|bank account/i
  ];

  function addInputSafety() {
    document.querySelectorAll('input:not([type="hidden"]):not([type="file"]), textarea').forEach(field => {
      if (field.dataset.prototypeSafetyBound === 'true') return;
      field.dataset.prototypeSafetyBound = 'true';
      field.setAttribute('autocomplete', 'off');
      field.addEventListener('input', () => {
        const value = String(field.value || '');
        const looksSensitive = SENSITIVE_PATTERNS.some(pattern => pattern.test(value));
        field.setAttribute('aria-invalid', String(looksSensitive));
        if (looksSensitive) {
          field.value = '';
          field.dispatchEvent(new Event('change', { bubbles: true }));
          const toast = document.getElementById('toast');
          if (toast) {
            toast.textContent = 'Sensitive information was not accepted in this prototype.';
            toast.classList.add('show');
            window.setTimeout(() => toast.classList.remove('show'), 3200);
          }
        }
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
  }

  function runPrototypeQA() {
    addInputSafety();
    improveDialogAccess();
    labelDynamicControls();
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
