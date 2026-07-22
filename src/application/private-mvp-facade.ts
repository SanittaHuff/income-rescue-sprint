import { assembleRecruiterResume } from "../domain/resume-assembly/service.js";
import { toRtf, validateAtsReadability } from "../domain/resume-assembly/export.js";
import type { ResumeAssemblyRequest } from "../domain/resume-assembly/types.js";
import { matchCertifiedResumeToJob } from "../domain/job-matching/service.js";
import type { JobMatchRequest } from "../domain/job-matching/types.js";

export const buildResumePackage = (request: ResumeAssemblyRequest) => {
  const resume = assembleRecruiterResume(request);
  return {
    resume,
    rtf: toRtf(resume),
    ats: validateAtsReadability(resume),
  };
};

export const evaluateJobMatch = (request: JobMatchRequest) => matchCertifiedResumeToJob(request);
