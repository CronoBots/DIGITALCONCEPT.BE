/* =====================================================================
   Digital Concept — home.js
   Accueil verre liquide : halos qui suivent doucement le curseur, cartes
   qui s'inclinent en 3D, apparition, formulaire (AJAX + repli e-mail).
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- En-tête : ombre dès qu'on a quitté le haut de page ---- */
  var top = $(".top");
  if (top) {
    var onScroll = function () { top.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Halos : dérive légère vers le curseur (desktop, mouvement autorisé) ---- */
  var halos = $(".halos");
  if (halos && finePointer && !prefersReduced) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    var tick = function () {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      halos.style.setProperty("--mx", cx.toFixed(1) + "px"); halos.style.setProperty("--my", cy.toFixed(1) + "px");
      if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) raf = requestAnimationFrame(tick); else raf = null;
    };
    window.addEventListener("pointermove", function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 40; ty = (e.clientY / window.innerHeight - 0.5) * 28;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* ---- Cartes : inclinaison 3D + lueur qui suit le curseur ---- */
  if (finePointer && !prefersReduced) {
    $$(".work").forEach(function (card) {
      var shot = $(".shot", card), r = null;
      card.addEventListener("pointerenter", function () { r = card.getBoundingClientRect(); card.classList.add("is-tilting"); });
      card.addEventListener("pointermove", function (e) {
        if (!r) r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", ((px - 0.5) * 10).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - py) * 8).toFixed(2) + "deg");
        if (shot) { shot.style.setProperty("--gx", (px * 100).toFixed(1) + "%"); shot.style.setProperty("--gy", (py * 100).toFixed(1) + "%"); }
      });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("is-tilting");
        card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); r = null;
      });
    });
  }

  /* ---- Apparition ---- */
  var items = $$(".work .shot, .promises li, .form");
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
