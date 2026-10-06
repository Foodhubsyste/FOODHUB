const service = require("../services/foodhubService");
const { success, failure } = require("../utils/response");

const list = (req, res) => success(res, 200, service.listCustomers(), "Customers retrieved");
const show = (req, res) => {
  const customer = service.getCustomer(req.params.id);
  return customer ? success(res, 200, customer, "Customer retrieved") : failure(res, 404, "Customer not found");
};
const create = (req, res) => {
  const result = service.createCustomer(req.validatedBody);
  return result.error ? failure(res, result.status, result.error, result.field || null) : success(res, 201, result.value, "Customer created");
};
const update = (req, res) => {
  const result = service.updateCustomer(req.params.id, req.validatedBody);
  if (result === null) return failure(res, 404, "Customer not found");
  return result.error ? failure(res, result.status, result.error, result.field || null) : success(res, 200, result.value, "Customer updated");
};
const remove = (req, res) => {
  const result = service.deleteCustomer(req.params.id);
  return result.error ? failure(res, result.status, result.error) : success(res, 200, result.value, "Customer deleted");
};
const session = (req, res) => {
  const result = service.startCustomerSession(req.validatedBody);
  return result.error
    ? failure(res, result.status, result.error, result.field || null)
    : success(res, result.created ? 201 : 200, result.value, result.created ? "Customer registered" : "Customer session started");
};
const orders = (req, res) => {
  const customer = service.getCustomer(req.params.id);
  if (!customer) return failure(res, 404, "Customer not found");
  return success(res, 200, service.listOrders().filter(order => order.customer_id === req.params.id), "Customer orders retrieved");
};

module.exports = { list, show, create, update, remove, session, orders };
