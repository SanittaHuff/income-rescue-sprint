import { spawnSync } from "node:child_process";
const steps = [
  ["npm", ["run", "typecheck"]],
  ["npm", ["test"]],
  ["npm", ["audit", "--audit-level=high"]],
  ["npm", ["run", "demo:primary"]],
  ["npm", ["run", "demo:export"]],
];
for (const [command, args] of steps) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("QUALITY_GATE_PASSED");
