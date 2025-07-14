import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  registerToEvent
} from "./controllers/crudEvents.js";
import { login } from "./controllers/login.js";

const routes = {
  "/": "/src/views/home.html",
  "/login": "/src/views/login.html",
  "/register": "/src/views/register.html",
  "/admin": "/src/views/admin.html",
  "/events": "/src/views/managmentEvents.html",
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

      const loginForm = document.getElementById("loginForm");

      if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          const success = await login({ email, password });

          if (success) {
            location.pathname = "/";
          } else {
            alert("Correo o contraseña incorrectos");
          }
        });
      }
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
      const username = document.getElementById("username");
      const adminOptions = document.getElementById("admin-options");

      if (username) username.textContent = user?.name;
      if (adminOptions && user?.role === "admin") adminOptions.classList.remove("hidden");
    }

    // EVENTS
    if (path === "/events") {
      const eventForm = document.getElementById("taskForm");
      const eventTableBody = document.getElementById("task-table-body");

      const events = await getEvents();

      eventTableBody.innerHTML = "";

      if (events.length === 0) {
        eventTableBody.innerHTML = "<tr><td colspan='5'>No hay eventos disponibles</td></tr>";
      }

      events.forEach(event => {
        const isRegistered = event.registeredUsers.includes(user.email);

        const row = document.createElement("tr");
        row.className = "border-b";
        row.innerHTML = `
          <td class="py-2 px-4 border">${event.title}</td>
          <td class="py-2 px-4 border">${event.description}</td>
          <td class="py-2 px-4 border">${event.registeredUsers.length} / ${event.capacity}</td>
          <td class="py-2 px-4 border">${isRegistered ? "Inscrito" : "Disponible"}</td>
          <td class="py-2 px-4 border">
            ${
              user.role === "admin"
                ? `
                  <button class="edit-event bg-blue-500 text-white px-2 py-1 rounded" data-id="${event.id}">Editar</button>
                  <button class="delete-event bg-red-500 text-white px-2 py-1 rounded ml-2" data-id="${event.id}">Eliminar</button>
                `
                : !isRegistered && event.registeredUsers.length < event.capacity
                  ? `<button class="register-event bg-green-500 text-white px-2 py-1 rounded" data-id="${event.id}">Unirme</button>`
                  : ""
            }
          </td>
        `;
        eventTableBody.appendChild(row);
      });

      // Acciones de eventos
      document.querySelectorAll(".register-event").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          await registerToEvent(id, user.email);
          location.reload();
        });
      });

      document.querySelectorAll(".delete-event").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          if (confirm("¿Deseas eliminar este evento?")) {
            await deleteEvent(id);
            location.reload();
          }
        });
      });

      document.querySelectorAll(".edit-event").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const event = events.find(ev => ev.id == id);

          const newTitle = prompt("Nuevo título:", event.title);
          const newDesc = prompt("Nueva descripción:", event.description);
          const newCap = prompt("Nueva capacidad:", event.capacity);

          if (newTitle && newDesc && newCap) {
            await updateEvent({ ...event, title: newTitle, description: newDesc, capacity: Number(newCap) }, id);
            location.reload();
          }
        });
      });

      // Mostrar formulario solo si es admin
      if (user.role === "admin") {
        eventForm.style.display = "grid";
        eventForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const title = document.getElementById("event-title").value;
          const description = document.getElementById("event-description").value;
          const assignedEmail = document.getElementById("event-assigned").value;

          if (!title || !description || !assignedEmail) {
            alert("Todos los campos son obligatorios");
            return;
          }

          const newEvent = {
            title,
            description,
            date: new Date().toISOString().slice(0, 10),
            capacity: 20,
            registeredUsers: [assignedEmail]
          };

          await addEvent(newEvent);
          location.reload();
        });
      } else {
        eventForm.style.display = "none";
      }
    }

    // USUARIOS
    if (path === "/users" && user?.role === "admin") {
      const tableBody = document.getElementById("user-table-body");

      try {
        const res = await fetch("http://localhost:3000/users");
        const users = await res.json();

        if (users.length === 0) {
          tableBody.innerHTML = "<tr><td colspan='4'>No hay usuarios registrados</td></tr>";
        }

        users.forEach(u => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="py-2 px-4">${u.name}</td>
            <td class="py-2 px-4">${u.email}</td>
            <td class="py-2 px-4">${u.role}</td>
            <td class="py-2 px-4">
              <button class="edit-user bg-blue-500 text-white px-2 py-1 rounded" data-id="${u.id}">Editar</button>
              <button class="delete-user bg-red-500 text-white px-2 py-1 rounded ml-2" data-id="${u.id}">Eliminar</button>
            </td>
          `;
          tableBody.appendChild(row);
        });

        document.querySelectorAll(".delete-user").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            if (confirm("¿Eliminar este usuario?")) {
              await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
              location.reload();
            }
          });
        });

        document.querySelectorAll(".edit-user").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const res = await fetch(`http://localhost:3000/users/${id}`);
            const userEdit = await res.json();

            const newName = prompt("Nuevo nombre:", userEdit.name);
            const newEmail = prompt("Nuevo email:", userEdit.email);
            const newRole = prompt("Nuevo rol (admin/user):", userEdit.role);

            if (newName && newEmail && newRole) {
              await fetch(`http://localhost:3000/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...userEdit, name: newName, email: newEmail, role: newRole }),
              });
              location.reload();
            }
          });
        });

      } catch (err) {
        console.error("Error al cargar usuarios", err);
        tableBody.innerHTML = "<tr><td colspan='4'>Error al cargar usuarios</td></tr>";
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