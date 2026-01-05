import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  // Time-based reminder
  dateTime: { type: Date, required: false },

  // Location-based reminder
  location: {
    lat: { type: Number },
    lng: { type: Number },
    radius: { type: Number }, // in meters
  },

  // Type of reminder: "time", "location", or "both"
  reminderType: { 
    type: String, 
    enum: ["time", "location", "both"], 
    default: "time" 
  },

  userId: { type: String, required: true },
  completed: { type: Boolean, default: false },

  // Soft delete
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
