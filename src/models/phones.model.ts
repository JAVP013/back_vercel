// src/models/phones.model.ts
import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  releaseYear: { type: Number, required: true },
  color: { type: String },
  size: { type: String },
  memory: { type: String },
  cameras: { type: String },
  imageUrl: { type: String, required: true }
});

const Phone = mongoose.model("Phone", phoneSchema);
export default Phone;
