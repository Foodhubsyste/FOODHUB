const service = require("../services/foodhubService");
const { success } = require("../utils/response");

const sales = (req, res) => success(res, 200, service.listSales(), "Sales retrieved");
const dashboard = (req, res) => success(res, 200, service.dashboard(), "Dashboard retrieved");

module.exports = { sales, dashboard };
