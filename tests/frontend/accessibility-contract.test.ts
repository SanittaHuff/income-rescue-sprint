import { describe, expect, it } from "vitest";
import { initialPrivateMvpUiState } from "../../src/frontend/app/private-mvp-model.js";
import { renderPrivateMvpHtml } from "../../src/frontend/app/render-private-mvp.js";

describe("primary MVP accessibility contract", () => {
  const html = renderPrivateMvpHtml(initialPrivateMvpUiState());

  it("provides language, skip navigation, main landmark, and live status regions", () => {
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('href="#main">Skip to main content');
    expect(html).toContain('<main class="shell" id="main" tabindex="-1">');
    expect(html).toContain('role="status"');
    expect(html).toContain('role="alert"');
  });

  it("uses labeled controls, visible keyboard focus, and minimum touch target sizing", () => {
    expect(html).toContain('<label for="evidenceText">');
    expect(html).toContain('<label for="jobDescription">');
    expect(html).toContain('*:focus-visible{outline:3px solid #0969da');
    expect(html).toContain('min-height:44px');
  });

  it("uses inline accessible guidance instead of browser alert dialogs", () => {
    expect(html).not.toContain("alert('");
    expect(html).toContain('announce(');
  });
});
