const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

dotenv.config();
const router = express.Router();
const SALT_ROUNDS = 10;

/* -------------------------------------------------
   Seed automático: crea admin/admin si no existe
--------------------------------------------------*/
async function ensureDefaultAdmin() {
  const exists = await Admin.findOne({ userId: "admin" });
  if (!exists) {
    const hash = await bcrypt.hash("admin", SALT_ROUNDS);
    await Admin.create({ userId: "admin", password: hash });
    console.log("✔ Usuario admin/admin creado (seed)");
  }
}
ensureDefaultAdmin().catch(console.error);

/* -------------------------------------------------
   Utilidades
--------------------------------------------------*/
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** Middleware JWT */
const auth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );
    req.adminId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
});

/* -------------------------------------------------
   Rutas públicas
--------------------------------------------------*/
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { userId, password } = req.body;
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(401).json({ error: "Credenciales inválidas" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });
    res.json({ token });
  })
);

/* -------------------------------------------------
   Rutas protegidas
--------------------------------------------------*/

// Listar todos
router.get(
  "/",
  auth,
  asyncHandler(async (_req, res) => {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  })
);

// Crear nuevo
router.post(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(400).json({ error: "userId y password son requeridos" });

    const exists = await Admin.findOne({ userId });
    if (exists) return res.status(409).json({ error: "userId ya existe" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const admin = await Admin.create({ userId, password: hash });
    res.status(201).json({ _id: admin._id, userId: admin.userId });
  })
);

// Actualizar
router.put(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id === req.adminId)
      return res.status(403).json({ error: "No puedes modificar tu propio usuario activo" });

    const updates = {};
    if (req.body.userId) updates.userId = req.body.userId;
    if (req.body.password) updates.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const updated = await Admin.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(updated);
  })
);

// Eliminar
router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id === req.adminId)
      return res.status(403).json({ error: "No puedes eliminar tu propio usuario activo" });

    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado" });
  })
);

module.exports = router;
