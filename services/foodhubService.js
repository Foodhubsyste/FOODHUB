const { readDb, writeDb, nextId } = require("./database");

function listMenu() {
  return readDb().menuItems;
}
function getMenu(id) {
  return readDb().menuItems.find(item => item.id === id) || null;
}
function createMenu(data) {
  const db = readDb();
  const item = {
    id: nextId("M", db.menuItems),
    name: data.name.trim(),
    description: (data.description || "").trim(),
    category: (data.category || "Other").trim(),
    price: Number(data.price),
    stock_quantity: Number(data.stock_quantity || 0),
    status: data.status || "available"
  };
  db.menuItems.push(item);
  writeDb(db);
  return item;
}
function updateMenu(id, data) {
  const db = readDb();
  const index = db.menuItems.findIndex(item => item.id === id);
  if (index < 0) return null;
  db.menuItems[index] = { ...db.menuItems[index], ...data };
  writeDb(db);
  return db.menuItems[index];
}
function deleteMenu(id) {
  const db = readDb();
  const index = db.menuItems.findIndex(item => item.id === id);
  if (index < 0) return { error: "Menu item not found", status: 404 };
  if (db.orders.some(order => order.items.some(item => item.menu_id === id))) {
    return { error: "Menu item cannot be deleted because it is used by an order", status: 409 };
  }
  const deleted = db.menuItems.splice(index, 1)[0];
  writeDb(db);
  return { value: deleted };
}

function listCustomers() {
  return readDb().customers;
}
function getCustomer(id) {
  return readDb().customers.find(customer => customer.id === id) || null;
}
function createCustomer(data) {
  const db = readDb();
  if (db.customers.some(customer => customer.contact_number === data.contact_number)) {
    return { error: "A customer with this contact number already exists", status: 409, field: "contact_number" };
  }
  const customer = {
    id: nextId("C", db.customers),
    full_name: data.full_name.trim(),
    contact_number: data.contact_number,
    address: data.address.trim(),
    preferences: data.preferences || "",
    total_orders: 0
  };
  db.customers.push(customer);
  writeDb(db);
  return { value: customer };
}
function updateCustomer(id, data) {
  const db = readDb();
  const index = db.customers.findIndex(customer => customer.id === id);
  if (index < 0) return null;
  if (data.contact_number && db.customers.some((customer, i) => i !== index && customer.contact_number === data.contact_number)) {
    return { error: "Contact number already belongs to another customer", status: 409, field: "contact_number" };
  }
  db.customers[index] = { ...db.customers[index], ...data };
  writeDb(db);
  return { value: db.customers[index] };
}
function deleteCustomer(id) {
  const db = readDb();
  const index = db.customers.findIndex(customer => customer.id === id);
  if (index < 0) return { error: "Customer not found", status: 404 };
  if (db.orders.some(order => order.customer_id === id)) {
    return { error: "Customer cannot be deleted because they have order history", status: 409 };
  }
  const deleted = db.customers.splice(index, 1)[0];
  writeDb(db);
  return { value: deleted };
}
function startCustomerSession(data) {
  const db = readDb();
  let customer = db.customers.find(c => c.contact_number === data.contact_number);
  if (customer) {
    if (customer.full_name.toLowerCase() !== data.full_name.trim().toLowerCase()) {
      return { error: "This phone number is already registered with another customer", status: 409, field: "contact_number" };
    }
    customer.address = data.address.trim();
    writeDb(db);
    return { value: customer };
  }
  customer = {
    id: nextId("C", db.customers),
    full_name: data.full_name.trim(),
    contact_number: data.contact_number,
    address: data.address.trim(),
    preferences: "",
    total_orders: 0
  };
  db.customers.push(customer);
  writeDb(db);
  return { value: customer, created: true };
}

function listOrders() {
  const db = readDb();
  return db.orders.map(order => ({
    ...order,
    customer: db.customers.find(customer => customer.id === order.customer_id) || null
  }));
}
function getOrder(id) {
  const db = readDb();
  const order = db.orders.find(item => item.id === id);
  return order ? { ...order, customer: db.customers.find(c => c.id === order.customer_id) || null } : null;
}
function createOrder(data) {
  const db = readDb();
  const customer = db.customers.find(c => c.id === data.customer_id);
  if (!customer) return { error: "Customer not found", status: 404, field: "customer_id" };

  for (const line of data.items) {
    const menu = db.menuItems.find(item => item.id === line.menu_id);
    if (menu.stock_quantity < line.quantity) {
      return { error: `Not enough stock for ${menu.name}`, status: 409, field: "items" };
    }
  }

  const items = data.items.map(line => {
    const menu = db.menuItems.find(item => item.id === line.menu_id);
    return {
      menu_id: menu.id,
      name: menu.name,
      quantity: line.quantity,
      unit_price: menu.price,
      subtotal: Number((menu.price * line.quantity).toFixed(2))
    };
  });

  const total = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  const order = {
    id: nextId("O", db.orders),
    order_number: `ORD-${Date.now()}`,
    customer_id: customer.id,
    items,
    total_amount: total,
    fulfillment_type: data.fulfillment_type || "pickup",
    delivery_location: data.fulfillment_type === "delivery" ? data.delivery_location.trim() : "",
    scheduled_datetime: data.scheduled_datetime,
    pickup_datetime: data.scheduled_datetime,
    payment_status: data.payment_status || "unpaid",
    payment_method: data.payment_method || "cash",
    order_status: data.order_status || "pending",
    notes: data.notes || "",
    created_at: new Date().toISOString()
  };

  items.forEach(line => {
    const menu = db.menuItems.find(item => item.id === line.menu_id);
    menu.stock_quantity -= line.quantity;
    if (menu.stock_quantity === 0) menu.status = "unavailable";
  });

  customer.total_orders += 1;
  db.orders.push(order);
  writeDb(db);
  return { value: order };
}
function updateOrder(id, data) {
  const db = readDb();
  const index = db.orders.findIndex(order => order.id === id);
  if (index < 0) return { error: "Order not found", status: 404 };

  const previousStatus = db.orders[index].order_status;
  const nextStatus = data.order_status ?? previousStatus;

  if (nextStatus === "cancelled" && previousStatus !== "cancelled") {
    for (const line of db.orders[index].items) {
      const menu = db.menuItems.find(item => item.id === line.menu_id);
      if (menu) {
        menu.stock_quantity += Number(line.quantity || 0);
        if (menu.stock_quantity > 0) menu.status = "available";
      }
    }
    const customer = db.customers.find(c => c.id === db.orders[index].customer_id);
    if (customer && customer.total_orders > 0) customer.total_orders -= 1;
  }

  if (previousStatus === "cancelled" && nextStatus !== "cancelled") {
    for (const line of db.orders[index].items) {
      const menu = db.menuItems.find(item => item.id === line.menu_id);
      if (menu && menu.stock_quantity < Number(line.quantity || 0)) {
        return { error: `Not enough stock to reactivate this order for ${menu.name}`, status: 409, field: "order_status" };
      }
    }
    for (const line of db.orders[index].items) {
      const menu = db.menuItems.find(item => item.id === line.menu_id);
      if (menu) {
        menu.stock_quantity -= Number(line.quantity || 0);
        if (menu.stock_quantity === 0) menu.status = "unavailable";
      }
    }
    const customer = db.customers.find(c => c.id === db.orders[index].customer_id);
    if (customer) customer.total_orders += 1;
  }

  db.orders[index] = {
    ...db.orders[index],
    fulfillment_type: data.fulfillment_type ?? db.orders[index].fulfillment_type ?? "pickup",
    delivery_location: data.delivery_location ?? db.orders[index].delivery_location ?? "",
    scheduled_datetime: data.scheduled_datetime ?? db.orders[index].scheduled_datetime ?? db.orders[index].pickup_datetime ?? "",
    pickup_datetime: data.scheduled_datetime ?? db.orders[index].scheduled_datetime ?? db.orders[index].pickup_datetime ?? "",
    payment_status: data.payment_status ?? db.orders[index].payment_status,
    payment_method: data.payment_method ?? db.orders[index].payment_method ?? "cash",
    order_status: nextStatus,
    notes: data.notes ?? db.orders[index].notes
  };

  if (db.orders[index].order_status === "completed" && !db.sales.some(sale => sale.order_id === db.orders[index].id)) {
    db.sales.push({
      id: nextId("S", db.sales),
      order_id: db.orders[index].id,
      transaction_date: new Date().toISOString().slice(0, 10),
      total_received: db.orders[index].total_amount,
      payment_method: db.orders[index].payment_method || "cash"
    });
  }
  if (db.orders[index].order_status !== "completed") {
    db.sales = db.sales.filter(sale => sale.order_id !== db.orders[index].id);
  }

  writeDb(db);
  return { value: db.orders[index] };
}
function deleteOrder(id) {
  const db = readDb();
  const index = db.orders.findIndex(order => order.id === id);
  if (index < 0) return { error: "Order not found", status: 404 };
  if (db.orders[index].order_status !== "cancelled") {
    return { error: "Only cancelled orders can be deleted", status: 409 };
  }
  db.sales = db.sales.filter(sale => sale.order_id !== id);
  const deleted = db.orders.splice(index, 1)[0];
  writeDb(db);
  return { value: deleted };
}

function listSales() {
  return readDb().sales;
}
function dashboard() {
  const db = readDb();
  const revenue = db.sales.reduce((sum, sale) => sum + Number(sale.total_received || 0), 0);
  return {
    menu_count: db.menuItems.length,
    customer_count: db.customers.length,
    order_count: db.orders.length,
    pending_orders: db.orders.filter(order => ["pending", "confirmed", "ready"].includes(order.order_status)).length,
    completed_orders: db.orders.filter(order => order.order_status === "completed").length,
    revenue: Number(revenue.toFixed(2)),
    low_stock: db.menuItems.filter(item => item.stock_quantity <= 5).length
  };
}

module.exports = {
  listMenu, getMenu, createMenu, updateMenu, deleteMenu,
  listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, startCustomerSession,
  listOrders, getOrder, createOrder, updateOrder, deleteOrder,
  listSales, dashboard
};
