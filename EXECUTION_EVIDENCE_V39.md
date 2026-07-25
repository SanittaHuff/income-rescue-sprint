# Execution Evidence — v39

## Purpose
Repair hosted CI by installing the Python dependencies required by the governed DOCX and PDF production exporter.

## Verified root cause
- Hosted Node dependencies installed successfully.
- Dependency preflight and TypeScript typecheck passed.
- 56 of 58 tests passed.
- The two production-export tests failed because `python-docx` was not installed on the GitHub-hosted runner.
- `scripts/export_resume.py` also imports ReportLab, so both Python export dependencies are now explicitly pinned.

## Repair
- Added `requirements-ci.txt` with pinned `python-docx` and ReportLab versions.
- Added pip caching and locked Python dependency installation to the hosted release workflow.
- Advanced artifact verification to `ARTIFACT_MANIFEST_V39.json`.
- Preserved the verified v38 canonical commit unchanged.

## Certification rule
Hosted CI must install both the locked Node dependencies and the locked Python export dependencies before executing the release gate.
