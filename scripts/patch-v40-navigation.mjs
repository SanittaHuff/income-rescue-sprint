import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/frontend/app/render-private-mvp.ts';
const source = readFileSync(path, 'utf8');
const selectorPattern = /document\.querySelector\(`\[data-panel="\$\{screen\}"\] h2`\)\?\.focus\(\)/;
const good = "document.querySelector('[data-panel=\"'+screen+'\"] h2')?.focus()";

if (!selectorPattern.test(source)) {
  console.error('EXPECTED_NESTED_NAVIGATION_SELECTOR_NOT_FOUND');
  const line = source.split('\n').find((item) => item.includes('const showScreen='));
  console.error(line ?? 'SHOW_SCREEN_LINE_MISSING');
  process.exit(1);
}

const repaired = source.replace(selectorPattern, good);
if (repaired.includes('location.reload()')) {
  console.error('FULL_PAGE_RELOAD_REMAINS');
  process.exit(1);
}
writeFileSync(path, repaired, 'utf8');
console.log('V40_NAVIGATION_SYNTAX_REPAIRED');
