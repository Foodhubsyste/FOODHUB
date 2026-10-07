const fs = require("fs");
const path = require("path");

describe("Week 9 — review artifacts", () => {
  test("required Week 9 files exist", () => {
    expect(fs.existsSync(path.join(__dirname, "docs", "review-checklist.md"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "docs", "find-the-flaw.md"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "docs", "WEEK9_DELIVERABLE.md"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "docs", "ai-notes", "week-09.md"))).toBe(true);
  });

  test("flaw exercise covers required review categories", () => {
    const doc = fs.readFileSync(path.join(__dirname, "docs", "find-the-flaw.md"), "utf8");
    expect(doc).toContain("Missing validation");
    expect(doc).toContain("Wrong status code");
    expect(doc).toContain("Unhandled 404");
    expect(doc).toContain("Unhandled 500");
    expect(doc).toContain("Missing edge-case coverage");
  });

  test("frontend still escapes dynamic values", () => {
    const app = fs.readFileSync(path.join(__dirname, "public", "app.js"), "utf8");
    expect(app).toContain("const esc=");
  });

  test("server-side validation remains in the request pipeline", () => {
    const validation = fs.readFileSync(path.join(__dirname, "middleware", "validation.js"), "utf8");
    const routes = fs.readFileSync(path.join(__dirname, "routes", "menuRoutes.js"), "utf8");
    expect(validation).toContain("validateMenu");
    expect(routes).toContain("bodyValidator");
  });

  test("Week 9 merge gate is documented honestly", () => {
    const doc = fs.readFileSync(path.join(__dirname, "docs", "WEEK9_DELIVERABLE.md"), "utf8");
    expect(doc).toContain("one approving review");
    expect(doc).toContain("does not claim");
  });
});
