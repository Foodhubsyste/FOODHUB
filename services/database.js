const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

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
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialDb, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function nextId(prefix, records) {
  const max = records.reduce((n, record) => {
    const value = Number(String(record.id || "").replace(/^\D+/, ""));
    return Number.isFinite(value) ? Math.max(n, value) : n;
  }, 0);
  return prefix + String(max + 1).padStart(3, "0");
}

module.exports = { DATA_FILE, initialDb, ensureDb, readDb, writeDb, nextId };
