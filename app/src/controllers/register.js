import axios from "axios";
const userURL = "http://localhost:3000/users";

export async function register({ name, email, password, role }) {
  try {
// Check if the user already exists
    const existing = await axios.get(userURL, { params: { email } });

    if (existing.data.length > 0) {
      alert("This email is already registered.");
      return false;
    }

// Create new user
    await axios.post(userURL, {
      name,
      email,
      password,
      role,
    });

    alert("Registration successful. You can now log in.");
    return true;
  } catch (error) {
    console.log("Error registering:", error);
    alert("Error registering. Please try again.");
    return false;
  }
}
