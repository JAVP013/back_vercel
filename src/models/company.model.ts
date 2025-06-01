// src/models/company.model.ts
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  description: { type: String }
});

const Company = mongoose.model("Company", companySchema);
export default Company;
