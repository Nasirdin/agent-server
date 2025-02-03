const bcrypt = require("bcrypt");
const { Owner } = require("../models");

const jwt = require("jsonwebtoken");

const refreshToken = (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Нет токена" });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Некорректный токен" });
    }

    // Создание нового accessToken
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "owner" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });
  });
};

const registerOwner = async (req, res) => {
  try {
    const { name, login, password, email, phoneNumber, address } = req.body;

    // Проверка на существование владельца с таким логином
    const existingOwner = await Owner.findOne({ login });
    if (existingOwner) {
      return res
        .status(400)
        .json({ message: "Владелец с таким логином уже существует" });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового владельца
    const newOwner = new Owner({
      name,
      login,
      password: hashedPassword,
      email,
      phoneNumber,
      address,
    });

    await newOwner.save();

    res
      .status(201)
      .json({ message: "Владелец успешно зарегистрирован", owner: newOwner });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ошибка регистрации владельца", error: err });
  }
};

const loginOwner = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Проверка на существование владельца с таким логином
    const owner = await Owner.findOne({ login });
    if (!owner) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    // Сравнение пароля с хешированным
    const isPasswordCorrect = await bcrypt.compare(password, owner.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    // Создание токенов
    const accessToken = jwt.sign(
      { id: owner._id, role: "owner" },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }
    );

    const refreshToken = jwt.sign(
      { id: owner._id, role: "owner" },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ошибка при логине владельца", error: err });
  }
};

module.exports = { registerOwner, loginOwner, refreshToken };
