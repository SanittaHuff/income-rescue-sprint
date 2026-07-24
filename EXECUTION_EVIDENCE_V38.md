# Execution Evidence — v38

## Purpose
Close dependency-lock drift and add a mandatory dependency-environment preflight before release certification.

## Repair
- Detected that the v37 `package-lock.json` specified Vitest 4.1.10 while `package.json` and the executed environment used Vitest 2.1.9.
- Regenerated `package-lock.json` offline from the declared package requirements and verified local cache.
- Added `scripts/dependency-preflight.mjs` to compare installed TypeScript, Vitest, and Zod versions to the lockfile.
- Added actionable offline and online restoration guidance.
- Prepended the dependency check to the full release gate.

## Certification rule
A missing or mismatched dependency now stops certification before typecheck or regression execution. Prior test results may not be represented as newly executed when dependency preflight fails.
