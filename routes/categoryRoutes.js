const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/", categoryController.addCategory); // Добавление категории
router.put("/:categoryId", categoryController.updateCategory); // Изменение категории
router.delete("/:categoryId", categoryController.deleteCategory); // Удаление категории
router.get("/", categoryController.getCategories); // Получение всех категорий
router.get("/:categoryId", categoryController.getCategoryById); // Получение категории по ID

module.exports = router;
