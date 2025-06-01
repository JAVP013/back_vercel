// src/models/brand.model.ts
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  logoUrl: { type: String, required: true },
  brandName: { type: String, default: "MiTienda" }
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
