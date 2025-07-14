const BASE_URL = "http://localhost:3000/events";

// Obtener todos los eventos
export async function getEvents() {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  return data;
}

// Agregar nuevo evento
export async function addEvent(eventData) {
  await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData)
  });
}

// Actualizar evento
export async function updateEvent(eventData, id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData)
  });
}

// Eliminar evento
export async function deleteEvent(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });
}

// Registrar usuario al evento
export async function registerToEvent(eventId, userEmail) {
  const res = await fetch(`${BASE_URL}/${eventId}`);
  const event = await res.json();

  if (!event.registeredUsers.includes(userEmail) && event.registeredUsers.length < event.capacity) {
    event.registeredUsers.push(userEmail);

    await fetch(`${BASE_URL}/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
  }
}