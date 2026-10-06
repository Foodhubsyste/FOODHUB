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

test("health endpoint is available", async () => {
  const res = await request(app).get("/api/health");
  expect(res.status).toBe(200);
  expect(res.body.data.service).toBe("FOODHUB");
});

test("menu can be read publicly", async () => {
  const res = await request(app).get("/api/menu");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data.length).toBeGreaterThan(0);
});

test("admin protected routes reject unauthenticated access", async () => {
  const res = await request(app).get("/api/customers");
  expect(res.status).toBe(401);
});

test("admin can log in and access protected data", async () => {
  const login = await request(app)
    .post("/api/admin/login")
    .send({ username: process.env.ADMIN_USERNAME || "admin", password: process.env.ADMIN_PASSWORD || "foodhub123" });

  expect(login.status).toBe(200);
  expect(login.body.data.token).toBeTruthy();

  const res = await request(app)
    .get("/api/customers")
    .set("Authorization", "Bearer " + login.body.data.token);

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
});

test("customer can register/session and place pickup order", async () => {
  const customer = await request(app)
    .post("/api/customers/session")
    .send({
      full_name: "Test Customer",
      contact_number: "09991234567",
      address: "Test Address, Maramag"
    });

  expect([200, 201]).toContain(customer.status);
  const customerId = customer.body.data.id;

  const menu = await request(app).get("/api/menu");
  const item = menu.body.data.find(x => x.stock_quantity > 0);
  const before = item.stock_quantity;

  const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const order = await request(app)
    .post("/api/orders")
    .send({
      customer_id: customerId,
      items: [{ menu_id: item.id, quantity: 1 }],
      fulfillment_type: "pickup",
      scheduled_datetime: future
    });

  expect(order.status).toBe(201);
  expect(order.body.data.fulfillment_type).toBe("pickup");
  expect(order.body.data.scheduled_datetime).toBe(future);

  const afterOrder = await request(app).get("/api/menu/" + item.id);
  expect(afterOrder.body.data.stock_quantity).toBe(before - 1);
});

test("delivery requires a delivery location", async () => {
  const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
  const customer = db.customers[0];
  const item = db.menuItems.find(x => x.stock_quantity > 0);
  const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const res = await request(app)
    .post("/api/orders")
    .send({
      customer_id: customer.id,
      items: [{ menu_id: item.id, quantity: 1 }],
      fulfillment_type: "delivery",
      scheduled_datetime: future
    });

  expect(res.status).toBe(422);
  expect(res.body.field).toBe("delivery_location");
});

test("cancelling an order restores stock", async () => {
  const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
  const customer = db.customers[0];
  const item = db.menuItems.find(x => x.stock_quantity > 0);
  const before = item.stock_quantity;
  const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const order = await request(app)
    .post("/api/orders")
    .send({
      customer_id: customer.id,
      items: [{ menu_id: item.id, quantity: 1 }],
      fulfillment_type: "pickup",
      scheduled_datetime: future
    });

  expect(order.status).toBe(201);

  const cancel = await request(app)
    .put("/api/orders/" + order.body.data.id)
    .set("Authorization", "Bearer test-invalid");

  expect(cancel.status).toBe(401);

  const login = await request(app)
    .post("/api/admin/login")
    .send({ username: process.env.ADMIN_USERNAME || "admin", password: process.env.ADMIN_PASSWORD || "foodhub123" });
  const token = login.body.data.token;

  const updated = await request(app)
    .put("/api/orders/" + order.body.data.id)
    .set("Authorization", "Bearer " + token)
    .send({ order_status: "cancelled" });

  expect(updated.status).toBe(200);

  const restored = await request(app).get("/api/menu/" + item.id);
  expect(restored.body.data.stock_quantity).toBe(before);
});

test("invalid order items are rejected", async () => {
  const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
  const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const res = await request(app)
    .post("/api/orders")
    .send({
      customer_id: db.customers[0].id,
      items: [{ menu_id: "M999", quantity: 1 }],
      fulfillment_type: "pickup",
      scheduled_datetime: future
    });

  expect(res.status).toBe(422);
});


test("completing an order creates a sale and cancelling removes the sale", async () => {
  const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
  const customer = db.customers[0];
  const item = db.menuItems.find(x => x.stock_quantity > 0);
  const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const order = await request(app)
    .post("/api/orders")
    .send({
      customer_id: customer.id,
      items: [{ menu_id: item.id, quantity: 1 }],
      fulfillment_type: "pickup",
      scheduled_datetime: future
    });
  expect(order.status).toBe(201);

  const login = await request(app)
    .post("/api/admin/login")
    .send({ username: process.env.ADMIN_USERNAME || "admin", password: process.env.ADMIN_PASSWORD || "foodhub123" });
  const token = login.body.data.token;

  const completed = await request(app)
    .put("/api/orders/" + order.body.data.id)
    .set("Authorization", "Bearer " + token)
    .send({ order_status: "completed", payment_status: "paid", payment_method: "cash" });
  expect(completed.status).toBe(200);

  const sales = await request(app)
    .get("/api/sales")
    .set("Authorization", "Bearer " + token);
  expect(sales.body.data.some(s => s.order_id === order.body.data.id)).toBe(true);

  const cancelled = await request(app)
    .put("/api/orders/" + order.body.data.id)
    .set("Authorization", "Bearer " + token)
    .send({ order_status: "cancelled" });
  expect(cancelled.status).toBe(200);

  const salesAfter = await request(app)
    .get("/api/sales")
    .set("Authorization", "Bearer " + token);
  expect(salesAfter.body.data.some(s => s.order_id === order.body.data.id)).toBe(false);
});

test("frontend files exist", () => {
  expect(fs.existsSync(path.join(__dirname, "public", "index.html"))).toBe(true);
  expect(fs.existsSync(path.join(__dirname, "public", "app.js"))).toBe(true);
  expect(fs.existsSync(path.join(__dirname, "public", "navigation.js"))).toBe(true);
  expect(fs.existsSync(path.join(__dirname, "public", "styles.css"))).toBe(true);
});
