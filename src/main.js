import { renderRoute } from "./router.js";
import "./style.css";

window.addEventListener("DOMContentLoaded", () => {
  renderRoute();

  // Escuchar clicks en los enlaces internos para SPA
  document.body.addEventListener("click", (e) => {
    const target = e.target.closest("a");
    if (target && target.getAttribute("href")?.startsWith("/")) {
      e.preventDefault();
      history.pushState(null, "", target.getAttribute("href"));
      renderRoute();
    }
  });
});

// Para que funcione también con botones del navegador
window.addEventListener("popstate", renderRoute);
