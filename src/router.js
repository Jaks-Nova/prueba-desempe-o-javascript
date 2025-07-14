import {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  markTaskCompleted
} from "./controllers/crudTasks.js";
import { login } from "./controllers/login.js";

const routes = {
  "/": "/src/views/home.html",
  "/login": "/src/views/login.html",
  "/register": "/src/views/register.html",
  "/admin": "/src/views/admin.html",
  "/user": "/src/views/user.html",
  "/tasks": "/src/views/managmentTask.html",
  "/users": "/src/views/users.html",
  "/404": "/src/views/404.html",
};

export async function renderRoute() {
  const path = location.pathname;
  const app = document.getElementById("app");
  const isAuth = localStorage.getItem("isAuth") === "true";
  const user = JSON.parse(localStorage.getItem("user"));
  const file = routes[path] || routes["/404"];

  if (!isAuth && path !== "/login" && path !== "/register") {
    location.pathname = "/login";
    return;
  }

  if (isAuth && path === "/login") {
    location.pathname = "/";
    return;
  }

  if (isAuth && user?.role !== "admin") {
    if (["/admin", "/users"].includes(path)) {
      alert("No tienes permiso para acceder a esta ruta");
      location.pathname = "/";
      return;
    }
  }

  try {
    const res = await fetch(file);
    const html = await res.text();
    app.innerHTML = html;

    if (!["/login", "/register"].includes(path) && document.getElementById("principal-header")) {
      document.getElementById("principal-header").hidden = false;
    }

    // LOGIN
    if (path === "/login") {
      document.getElementById("principal-header").hidden = true;
      document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const success = await login({ email, password });
        if (success) {
          const user = JSON.parse(localStorage.getItem("user"));
          location.pathname = user.role === "admin" ? "/admin" : "/user";
        }
      });
    }

    // REGISTRO
    if (path === "/register") {
      document.getElementById("registerForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!name || !email || !password) {
          alert("Todos los campos son obligatorios");
          return;
        }

        const res = await fetch(`http://localhost:3000/users?email=${email}`);
        const data = await res.json();

        if (data.length > 0) {
          alert("Este correo ya está registrado.");
          return;
        }

        const newUser = { name, email, password, role: "user" };
        await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        location.pathname = "/login";
      });
    }

    // HOME
    if (path === "/") {
      app.innerHTML = `
      <div class="text-center mb-4">
        <h2 class="text-2xl font-bold">Bienvenido ${user?.name}</h2>
      </div>
      <div class="container grid grid-cols-2 space-x-4 p-3">
        <a href="/tasks"><div class="card bg-blue-200 h-24 w-full rounded-lg p-3">Tareas</div></a>
        ${user?.role === "admin"
          ? `<a href="/users"><div class="card bg-blue-200 h-24 w-full rounded-lg p-3">Usuarios</div></a>`
          : ""}
      </div>`;
    }

    // TASKS
if (path === "/tasks") {
  const taskTable = document.getElementById("task-table-body");
  const taskForm = document.getElementById("taskForm");

  const allTasks = await getTasks(user);
  const visibleTasks = user.role === "admin"
    ? allTasks
    : allTasks.filter(task => task.assignedTo === user.email);

  taskTable.innerHTML = "";

  if (visibleTasks.length === 0) {
    taskTable.innerHTML = "<tr><td colspan='5'>No hay tareas para mostrar</td></tr>";
  }

  visibleTasks.forEach(task => {
    const row = document.createElement("tr");
    row.className = "border-b";
    row.innerHTML = `
      <td class="py-2 px-4">${task.title}</td>
      <td class="py-2 px-4">${task.description}</td>
      <td class="py-2 px-4">${task.assignedTo}</td>
      <td class="py-2 px-4">${task.status}</td>
      <td class="py-2 px-4">
        ${
          user.role === "admin"
            ? `
              <button class="edit-task bg-blue-500 text-white px-2 py-1 rounded" data-id="${task.id}">Editar</button>
              <button class="delete-task bg-red-500 text-white px-2 py-1 rounded ml-2" data-id="${task.id}">Eliminar</button>
            `
            : task.status === "pendiente"
              ? `<button class="mark-done bg-green-500 text-white px-2 py-1 rounded" data-id="${task.id}">Marcar como completada</button>`
              : ""
        }
      </td>
    `;
    taskTable.appendChild(row);
  });

  // Usuario: Marcar como completada
  document.querySelectorAll(".mark-done").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const task = allTasks.find(t => t.id == id);
      await markTaskCompleted(task);
      location.reload();
    });
  });

  // Admin: Eliminar tarea
  document.querySelectorAll(".delete-task").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm("¿Deseas eliminar esta tarea?")) {
        await deleteTask(id);
        location.reload();
      }
    });
  });

  // Admin: Editar tarea
  document.querySelectorAll(".edit-task").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const task = allTasks.find(t => t.id == id);

      const newTitle = prompt("Nuevo título:", task.title);
      const newDesc = prompt("Nueva descripción:", task.description);
      const newStatus = prompt("Nuevo estado (pendiente/completada):", task.status);

      if (newTitle && newDesc && newStatus) {
        await updateTask(
          { ...task, title: newTitle, description: newDesc, status: newStatus },
          task.id
        );
        location.reload();
      }
    });
  });

  // Mostrar formulario solo si el usuario es admin
  if (taskForm) {
    if (user.role === "admin") {
      taskForm.style.display = "grid"; // o "block" según tu diseño
      taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const assignedTo = document.getElementById("task-assigned").value;

        if (!title || !description || !assignedTo) {
          alert("Todos los campos son obligatorios");
          return;
        }

        const newTask = {
          title,
          description,
          assignedTo,
          status: "pendiente",
          created: new Date().toISOString(),
        };

        await addTask(newTask);
        location.reload();
      });
    } else {
      taskForm.style.display = "none";
    }
  }
}


    // LOGOUT
    if (document.getElementById("logOut")) {
      document.getElementById("logOut").addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuth");
        location.pathname = "/login";
      });
    }

  } catch (error) {
    console.error(error);
    app.innerHTML = "<h2 class='text-center text-red-500 mt-4'>Error al cargar la vista</h2>";
  }
}
