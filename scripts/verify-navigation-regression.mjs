import { readFileSync } from 'node:fs';
const source = readFileSync('src/frontend/app/render-private-mvp.ts', 'utf8');
const oldNavigation = "document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>{state.activeScreen=b.dataset.screen;save();location.reload()}));";
const failures = [];
if (source.includes(oldNavigation)) failures.push('reload-based workflow navigation remains');
if (!source.includes('const showScreen=(screen)=>')) failures.push('in-page screen switch function is missing');
if (!source.includes("panel.hidden=panel.dataset.panel!==screen")) failures.push('panel visibility switching is missing');
if (!source.includes("button.setAttribute('aria-current'")) failures.push('active-step accessibility update is missing');
if (!source.includes("heading.setAttribute('tabindex','-1')")) failures.push('screen heading focus target is missing');
if (failures.length) {
  console.error('NAVIGATION_REGRESSION_FAILED');
  failures.forEach((failure) => console.error(failure));
  process.exit(1);
}
console.log('NAVIGATION_REGRESSION_PASSED');
