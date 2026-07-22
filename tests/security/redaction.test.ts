import { describe, expect, it } from "vitest";
import { redactSensitiveLogText, safeErrorMessage } from "../../src/security/redaction.js";
describe("security redaction", () => {
  it("redacts email and phone from logs", () => {
    expect(redactSensitiveLogText("Contact me@example.com at 425-555-1212")).toBe("Contact [EMAIL_REDACTED] at [PHONE_REDACTED]");
  });
  it("sanitizes error messages", () => {
    expect(safeErrorMessage(new Error("Failed for me@example.com"))).toBe("Failed for [EMAIL_REDACTED]");
  });
});
