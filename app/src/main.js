import { renderRoute } from "./router.js";
import "./style.css";

window.addEventListener("DOMContentLoaded", () => {
  renderRoute();

// Listen for clicks on internal links for SPA
  document.body.addEventListener("click", (e) => {
    const target = e.target.closest("a");
    if (target && target.getAttribute("href")?.startsWith("/")) {
      e.preventDefault();
      history.pushState(null, "", target.getAttribute("href"));
      renderRoute();
    }
  });
});

// So that it also works with browser buttons
window.addEventListener("popstate", renderRoute);
