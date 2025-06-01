// src/models/Admin.ts
// import mongoose, { Schema, Document }// from "mongoose";

// export interface IAdmin extends Document {
  userId: string;
  password: string;
}

const AdminSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model<IAdmin>("Admin", AdminSchema);
