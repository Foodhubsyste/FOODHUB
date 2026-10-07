const fs = require("fs");
const path = require("path");

const app = fs.readFileSync(path.join(__dirname, "public", "app.js"), "utf8");

describe("Week 7 — asynchronous form binding", () => {
  test("API preserves HTTP status and validation field metadata", () => {
    expect(app).toContain("err.status=r.status");
    expect(app).toContain("err.field=j.field||null");
  });

  test("Create menu form uses asynchronous POST and prevents page reload", () => {
    expect(app).toContain("$('#menuForm').onsubmit=async e=>");
    expect(app).toContain("e.preventDefault()");
    expect(app).toContain("'/api/menu'");
    expect(app).toContain("method:id?'PUT':'POST'");
  });

  test("Create customer form uses asynchronous POST", () => {
    expect(app).toContain("$('#customerForm').onsubmit=async e=>");
    expect(app).toContain("'/api/customers'");
    expect(app).toContain("method:id?'PUT':'POST'");
  });

  test("Update order form uses PUT and refreshes the UI after success", () => {
    expect(app).toContain("$('#orderEditForm').onsubmit=async e=>");
    expect(app).toContain("'/api/orders/'+id");
    expect(app).toContain("method:'PUT'");
    expect(app).toContain("await loadAdmin()");
  });

  test("pending state disables the submit button", () => {
    expect(app).toContain("button.disabled=true");
    expect(app).toContain("setAttribute('aria-busy','true')");
    expect(app).toContain("setFormBusy(form,true");
  });

  test("success and error states are visible", () => {
    expect(app).toContain("toast(id?'Menu updated.':'Menu added.')");
    expect(app).toContain("formError(form,err.message");
    expect(app).toContain("err.status===422?err.field:null");
  });

  test("customer checkout uses async POST and a pending state", () => {
    expect(app).toContain("await api('/api/orders'");
    expect(app).toContain("submit.textContent='Placing order...'");
    expect(app).toContain("$('#checkoutError').textContent");
  });

  test("Week 7 documentation and AI prompt log exist", () => {
    expect(fs.existsSync(path.join(__dirname, "docs", "binding-tests.md"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "docs", "WEEK7_DELIVERABLE.md"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "docs", "ai-notes", "week-07.md"))).toBe(true);
  });
});
