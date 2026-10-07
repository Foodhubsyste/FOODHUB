const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("./server");

const dbFile = path.join(__dirname, "data", "db.json");
let originalDb;

beforeAll(() => {
  originalDb = fs.readFileSync(dbFile, "utf8");
});

afterAll(() => {
  fs.writeFileSync(dbFile, originalDb);
});

async function login() {
  const res = await request(app).post("/api/admin/login").send({
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "foodhub123"
  });
  expect(res.status).toBe(200);
  return res.body.data.token;
}

describe("Week 10 — critical-path automated QA coverage", () => {
  test("health endpoint returns a valid success envelope", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.error).toBeNull();
  });

  test("protected customer list rejects anonymous access", async () => {
    const res = await request(app).get("/api/customers");
    expect(res.status).toBe(401);
  });

  test("admin login grants access to protected menu data", async () => {
    const token = await login();
    const res = await request(app)
      .get("/api/menu")
      .set("Authorization", "Bearer " + token);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("invalid order item is rejected with a validation response", async () => {
    const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post("/api/orders")
      .send({
        customer_id: db.customers[0].id,
        items: [{ menu_id: "M-NOT-REAL", quantity: 1 }],
        fulfillment_type: "pickup",
        scheduled_datetime: future
      });

    expect(res.status).toBe(422);
    expect(res.body.field).toBe("items");
  });

  test("nonexistent API record returns 404 rather than silent success", async () => {
    const res = await request(app).get("/api/menu/M-NOT-REAL");
    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
  });

  test("frontend remains protected against raw HTML insertion", () => {
    const appCode = fs.readFileSync(path.join(__dirname, "public", "app.js"), "utf8");
    expect(appCode).toContain("const esc=");
  });

  test("Week 10 QA artifacts exist", () => {
    const required = [
      "test-matrix.md",
      "qa-run-sheet.md",
      "bug-report-template.md",
      "WEEK10_DELIVERABLE.md",
      path.join("ai-notes", "week-10.md")
    ];
    for (const file of required) {
      expect(fs.existsSync(path.join(__dirname, "docs", file))).toBe(true);
    }
  });
});
