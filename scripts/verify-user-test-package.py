from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
required = [
    root / "CAPTAIN_USER_TESTING_V37.md",
    root / "USER_TEST_EVIDENCE_TEMPLATE_V37.md",
    root / "resume-product-primary-private-mvp-v37.html",
]
failures = [f"missing: {p.name}" for p in required if not p.is_file() or p.stat().st_size == 0]
if not failures:
    guide = required[0].read_text(encoding="utf-8")
    evidence = required[1].read_text(encoding="utf-8")
    app = required[2].read_text(encoding="utf-8")
    checks = {
        "guide names keyboard test": "Keyboard-only navigation" in guide,
        "guide names 200% zoom": "200% zoom" in guide,
        "guide names read aloud": "Read Aloud" in guide,
        "guide names backup cancel": "Cancel" in guide and "Confirm restore" in guide,
        "evidence template has pass status": "Pass / Fail / Blocked" in evidence,
        "application has main landmark": "<main" in app,
        "application has focus styling": ":focus-visible" in app,
        "application has review controls": "review" in app.lower(),
    }
    failures.extend(name for name, passed in checks.items() if not passed)
if failures:
    print("USER_TEST_PACKAGE_PREFLIGHT_FAILED")
    for failure in failures:
        print(failure)
    sys.exit(1)
print("USER_TEST_PACKAGE_PREFLIGHT_PASSED 8 checks")
