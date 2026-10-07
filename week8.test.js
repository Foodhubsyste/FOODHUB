const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;

describe("Week 8 — error handling and feedback", () => {
  let UI;
  let app;

  beforeAll(() => {
    global.window = {};
    const componentSource = fs.readFileSync(path.join(root, "public", "components.js"), "utf8");
    vm.runInThisContext(componentSource);
    UI = global.window.FoodHubComponents;
    app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
  });

  test("shared feedback components include loading, empty, not-found, and error states", () => {
    expect(typeof UI.loadingState).toBe("function");
    expect(typeof UI.emptyState).toBe("function");
    expect(typeof UI.notFoundState).toBe("function");
    expect(typeof UI.errorState).toBe("function");
    expect(UI.loadingState("Loading")).toContain('role="status"');
    expect(UI.notFoundState()).toContain("Record not found.");
    expect(UI.errorState("Try again")).toContain('role="alert"');
  });

  test("API preserves status and field metadata for all failure categories", () => {
    expect(app).toContain("err.status=r.status");
    expect(app).toContain("err.field=j.field||null");
    expect(app).toContain("friendlyError");
    expect(app).toContain("err.status===404");
    expect(app).toContain("!err?.status");
  });

  test("list failures show a visible error and Retry", () => {
    expect(app).toContain("setAdminState('error',message)");
    expect(app).toContain("toast(message,'error','Retry',loadAdmin)");
    expect(app).toContain("UI.notFoundState");
    expect(app).toContain("toast(message,'error','Retry',loadCustomerOrders)");
  });

  test("422 validation stays inline and avoids raw technical errors", () => {
    expect(app).toContain("formError(form,message,err.status===422?err.field:null)");
    expect(app).toContain("err.status===422&&err.field");
    expect(app).toContain("Please check the highlighted fields and try again.");
  });

  test("destructive deletes require confirmation and provide retry", () => {
    expect(app).toContain("Are you sure you want to delete this menu item?");
    expect(app).toContain("Are you sure you want to delete this customer?");
    expect(app).toContain("toast(message,'error','Retry',()=>deleteMenu(id))");
    expect(app).toContain("toast(message,'error','Retry',()=>deleteCustomer(id))");
    expect(app).toContain("button.disabled=true");
  });

  test("pending controls and success feedback remain part of the async lifecycle", () => {
    expect(app).toContain("setFormBusy(form,true");
    expect(app).toContain("setFormBusy(form,false)");
    expect(app).toContain("toast(id?'Menu updated.':'Menu added.')");
    expect(app).toContain("toast(id?'Customer updated.':'Customer added.')");
    expect(app).toContain("toast('Order updated.')");
  });

  test("Week 8 required documentation exists", () => {
    expect(fs.existsSync(path.join(root, "docs", "feedback-matrix.md"))).toBe(true);
    expect(fs.existsSync(path.join(root, "docs", "feedback-tests.md"))).toBe(true);
    expect(fs.existsSync(path.join(root, "docs", "WEEK8_DELIVERABLE.md"))).toBe(true);
    expect(fs.existsSync(path.join(root, "docs", "ai-notes", "week-08.md"))).toBe(true);
  });
});
