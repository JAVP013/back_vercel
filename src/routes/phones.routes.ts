// src/routes/phones.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import Phone from "../models/phones.model"; // Asegúrate de que la ruta y el nombre coincidan

const router = Router();

// Wrapper para manejar funciones async y capturar errores
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Obtener todos los celulares
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const phones = await Phone.find();
    res.json(phones);
  })
);

// Obtener un celular por ID
router.get<{ id: string }>(
  "/:id",
  asyncHandler(async (req, res): Promise<void> => {
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
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const newPhone = new Phone(req.body);
    const savedPhone = await newPhone.save();
    res.status(201).json(savedPhone);
  })
);

// Actualizar un celular
router.put<{ id: string }>(
  "/:id",
  asyncHandler(async (req, res): Promise<void> => {
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
router.delete<{ id: string }>(
  "/:id",
  asyncHandler(async (req, res): Promise<void> => {
    const deletedPhone = await Phone.findByIdAndDelete(req.params.id);
    if (!deletedPhone) {
      res.status(404).json({ error: "Phone not found" });
      return;
    }
    res.json({ message: "Phone deleted successfully" });
  })
);

export default router;
