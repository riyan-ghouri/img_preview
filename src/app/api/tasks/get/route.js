import {connectDB} from "../../../../../lib/db";
import Task from "../../../../../models/Task";

connectDB(); // ensure DB connection

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Get query params
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!userId) {
      return new Response(JSON.stringify({ error: "'userId' query param is required" }), { status: 400 });
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch tasks, exclude soft-deleted ones
    const tasks = await Task.find({ userId, isDeleted: false })
      .sort({ dateTime: 1 }) // soonest first
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments({ userId, isDeleted: false });
    const totalPages = Math.ceil(totalTasks / limit);

    return new Response(
      JSON.stringify({
        success: true,
        page,
        totalPages,
        totalTasks,
        tasks: tasks.map(task => ({
          id: task._id,
          title: task.title,
          description: task.description,
          dateTime: task.dateTime,
          location: task.location,
          reminderType: task.reminderType,
          completed: task.completed,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Get tasks error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), { status: 500 });
  }
}
