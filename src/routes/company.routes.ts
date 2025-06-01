// src/routes/company.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import Company from "../models/company.model";

const router = Router();

// Wrapper para manejar funciones async
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Ruta para obtener la información de la empresa (imagen y descripción)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
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


export default router;
