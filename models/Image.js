import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "images" }
);

export default mongoose.models.Image ||
  mongoose.model("Image", ImageSchema);
