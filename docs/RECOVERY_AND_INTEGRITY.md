# Recovery and Integrity Controls

- Session exports use a versioned envelope and SHA-256 checksum.
- Import validates structure, checksum, and duplicate identifiers before replacing current state.
- Failed imports preserve the active session.
- Certification events and successful imports are written to the audit trail.
- Browser prototype backups remain user-controlled and are validated before restoration.
- Job-description gaps are investigation prompts only and never authorize resume additions.
