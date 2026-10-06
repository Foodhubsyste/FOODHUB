const service = require("../services/foodhubService");
const { success, failure } = require("../utils/response");

const list = (req, res) => success(res, 200, service.listMenu(), "Menu retrieved");
const show = (req, res) => {
  const item = service.getMenu(req.params.id);
  return item ? success(res, 200, item, "Menu item retrieved") : failure(res, 404, "Menu item not found");
};
const create = (req, res) => success(res, 201, service.createMenu(req.validatedBody), "Menu item created");
const update = (req, res) => {
  const item = service.updateMenu(req.params.id, req.validatedBody);
  return item ? success(res, 200, item, "Menu item updated") : failure(res, 404, "Menu item not found");
};
const remove = (req, res) => {
  const result = service.deleteMenu(req.params.id);
  return result.error ? failure(res, result.status, result.error, result.field || null) : success(res, 200, result.value, "Menu item deleted");
};

module.exports = { list, show, create, update, remove };
