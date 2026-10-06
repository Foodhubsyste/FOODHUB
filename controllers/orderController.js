const service = require("../services/foodhubService");
const { success, failure } = require("../utils/response");

const list = (req, res) => success(res, 200, service.listOrders(), "Orders retrieved");
const show = (req, res) => {
  const order = service.getOrder(req.params.id);
  return order ? success(res, 200, order, "Order retrieved") : failure(res, 404, "Order not found");
};
const create = (req, res) => {
  const result = service.createOrder(req.validatedBody);
  return result.error ? failure(res, result.status, result.error, result.field || null) : success(res, 201, result.value, "Order created");
};
const update = (req, res) => {
  const result = service.updateOrder(req.params.id, req.validatedBody);
  return result.error ? failure(res, result.status, result.error, result.field || null) : success(res, 200, result.value, "Order updated");
};
const remove = (req, res) => {
  const result = service.deleteOrder(req.params.id);
  return result.error ? failure(res, result.status, result.error) : success(res, 200, result.value, "Order deleted");
};

module.exports = { list, show, create, update, remove };
