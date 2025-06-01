// src/models/company.model.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  description: { type: String }
});

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
