import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const required = ['typescript', 'vitest', 'zod'];
const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'));
const failures = [];

for (const name of required) {
  const installedPath = resolve(root, 'node_modules', name, 'package.json');
  const lockEntry = lock.packages?.[`node_modules/${name}`];
  if (!lockEntry?.version) {
    failures.push(`${name}: missing from package-lock.json`);
    continue;
  }
  if (!existsSync(installedPath)) {
    failures.push(`${name}: dependency not restored (expected ${lockEntry.version})`);
    continue;
  }
  const installed = JSON.parse(readFileSync(installedPath, 'utf8'));
  if (installed.version !== lockEntry.version) {
    failures.push(`${name}: installed ${installed.version}, expected ${lockEntry.version}`);
  }
}

if (failures.length) {
  console.error('DEPENDENCY_PREFLIGHT_FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  console.error('REMEDIATION: restore dependencies with npm ci, or restore the verified offline node_modules cache, then rerun npm run dependency:preflight.');
  process.exit(1);
}

console.log(`DEPENDENCY_PREFLIGHT_PASSED ${required.length} packages`);
