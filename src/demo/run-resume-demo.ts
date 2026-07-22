import { writeFile } from "node:fs/promises";
import { assembleRecruiterResume } from "../domain/resume-assembly/service.js";
import { matchCertifiedResumeToJob } from "../domain/job-matching/service.js";

const resume = assembleRecruiterResume({
  resumeId: "11111111-1111-4111-8111-111111111111", title: "Azure DevOps Administrator", targetLane: "B3A",
  candidateName: "Sample Candidate", contactLine: "email@example.com | Remote",
  components: [
    { componentId: "22222222-2222-4222-8222-222222222222", componentType: "summary", text: "Technical operations professional specializing in governed Azure DevOps administration.", certificationStatus: "certified", approvedLanes: ["B3A"] },
    { componentId: "33333333-3333-4333-8333-333333333333", componentType: "skill", text: "Azure DevOps", certificationStatus: "certified", approvedLanes: ["B3A"] },
    { componentId: "44444444-4444-4444-8444-444444444444", componentType: "bullet", text: "Administered Azure DevOps boards, permissions, and workflow governance.", certificationStatus: "certified", approvedLanes: ["B3A"] },
  ],
});
const match = matchCertifiedResumeToJob({ jobTitle: "Azure DevOps Administrator", jobDescription: "Azure DevOps boards, governance, pipelines, Terraform", certifiedComponentTexts: [resume.plainText] });
await writeFile("resume-assembly-demo.html", resume.html, "utf8");
await writeFile("resume-assembly-demo.txt", resume.plainText + `\nMATCH SCORE: ${match.score}%\nSUPPORTED: ${match.supportedTerms.join(", ")}\nGAPS: ${match.gaps.join(", ")}\n`, "utf8");
console.log(JSON.stringify({ componentCount: resume.componentIds.length, warnings: resume.warnings, match }, null, 2));
