// src/routes/carousel.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import Carousel from "../models/carousel.model";

const router = Router();

// Helper para async/await
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET /carousel - Obtener todas las imágenes del carrusel
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const images = await Carousel.find();
    res.json(images);
  })
);

// POST /carousel - Insertar una nueva imagen en el carrusel
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { imageUrl, caption } = req.body;
    if (!imageUrl) {
      res.status(400).json({ error: "Falta imageUrl" });
      return;
    }
    const newImage = new Carousel({ imageUrl, caption });
    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  })
);

// PUT /carousel/:id - Actualizar una imagen del carrusel por ID
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      res.status(400).json({ error: "Falta imageUrl" });
      return;
    }
    const updatedImage = await Carousel.findByIdAndUpdate(
      req.params.id,
      { imageUrl },
      { new: true, runValidators: true }
    );
    if (!updatedImage) {
      res.status(404).json({ error: "Imagen del carrusel no encontrada" });
      return;
    }
    res.json(updatedImage);
  })
);

// DELETE /carousel/:id - Eliminar una imagen del carrusel por ID
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const deletedImage = await Carousel.findByIdAndDelete(req.params.id);
    if (!deletedImage) {
      res.status(404).json({ error: "Imagen del carrusel no encontrada" });
      return;
    }
    res.json({ message: "Imagen del carrusel eliminada correctamente" });
  })
);

export default router;
