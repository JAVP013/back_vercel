// src/routes/brand.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import Brand from "../models/brand.model";

const router = Router();

// Wrapper para funciones async
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET /brand - Retorna el primer (o único) documento de Brand
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const brand = await Brand.findOne({});
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(brand);
  })
);

// Ruta para actualizar el logo (marca)
router.put(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { logoUrl } = req.body;
    if (!logoUrl) {
      res.status(400).json({ error: "Falta logoUrl" });
      return;
    }
    // Se asume que existe un único documento para la marca.
    let brand = await Brand.findOneAndUpdate(
      {},
      { logoUrl },
      { new: true, runValidators: true }
    );
    if (!brand) {
      brand = await Brand.create({ logoUrl });
    }
    res.json(brand);
  })
);
export default router;
