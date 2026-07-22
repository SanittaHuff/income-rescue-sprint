from pathlib import Path
import sys

workflow = Path('.github/workflows/quality.yml')
if not workflow.exists():
    print('CI_PREFLIGHT_FAILED missing workflow')
    sys.exit(1)
text = workflow.read_text(encoding='utf-8')
required = [
    'permissions:\n  contents: read',
    'timeout-minutes: 20',
    'npm ci',
    'npm run verify:release',
    'npm run demo:export',
    'npm audit --audit-level=high',
    'actions/upload-artifact@v4',
    'if-no-files-found: error',
    'workflow_dispatch:',
]
missing = [item for item in required if item not in text]
if missing:
    print('CI_PREFLIGHT_FAILED')
    for item in missing:
        print(f'missing: {item}')
    sys.exit(1)
print(f'CI_PREFLIGHT_PASSED {len(required)} controls')
