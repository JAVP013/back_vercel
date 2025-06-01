const express = require("express");
const Phone = require("../models/phones.model"); // Asegúrate de que la ruta y el nombre coincidan

const router = express.Router();

// Wrapper para manejar funciones async y capturar errores
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Obtener todos los celulares
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const phones = await Phone.find();
    res.json(phones);
  })
);

// Obtener un celular por ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const phone = await Phone.findById(req.params.id);
    if (!phone) {
      res.status(404).json({ error: "Phone not found" });
      return;
    }
    res.json(phone);
  })
);

// Crear un nuevo celular
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newPhone = new Phone(req.body);
    const savedPhone = await newPhone.save();
    res.status(201).json(savedPhone);
  })
);

// Actualizar un celular
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const updatedPhone = await Phone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPhone) {
      res.status(404).json({ error: "Phone not found" });
      return;
    }
    res.json(updatedPhone);
  })
);

// Eliminar un celular
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deletedPhone = await Phone.findByIdAndDelete(req.params.id);
    if (!deletedPhone) {
      res.status(404).json({ error: "Phone not found" });
      return;
    }
    res.json({ message: "Phone deleted successfully" });
  })
);

module.exports = router;
