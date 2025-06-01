// src/server.ts
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Importa las rutas (asegúrate de que los archivos existan en las rutas indicadas)
import emailRoutes from "./routes/email.routes";
import storeLocationRoutes from "./routes/storeLocation.routes";
import phoneRoutes from "./routes/phones.routes";
import brandRoutes from "./routes/brand.routes";
import carouselRoutes from "./routes/carousel.routes";
import companyRoutes from "./routes/company.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Registro de rutas
app.use("/email", emailRoutes);
app.use("/store-location", storeLocationRoutes);
app.use("/phones", phoneRoutes);
app.use("/brand", brandRoutes);
app.use("/carousel", carouselRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);

// Middleware para manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

// Conexión a la base de datos y arranque del servidor
const MONGO_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error conectando a MongoDB:", error);
  });
