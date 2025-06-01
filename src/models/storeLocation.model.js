const mongoose = require("mongoose");

const storeLocationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  branchName: { type: String, required: true } // NUEVO
});

const StoreLocation = mongoose.model("StoreLocation", storeLocationSchema);
module.exports = StoreLocation;
