import axios from "axios";
const userURL = "http://localhost:3000/users";

export async function login({ email, password }) {
  try {
    const resp = await axios.get(userURL, {
      params: { email, password },
    });

    const users = Array.isArray(resp.data) ? resp.data : [];

    if (users.length === 0) {
      alert("Invalid username or password");
      return false;
    }

    const user = users[0];

    if (!user.role) {
      alert("The user does not have a role assigned.");
      return false;
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuth", true);
    return true;

  } catch (error) {
    console.error("Error logging in:", error);
    alert("An unexpected error occurred");
    return false;
  }
}
