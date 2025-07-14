const BASE_URL = "http://localhost:3000/tasks";

// Obtener tareas (admin todas, usuario solo las suyas)
export async function getTasks(user) {
  try {
    const res = await fetch(BASE_URL);
    const tasks = await res.json();

    if (user?.role === "admin") {
      return tasks;
    } else {
      return tasks.filter((t) => t.assignedTo === user.email);
    }
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return [];
  }
}

// Agregar una nueva tarea (solo admin)
export async function addTask(task) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return await res.json();
  } catch (error) {
    console.error("Error al agregar tarea:", error);
  }
}

// Actualizar tarea
export async function updateTask(task, id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return await res.json();
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
  }
}

// Eliminar tarea
export async function deleteTask(id) {
  try {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
}

// Marcar tarea como completada
export async function markTaskCompleted(task) {
  try {
    const updated = { ...task, status: "completada" };
    return await updateTask(updated, task.id);
  } catch (error) {
    console.error("Error al marcar tarea como completada:", error);
  }
}
