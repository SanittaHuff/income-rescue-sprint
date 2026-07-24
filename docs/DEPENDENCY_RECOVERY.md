# Dependency Recovery Gate

The release gate now checks the exact installed versions of TypeScript, Vitest, and Zod against `package-lock.json` before compilation or testing begins.

## Normal restoration

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run dependency:preflight
```

## Offline restoration

Restore the previously verified `node_modules` directory into the project root, then run:

```bash
npm run dependency:preflight
npm run verify:release
```

A missing or mismatched dependency stops certification with an explicit remediation message. No prior test result may be represented as newly executed when this gate fails.
