const { readDb } = require("../services/database");

function validString(value, min, max) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

function validateMenu(body, partial = false) {
  if (!partial || body.name !== undefined) {
    if (!validString(body.name, 2, 100)) return ["name", "Name must be 2–100 characters"];
  }
  if (!partial || body.price !== undefined) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price <= 0) {
      return ["price", "Price must be a positive number"];
    }
  }
  if (body.description !== undefined && !validString(body.description, 0, 250)) {
    return ["description", "Description must be 250 characters or fewer"];
  }
  if (body.category !== undefined && !validString(body.category, 2, 50)) {
    return ["category", "Category must be 2–50 characters"];
  }
  if (body.stock_quantity !== undefined && (!Number.isInteger(body.stock_quantity) || body.stock_quantity < 0)) {
    return ["stock_quantity", "Stock must be a non-negative whole number"];
  }
  if (body.status !== undefined && !["available", "unavailable"].includes(body.status)) {
    return ["status", "Status must be available or unavailable"];
  }
  return null;
}

function validateCustomer(body, partial = false) {
  if (!partial || body.full_name !== undefined) {
    if (!validString(body.full_name, 2, 100)) return ["full_name", "Full name must be 2–100 characters"];
  }
  if (!partial || body.contact_number !== undefined) {
    if (typeof body.contact_number !== "string" || !/^09\d{9}$/.test(body.contact_number)) {
      return ["contact_number", "Contact number must be 11 digits in 09XXXXXXXXX format"];
    }
  }
  if (!partial || body.address !== undefined) {
    if (!validString(body.address, 5, 250)) return ["address", "Address must be 5–250 characters"];
  }
  if (body.preferences !== undefined && typeof body.preferences !== "string") {
    return ["preferences", "Preferences must be text"];
  }
  return null;
}

function validateOrder(body, db = readDb()) {
  if (!validString(body.customer_id, 4, 20)) return ["customer_id", "A valid customer is required"];
  if (!Array.isArray(body.items) || body.items.length === 0) return ["items", "At least one item is required"];
  if (!["pending", "confirmed", "ready", "completed", "cancelled"].includes(body.order_status || "pending")) {
    return ["order_status", "Invalid order status"];
  }

  const fulfillment = body.fulfillment_type || "pickup";
  if (!["pickup", "delivery"].includes(fulfillment)) return ["fulfillment_type", "Choose pickup or delivery"];
  if (!validString(body.scheduled_datetime, 10, 40)) {
    return ["scheduled_datetime", "A pickup or delivery date and time is required"];
  }

  const scheduled = new Date(body.scheduled_datetime);
  if (Number.isNaN(scheduled.getTime())) return ["scheduled_datetime", "Please provide a valid date and time"];
  if (scheduled.getTime() < Date.now() - 60000) {
    return ["scheduled_datetime", "The selected date and time has already passed"];
  }

  if (fulfillment === "delivery" && !validString(body.delivery_location, 5, 250)) {
    return ["delivery_location", "A delivery location is required"];
  }

  for (const line of body.items) {
    if (!validString(line.menu_id, 4, 20) || !Number.isInteger(line.quantity) || line.quantity < 1) {
      return ["items", "Each order item needs a menu item and positive quantity"];
    }
    if (!db.menuItems.some(item => item.id === line.menu_id)) {
      return ["items", "One of the selected menu items does not exist"];
    }
  }

  return null;
}

function validateOrderUpdate(body) {
  if (body.order_status !== undefined && !["pending", "confirmed", "ready", "completed", "cancelled"].includes(body.order_status)) {
    return ["order_status", "Invalid order status"];
  }
  if (body.payment_status !== undefined && !["unpaid", "partial", "paid"].includes(body.payment_status)) {
    return ["payment_status", "Invalid payment status"];
  }
  if (body.fulfillment_type !== undefined && !["pickup", "delivery"].includes(body.fulfillment_type)) {
    return ["fulfillment_type", "Choose pickup or delivery"];
  }
  if (body.delivery_location !== undefined && !validString(body.delivery_location, 5, 250)) {
    return ["delivery_location", "Delivery location must be 5–250 characters"];
  }
  if (body.scheduled_datetime !== undefined) {
    if (!validString(body.scheduled_datetime, 10, 40)) {
      return ["scheduled_datetime", "A valid date and time is required"];
    }
    if (Number.isNaN(new Date(body.scheduled_datetime).getTime())) {
      return ["scheduled_datetime", "Please provide a valid date and time"];
    }
  }
  return null;
}

const bodyValidator = (validator, partial = false) => (req, res, next) => {
  const error = validator(req.body, partial);
  if (error) return res.status(422).json({ status: 422, data: null, error: error[1], field: error[0], message: error[1] });
  req.validatedBody = req.body;
  next();
};

const orderValidator = (req, res, next) => {
  const error = validateOrder(req.body);
  if (error) return res.status(422).json({ status: 422, data: null, error: error[1], field: error[0], message: error[1] });
  req.validatedBody = req.body;
  next();
};

const orderUpdateValidator = (req, res, next) => {
  const error = validateOrderUpdate(req.body);
  if (error) return res.status(422).json({ status: 422, data: null, error: error[1], field: error[0], message: error[1] });
  req.validatedBody = req.body;
  req.validatedParams = req.params;
  next();
};

module.exports = {
  validString,
  validateMenu,
  validateCustomer,
  validateOrder,
  validateOrderUpdate,
  bodyValidator,
  orderValidator,
  orderUpdateValidator
};
