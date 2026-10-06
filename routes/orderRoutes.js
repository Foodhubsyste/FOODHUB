const router = require("express").Router();
const controller = require("../controllers/orderController");
const { orderValidator, orderUpdateValidator } = require("../middleware/validation");

router.get("/", controller.list);
router.get("/:id", controller.show);
router.post("/", orderValidator, controller.create);
router.put("/:id", orderUpdateValidator, controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
