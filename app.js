const workspace = document.getElementById('workspace');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const privacyDialog = document.getElementById('privacyDialog');

const state = JSON.parse(localStorage.getItem('irs-state') || '{"evidence":[],"jobs":[],"progress":35}');

function saveState(){
  localStorage.setItem('irs-state', JSON.stringify(state));
  progressBar.style.width = `${state.progress}%`;
  progressText.textContent = `Sprint readiness: ${state.progress}%`;
}

function renderEvidence(){
  workspace.innerHTML = `
    <h2>Experience Evidence Intake</h2>
    <p>Capture facts first. Resume wording comes later.</p>
    <form id="evidenceForm">
      <input name="role" placeholder="Role or project" required />
      <textarea name="evidence" placeholder="What did you actually do? Include tools, people, process, and result." required></textarea>
      <select name="confidence">
        <option>High confidence</option>
        <option>Needs verification</option>
        <option>Recovered memory</option>
      </select>
      <button type="submit">Save Evidence</button>
    </form>
    <div id="evidenceList"></div>`;
  document.getElementById('evidenceForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    state.evidence.push({...data, approved:false, createdAt:new Date().toISOString()});
    state.progress = Math.min(100, state.progress + 8);
    saveState();
    renderEvidence();
  });
  const list = document.getElementById('evidenceList');
  list.innerHTML = state.evidence.length ? `<h3>Saved evidence</h3><ul>${state.evidence.map(item => `<li><strong>${item.role}</strong> — ${item.evidence} <em>(${item.confidence})</em></li>`).join('')}</ul>` : '<p>No evidence saved yet.</p>';
}

function renderResume(){
  const verified = state.evidence.filter(item => item.confidence === 'High confidence');
  workspace.innerHTML = `
    <h2>Resume Readiness</h2>
    <p><strong>${verified.length}</strong> high-confidence evidence item(s) are ready for resume-component review.</p>
    <ul>
      <li>Truth Gate: ${verified.length ? 'Ready for governed drafting' : 'More verified evidence needed'}</li>
      <li>Recruiter scan: Pending component selection</li>
      <li>ATS alignment: Pending target job description</li>
    </ul>
    <button id="approveDraft" ${verified.length ? '' : 'disabled'}>Approve Evidence for Drafting</button>`;
  const button = document.getElementById('approveDraft');
  if(button) button.addEventListener('click', () => {
    state.progress = Math.min(100, state.progress + 10);
    saveState();
    button.textContent = 'Approved';
    button.disabled = true;
  });
}

function renderJobs(){
  workspace.innerHTML = `
    <h2>Opportunity Priority</h2>
    <form id="jobForm">
      <input name="title" placeholder="Job title" required />
      <input name="company" placeholder="Company" required />
      <select name="fit"><option>Strong fit</option><option>Possible fit</option><option>Stretch</option></select>
      <button type="submit">Add Opportunity</button>
    </form>
    <div id="jobList"></div>`;
  document.getElementById('jobForm').addEventListener('submit', event => {
    event.preventDefault();
    state.jobs.push(Object.fromEntries(new FormData(event.target)));
    state.progress = Math.min(100, state.progress + 5);
    saveState();
    renderJobs();
  });
  document.getElementById('jobList').innerHTML = state.jobs.length ? `<h3>Priority queue</h3><ol>${state.jobs.map(job => `<li><strong>${job.title}</strong> at ${job.company} — ${job.fit}</li>`).join('')}</ol>` : '<p>No opportunities added yet.</p>';
}

function renderNext(){
  let action = 'Add one high-confidence experience evidence item.';
  if(state.evidence.length && !state.jobs.length) action = 'Add one target opportunity to compare against your evidence.';
  if(state.evidence.length && state.jobs.length) action = 'Review resume readiness and approve verified evidence for drafting.';
  workspace.innerHTML = `<h2>Your Next Best Action</h2><p class="status">Highest ROI</p><h3>${action}</h3><p>This recommendation is based only on information stored in this local prototype.</p>`;
}

document.querySelectorAll('[data-panel]').forEach(button => {
  button.addEventListener('click', () => ({evidence:renderEvidence,resume:renderResume,jobs:renderJobs,next:renderNext}[button.dataset.panel])());
});

document.getElementById('privacyBtn').addEventListener('click', () => privacyDialog.showModal());
document.getElementById('closePrivacy').addEventListener('click', () => privacyDialog.close());
saveState();
