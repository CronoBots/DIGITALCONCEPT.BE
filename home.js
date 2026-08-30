/* =====================================================================
   Digital Concept — home.js
   Monographie d'atelier. Autonome (FR). Aucune dépendance à script.js/i18n.js.
   ===================================================================== */
(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var STILL = /[?&]still\b/.test(window.location.search); /* mode capture : fige les entrées */
  if (STILL) { prefersReduced = true; document.documentElement.classList.add("capture"); }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- Année ---- */
  $$(".js-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Reveal ---- */
  var revealEls = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  /* ---- Signature : trace exacte via getTotalLength ---- */
  $$(".sig").forEach(function (svg) {
    var p = svg.querySelector("path");
    if (!p) return;
    try {
      var len = Math.ceil(p.getTotalLength());
      svg.style.setProperty("--len", len);
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    } catch (e) {}
    if (prefersReduced) { if (p) p.style.strokeDashoffset = 0; svg.classList.add("drawn"); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { svg.classList.add("drawn"); io.unobserve(svg); } });
    }, { threshold: 0.5 });
    io.observe(svg);
  });

  /* ---- Masthead : fixe après le hero ---- */
  var masthead = $("#masthead");
  var cover = $(".cover");
  if (masthead && cover && "IntersectionObserver" in window) {
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // quand le hero sort du haut, on épingle une barre pleine
        masthead.classList.toggle("is-fixed", !e.isIntersecting);
      });
    }, { rootMargin: "-79px 0px 0px 0px", threshold: 0 });
    mio.observe(cover);
  }

  /* ---- Menu mobile ---- */
  var toggle = $(".nav-toggle");
  if (toggle) {
    var closeNav = function () { document.body.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("[data-nav-close], .nav-drawer a").forEach(function (el) { el.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }

  /* ---- Bouton haut de page ---- */
  var toTop = $("#to-top");
  if (toTop) {
    toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }); });
    if ("IntersectionObserver" in window && cover) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { toTop.classList.toggle("show", !e.isIntersecting); });
      }, { threshold: 0 });
      tio.observe(cover);
    }
  }

  /* ---- Formulaire de contact (AJAX formsubmit, reste sur la page) ---- */
  (function () {
    var form = $("#contact-form");
    var message = $("#form-message");
    if (!form || !message) return;
    var nameInput = form.elements.namedItem("name");
    var emailInput = form.elements.namedItem("email");
    var submitBtn = $("#contact-submit");
    var formCheck = $("#form-check");
    var endpoint = (form.dataset.endpoint || "").trim();
    if (endpoint) form.setAttribute("action", endpoint);

    function showError(msg) { message.className = "form-message error"; message.textContent = msg; }
    function showSuccess(msg) {
      if (formCheck) { void formCheck.offsetWidth; formCheck.classList.add("show"); }
      message.className = "form-message success"; message.textContent = msg;
    }
    function setLoading(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      submitBtn.innerHTML = on ? "Envoi…" : 'Demander un devis gratuit <span class="btn-ar" aria-hidden="true">→</span>';
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      message.className = "form-message";
      nameInput.classList.remove("invalid");
      emailInput.classList.remove("invalid");
      if (formCheck) formCheck.classList.remove("show");

      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var gotcha = form.elements.namedItem("_gotcha");
      if (gotcha && gotcha.value) return;

      if (!name) nameInput.classList.add("invalid");
      if (!emailValid) emailInput.classList.add("invalid");
      if (!name || !emailValid) {
        showError("Merci d'indiquer votre nom et une adresse e-mail valide.");
        return;
      }

      if (!endpoint) { form.submit(); return; }
      setLoading(true);
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          setLoading(false);
          if (res.ok) {
            showSuccess("Merci " + name + " ! Votre demande est envoyée, je vous réponds à " + email + " sous 24 h.");
            form.reset();
          } else {
            showError("Un souci est survenu. Réessayez, ou appelez-moi au 0460 96 21 46.");
          }
        })
        .catch(function () {
          setLoading(false);
          showError("Connexion impossible. Réessayez, ou appelez-moi au 0460 96 21 46.");
        });
    });
  })();

  /* ---- Showcase (aperçu PC + mobile conservé) ---- */
  (function () {
    var showcase = $("[data-showcase]");
    if (!showcase) return;
    var PROJECTS = [
      { host: "jaydenmusic.com", url: "https://jaydenmusic.com/", desktop: "img/jaydenmusic-desktop.jpg?v=4", mobile: "img/jaydenmusic-mobile.jpg?v=4", name: "Jayden", kind: "Site web · Artiste musical", desc: "Site officiel du chanteur Jayden — rock, soul et poésie." },
      { host: "cronobots.github.io/PIZZAPINO", url: "https://cronobots.github.io/PIZZAPINO/", desktop: "img/pizzapino-desktop.jpg?v=1", mobile: "img/pizzapino-mobile.jpg?v=1", name: "Pizzeria Pino", kind: "Site web · Restaurant italien", desc: "Restaurant italien & pizzas au feu de bois à Nandrin." },
      { host: "yumea-wellness.be", url: "https://www.yumea-wellness.be/", desktop: "img/yumea-desktop.jpg?v=4", mobile: "img/yumea-mobile.jpg?v=4", name: "Yuméa Wellness", kind: "Site web · Bien-être & Head Spa", desc: "Institut de Head Spa japonais et de soins du visage." },
      { host: "crypto-nauts.com", url: "https://www.crypto-nauts.com", desktop: "img/cryptonauts-desktop.jpg?v=2", mobile: "img/cryptonauts-mobile.jpg?v=2", name: "Cryptonauts", kind: "NFT · Crypto.com", desc: "Collection NFT d'avatars d'astronautes sur Crypto.com." },
      { host: "oryxia.be", url: "https://oryxia.be/", desktop: "img/oryxia-desktop.jpg?v=2", mobile: "img/oryxia-mobile.jpg?v=2", name: "Oryxia Design", kind: "Site web · Gravure laser", desc: "Studio de gravure laser et création sur mesure." },
      { host: "cronobots.github.io/TOUKIN", url: "https://cronobots.github.io/TOUKIN/", desktop: "img/toukin-desktop.jpg?v=2", mobile: "img/toukin-mobile.jpg?v=2", name: "Toukin Physiothérapie", kind: "Site web · Physiothérapie", desc: "Cabinet de physiothérapie à Tolochenaz." }
    ];
    PROJECTS.forEach(function (p) { new Image().src = p.desktop; new Image().src = p.mobile; });

    var q = function (s) { return showcase.querySelector(s); };
    var elDesktop = q("[data-sc-desktop]"), elMobile = q("[data-sc-mobile]");
    var elUrl = q("[data-sc-url]"), elKind = q("[data-sc-kind]"), elTitle = q("[data-sc-title]");
    var elDesc = q("[data-sc-desc]"), elLink = q("[data-sc-link]");
    var tabsWrap = q("[data-sc-tabs]");
    var devicesEl = q("[data-devices]");
    var INT = prefersReduced ? 0 : 3800;
    showcase.style.setProperty("--sc-int", INT + "ms");
    var index = 0, timer = null, started = false;

    if (devicesEl) {
      devicesEl.classList.add("is-clickable");
      devicesEl.setAttribute("role", "link");
      devicesEl.setAttribute("tabindex", "0");
      var openProject = function () { var u = PROJECTS[index] && PROJECTS[index].url; if (u) window.open(u, "_blank", "noopener"); };
      devicesEl.addEventListener("click", openProject);
      devicesEl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(); } });
    }

    var tabs = PROJECTS.map(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "sc-dot"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", p.name);
      b.innerHTML = '<span class="sc-dot-fill" aria-hidden="true"></span>';
      b.addEventListener("click", function () { if (!started) { started = true; showcase.classList.add("is-live"); } go(i, true); arm(); });
      tabsWrap.appendChild(b);
      return b;
    });

    function restartFill(i) {
      if (prefersReduced) return;
      var fill = tabs[i] && tabs[i].querySelector(".sc-dot-fill");
      if (!fill) return;
      fill.style.animation = "none"; void fill.offsetWidth; fill.style.animation = "";
    }
    function paint(i) {
      var p = PROJECTS[i];
      if (elDesktop) { elDesktop.src = p.desktop; elDesktop.alt = p.name + " — aperçu du site (version ordinateur)"; }
      if (elMobile) elMobile.src = p.mobile;
      if (elUrl) elUrl.textContent = p.host;
      if (elLink) elLink.href = p.url;
      if (elKind) elKind.textContent = p.kind;
      if (elTitle) elTitle.textContent = p.name;
      if (elDesc) elDesc.textContent = p.desc;
      if (devicesEl) devicesEl.setAttribute("aria-label", "Ouvrir le site " + p.name + " (" + p.host + ")");
      tabs.forEach(function (t, k) { t.classList.toggle("active", k === i); t.setAttribute("aria-selected", k === i ? "true" : "false"); });
      restartFill(i);
    }
    function go(i, animate) {
      index = (i + PROJECTS.length) % PROJECTS.length;
      if (animate && !prefersReduced) {
        showcase.classList.add("is-swapping");
        setTimeout(function () { paint(index); showcase.classList.remove("is-swapping"); }, 220);
      } else { paint(index); }
    }
    function arm() { if (!INT) return; clearInterval(timer); timer = setInterval(function () { go(index + 1, true); }, INT); }
    function stop() { clearInterval(timer); }

    paint(0);

    if ("IntersectionObserver" in window && !prefersReduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) { started = true; showcase.classList.add("is-live"); restartFill(index); arm(); }
        });
      }, { threshold: 0.35 });
      io.observe(showcase);
    }

    showcase.addEventListener("pointerenter", function () { stop(); showcase.classList.add("is-paused"); });
    showcase.addEventListener("pointerleave", function () { showcase.classList.remove("is-paused"); if (started) { restartFill(index); arm(); } });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (started && !showcase.matches(":hover")) { restartFill(index); arm(); }
    });

    /* Parallaxe 3D (PC + mobile se décalent différemment) */
    if (finePointer && !prefersReduced) {
      var stage = showcase.querySelector(".showcase-stage");
      var laptop = showcase.querySelector(".laptop-device");
      var phone = showcase.querySelector(".phone");
      if (stage && devicesEl && laptop && phone) {
        var clamp = function (v) { return v < -0.5 ? -0.5 : v > 0.5 ? 0.5 : v; };
        var lastE = null, ticking = false;
        var update = function () {
          ticking = false; if (!lastE) return;
          var sr = stage.getBoundingClientRect();
          var rx = clamp((lastE.clientX - sr.left) / sr.width - 0.5);
          var ry = clamp((lastE.clientY - sr.top) / sr.height - 0.5);
          devicesEl.style.transform = "rotateY(" + (rx * 8).toFixed(2) + "deg) rotateX(" + (-ry * 5).toFixed(2) + "deg)";
          laptop.style.transform = "translateZ(-8px) rotateY(" + (rx * 4).toFixed(2) + "deg) rotateX(" + (-ry * 3).toFixed(2) + "deg)";
          phone.style.transform = "translateZ(22px) rotateY(" + (rx * 11).toFixed(2) + "deg) rotateX(" + (-ry * 7).toFixed(2) + "deg)";
        };
        window.addEventListener("pointermove", function (e) { lastE = e; if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        document.addEventListener("mouseleave", function () { devicesEl.style.transform = ""; laptop.style.transform = ""; phone.style.transform = ""; });
      }
    }
  })();

  /* ---- Hero : réseau de nœuds interactif (constellation 3D — web / IA / crypto / bots) ---- */
  (function () {
    var canvas = $("[data-forge]");
    if (!canvas) return;
    var cover = $(".cover");
    var ctx = null;
    try { ctx = canvas.getContext("2d"); } catch (e) {}
    if (!ctx) return; /* repli CSS (dégradé sombre déjà en place) */

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    var nodes = [];
    function build() {
      var n = Math.round((W * H) / 15000);
      n = Math.max(26, Math.min(W < 640 ? 44 : 90, n));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1,
          vx: (Math.random() * 2 - 1) * 0.00018, vy: (Math.random() * 2 - 1) * 0.00018, vz: (Math.random() * 2 - 1) * 0.00018
        });
      }
    }
    build();

    var mouse = { x: 0.5, y: 0.5, active: false };
    var rotX = 0.06, rotY = 0, tRotX = 0.06, tRotY = 0;
    if (finePointer && !prefersReduced) {
      window.addEventListener("pointermove", function (e) {
        var r = cover.getBoundingClientRect();
        mouse.x = (e.clientX - r.left) / r.width;
        mouse.y = (e.clientY - r.top) / r.height;
        mouse.active = (e.clientY - r.top) < r.height + 60 && (e.clientY - r.top) > -60;
        tRotY = (mouse.x - 0.5) * 0.6;
        tRotX = 0.06 + (mouse.y - 0.5) * -0.4;
      }, { passive: true });
      window.addEventListener("pointerleave", function () { mouse.active = false; tRotY = 0; tRotX = 0.06; });
    }

    var CONN = 130, running = true, visible = true, started = false, raf = 0, t = 0;
    var P = [];

    function frame() {
      raf = 0;
      if (!running || !visible) return;
      t += 1;
      rotY += (tRotY - rotY) * 0.05; rotX += (tRotX - rotX) * 0.05;
      var ry = rotY + t * 0.0009, rx = rotX;
      var cosY = Math.cos(ry), sinY = Math.sin(ry), cosX = Math.cos(rx), sinX = Math.sin(rx);
      var spread = Math.min(W, H) * 0.62;
      var cx = W * (W > 820 ? 0.6 : 0.5), cy = H * 0.5, focal = 640;

      P.length = 0;
      for (var i = 0; i < nodes.length; i++) {
        var nd = nodes[i];
        nd.x += nd.vx; nd.y += nd.vy; nd.z += nd.vz;
        if (nd.x > 1 || nd.x < -1) nd.vx *= -1;
        if (nd.y > 1 || nd.y < -1) nd.vy *= -1;
        if (nd.z > 1 || nd.z < -1) nd.vz *= -1;
        var x = nd.x * spread, y = nd.y * spread, z = nd.z * spread;
        var x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
        var y1 = y * cosX - z1 * sinX, z2 = y * sinX + z1 * cosX;
        var sc = focal / (focal + z2 + spread);
        P.push({ sx: cx + x1 * sc, sy: cy + y1 * sc, sc: sc });
      }

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter"; /* bloom additif — les lueurs s'additionnent */

      /* connexions entre nœuds proches */
      for (var a = 0; a < P.length; a++) {
        for (var b = a + 1; b < P.length; b++) {
          var dx = P[a].sx - P[b].sx, dy = P[a].sy - P[b].sy;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONN) {
            var al = (1 - d / CONN) * 0.32 * Math.min(P[a].sc, P[b].sc);
            if (al > 0.015) {
              ctx.strokeStyle = "rgba(99,102,241," + al.toFixed(3) + ")";
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(P[a].sx, P[a].sy); ctx.lineTo(P[b].sx, P[b].sy); ctx.stroke();
            }
          }
        }
      }

      /* nœuds (+ halo & liens au curseur) */
      var mx = mouse.x * W, my = mouse.y * H;
      for (var k = 0; k < P.length; k++) {
        var p = P[k], near = 0;
        if (mouse.active) {
          var ex = p.sx - mx, ey = p.sy - my, dm = Math.sqrt(ex * ex + ey * ey);
          if (dm < 150) {
            near = 1 - dm / 150;
            ctx.strokeStyle = "rgba(192,132,252," + (near * 0.55 * p.sc).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(p.sx, p.sy); ctx.stroke();
          }
        }
        var r = (1.0 + p.sc * 1.5) * (1 + near * 1.3);
        /* halo doux (2 arcs, sans shadowBlur global pour la perf) */
        ctx.fillStyle = "rgba(120,108,240," + (0.05 + 0.08 * p.sc + near * 0.32).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 3.2, 0, 6.283); ctx.fill(); /* halo bloom */
        ctx.fillStyle = "rgba(150,138,235," + (0.10 + 0.14 * p.sc).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 1.7, 0, 6.283); ctx.fill(); /* lueur médiane */
        ctx.fillStyle = near > 0.15
          ? "rgba(224,208,255," + (0.85 + near * 0.15).toFixed(3) + ")"
          : "rgba(170,158,245," + (0.4 + p.sc * 0.5).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, 6.283); ctx.fill(); /* cœur */
      }
      ctx.globalCompositeOperation = "source-over";

      if (!started) { started = true; canvas.classList.add("is-live"); }
      if (!prefersReduced) raf = requestAnimationFrame(frame);
    }
    function loop() { if (!raf && running && visible) raf = requestAnimationFrame(frame); }

    var rt = null;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { resize(); build(); if (prefersReduced) frame(); }, 180); });

    if ("IntersectionObserver" in window && cover) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible = en.isIntersecting; if (visible) loop(); });
      }, { threshold: 0 });
      vio.observe(cover);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) running = false; else { running = true; loop(); } });

    if (prefersReduced) frame(); /* une seule image figée */
    else loop();
  })();

  /* ---- Boutons magnétiques ---- */
  if (finePointer && !prefersReduced) {
    $$("[data-magnetic]").forEach(function (btn) {
      var strength = 18;
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var my = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.transform = "translate(" + (mx * strength).toFixed(1) + "px," + (my * strength * 0.7).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---- Réseau de fond global (multi-sections, parallaxe par superposition) ---- */
  (function () {
    var canvas = document.getElementById("net-bg");
    if (!canvas) return;
    var ctx; try { ctx = canvas.getContext("2d"); } catch (e) {}
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, N = 0, nodes = [];
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      N = W < 720 ? 0 : Math.min(42, Math.round(W * H / 42000));
      nodes = [];
      for (var i = 0; i < N; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random(), vx: (Math.random() * 2 - 1) * 0.13, vy: (Math.random() * 2 - 1) * 0.13 });
    }
    resize();
    var mx = -999, my = -999;
    if (finePointer && !prefersReduced) window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    var CONN = 155, raf = 0, run = true, vis = true;
    function frame() {
      raf = 0; if (!run || !vis || N === 0) return;
      for (var i = 0; i < N; i++) { var n = nodes[i]; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x += W; if (n.x > W) n.x -= W; if (n.y < 0) n.y += H; if (n.y > H) n.y -= H; }
      ctx.clearRect(0, 0, W, H);
      for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) {
        var A = nodes[a], B = nodes[b], dx = A.x - B.x, dy = A.y - B.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN) { var al = (1 - d / CONN) * 0.10; ctx.strokeStyle = "rgba(99,102,241," + al.toFixed(3) + ")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); }
      }
      for (var k = 0; k < N; k++) {
        var p = nodes[k], near = 0;
        if (mx > -900) { var ex = p.x - mx, ey = p.y - my, dm = Math.sqrt(ex * ex + ey * ey); if (dm < 170) near = 1 - dm / 170; }
        ctx.fillStyle = near > 0.1 ? "rgba(196,181,253," + (0.4 + near * 0.5).toFixed(3) + ")" : "rgba(139,124,255," + (0.10 + p.z * 0.16).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.1 + p.z * 1.4 + near * 1.4, 0, 6.283); ctx.fill();
      }
      if (!prefersReduced) raf = requestAnimationFrame(frame);
    }
    function loop() { if (!raf && run && vis && N > 0) raf = requestAnimationFrame(frame); }
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { resize(); if (prefersReduced) frame(); else loop(); }, 180); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) run = false; else { run = true; loop(); } });
    if (prefersReduced) frame(); else loop();
  })();

  /* ---- Scroll : fil conducteur + dissolution du hero ---- */
  (function () {
    var fill = $(".spine-fill"), node = $(".spine-node");
    var cover = $(".cover"), heroWrap = cover && cover.querySelector(".wrap"), heroCanvas = $("[data-forge]");
    if (prefersReduced) { if (fill) fill.style.transform = "scaleY(0)"; return; }
    var ticking = false;
    function upd() {
      ticking = false;
      var s = window.pageYOffset || 0;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var prog = docH > 0 ? Math.min(1, Math.max(0, s / docH)) : 0;
      if (fill) fill.style.transform = "scaleY(" + prog.toFixed(4) + ")";
      if (node) node.style.top = (prog * 100).toFixed(2) + "%";
      var h = window.innerHeight, t = Math.min(1, s / h);
      if (heroWrap) { if (t > 0.004) { heroWrap.style.transform = "translateY(" + (t * 46).toFixed(1) + "px)"; heroWrap.style.opacity = (1 - t * 0.92).toFixed(3); } else { heroWrap.style.transform = ""; heroWrap.style.opacity = ""; } }
      if (heroCanvas) { if (t > 0.004) heroCanvas.style.opacity = (1 - t * 0.85).toFixed(3); else heroCanvas.style.opacity = ""; }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    upd();
  })();

  /* ---- Chiffres animés (count-up) ---- */
  (function () {
    if (prefersReduced || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return; var el = e.target; io.unobserve(el);
        var m = /^(\d+)([\s\S]*)$/.exec(el.textContent); if (!m) return;
        var target = parseInt(m[1], 10), suffix = m[2], t0 = null;
        function step(ts) { if (t0 === null) t0 = ts; var p = Math.min(1, (ts - t0) / 1300), eased = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(eased * target) + suffix; if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    $$(".fact b, .maker-facts b").forEach(function (el) { io.observe(el); });
  })();

  /* ---- Projecteur curseur sur les cartes ---- */
  if (finePointer && !prefersReduced) {
    $$(".step, .commission-side").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      });
    });
  }

  /* ---- Lueur qui suit le curseur ---- */
  (function () {
    if (!finePointer || prefersReduced) return;
    var g = $(".cursor-glow"); if (!g) return;
    var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, raf = 0, shown = false;
    function run() { raf = 0; x += (tx - x) * 0.16; y += (ty - y) * 0.16; g.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)"; if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) raf = requestAnimationFrame(run); }
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; if (!shown) { shown = true; g.style.opacity = "1"; } if (!raf) raf = requestAnimationFrame(run); }, { passive: true });
  })();
})();
