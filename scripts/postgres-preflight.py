from pathlib import Path
import hashlib, json, re, sys
root=Path(__file__).resolve().parents[1]
mdir=root/'src/persistence/migrations'
files=sorted(mdir.glob('*.sql'))
required=['001_extensions.sql','002_sources_evidence.sql','003_experiences.sql','004_resume_components.sql','005_decisions.sql','006_versions_audit.sql']
checks={}
checks['migration sequence complete']=[f.name for f in files]==required
checks['docker compose present']=(root/'docker-compose.postgres.yml').exists()
checks['migration runner present']=(root/'scripts/run-postgres-migrations.sh').exists()
checks['no destructive drop database']=all('drop database' not in f.read_text().lower() for f in files)
runner=(root/'scripts/run-postgres-migrations.sh').read_text()
checks['runner uses atomic migration transactions']='--single-transaction' in runner
checks['runner verifies required tables']='required_tables=' in runner and 'to_regclass' in runner
checks['foreign keys present']=any('references ' in f.read_text().lower() for f in files)
checks['indexes present']=any('create index' in f.read_text().lower() for f in files)
manifest=[]
for f in files:
    data=f.read_bytes(); manifest.append({'file':f.name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
report={'checks':checks,'migrations':manifest,'readyForRealPostgresExecution':all(checks.values()),'actualPostgresExecutionCompleted':False}
(root/'POSTGRES_PREFLIGHT_REPORT.json').write_text(json.dumps(report,indent=2))
for k,v in checks.items():print(('PASS' if v else 'FAIL')+': '+k)
print('NOTE: This validates readiness only; it does not execute PostgreSQL.')
sys.exit(0 if all(checks.values()) else 1)
