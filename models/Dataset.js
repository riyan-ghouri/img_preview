import mongoose from "mongoose";

const DatasetSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  completion: { type: String, required: true },
  tags: { type: [String], default: [] }, // ✅ default array fix
  createdAt: { type: Date, default: Date.now },
  userId: String
});

export default mongoose.models.Dataset || mongoose.model("Dataset", DatasetSchema);
