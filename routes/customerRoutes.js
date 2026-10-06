const router = require("express").Router();
const controller = require("../controllers/customerController");
const { bodyValidator, validateCustomer } = require("../middleware/validation");

router.get("/", controller.list);
router.get("/:id", controller.show);
router.get("/:id/orders", controller.orders);
router.post("/", bodyValidator(validateCustomer), controller.create);
router.post("/session", bodyValidator(validateCustomer), controller.session);
router.put("/:id", bodyValidator(validateCustomer, true), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
