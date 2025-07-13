import { renderRoute } from "./router.js";
import "./style.css";

window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user && location.pathname !== "/login") {
    location.pathname = "/login";
  }

  renderRoute();
});

window.addEventListener("popstate", () => {
  renderRoute();
});
