import mongoose from "mongoose";
import dotenv from "dotenv";
import StoreLocation from "./models/storeLocation.model";

dotenv.config();

const seedLocation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");

    // Eliminar datos anteriores
    await StoreLocation.deleteMany();

    // Nuevas sucursales
    const locations = [
      {
        address: "C. Puebla 178, entre Hidalgo y Lerdo, Tepic",
        latitude: 21.512090954191585,
        longitude: -104.89347764746158,
        branchName: "Sucursal Centro"
      },
      {
        address: "Av. Insurgentes 345, esquina con Victoria, Tepic",
        latitude: 21.504321,
        longitude: -104.891234,
        branchName: "Sucursal Insurgentes"
      },
      {
        address: "Blvd. Tepic-Xalisco 500, frente al estadio, Tepic",
        latitude: 21.485776,
        longitude: -104.902345,
        branchName: "Sucursal Estadio"
      },
      {
        address: "Av. México 1200, Plaza Forum, Tepic",
        latitude: 21.507890,
        longitude: -104.884456,
        branchName: "Sucursal Forum"
      }
    ];

    await StoreLocation.insertMany(locations);

    console.log("✅ Sucursales sembradas con éxito");
  } catch (error) {
    console.error("❌ Error en el seed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedLocation();
