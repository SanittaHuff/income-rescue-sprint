import { describe, expect, it } from "vitest";
import { renderPrivateMvpHtml } from "../../src/frontend/app/render-private-mvp.js";
import { initialPrivateMvpUiState } from "../../src/frontend/app/private-mvp-model.js";

describe("primary private MVP HTML", () => {
  const html = renderPrivateMvpHtml(initialPrivateMvpUiState());
  it("contains four accessible workflow steps", () => {
    expect(html).toContain('aria-label="Resume workflow steps"');
    expect(html.match(/data-screen=/g)?.length).toBe(4);
    expect(html).toContain('aria-live="polite"');
  });
  it("supports local recovery and user-controlled exports", () => {
    expect(html).toContain("localStorage");
    expect(html).toContain("Download Word-compatible resume");
    expect(html).toContain("Download integrity-checked session backup");
    expect(html).toContain("Validate and restore backup");
    expect(html).toContain("Your current work was not changed");
    expect(html).toContain("crypto.subtle.digest");
    expect(html).toContain("Clear private session data");
  });
  it("states that job descriptions are not evidence", () => {
    expect(html).toContain("never treated as proof");
    expect(html).toContain("highest-value gap");
  });
});

describe("evidence recovery and confidence workflow", () => {
  const html = renderPrivateMvpHtml(initialPrivateMvpUiState());
  it("uses user-friendly recovery language and preserves truthful boundaries", () => {
    expect(html).toContain("We could not fully verify this experience yet.");
    expect(html).toContain("That does not necessarily mean it is incorrect.");
    expect(html).toContain("Your work is saved");
    expect(html).toContain("Similar job descriptions are memory aids only");
  });
  it("offers the approved recovery navigation routes", () => {
    expect(html).toContain("Upload supporting evidence");
    expect(html).toContain("Search historical resume documents");
    expect(html).toContain("Search my email evidence");
    expect(html).toContain("Help me reconstruct the experience");
    expect(html).toContain("Show the highest ROI next step");
  });
  it("prevents duplicate browser certifications and preserves the component registry in backups", () => {
    expect(html).toContain("certifiedComponentRecords");
    expect(html).toContain("This exact evidence-linked statement was already certified. No duplicate was created.");
    expect(html).toContain("fingerprint");
  });
  it("exposes evidence confidence and autosave status accessibly", () => {
    expect(html).toContain('id="confidenceLevel"');
    expect(html).toContain("Corroborated memory");
    expect(html).toContain('id="autosaveStatus"');
    expect(html).toContain('aria-live="polite"');
  });
});
