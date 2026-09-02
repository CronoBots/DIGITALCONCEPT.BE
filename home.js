/* =====================================================================
   Digital Concept — home.js
   Accueil : en-tête au défilement, apparition discrète des captures,
   formulaire (envoi AJAX + repli e-mail). Rien d'autre.
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- En-tête : filet dès qu'on a quitté le haut de page ---- */
  var top = $(".top");
  if (top) {
    var onScroll = function () { top.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Apparition discrète des réalisations ---- */
  var items = $$(".work, .promises li");
  if (items.length && "IntersectionObserver" in window && !prefersReduced) {
    items.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Formulaire ---- */
  var form = $("#contact-form"), message = $("#form-message");
  if (form && message) {
    var nameInput = form.elements.namedItem("name");
    var emailInput = form.elements.namedItem("email");
    var submitBtn = $("#contact-submit");
    var endpoint = (form.dataset.endpoint || "").trim();
    if (endpoint) form.setAttribute("action", endpoint);

    var showError = function (msg) { message.className = "form-message error"; message.textContent = msg; };
    var showSuccess = function (msg) { message.className = "form-message success"; message.textContent = msg; };
    var setLoading = function (on) { if (!submitBtn) return; submitBtn.disabled = on; submitBtn.textContent = on ? "Envoi…" : "Envoyer ma demande"; };
    // Si l'envoi échoue, la demande n'est pas perdue : e-mail pré-rempli vers data-mailto.
    var showFallback = function (msg) {
      showError(msg);
      var to = (form.dataset.mailto || "").trim(); if (!to) return;
      var phone = form.elements.namedItem("Téléphone"), msgEl = form.elements.namedItem("message");
      var body = "Nom : " + nameInput.value.trim() + "\nE-mail : " + emailInput.value.trim()
        + "\nTéléphone : " + ((phone && phone.value.trim()) || "—") + "\n\n" + ((msgEl && msgEl.value.trim()) || "");
      var a = document.createElement("a");
      a.href = "mailto:" + to + "?subject=" + encodeURIComponent("Demande — digitalconcept.be") + "&body=" + encodeURIComponent(body);
      a.className = "form-fallback"; a.textContent = "Envoyer par e-mail";
      message.appendChild(document.createTextNode(" ")); message.appendChild(a);
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      message.className = "form-message"; message.textContent = "";
      nameInput.classList.remove("invalid"); emailInput.classList.remove("invalid");
      var gotcha = form.elements.namedItem("_gotcha"); if (gotcha && gotcha.value) return;
      var name = nameInput.value.trim(), email = emailInput.value.trim();
      var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name) nameInput.classList.add("invalid");
      if (!emailValid) emailInput.classList.add("invalid");
      if (!name || !emailValid) { showError("Merci d'indiquer votre nom et une adresse e-mail valide."); return; }
      if (!endpoint) { form.submit(); return; }
      setLoading(true);
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          setLoading(false);
          if (res.ok) { showSuccess("Merci " + name + ", votre demande est envoyée. Je vous réponds à " + email + " sous 24 h."); form.reset(); }
          else showFallback("Un souci est survenu. Réessayez, appelez-moi au 0460 96 21 46, ou :");
        })
        .catch(function () { setLoading(false); showFallback("Connexion impossible. Réessayez, appelez-moi au 0460 96 21 46, ou :"); });
    });
  }
})();
