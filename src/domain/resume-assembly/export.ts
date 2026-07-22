import type { AssembledResume } from "./types.js";

export interface AtsValidationResult {
  passed: boolean;
  warnings: string[];
}

const escapeRtf = (value: string): string => value
  .replaceAll("\\", "\\\\")
  .replaceAll("{", "\\{")
  .replaceAll("}", "\\}")
  .replaceAll("\n", "\\par\n");

export const toRtf = (resume: AssembledResume): string => {
  const body = escapeRtf(resume.plainText);
  return `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\fs22 ${body}}`;
};

export const validateAtsReadability = (resume: AssembledResume): AtsValidationResult => {
  const warnings: string[] = [];
  const text = resume.plainText;
  if (!text.includes("PROFESSIONAL SUMMARY")) warnings.push("Professional Summary section is missing.");
  if (!text.includes("PROFESSIONAL EXPERIENCE")) warnings.push("Professional Experience section is missing.");
  if (/[│┃┆┇┊┋╎╏]/.test(text)) warnings.push("Decorative vertical characters may reduce ATS readability.");
  if (/\t{2,}/.test(text)) warnings.push("Repeated tabs may produce unstable ATS parsing.");
  if (resume.componentIds.length === 0) warnings.push("No certified resume components were assembled.");
  warnings.push(...resume.warnings);
  return { passed: warnings.length === 0, warnings };
};
