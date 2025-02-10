const { CartProduct } = require("../models");

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cartItem = await CartProduct.findOne({ userId, productId });
    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = new CartProduct({ userId, productId, quantity });
      await cartItem.save();
    }

    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Ошибка добавления в корзину:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getCartByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await CartProduct.find({ userId })
      .populate({
        path: "productId",
        populate: {
          path: "owner",
          model: "Owner",
        },
      })
      .exec();

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({ message: "Корзина пуста или не найдена" });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Ошибка получения корзины:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const clearItems = async (req, res) => {
  const { userId } = req.params;
  const { productIds } = req.body;

  try {
    const result = await CartProduct.deleteMany({
      userId,
      "productId": { $in: productIds },
    });

    console.log(result);

    console.log("Удалено товаров:", result.deletedCount);

    res.json({ success: true, message: "Товары удалены из корзины" });
  } catch (error) {
    console.error("Ошибка при удалении товаров:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  getCartByUserId,
  clearItems,
};
