const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
  price: { type: Number, required: true },
  newPrice: { type: Number },
  images: [{ type: String }],
  sizes: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  minAmount: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  createdBy: { type: String },
});

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  certificateNumber: { type: String, required: true },
  files: [{ type: String }], // PDF links
  endedAt: { type: Date },
  startedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  updatedAt: { type: Date },
  createdBy: { type: String },
});

// Owner Schema
const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  users: [{ type: String }],
  email: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  sales: {
    January: { type: Number, default: 0 },
    February: { type: Number, default: 0 },
    March: { type: Number, default: 0 },
    April: { type: Number, default: 0 },
    May: { type: Number, default: 0 },
    June: { type: Number, default: 0 },
  },
  expenses: {
    January: { type: Number, default: 0 },
    February: { type: Number, default: 0 },
    March: { type: Number, default: 0 },
    April: { type: Number, default: 0 },
    May: { type: Number, default: 0 },
    June: { type: Number, default: 0 },
  },
  promotions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Promotion" }],
  ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Promotion" }],
  rating: { type: Number, default: 0 },
});

// User Schema
const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, unique: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  refreshToken: { type: String },
  deliveryAddresses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAddress" },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  cartProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  avatar: { type: String },
  costs: {
    day: { type: Number, default: 0 },
    week: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    threeMonth: { type: Number, default: 0 },
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

// Delivery Address Schema
const deliveryAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  phoneNumber: { type: String },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  categoryIcon: { type: String },
});

// Order Schema
const orderSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  status: {
    type: String,
    enum: ["pending", "stated", "finished", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  cancelledAt: { type: Date },
});

// Promotion Schema
const promotionSchema = new mongoose.Schema({
  link: { type: String },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  newPrice: { type: Number, required: true },
  endedAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// News Schema
const newsSchema = new mongoose.Schema({
  img: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  Product: mongoose.model("Product", productSchema),
  Certificate: mongoose.model("Certificate", certificateSchema),
  Owner: mongoose.model("Owner", ownerSchema),
  User: mongoose.model("User", userSchema),
  DeliveryAddress: mongoose.model("DeliveryAddress", deliveryAddressSchema),
  Category: mongoose.model("Category", categorySchema),
  Order: mongoose.model("Order", orderSchema),
  Promotion: mongoose.model("Promotion", promotionSchema),
  News: mongoose.model("News", newsSchema),
};
