const router = require("express").Router();
const controller = require("../controllers/menuController");
const { bodyValidator, validateMenu } = require("../middleware/validation");

router.get("/", controller.list);
router.get("/:id", controller.show);
router.post("/", bodyValidator(validateMenu), controller.create);
router.put("/:id", bodyValidator(validateMenu, true), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
