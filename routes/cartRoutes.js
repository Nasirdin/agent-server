const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.get("/:userId", cartController.getCartByUserId);
router.delete("/:userId/remove-items", cartController.clearItems);

module.exports = router;
