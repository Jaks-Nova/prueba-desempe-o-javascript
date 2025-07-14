import axios from "axios";
const userURL = "http://localhost:3000/users";

export async function register({ name, email, password, role }) {
  try {
    // Verificar si el usuario ya existe
    const existing = await axios.get(userURL, { params: { email } });

    if (existing.data.length > 0) {
      alert("Este correo ya está registrado.");
      return false;
    }

    // Crear usuario nuevo
    await axios.post(userURL, {
      name,
      email,
      password,
      role,
    });

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    return true;
  } catch (error) {
    console.log("Error al registrar:", error);
    alert("Error al registrar. Intenta de nuevo.");
    return false;
  }
}
