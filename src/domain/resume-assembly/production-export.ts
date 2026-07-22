import { writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import type { AssembledResume } from "./types.js";

export interface ProductionExportResult { docxPath: string; pdfPath: string; }
const scriptPath = resolve("scripts/export_resume.py");
const runPython = async (payloadPath: string): Promise<void> => new Promise((resolveRun, reject) => {
  const child = spawn("python", [scriptPath, payloadPath], { stdio: ["ignore", "pipe", "pipe"] });
  let stderr = "";
  child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
  child.on("error", reject);
  child.on("close", (code) => code === 0 ? resolveRun() : reject(new Error(`Resume export failed (${code}): ${stderr}`)));
});
export const exportProductionResume = async (resume: AssembledResume, basePath: string): Promise<ProductionExportResult> => {
  const docxPath = `${basePath}.docx`; const pdfPath = `${basePath}.pdf`; const payloadPath = `${basePath}.export.json`;
  await writeFile(payloadPath, JSON.stringify({ plainText: resume.plainText, docxPath, pdfPath }), "utf8");
  await runPython(payloadPath);
  return { docxPath, pdfPath };
};
export const exportResumeDocx = async (resume: AssembledResume, path: string): Promise<void> => { await exportProductionResume(resume, path.replace(/\.docx$/i, "")); };
export const exportResumePdf = async (resume: AssembledResume, path: string): Promise<void> => { await exportProductionResume(resume, path.replace(/\.pdf$/i, "")); };
