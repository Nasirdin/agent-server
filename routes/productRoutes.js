const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.post("/", productController.createProduct);

router.put("/:productId", productController.updateProduct);

router.get("/", productController.getAllProducts);

router.get("/:productId", productController.getProductById);

router.get("/owner/:ownerId", productController.getProductsByOwnerId);


module.exports = router;
