// src/models/carousel.model.ts
import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String }
});

const Carousel = mongoose.model("Carousel", carouselSchema);
export default Carousel;
