const fs = require("fs");
const path = require("path");

describe("Deliverable 4 — final package", () => {
  test("required QA, deployment, retrospective, and presentation evidence exists", () => {
    const required = [
      "DELIVERABLE4_QA_DEPLOYMENT_PRESENTATION.md",
      "DELIVERABLE4_CHECKLIST.md",
      "final-evidence.md",
      "final-presentation.md",
      "test-matrix.md",
      "deployment.md",
      "retrospective.md"
    ];
    for (const file of required) {
      expect(fs.existsSync(path.join(__dirname, "docs", file))).toBe(true);
    }
  });

  test("Phase 4 prompt logs are present", () => {
    for (const week of ["09", "10", "11"]) {
      expect(fs.existsSync(path.join(__dirname, "docs", "ai-notes", `week-${week}.md`))).toBe(true);
    }
  });

  test("final package preserves the unassisted defense requirement", () => {
    const deliverable = fs.readFileSync(
      path.join(__dirname, "docs", "DELIVERABLE4_QA_DEPLOYMENT_PRESENTATION.md"),
      "utf8"
    );
    expect(deliverable).toContain("unassisted");
    expect(deliverable).toContain("oral defense");
  });

  test("final presentation follows the required story arc", () => {
    const deck = fs.readFileSync(
      path.join(__dirname, "docs", "final-presentation.md"),
      "utf8"
    );
    expect(deck).toContain("Problem");
    expect(deck).toContain("Solution");
    expect(deck).toContain("Architecture");
    expect(deck).toContain("Live Demo");
    expect(deck).toContain("Lessons");
  });

  test("final evidence uses real status placeholders rather than invented results", () => {
    const evidence = fs.readFileSync(
      path.join(__dirname, "docs", "final-evidence.md"),
      "utf8"
    );
    expect(evidence).toContain("PENDING");
    expect(evidence).toContain("Do not mark a row complete without real evidence.");
  });
});
