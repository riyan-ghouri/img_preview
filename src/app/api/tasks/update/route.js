import {connectDB} from "../../../../../lib/db";
import Task from "../../../../../models/Task";
import mongoose from "mongoose";

connectDB(); // ensure DB connection

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, completed } = body;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Valid task ID is required" }), { status: 400 });
    }

    // Validate completed
    if (completed === undefined || typeof completed !== "boolean") {
      return new Response(JSON.stringify({ error: "'completed' must be true or false" }), { status: 400 });
    }

    // Find task
    const task = await Task.findOne({ _id: id, isDeleted: false });
    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found or deleted" }), { status: 404 });
    }

    // Update completed status
    task.completed = completed;
    await task.save();

    return new Response(
      JSON.stringify({
        success: true,
        task: {
          id: task._id,
          title: task.title,
          completed: task.completed,
          updatedAt: task.updatedAt,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Task status update error:", err);
    return new Response(JSON.stringify({ error: "Failed to update task status" }), { status: 500 });
  }
}
