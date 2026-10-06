const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("./server");

const dbFile = path.join(__dirname, "data", "db.json");
let originalDb;

async function adminToken() {
  const login = await request(app)
    .post("/api/admin/login")
    .send({
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "foodhub123"
    });
  expect(login.status).toBe(200);
  return login.body.data.token;
}

beforeAll(() => {
  originalDb = fs.readFileSync(dbFile, "utf8");
});

afterAll(() => {
  fs.writeFileSync(dbFile, originalDb);
});

describe("Week 5 — Arrange Act Assert controller/logic coverage", () => {
  test("menu happy path: creates a valid menu item", async () => {
    // Arrange
    const token = await adminToken();
    const payload = {
      name: "Week 5 Test Lumpia",
      description: "Automated test item",
      category: "Snack",
      price: 45,
      stock_quantity: 10,
      status: "available"
    };

    // Act
    const res = await request(app)
      .post("/api/menu")
      .set("Authorization", "Bearer " + token)
      .send(payload);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe(payload.name);
    expect(res.body.error).toBeNull();
  });

  test("menu validation failure: rejects missing name", async () => {
    // Arrange
    const token = await adminToken();

    // Act
    const res = await request(app)
      .post("/api/menu")
      .set("Authorization", "Bearer " + token)
      .send({ price: 45 });

    // Assert
    expect(res.status).toBe(422);
    expect(res.body.field).toBe("name");
  });

  test("menu edge case: rejects zero price", async () => {
    // Arrange
    const token = await adminToken();

    // Act
    const res = await request(app)
      .post("/api/menu")
      .set("Authorization", "Bearer " + token)
      .send({ name: "Zero Price Test", price: 0 });

    // Assert
    expect(res.status).toBe(422);
    expect(res.body.field).toBe("price");
  });

  test("customer happy path: creates a valid customer", async () => {
    // Arrange
    const token = await adminToken();
    const payload = {
      full_name: "Week 5 Test Customer",
      contact_number: "09881234567",
      address: "Test Address, Maramag"
    };

    // Act
    const res = await request(app)
      .post("/api/customers")
      .set("Authorization", "Bearer " + token)
      .send(payload);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.data.full_name).toBe(payload.full_name);
    expect(res.body.error).toBeNull();
  });

  test("customer validation failure: rejects invalid phone format", async () => {
    // Arrange
    const token = await adminToken();

    // Act
    const res = await request(app)
      .post("/api/customers")
      .set("Authorization", "Bearer " + token)
      .send({
        full_name: "Invalid Phone Test",
        contact_number: "12345",
        address: "Test Address, Maramag"
      });

    // Assert
    expect(res.status).toBe(422);
    expect(res.body.field).toBe("contact_number");
  });

  test("customer edge case: rejects an address that is too short", async () => {
    // Arrange
    const token = await adminToken();

    // Act
    const res = await request(app)
      .post("/api/customers")
      .set("Authorization", "Bearer " + token)
      .send({
        full_name: "Short Address Test",
        contact_number: "09881234568",
        address: "CDO"
      });

    // Assert
    expect(res.status).toBe(422);
    expect(res.body.field).toBe("address");
  });

  test("order happy path: creates a pickup order and returns 201", async () => {
    // Arrange
    const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    const customer = db.customers[0];
    const item = db.menuItems.find(x => x.stock_quantity > 0);
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Act
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer_id: customer.id,
        items: [{ menu_id: item.id, quantity: 1 }],
        fulfillment_type: "pickup",
        scheduled_datetime: future
      });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.data.fulfillment_type).toBe("pickup");
    expect(res.body.error).toBeNull();
  });

  test("order validation failure: rejects a nonexistent menu item", async () => {
    // Arrange
    const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Act
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer_id: db.customers[0].id,
        items: [{ menu_id: "M999", quantity: 1 }],
        fulfillment_type: "pickup",
        scheduled_datetime: future
      });

    // Assert
    expect(res.status).toBe(422);
    expect(res.body.field).toBe("items");
  });

  test("order edge case: rejects zero quantity", async () => {
    // Arrange
    const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    const item = db.menuItems[0];
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Act
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer_id: db.customers[0].id,
        items: [{ menu_id: item.id, quantity: 0 }],
        fulfillment_type: "pickup",
        scheduled_datetime: future
      });

    // Assert
    expect(res.status).toBe(422);
    expect(res.body.field).toBe("items");
  });
});
