const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;

describe("Week 6 — view layer and component architecture", () => {
  let components;

  beforeAll(() => {
    const source = fs.readFileSync(path.join(root, "public", "components.js"), "utf8");
    global.window = {};
    vm.runInThisContext(source);
    components = global.window.FoodHubComponents;
  });

  test("reusable component library exposes loading, empty, error, table, badge, and stat views", () => {
    expect(components).toBeTruthy();
    expect(typeof components.loadingState).toBe("function");
    expect(typeof components.emptyState).toBe("function");
    expect(typeof components.errorState).toBe("function");
    expect(typeof components.table).toBe("function");
    expect(typeof components.badge).toBe("function");
    expect(typeof components.stat).toBe("function");
  });

  test("table component uses semantic column scopes", () => {
    const html = components.table(["Name"], ["<tr><td>Adobo</td></tr>"]);
    expect(html).toContain('<th scope="col">Name</th>');
    expect(html).toContain("<tbody>");
  });

  test("all three data states render accessible state containers", () => {
    expect(components.loadingState("Loading menu")).toContain('role="status"');
    expect(components.emptyState("No menu")).toContain('role="status"');
    expect(components.errorState("Network failed")).toContain('role="alert"');
  });

  test("state content is HTML escaped", () => {
    expect(components.emptyState("<b>unsafe</b>")).not.toContain("<b>unsafe</b>");
    expect(components.errorState("<i>unsafe</i>")).not.toContain("<i>unsafe</i>");
  });

  test("Week 6 frontend loads components before app behavior", () => {
    const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
    expect(html.indexOf("/components.js")).toBeGreaterThan(-1);
    expect(html.indexOf("/components.js")).toBeLessThan(html.indexOf("/app.js"));
  });

  test("app.js uses the reusable component library and explicit state rendering", () => {
    const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
    expect(app).toContain("window.FoodHubComponents");
    expect(app).toContain("UI.loadingState");
    expect(app).toContain("UI.errorState");
    expect(app).toContain("UI.emptyState");
    expect(app).toContain("UI.table");
    expect(app).toContain("UI.stat");
  });

  test("required Week 6 documentation and prompt log exist", () => {
    expect(fs.existsSync(path.join(root, "docs", "components.md"))).toBe(true);
    expect(fs.existsSync(path.join(root, "docs", "WEEK6_DELIVERABLE.md"))).toBe(true);
    expect(fs.existsSync(path.join(root, "docs", "ai-notes", "week-06.md"))).toBe(true);

    const log = fs.readFileSync(path.join(root, "docs", "ai-notes", "week-06.md"), "utf8");
    expect(log).toContain("AI-generated");
    expect(log).toContain("AI-modified");
    expect(log).toContain("Hand-written");
  });
});
