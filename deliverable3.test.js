const fs = require("fs");
const path = require("path");

describe("Deliverable 3 — Interface & View Binding submission", () => {
  test("required Phase 3 documentation is present", () => {
    const required = [
      "DELIVERABLE3_INTERFACE_VIEW_BINDING.md",
      "individual-contribution.md",
      "components.md",
      "feedback-matrix.md",
      "binding-tests.md",
      "feedback-tests.md"
    ];
    for (const file of required) {
      expect(fs.existsSync(path.join(__dirname, "docs", file))).toBe(true);
    }
  });

  test("all Week 6–8 prompt logs are present", () => {
    for (const week of ["06", "07", "08"]) {
      expect(fs.existsSync(path.join(__dirname, "docs", "ai-notes", `week-${week}.md`))).toBe(true);
    }
  });

  test("frontend contains reusable component, async binding, and feedback patterns", () => {
    const app = fs.readFileSync(path.join(__dirname, "public", "app.js"), "utf8");
    const components = fs.readFileSync(path.join(__dirname, "public", "components.js"), "utf8");
    expect(components).toContain("loadingState");
    expect(components).toContain("emptyState");
    expect(components).toContain("errorState");
    expect(app).toContain("preventDefault()");
    expect(app).toContain("await api");
    expect(app).toContain("setFormBusy(form,true");
    expect(app).toContain("friendlyError");
  });

  test("README describes the Phase 3 implementation", () => {
    const readme = fs.readFileSync(path.join(__dirname, "README.md"), "utf8");
    expect(readme).toContain("Week 8");
    expect(readme).toContain("loading");
    expect(readme).toContain("error");
  });
});
