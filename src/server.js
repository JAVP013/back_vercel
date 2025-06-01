const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());



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
app.use((err, req, res, next) => {
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
