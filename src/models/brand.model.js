// src/models/brand.model.js
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  logoUrl: { type: String, required: true },
  brandName: { type: String, default: "MiTienda" }
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
