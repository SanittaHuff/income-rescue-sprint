import type { WorkflowSnapshot } from "../../application/evidence-to-component-workflow.js";
import type { DomainError } from "../../domain/errors.js";

const escapeHtml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export const renderWorkflowSuccess = (snapshot: WorkflowSnapshot): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Evidence-to-Component Certification</title>
<style>
body{font-family:system-ui,sans-serif;max-width:760px;margin:0 auto;padding:24px;line-height:1.5;background:#fafafa;color:#161616}
main{background:#fff;border:1px solid #d8d8d8;border-radius:12px;padding:24px}h1,h2{line-height:1.2}.status{font-weight:700}.trace{padding-left:20px}.action{border-top:2px solid #222;margin-top:24px;padding-top:16px}.visually-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
</style>
</head>
<body>
<main>
<p class="status" aria-label="Navigation status: Green, On Course">🟢 Green — On Course</p>
<h1>Resume Component Certified</h1>
<p>${escapeHtml(snapshot.message)}</p>
<h2>Certified Statement</h2>
<p>${escapeHtml(snapshot.component.text)}</p>
<h2>Evidence Trace</h2>
<ul class="trace">
<li><strong>Source:</strong> ${escapeHtml(snapshot.evidence.sourceLocation)}</li>
<li><strong>Verified information:</strong> ${escapeHtml(snapshot.evidence.exactTextOrFact)}</li>
<li><strong>Confidence:</strong> ${escapeHtml(snapshot.evidence.confidence)}</li>
<li><strong>Component version:</strong> ${snapshot.component.version}</li>
</ul>
<h2>Completed Stages</h2>
<ol>${snapshot.completedStages.map((stage) => `<li>${escapeHtml(stage.replaceAll("_", " "))}</li>`).join("")}</ol>
<section class="action" aria-labelledby="captain-action-heading">
<h2 id="captain-action-heading">Captain Owns</h2>
<p><strong>Pending approvals:</strong> None.</p>
<p><strong>Captain actions:</strong> None.</p>
</section>
</main>
</body>
</html>`;

export const renderWorkflowError = (error: DomainError): string => `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Evidence Review</title></head>
<body><main><p aria-live="assertive"><strong>We could not complete this step yet.</strong></p><p>${escapeHtml(error.message)}</p>
<h1>Where would you like to navigate next?</h1><ul>
<li>Upload supporting evidence</li><li>Search historical resume documents</li><li>Search my email evidence</li><li>Search similar job descriptions for memory support only</li><li>Show the highest-ROI next step</li></ul>
<p>Your current work remains saved.</p></main></body></html>`;
