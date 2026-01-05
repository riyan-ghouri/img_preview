import mongoose from "mongoose";

const DocSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: {
    type: [Number],
    required: true,
    index: false // Atlas handles indexing
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Doc || mongoose.model("Doc", DocSchema);
  