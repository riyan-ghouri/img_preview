import {connectDB} from "../../../../../../lib/db";
import Task from "../../../../../../models/Task";

connectDB(); // ensure DB connection

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "'userId' query param is required" }), { status: 400 });
    }

    // Find tasks that are not completed and not soft-deleted
    const tasks = await Task.find({ userId, completed: false, isDeleted: false }).sort({ dateTime: 1 });

    return new Response(
      JSON.stringify({
        success: true,
        total: tasks.length,
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
    console.error("Get pending tasks error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch pending tasks" }), { status: 500 });
  }
}
