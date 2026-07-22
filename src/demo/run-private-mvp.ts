import { writeFile } from "node:fs/promises";
import { buildResumePackage, evaluateJobMatch } from "../application/private-mvp-facade.js";
import type { CertifiedResumeComponentInput } from "../domain/resume-assembly/types.js";

const component = (id: string, type: CertifiedResumeComponentInput["componentType"], text: string): CertifiedResumeComponentInput => ({
  componentId: id, componentType: type, text, approvedLanes: ["B3A"], certificationStatus: "certified",
});
const result = buildResumePackage({ resumeId: "resume-demo", candidateName: "Sanitta Huff", contactLine: "Gmail | Newcastle, WA", title: "Azure DevOps Administrator", targetLane: "B3A", components: [
  component("summary", "summary", "Technical operations professional with Azure DevOps administration and cloud-support experience."),
  component("skill", "skill", "Azure DevOps | PowerShell | YAML | KQL | Power BI"),
  component("bullet", "bullet", "Administered Azure DevOps boards, workflows, permissions, and migration activities."),
]});
const match = evaluateJobMatch({ jobTitle: "Azure DevOps Administrator", jobDescription: "Seeking ADO administration, PowerShell, YAML, governance, and CI/CD experience.", certifiedComponentTexts: result.resume.plainText.split("\n") });
await writeFile("private-mvp-resume.txt", result.resume.plainText, "utf8");
await writeFile("private-mvp-resume.rtf", result.rtf, "utf8");
await writeFile("private-mvp-result.json", JSON.stringify({ ats: result.ats, match }, null, 2), "utf8");
console.log(JSON.stringify({ ats: result.ats, match, outputs: ["private-mvp-resume.txt", "private-mvp-resume.rtf", "private-mvp-result.json"] }, null, 2));
