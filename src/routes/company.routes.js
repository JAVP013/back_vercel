const express = require("express");
const Company = require("../models/company.model");

const router = express.Router();

// Wrapper para manejar funciones async
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Ruta para obtener la información de la empresa (imagen y descripción)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const company = await Company.findOne({});
    if (!company) {
      res.status(404).json({ error: "Company image not found" });
      return;
    }
    res.json(company);
  })
);

// Ruta para actualizar la imagen "Nosotros"
router.put(
  "/",
  asyncHandler(async (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      res.status(400).json({ error: "Falta imageUrl" });
      return;
    }
    // Se asume que hay un único documento para la información de la compañía.
    let company = await Company.findOneAndUpdate(
      {},
      { imageUrl },
      { new: true, runValidators: true }
    );
    if (!company) {
      company = await Company.create({ imageUrl });
    }
    res.json(company);
  })
);

module.exports = router;
