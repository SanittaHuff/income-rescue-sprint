# Continuous Governed Build Mode

Status: Captain approved for the remainder of the Income Rescue Sprint product build.

## Purpose

Increase build speed and continuity without sacrificing accuracy, safety, the LVHQ Oath, user experience, or quality.

## Operating rule

Work proceeds in larger verified build blocks instead of stopping after every small change. Routine design, implementation, testing, documentation, deployment, and CBOM synchronization continue without requesting repeated approval.

## Required priorities

1. Accuracy
2. Safety and privacy
3. LVHQ Oath and constitutional alignment
4. User experience and accessibility
5. Quality and verification
6. Speed through batching and automation

## Stop conditions

Stop and return the full governed WGZ percentage report only when one of these conditions is reached:

- Credentials, permissions, payment, or account access only the Captain can provide
- An irreversible external action
- A genuine governance decision with materially different consequences
- A safety, privacy, legal, or security risk that cannot be safely bounded
- A failed deployment or defect that cannot be remediated through the next safe path
- Completion of the largest safe build block available in the current session

## Continuous workflow

Refresh governing sources → reconcile the active checkpoint → plan the largest safe build block → implement → test → remediate defects → deploy → verify → synchronize CBOM → continue.

If a path is blocked, navigate to the next best safe path that still achieves the objective without unnecessary interruption.

## Reporting rule

Do not interrupt the build with small progress reports. Record interim evidence in GitHub and CBOM. Report only at a genuine Captain gate, genuine dependency, material anomaly, or major verified milestone.

## Release boundary

This operating mode accelerates prototype development. It does not grant certification, production-security approval, participant-data authorization, legal approval, payment activation, commercialization, or public-launch approval.
