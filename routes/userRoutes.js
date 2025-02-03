const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);
router.get("/current-user", authMiddleware, userController.getCurrentUser);
router.get("/:userId", userController.getUserById);

router.post("/:userId/deliveryAddresses", userController.addDeliveryAddress);
router.put(
  "/:userId/deliveryAddresses/:addressId",
  userController.updateDeliveryAddress
);
router.delete(
  "/:userId/deliveryAddresses/:addressId",
  userController.deleteDeliveryAddress
);
router.get(
  "/:userId/deliveryAddresses",
  userController.getDeliveryAddressesByUserId
);
module.exports = router;
