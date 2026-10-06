const router = require("express").Router();
const controller = require("../controllers/reportController");

router.get("/sales", controller.sales);
router.get("/dashboard", controller.dashboard);

module.exports = router;
