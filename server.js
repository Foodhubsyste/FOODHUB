const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4444;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.static(path.join(__dirname, "public")));

const initialDb = {
  menuItems: [
    { id: "M001", name: "Chicken Adobo", description: "Braised chicken in soy sauce and vinegar", category: "Main Dish", price: 120, stock_quantity: 20, status: "available" },
    { id: "M002", name: "Pork Sinigang", description: "Sour tamarind soup with pork and vegetables", category: "Main Dish", price: 150, stock_quantity: 15, status: "available" },
    { id: "M003", name: "Beef Caldereta", description: "Tender beef stew in tomato sauce", category: "Main Dish", price: 180, stock_quantity: 10, status: "available" },
    { id: "M004", name: "Garlic Fried Rice", description: "Classic Filipino garlic fried rice", category: "Rice", price: 35, stock_quantity: 40, status: "available" },
    { id: "M005", name: "Grilled Fish", description: "Fresh tilapia grilled to order", category: "Main Dish", price: 130, stock_quantity: 12, status: "available" }
  ],
  customers: [
    { id: "C001", full_name: "Maria Santos", contact_number: "09171234567", address: "Poblacion, Maramag, Bukidnon", preferences: "", total_orders: 0 },
    { id: "C002", full_name: "Juan Dela Cruz", contact_number: "09181112222", address: "North Poblacion, Maramag, Bukidnon", preferences: "", total_orders: 0 }
  ],
  orders: [],
  sales: []
};

function ensureDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(initialDb, null, 2));
}
function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}
function ok(res, data, message = "Success", status = 200) {
  return res.status(status).json({ status, data, error: null, message });
}
function fail(res, status, error, field = null) {
  return res.status(status).json({ status, data: null, error, field, message: error });
}
function nextId(prefix, records) {
  const max = records.reduce((n, r) => {
    const value = Number(String(r.id || "").replace(/^\D+/, ""));
    return Number.isFinite(value) ? Math.max(n, value) : n;
  }, 0);
  return prefix + String(max + 1).padStart(3, "0");
}
function validString(value, min, max) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}
function validateMenu(body, partial = false) {
  if (!partial || body.name !== undefined) {
    if (!validString(body.name, 2, 100)) return ["name", "Name must be 2–100 characters"];
  }
  if (!partial || body.price !== undefined) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price <= 0) return ["price", "Price must be a positive number"];
  }
  if (body.description !== undefined && !validString(body.description, 0, 250)) return ["description", "Description must be 250 characters or fewer"];
  if (body.category !== undefined && !validString(body.category, 2, 50)) return ["category", "Category must be 2–50 characters"];
  if (body.stock_quantity !== undefined && (!Number.isInteger(body.stock_quantity) || body.stock_quantity < 0)) return ["stock_quantity", "Stock must be a non-negative whole number"];
  if (body.status !== undefined && !["available", "unavailable"].includes(body.status)) return ["status", "Status must be available or unavailable"];
  return null;
}
function validateCustomer(body, partial = false) {
  if (!partial || body.full_name !== undefined) {
    if (!validString(body.full_name, 2, 100)) return ["full_name", "Full name must be 2–100 characters"];
  }
  if (!partial || body.contact_number !== undefined) {
    if (typeof body.contact_number !== "string" || !/^09\d{9}$/.test(body.contact_number)) return ["contact_number", "Contact number must be 11 digits in 09XXXXXXXXX format"];
  }
  if (!partial || body.address !== undefined) {
    if (!validString(body.address, 5, 250)) return ["address", "Address must be 5–250 characters"];
  }
  if (body.preferences !== undefined && typeof body.preferences !== "string") return ["preferences", "Preferences must be text"];
  return null;
}
function validateOrder(body, db) {
  if (!validString(body.customer_id, 4, 20)) return ["customer_id", "A valid customer is required"];
  if (!Array.isArray(body.items) || body.items.length === 0) return ["items", "At least one item is required"];
  if (!["pending", "confirmed", "ready", "completed", "cancelled"].includes(body.order_status || "pending")) return ["order_status", "Invalid order status"];
  for (const line of body.items) {
    if (!validString(line.menu_id, 4, 20) || !Number.isInteger(line.quantity) || line.quantity < 1) return ["items", "Each order item needs a menu item and positive quantity"];
    const menu = db.menuItems.find(m => m.id === line.menu_id);
    if (!menu) return ["items", "One of the selected menu items does not exist"];
  }
  return null;
}

// Simple admin authentication for the school/demo deployment.
// Set ADMIN_USERNAME and ADMIN_PASSWORD in Railway environment variables for production.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "foodhub123";
const adminTokens = new Set();

function createAdminToken() {
  return require("crypto").randomBytes(24).toString("hex");
}
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !adminTokens.has(token)) return fail(res, 401, "Admin login required");
  next();
}

app.post("/api/admin/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) return fail(res, 401, "Invalid admin username or password");
  const token = createAdminToken();
  adminTokens.add(token);
  return ok(res, { token, username }, "Admin login successful");
});

app.post("/api/admin/logout", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token) adminTokens.delete(token);
  return ok(res, null, "Logged out");
});

// Customer-facing routes remain public. Everything else under /api is admin-only.
app.use("/api", (req, res, next) => {
  if (req.path === "/health" || req.path === "/admin/login" || req.path === "/admin/logout") return next();
  if (req.method === "GET" && req.path === "/menu") return next();
  if (req.method === "POST" && req.path === "/customers") return next();
  if (req.method === "POST" && req.path === "/orders") return next();
  if (req.method === "GET" && /^\/customers\/[^/]+\/orders$/.test(req.path)) return next();
  return requireAdmin(req, res, next);
});

app.get("/api/customers/:id/orders", (req, res) => {
  const db = readDb();
  if (!db.customers.some(c => c.id === req.params.id)) return fail(res, 404, "Customer not found");
  return ok(res, db.orders.filter(o => o.customer_id === req.params.id), "Customer orders retrieved");
});

// Health
app.get("/api/health", (req, res) => ok(res, { service: "FOODHUB", uptime: process.uptime() }));

// Menu CRUD
app.get("/api/menu", (req, res) => ok(res, readDb().menuItems, "Menu retrieved"));
app.get("/api/menu/:id", (req, res) => {
  const item = readDb().menuItems.find(x => x.id === req.params.id);
  return item ? ok(res, item, "Menu item retrieved") : fail(res, 404, "Menu item not found");
});
app.post("/api/menu", (req, res) => {
  const error = validateMenu(req.body);
  if (error) return fail(res, 422, error[1], error[0]);
  const db = readDb();
  const item = {
    id: nextId("M", db.menuItems), name: req.body.name.trim(), description: (req.body.description || "").trim(),
    category: (req.body.category || "Other").trim(), price: Number(req.body.price),
    stock_quantity: Number(req.body.stock_quantity || 0), status: req.body.status || "available"
  };
  db.menuItems.push(item); writeDb(db);
  return ok(res, item, "Menu item created", 201);
});
app.put("/api/menu/:id", (req, res) => {
  const error = validateMenu(req.body, true);
  if (error) return fail(res, 422, error[1], error[0]);
  const db = readDb(); const index = db.menuItems.findIndex(x => x.id === req.params.id);
  if (index < 0) return fail(res, 404, "Menu item not found");
  db.menuItems[index] = { ...db.menuItems[index], ...req.body };
  writeDb(db); return ok(res, db.menuItems[index], "Menu item updated");
});
app.delete("/api/menu/:id", (req, res) => {
  const db = readDb(); const index = db.menuItems.findIndex(x => x.id === req.params.id);
  if (index < 0) return fail(res, 404, "Menu item not found");
  const inOrder = db.orders.some(o => o.items.some(i => i.menu_id === req.params.id));
  if (inOrder) return fail(res, 409, "Menu item cannot be deleted because it is used by an order");
  const deleted = db.menuItems.splice(index, 1)[0]; writeDb(db);
  return ok(res, deleted, "Menu item deleted");
});

// Customer CRUD
app.get("/api/customers", (req, res) => ok(res, readDb().customers, "Customers retrieved"));
app.get("/api/customers/:id", (req, res) => {
  const c = readDb().customers.find(x => x.id === req.params.id);
  return c ? ok(res, c, "Customer retrieved") : fail(res, 404, "Customer not found");
});
app.post("/api/customers", (req, res) => {
  const error = validateCustomer(req.body);
  if (error) return fail(res, 422, error[1], error[0]);
  const db = readDb();
  if (db.customers.some(c => c.contact_number === req.body.contact_number)) return fail(res, 409, "A customer with this contact number already exists", "contact_number");
  const customer = { id: nextId("C", db.customers), full_name: req.body.full_name.trim(), contact_number: req.body.contact_number, address: req.body.address.trim(), preferences: req.body.preferences || "", total_orders: 0 };
  db.customers.push(customer); writeDb(db); return ok(res, customer, "Customer created", 201);
});
app.put("/api/customers/:id", (req, res) => {
  const error = validateCustomer(req.body, true);
  if (error) return fail(res, 422, error[1], error[0]);
  const db = readDb(); const index = db.customers.findIndex(x => x.id === req.params.id);
  if (index < 0) return fail(res, 404, "Customer not found");
  if (req.body.contact_number && db.customers.some((c, i) => i !== index && c.contact_number === req.body.contact_number)) return fail(res, 409, "Contact number already belongs to another customer", "contact_number");
  db.customers[index] = { ...db.customers[index], ...req.body }; writeDb(db);
  return ok(res, db.customers[index], "Customer updated");
});
app.delete("/api/customers/:id", (req, res) => {
  const db = readDb(); const index = db.customers.findIndex(x => x.id === req.params.id);
  if (index < 0) return fail(res, 404, "Customer not found");
  if (db.orders.some(o => o.customer_id === req.params.id)) return fail(res, 409, "Customer cannot be deleted because they have order history");
  const deleted = db.customers.splice(index, 1)[0]; writeDb(db); return ok(res, deleted, "Customer deleted");
});

// Orders CRUD
app.get("/api/orders", (req, res) => {
  const db = readDb();
  const orders = db.orders.map(o => ({ ...o, customer: db.customers.find(c => c.id === o.customer_id) || null }));
  return ok(res, orders, "Orders retrieved");
});
app.get("/api/orders/:id", (req, res) => {
  const db = readDb(); const o = db.orders.find(x => x.id === req.params.id);
  return o ? ok(res, { ...o, customer: db.customers.find(c => c.id === o.customer_id) || null }, "Order retrieved") : fail(res, 404, "Order not found");
});
app.post("/api/orders", (req, res) => {
  const db = readDb(); const error = validateOrder(req.body, db);
  if (error) return fail(res, 422, error[1], error[0]);
  const customer = db.customers.find(c => c.id === req.body.customer_id);
  if (!customer) return fail(res, 404, "Customer not found", "customer_id");
  for (const line of req.body.items) {
    const menu = db.menuItems.find(m => m.id === line.menu_id);
    if (menu.stock_quantity < line.quantity) return fail(res, 409, `Not enough stock for ${menu.name}`, "items");
  }
  const items = req.body.items.map(line => {
    const menu = db.menuItems.find(m => m.id === line.menu_id);
    return { menu_id: menu.id, name: menu.name, quantity: line.quantity, unit_price: menu.price, subtotal: Number((menu.price * line.quantity).toFixed(2)) };
  });
  const total = Number(items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2));
  const order = {
    id: nextId("O", db.orders), order_number: `ORD-${Date.now()}`, customer_id: customer.id, items,
    total_amount: total, pickup_datetime: req.body.pickup_datetime || "", payment_status: req.body.payment_status || "unpaid",
    order_status: req.body.order_status || "pending", notes: req.body.notes || "", created_at: new Date().toISOString()
  };
  items.forEach(line => {
    const menu = db.menuItems.find(m => m.id === line.menu_id);
    menu.stock_quantity -= line.quantity;
    if (menu.stock_quantity === 0) menu.status = "unavailable";
  });
  customer.total_orders += 1; db.orders.push(order); writeDb(db);
  return ok(res, order, "Order created", 201);
});
app.put("/api/orders/:id", (req, res) => {
  const db = readDb(); const index = db.orders.findIndex(x => x.id === req.params.id);
  if (index < 0) return fail(res, 404, "Order not found");
  const allowedStatuses = ["pending", "confirmed", "ready", "completed", "cancelled"];
  if (req.body.order_status && !allowedStatuses.includes(req.body.order_status)) return fail(res, 422, "Invalid order status", "order_status");
  const allowedPayments = ["unpaid", "partial", "paid"];
  if (req.body.payment_status && !allowedPayments.includes(req.body.payment_status)) return fail(res, 422, "Invalid payment status", "payment_status");
  db.orders[index] = { ...db.orders[index], pickup_datetime: req.body.pickup_datetime ?? db.orders[index].pickup_datetime, payment_status: req.body.payment_status ?? db.orders[index].payment_status, order_status: req.body.order_status ?? db.orders[index].order_status, notes: req.body.notes ?? db.orders[index].notes };
  if (db.orders[index].order_status === "completed" && !db.sales.some(s => s.order_id === db.orders[index].id)) {
    db.sales.push({ id: nextId("S", db.sales), order_id: db.orders[index].id, transaction_date: new Date().toISOString().slice(0, 10), total_received: db.orders[index].total_amount, payment_method: req.body.payment_method || "cash" });
  }
  writeDb(db); return ok(res, db.orders[index], "Order updated");
});
app.delete("/api/orders/:id", (req, res) => {
  const db = readDb(); const index = db.orders.findIndex(x => x.id === req.params.id);
  if (index < 0) return fail(res, 404, "Order not found");
  if (db.orders[index].order_status !== "cancelled") return fail(res, 409, "Only cancelled orders can be deleted");
  db.orders.splice(index, 1); writeDb(db); return ok(res, null, "Order deleted");
});

// Sales
app.get("/api/sales", (req, res) => ok(res, readDb().sales, "Sales retrieved"));
app.get("/api/dashboard", (req, res) => {
  const db = readDb();
  const revenue = db.sales.reduce((s, x) => s + Number(x.total_received || 0), 0);
  return ok(res, {
    menu_count: db.menuItems.length, customer_count: db.customers.length, order_count: db.orders.length,
    pending_orders: db.orders.filter(o => ["pending", "confirmed", "ready"].includes(o.order_status)).length,
    completed_orders: db.orders.filter(o => o.order_status === "completed").length,
    revenue: Number(revenue.toFixed(2)),
    low_stock: db.menuItems.filter(m => m.stock_quantity <= 5).length
  }, "Dashboard retrieved");
});

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) return fail(res, 404, "API endpoint not found");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  ensureDb();
  app.listen(PORT, "0.0.0.0", () => console.log(`FOODHUB running on port ${PORT}`));
}
module.exports = app;
