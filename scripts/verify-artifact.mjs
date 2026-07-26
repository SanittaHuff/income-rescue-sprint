import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const manifestPath = resolve(root, 'ARTIFACT_MANIFEST_V40.json');
if (!existsSync(manifestPath)) {
  console.error('ARTIFACT_MANIFEST_MISSING');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const failures = [];
for (const item of manifest.files) {
  const filePath = resolve(root, item.path);
  if (!existsSync(filePath)) {
    failures.push(`${item.path}: missing`);
    continue;
  }
  const digest = createHash('sha256').update(readFileSync(filePath)).digest('hex');
  if (digest !== item.sha256) failures.push(`${item.path}: checksum mismatch`);
}
if (failures.length) {
  console.error('ARTIFACT_VERIFICATION_FAILED');
  for (const failure of failures) console.error(failure);
  process.exit(1);
}
console.log(`ARTIFACT_VERIFICATION_PASSED ${manifest.files.length} files`);
