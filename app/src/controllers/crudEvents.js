const BASE_URL = "http://localhost:3000/events";

// Obtener todos los eventos (admin) o solo disponibles (visitante)
export async function getEvents(user) {
  try {
    const res = await fetch(BASE_URL);
    const events = await res.json();

    if (user?.role === "admin") {
      return events;
    } else {
      // Visitantes ven eventos no llenos
      return events.filter(event => event.registeredUsers.length < event.capacity);
    }
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
}

// Crear nuevo evento (solo admin)
export async function addEvent(event) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, registeredUsers: [] })
    });
    return await res.json();
  } catch (error) {
    console.error("Error al agregar evento:", error);
  }
}

// Actualizar evento (solo admin)
export async function updateEvent(event, id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
    return await res.json();
  } catch (error) {
    console.error("Error al actualizar evento:", error);
  }
}

// Eliminar evento (solo admin)
export async function deleteEvent(id) {
  try {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE"
    });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
  }
}

// Registrar visitante a un evento
export async function registerToEvent(eventId, userEmail) {
  try {
    const res = await fetch(`${BASE_URL}/${eventId}`);
    const event = await res.json();

    if (!event.registeredUsers.includes(userEmail) && event.registeredUsers.length < event.capacity) {
      const updated = {
        ...event,
        registeredUsers: [...event.registeredUsers, userEmail]
      };

      await updateEvent(updated, eventId);
      return true;
    } else {
      alert("Ya estás registrado o no hay cupos disponibles.");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar al evento:", error);
    return false;
  }
}

