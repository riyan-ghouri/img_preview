import {connectDB} from "../../../../../lib/db";
import Task from "../../../../../models/Task";

export async function POST(req) {
   await connectDB(); // ensure DB connection

  try {
    const body = await req.json();
    const { title, description, dateTime, location, reminderType, userId } = body;

    // Manual validation
    if (!title || typeof title !== "string") {
      return new Response(
        JSON.stringify({ error: "Task creation failed: 'title' is required and must be a string." }),
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return new Response(
        JSON.stringify({ error: "Task creation failed: 'userId' is required and must be a string." }),
        { status: 400 }
      );
    }

    if (dateTime && isNaN(new Date(dateTime).getTime())) {
      return new Response(
        JSON.stringify({ error: "Task creation failed: 'dateTime' must be a valid date string." }),
        { status: 400 }
      );
    }

    if (location) {
      if (typeof location !== "object") {
        return new Response(
          JSON.stringify({ error: "Task creation failed: 'location' must be an object." }),
          { status: 400 }
        );
      }

      if (
        typeof location.lat !== "number" ||
        typeof location.lng !== "number"
      ) {
        return new Response(
          JSON.stringify({ error: "Task creation failed: 'location.lat' and 'location.lng' must be numbers." }),
          { status: 400 }
        );
      }

      if (location.radius && typeof location.radius !== "number") {
        return new Response(
          JSON.stringify({ error: "Task creation failed: 'location.radius' must be a number if provided." }),
          { status: 400 }
        );
      }
    }

    // Create task
    const task = await Task.create({
      title,
      description: description || "",
      dateTime: dateTime ? new Date(dateTime) : undefined,
      location,
      reminderType: ["time", "location", "both"].includes(reminderType) ? reminderType : "time",
      userId,
    });

    // Clean response
    return new Response(
      JSON.stringify({
        success: true,
        task: {
          id: task._id,
          title: task.title,
          description: task.description,
          dateTime: task.dateTime,
          location: task.location,
          reminderType: task.reminderType,
          completed: task.completed,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Task creation error:", err);
    return new Response(
      JSON.stringify({ error: "Task creation failed due to an internal server error." }),
      { status: 500 }
    );
  }
}
