#!/usr/bin/env python3
from pathlib import Path
import re
import sys

APP = Path('primary-private-mvp-app.html')
if not APP.exists():
    print('ACCESSIBILITY_PREFLIGHT_FAILED')
    print('primary-private-mvp-app.html: missing')
    sys.exit(1)

html = APP.read_text(encoding='utf-8')
checks = {
    'document language': '<html lang="en">' in html,
    'descriptive title': bool(re.search(r'<title>[^<]{8,}</title>', html, re.I)),
    'skip link': 'href="#main"' in html and 'Skip to main content' in html,
    'main landmark': bool(re.search(r'<main\b[^>]*id="main"', html, re.I)),
    'main focus target': bool(re.search(r'<main\b[^>]*tabindex="-1"', html, re.I)),
    'status live region': 'role="status"' in html,
    'alert live region': 'role="alert"' in html,
    'visible keyboard focus': ':focus-visible' in html and 'outline:' in html,
    'minimum touch target': 'min-height:44px' in html,
    'evidence label': '<label for="evidenceText">' in html,
    'job description label': '<label for="jobDescription">' in html,
    'button types explicit': not bool(re.search(r'<button(?![^>]*\btype=)', html, re.I)),
    'no browser alert dialogs': "alert('" not in html and 'alert("' not in html,
    'viewport supports zoom': bool(re.search(r'<meta\s+name="viewport"[^>]*width=device-width', html, re.I)) and 'user-scalable=no' not in html,
    'headings present': '<h1' in html and '<h2' in html,
    'no positive tabindex': not bool(re.search(r'tabindex="[1-9][0-9]*"', html, re.I)),
    'form controls have ids': all(' id=' in tag for tag in re.findall(r'<(?:input|textarea|select)\b[^>]*>', html, re.I)),
    'images have alt text': all(re.search(r'\balt=', tag, re.I) for tag in re.findall(r'<img\b[^>]*>', html, re.I)),
}

failures = [name for name, passed in checks.items() if not passed]
for name, passed in checks.items():
    print(f"{'PASS' if passed else 'FAIL'}: {name}")
if failures:
    print(f'ACCESSIBILITY_PREFLIGHT_FAILED {len(failures)} of {len(checks)} checks')
    sys.exit(1)
print(f'ACCESSIBILITY_PREFLIGHT_PASSED {len(checks)} of {len(checks)} checks')
