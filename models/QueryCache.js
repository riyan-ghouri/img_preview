// models/QueryCache.js
import mongoose from "mongoose";

const QueryCacheSchema = new mongoose.Schema({
  query: { type: String, unique: true },
  embedding: [Number],
}, { timestamps: true });

export default mongoose.models.QueryCache ||
  mongoose.model("QueryCache", QueryCacheSchema);
