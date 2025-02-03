const { Product, Owner, Category, Certificate } = require("../models/index");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      newPrice,
      images,
      sizes,
      owner,
      category,
      createdBy,
      certificates,
    } = req.body;

    // Проверяем существование владельца
    const ownerRecord = await Owner.findById(owner);
    if (!ownerRecord) {
      return res.status(404).json({ message: "Владелец не найден" });
    }

    // Проверяем существование категории
    const categoryRecord = await Category.findById(category);
    if (!categoryRecord) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    // Проверяем, существуют ли все сертификаты
    if (certificates && certificates.length > 0) {
      const certificatesExist = await Certificate.find({
        _id: { $in: certificates },
      });
      if (certificatesExist.length !== certificates.length) {
        return res
          .status(404)
          .json({ message: "Некоторые сертификаты не найдены" });
      }
    }

    // Создаем новый продукт
    const product = new Product({
      name,
      description,
      price,
      newPrice,
      images,
      sizes,
      owner,
      category,
      createdBy,
      certificates, // Добавляем сертификаты
    });

    // Сохраняем продукт в базе данных
    await product.save();

    // Добавляем ID продукта в массив продуктов владельца
    ownerRecord.products.push(product._id);
    await ownerRecord.save();

    // Добавляем ID продукта в массив продуктов категории
    categoryRecord.products.push(product._id);
    await categoryRecord.save();

    // Если сертификаты были переданы, добавляем ID продукта в каждый сертификат
    if (certificates && certificates.length > 0) {
      await Certificate.updateMany(
        { _id: { $in: certificates } },
        { $push: { products: product._id } }
      );
    }

    res.status(201).json({
      message: "Продукт успешно создан",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при создании продукта",
      error: error.message || error,
    });
  }
};

// Обновление продукта
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Продукт не найден" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении продукта", error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let { minPrice, maxPrice, category, owner, sortBy, order, limit, page } =
      req.query;
    let filter = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (!isNaN(minPrice)) filter.price.$gte = Number(minPrice);
      if (!isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
    }

    if (category) filter.category = category;
    if (owner) filter.owner = owner;

    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .populate("owner", "name")
      .populate("category")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      products,
      total: totalProducts,
      page: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении продуктов", error });
  }
};

// Получение продукта по ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении продукта", error });
  }
};

// Получение продуктов по ID владельца
const getProductsByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const products = await Product.find({ owner: ownerId });
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении продуктов владельца", error });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  getProductsByOwnerId,
};
