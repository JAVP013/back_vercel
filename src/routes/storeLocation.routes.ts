// src/routes/storeLocation.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import StoreLocation from "../models/storeLocation.model";

const router = Router();

// Wrapper para funciones async
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET /store-location - Obtener todas las sucursales
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const locations = await StoreLocation.find();
    res.json(locations);
  })
);

// POST /store-location - Crear una nueva sucursal
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { address, latitude, longitude, branchName } = req.body;

    if (!address || latitude === undefined || longitude === undefined || !branchName) {
      res.status(400).json({ error: "Faltan datos requeridos" });
      return;
    }

    const newLocation = await StoreLocation.create({ address, latitude, longitude, branchName });
    res.status(201).json(newLocation);
  })
);

// PUT /store-location/:id - Actualizar una sucursal por ID
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { address, latitude, longitude, branchName } = req.body;

    if (!address || latitude === undefined || longitude === undefined || !branchName) {
      res.status(400).json({ error: "Faltan datos requeridos" });
      return;
    }

    const updated = await StoreLocation.findByIdAndUpdate(
      id,
      { address, latitude, longitude, branchName },
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404).json({ error: "Sucursal no encontrada" });
      return;
    }

    res.json(updated);
  })
);

// DELETE /store-location/:id - Eliminar una sucursal por ID
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const deleted = await StoreLocation.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ error: "Sucursal no encontrada" });
      return;
    }

    res.json({ message: "Sucursal eliminada correctamente" });
  })
);

export default router;
