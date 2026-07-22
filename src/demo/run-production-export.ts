import { assembleRecruiterResume } from "../domain/resume-assembly/service.js";
import { exportProductionResume } from "../domain/resume-assembly/production-export.js";

const resume = assembleRecruiterResume({
  resumeId: "00000000-0000-4000-8000-000000000201",
  title: "Azure DevOps Administrator | Technical Operations",
  targetLane: "B3A",
  candidateName: "Sanitta Huff",
  contactLine: "Newcastle, WA | Gmail address intentionally omitted from this demonstration",
  components: [
    { componentId: "00000000-0000-4000-8000-000000000202", componentType: "summary", text: "Technical operations and cloud infrastructure professional with experience supporting Azure DevOps administration, governance, service delivery, and business systems.", certificationStatus: "certified", approvedLanes: ["B3A"] },
    { componentId: "00000000-0000-4000-8000-000000000203", componentType: "skill", text: "Azure DevOps | PowerShell | YAML | JSON | REST APIs | KQL | Power BI", certificationStatus: "certified", approvedLanes: ["B3A"] },
    { componentId: "00000000-0000-4000-8000-000000000204", componentType: "role_block", text: "Microsoft via Collabera - Azure Infrastructure Project Coordinator & Tooling Engineer, Contract", certificationStatus: "certified", approvedLanes: ["B3A"] },
    { componentId: "00000000-0000-4000-8000-000000000205", componentType: "bullet", text: "Administered Azure DevOps projects, boards, repositories, access controls, sprint structures, and governed work-item migrations.", certificationStatus: "certified", approvedLanes: ["B3A"] },
    { componentId: "00000000-0000-4000-8000-000000000206", componentType: "bullet", text: "Supported tooling, reporting, and operational workflows using Power BI, YAML, JSON, REST interfaces, KQL, and PowerShell.", certificationStatus: "certified", approvedLanes: ["B3A"] },
  ],
});

const result = await exportProductionResume(resume, "private-mvp-production-resume");
console.log(JSON.stringify(result));
