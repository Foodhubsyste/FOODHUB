const fs = require("fs");
const path = require("path");

describe("Week 12 — final submission preparation", () => {
  test("required Week 12 preparation documents exist", () => {
    const required = [
      "retrospective.md",
      "presentation-outline.md",
      "final-demo-script.md",
      "defense-guide.md",
      "final-submission-checklist.md",
      "WEEK12_DELIVERABLE.md"
    ];
    for (const file of required) {
      expect(fs.existsSync(path.join(__dirname, "docs", file))).toBe(true);
    }
  });

  test("defense guide preserves the official unassisted rule", () => {
    const defense = fs.readFileSync(path.join(__dirname, "docs", "defense-guide.md"), "utf8");
    expect(defense).toContain("unassisted");
    expect(defense).toContain("without AI");
  });

  test("presentation outline contains the required story arc", () => {
    const outline = fs.readFileSync(path.join(__dirname, "docs", "presentation-outline.md"), "utf8");
    expect(outline).toContain("Problem");
    expect(outline).toContain("Solution");
    expect(outline).toContain("Architecture");
    expect(outline).toContain("Live Demo");
  });

  test("deployment documentation is part of final evidence", () => {
    expect(fs.existsSync(path.join(__dirname, "docs", "deployment.md"))).toBe(true);
  });

  test("final checklist requires real public deployment evidence", () => {
    const checklist = fs.readFileSync(path.join(__dirname, "docs", "final-submission-checklist.md"), "utf8");
    expect(checklist).toContain("Public deployment is reachable");
    expect(checklist).toContain("AI OFF");
  });
});
