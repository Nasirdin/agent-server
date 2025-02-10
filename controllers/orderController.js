const { Order } = require("../models/index");

// Создание нового заказа
const createOrder = async (req, res) => {
  try {
    const { products, customer, owner } = req.body;

    const getRandomLetters = () => {
      const letters = "АБВГДЕЖЗИКЛНОПРСТУФХЦЧШЩЭЮЯ";
      return (
        letters[Math.floor(Math.random() * letters.length)] +
        letters[Math.floor(Math.random() * letters.length)]
      );
    };

    const newOrder = new Order({
      products,
      customer,
      owner,
      status: "pending",
      key: `${Date.now()}-${getRandomLetters()}${Math.floor(
        1000 + Math.random() * 9000
      )}`,
    });

    await newOrder.save();
    res.status(201).json({ message: "Заказ успешно создан", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании заказа", error });
  }
};

// Получение всех заказов
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products")
      .populate("customer", "name email")
      .populate("owner", "name email");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении заказов", error });
  }
};

// Получение заказа по ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("products")
      .populate("customer", "name email")
      .populate("owner", "name email");

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении заказа", error });
  }
};

// Обновление статуса заказа
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    res.status(200).json({ message: "Статус заказа обновлен", order });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении заказа", error });
  }
};

// Удаление заказа
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    res.status(200).json({ message: "Заказ удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении заказа", error });
  }
};

// Получение заказов по userId (покупатель)
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ customer: userId })
      .populate("products")
      .populate("customer", "name email")
      .populate("owner", "name email");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении заказов", error });
  }
};

// Получение заказов по ownerId (продавец)
const getOrdersByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const orders = await Order.find({ owner: ownerId })
      .populate("products")
      .populate("customer", "name email")
      .populate("owner", "name email");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении заказов", error });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersByUserId,
  getOrdersByOwnerId,
};
