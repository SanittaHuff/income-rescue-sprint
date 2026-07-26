import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/frontend/app/render-private-mvp.ts';
const source = readFileSync(path, 'utf8');
const bad = 'document.querySelector(`[data-panel="${screen}"] h2`)?.focus()';
const good = 'document.querySelector(\'[data-panel="\' + screen + '\"] h2\')?.focus()';

if (!source.includes(bad)) {
  console.error('EXPECTED_NESTED_NAVIGATION_SELECTOR_NOT_FOUND');
  process.exit(1);
}

const repaired = source.replace(bad, good);
if (repaired.includes('location.reload()')) {
  console.error('FULL_PAGE_RELOAD_REMAINS');
  process.exit(1);
}
writeFileSync(path, repaired, 'utf8');
console.log('V40_NAVIGATION_SYNTAX_REPAIRED');
