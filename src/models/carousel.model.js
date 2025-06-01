// src/models/carousel.model.js
const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String }
});

const Carousel = mongoose.model("Carousel", carouselSchema);
module.exports = Carousel;
