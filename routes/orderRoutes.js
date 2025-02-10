const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersByUserId,
  getOrdersByOwnerId,
} = require("../controllers/orderController");

// Создание заказа
router.post("/", createOrder);

// Получение всех заказов
router.get("/", getOrders);

// Получение одного заказа по ID
router.get("/:id", getOrderById);

// Обновление статуса заказа
router.put("/:id", updateOrderStatus);

// Удаление заказа
router.delete("/:id", deleteOrder);

// Получение заказов по userId (покупатель)
router.get("/user/:userId", getOrdersByUserId);

// Получение заказов по ownerId (продавец)
router.get("/owner/:ownerId", getOrdersByOwnerId);

module.exports = router;
