import type { AssembledResume, ResumeAssemblyRequest } from "./types.js";

const escapeHtml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const section = (heading: string, lines: string[]): string[] => lines.length ? [heading, ...lines, ""] : [];

export const assembleRecruiterResume = (request: ResumeAssemblyRequest): AssembledResume => {
  const eligible = request.components.filter((component) =>
    component.certificationStatus === "certified" &&
    (component.approvedLanes.length === 0 || component.approvedLanes.includes(request.targetLane)),
  );
  const warnings: string[] = [];
  const summaries = eligible.filter((c) => c.componentType === "summary").map((c) => c.text);
  const skills = eligible.filter((c) => c.componentType === "skill").map((c) => c.text);
  const roles = eligible.filter((c) => c.componentType === "role_block").map((c) => c.text);
  const bullets = eligible.filter((c) => ["bullet", "achievement"].includes(c.componentType)).map((c) => `• ${c.text}`);
  if (!summaries.length) warnings.push("No certified summary component was available for this lane.");
  if (!bullets.length) warnings.push("No certified bullet or achievement component was available for this lane.");

  const lines = [
    request.candidateName,
    request.contactLine,
    request.title,
    "",
    ...section("PROFESSIONAL SUMMARY", summaries),
    ...section("CORE SKILLS", skills.length ? [skills.join(" | ")] : []),
    ...section("PROFESSIONAL EXPERIENCE", [...roles, ...bullets]),
  ];
  const plainText = lines.join("\n").trim() + "\n";
  const htmlSections = [
    summaries.length ? `<section><h2>Professional Summary</h2>${summaries.map((x) => `<p>${escapeHtml(x)}</p>`).join("")}</section>` : "",
    skills.length ? `<section><h2>Core Skills</h2><p>${skills.map(escapeHtml).join(" | ")}</p></section>` : "",
    roles.length || bullets.length ? `<section><h2>Professional Experience</h2>${roles.map((x) => `<h3>${escapeHtml(x)}</h3>`).join("")}<ul>${bullets.map((x) => `<li>${escapeHtml(x.slice(2))}</li>`).join("")}</ul></section>` : "",
  ].join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(request.title)}</title></head><body><main><h1>${escapeHtml(request.candidateName)}</h1><p>${escapeHtml(request.contactLine)}</p><p><strong>${escapeHtml(request.title)}</strong></p>${htmlSections}</main></body></html>`;
  return { resumeId: request.resumeId, title: request.title, targetLane: request.targetLane, plainText, html, componentIds: eligible.map((c) => c.componentId), warnings };
};
