const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, DeliveryAddress } = require("../models");
const { default: mongoose } = require("mongoose");

exports.register = async (req, res) => {
  const { password, phoneNumber, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        message: "Пользователь с таким логином уже существует",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      login: phoneNumber,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
    });

    await user.save();

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user,
    });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    res.status(500).json({
      message: "Ошибка регистрации",
      error: err.message || err,
    });
  }
};

exports.login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Ошибка логина", error: err });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Неверный refreshToken" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
    res.json({ accessToken });
  } catch (err) {
    console.error("Ошибка при обновлении токена:", err);
    res.status(500).json({ message: "Ошибка обновления токена", error: err });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Некорректный ID пользователя" });
  }
  try {
    const user = await User.findById(userId)
      .populate("deliveryAddresses")
      .populate("orders");

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Ошибка при получении пользователя:", err);
    res.status(500).json({
      message: "Ошибка при получении пользователя",
      error: err.message || err,
    });
  }
};

exports.addDeliveryAddress = async (req, res) => {
  const userId = req.params.userId;
  const { address, coordinates, phoneNumber } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Некорректный ID пользователя" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const newDeliveryAddress = new DeliveryAddress({
      address,
      coordinates,
      phoneNumber,
      customer: userId,
    });

    await newDeliveryAddress.save();

    user.deliveryAddresses.push(newDeliveryAddress._id);
    await user.save();

    res.status(201).json({
      message: "Адрес доставки успешно добавлен",
      deliveryAddress: newDeliveryAddress,
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при добавлении адреса",
      error: err.message || err,
    });
  }
};

exports.updateDeliveryAddress = async (req, res) => {
  const userId = req.params.userId;
  const addressId = req.params.addressId;
  const { address, coordinates, phoneNumber } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(addressId)
  ) {
    return res
      .status(400)
      .json({ message: "Некорректный ID пользователя или адреса" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const deliveryAddress = await DeliveryAddress.findById(addressId);

    if (!deliveryAddress || deliveryAddress.customer.toString() !== userId) {
      return res.status(404).json({ message: "Адрес доставки не найден" });
    }

    deliveryAddress.address = address || deliveryAddress.address;
    deliveryAddress.coordinates = coordinates || deliveryAddress.coordinates;
    deliveryAddress.phoneNumber = phoneNumber || deliveryAddress.phoneNumber;

    await deliveryAddress.save();

    res.status(200).json({
      message: "Адрес доставки успешно обновлен",
      deliveryAddress,
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при обновлении адреса",
      error: err.message || err,
    });
  }
};

exports.deleteDeliveryAddress = async (req, res) => {
  const userId = req.params.userId;
  const addressId = req.params.addressId;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(addressId)
  ) {
    return res
      .status(400)
      .json({ message: "Некорректный ID пользователя или адреса" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const deliveryAddress = await DeliveryAddress.findById(addressId);

    if (!deliveryAddress || deliveryAddress.customer.toString() !== userId) {
      return res.status(404).json({ message: "Адрес доставки не найден" });
    }

    await DeliveryAddress.findByIdAndDelete(addressId);

    user.deliveryAddresses = user.deliveryAddresses.filter(
      (addressId) => addressId.toString() !== deliveryAddress._id.toString()
    );
    await user.save();

    res.status(200).json({
      message: "Адрес доставки успешно удален",
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при удалении адреса",
      error: err.message || err,
    });
  }
};

exports.getDeliveryAddressesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const deliveryAddresses = await DeliveryAddress.find({ customer: userId });

    if (!deliveryAddresses.length) {
      return res.status(404).json({ message: "Адреса доставки не найдены" });
    }

    res.json(deliveryAddresses);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ошибка при получении адресов доставки", error: err });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка получения данных пользователя", error });
  }
};
