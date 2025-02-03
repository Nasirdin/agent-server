const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");

router.post("/register", ownerController.registerOwner);

router.post("/login", ownerController.loginOwner);

router.post("/refresh-token", ownerController.refreshToken);

module.exports = router;
