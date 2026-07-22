import { createHash } from 'node:crypto';
import { readFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(process.cwd());
const outputPath = resolve(root, 'primary-private-mvp-app.html');

function runPrimaryBuild() {
  const result = spawnSync('npm', ['run', 'demo:primary'], {
    cwd: root,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    process.exit(result.status ?? 1);
  }
  if (!existsSync(outputPath)) {
    console.error('REPRODUCIBLE_BUILD_OUTPUT_MISSING');
    process.exit(1);
  }
  const bytes = readFileSync(outputPath);
  return {
    hash: createHash('sha256').update(bytes).digest('hex'),
    bytes,
  };
}

rmSync(outputPath, { force: true });
const first = runPrimaryBuild();
rmSync(outputPath, { force: true });
const second = runPrimaryBuild();

if (first.hash !== second.hash || !first.bytes.equals(second.bytes)) {
  console.error('REPRODUCIBLE_BUILD_FAILED');
  console.error(`first=${first.hash}`);
  console.error(`second=${second.hash}`);
  process.exit(1);
}

const html = second.bytes.toString('utf8');
const requiredMarkers = [
  '<main',
  'Evidence Certification',
  'Resume Assembly',
  'Job Match Review',
  'Export Readiness',
  'Confirm restore',
  'Cancel',
];
const missingMarkers = requiredMarkers.filter((marker) => !html.includes(marker));
if (missingMarkers.length) {
  console.error('REPRODUCIBLE_BUILD_CONTENT_FAILED');
  for (const marker of missingMarkers) console.error(`missing marker: ${marker}`);
  process.exit(1);
}

console.log(`REPRODUCIBLE_BUILD_PASSED sha256=${second.hash} bytes=${second.bytes.length}`);
