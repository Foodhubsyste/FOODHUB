const express = require("express");
const path = require("path");
const { ensureDb } = require("./services/database");
const { failure } = require("./utils/response");
const { createAuthController } = require("./controllers/authController");
const menuRoutes = require("./routes/menuRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 4444;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.static(path.join(__dirname, "public")));

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "foodhub123";
const adminTokens = new Set();

const auth = createAuthController(adminTokens, ADMIN_USERNAME, ADMIN_PASSWORD);

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !adminTokens.has(token)) return failure(res, 401, "Admin login required");
  next();
}

app.post("/api/admin/login", auth.login);
app.post("/api/admin/logout", auth.logout);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: 200,
    data: { service: "FOODHUB", uptime: process.uptime() },
    error: null,
    message: "Success"
  });
});

// Public customer-facing endpoints.
app.get("/api/menu", menuRoutes);
app.get("/api/menu/:id", menuRoutes);
app.post("/api/customers/session", customerRoutes);
app.post("/api/orders", orderRoutes);
app.get("/api/customers/:id/orders", customerRoutes);

// Admin CRUD/report endpoints.
app.use("/api/menu", requireAdmin, menuRoutes);
app.use("/api/customers", requireAdmin, customerRoutes);
app.use("/api/orders", requireAdmin, orderRoutes);
app.use("/api", requireAdmin, reportRoutes);

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) return failure(res, 404, "API endpoint not found");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  ensureDb();
  app.listen(PORT, "0.0.0.0", () => console.log(`FOODHUB running on port ${PORT}`));
}

module.exports = app;
