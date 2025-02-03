// В файле controllers/categoryController.js
const mongoose = require("mongoose");
const { Category } = require("../models");

const addCategory = async (req, res) => {
  const { name, parentCategory, categoryIcon } = req.body;

  try {
    const newCategory = new Category({
      name,
      parentCategory,
      categoryIcon,
    });

    await newCategory.save();

    res.status(201).json({
      message: "Категория успешно добавлена",
      category: newCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при добавлении категории",
      error: err.message || err,
    });
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { name, parentCategory, categoryIcon } = req.body;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Некорректный ID категории" });
  }

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    category.name = name || category.name;
    category.parentCategory = parentCategory || category.parentCategory;
    category.categoryIcon = categoryIcon || category.categoryIcon;

    await category.save();

    res.status(200).json({
      message: "Категория успешно обновлена",
      category,
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при обновлении категории",
      error: err.message || err,
    });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Некорректный ID категории" });
  }

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      message: "Категория успешно удалена",
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при удалении категории",
      error: err.message || err,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory")
      .populate("subcategories");

    res.status(200).json({
      message: "Категории успешно получены",
      categories,
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при получении категорий",
      error: err.message || err,
    });
  }
};

const getCategoryById = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Некорректный ID категории" });
  }

  try {
    const category = await Category.findById(categoryId)
      .populate("parentCategory")
      .populate("subcategories");

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    res.status(200).json({
      message: "Категория успешно получена",
      category,
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при получении категории",
      error: err.message || err,
    });
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
};
