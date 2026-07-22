from pathlib import Path
import re, sys, hashlib, json
root = Path(__file__).resolve().parents[1]
html = (root / 'resume-product-primary-private-mvp-v13.html').read_text()
model = (root / 'src/frontend/app/private-mvp-model.ts').read_text()
renderer = (root / 'src/frontend/app/render-private-mvp.ts').read_text()
checks = {
  'four workflow screens': html.count('data-screen=') == 4,
  'confidence selector': 'id="confidenceLevel"' in html,
  'five confidence levels': all(x in html for x in ['Verified evidence','Strong supporting evidence','Corroborated memory','Partial memory','Not enough information yet']),
  'friendly unsupported wording': 'We could not fully verify this experience yet.' in html,
  'non-accusatory clarification': 'That does not necessarily mean it is incorrect.' in html,
  'work preservation notice': 'Your work is saved.' in html,
  'historical resume recovery': 'Search historical resume documents' in html,
  'email recovery': 'Search my email evidence' in html,
  'reconstruction recovery': 'Help me reconstruct the experience' in html,
  'highest ROI recovery': 'Show the highest ROI next step' in html,
  'job description boundary': 'memory aids only. They are never proof' in html,
  'autosave status': 'id="autosaveStatus"' in html and 'aria-live="polite"' in html,
  'keyboard focus target': 'id="recoveryPanel" class="notice hidden" tabindex="-1"' in html,
  'integrity checksum': 'crypto.subtle.digest' in html,
  'unsafe property guard': '__proto__|prototype|constructor' in html and '\\s*:' in html,
  'one megabyte import limit': '1000000' in html,
  'clear confirmation': "confirm('Clear all locally saved Resume Product data" in html,
  'source model confidence': 'EvidenceConfidenceLevel' in model,
  'source model recovery route': 'selectRecoveryRoute' in model,
  'source renderer parity': 'Search my email evidence' in renderer and 'confidenceLevel' in renderer,
}
failed=[name for name, ok in checks.items() if not ok]
report={'passed':len(checks)-len(failed),'total':len(checks),'failed':failed,'sha256':hashlib.sha256(html.encode()).hexdigest()}
(root/'V13_STATIC_QUALITY_REPORT.json').write_text(json.dumps(report,indent=2))
for name,ok in checks.items(): print(('PASS' if ok else 'FAIL')+': '+name)
print(json.dumps(report,indent=2))
sys.exit(1 if failed else 0)
