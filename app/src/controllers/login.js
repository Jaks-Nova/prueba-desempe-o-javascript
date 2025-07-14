import axios from "axios";
const userURL = "http://localhost:3000/users";

export async function login({ email, password }) {
  try {
    const resp = await axios.get(userURL, {
      params: { email, password },
    });

    const users = Array.isArray(resp.data) ? resp.data : [];

    if (users.length === 0) {
      alert("Usuario o contraseña inválido");
      return false;
    }

    const user = users[0];

    if (!user.role) {
      alert("El usuario no tiene un rol asignado.");
      return false;
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuth", true);
    return true;

  } catch (error) {
    console.error("Error al hacer login:", error);
    alert("Ocurrió un error inesperado");
    return false;
  }
}
