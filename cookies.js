/* Gestion du consentement cookies + bouton « Gérer les cookies » + année.
   Autonome : fonctionne aussi bien sur la page d'accueil que sur les pages légales. */
(function () {
  "use strict";
  var KEY = "dc-cookie-consent";
  var banner = document.getElementById("cookie-consent");

  // Année dynamique (footers)
  var y = new Date().getFullYear();
  document.querySelectorAll(".js-year, #year").forEach(function (el) { el.textContent = y; });

  if (!banner) return;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} hide(); }
  function show() { banner.classList.add("show"); }
  function hide() { banner.classList.remove("show"); }

  if (!stored()) { setTimeout(show, 700); }

  var accept = banner.querySelector("[data-c-accept]");
  var refuse = banner.querySelector("[data-c-refuse]");
  if (accept) accept.addEventListener("click", function () { save("accepted"); });
  if (refuse) refuse.addEventListener("click", function () { save("refused"); });

  document.querySelectorAll("[data-cookie-prefs]").forEach(function (btn) {
    btn.addEventListener("click", function (e) { e.preventDefault(); show(); });
  });
})();
