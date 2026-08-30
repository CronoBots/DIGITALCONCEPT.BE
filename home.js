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

  /* ---- Hero : métal en fusion (WebGL, vrai temps réel) ---- */
  (function () {
    var canvas = $("[data-forge]");
    if (!canvas) return;
    var cover = $(".cover");

    var gl = null;
    try {
      var opts = { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power", preserveDrawingBuffer: false };
      gl = canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts);
    } catch (e) {}
    if (!gl) return; /* repli CSS (dégradé de forge déjà en place) */

    var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";
    var FRAG = [
      "precision highp float;",
      "uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;",
      "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
      "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);",
      "float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));",
      "return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}",
      "float fbm(vec2 p){float v=0.0,a=0.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);",
      "for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=0.5;}return v;}",
      "void main(){",
      " vec2 uv=gl_FragCoord.xy/u_res.xy;",
      " vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;",
      " float t=u_time*0.05;",
      " vec2 mo=(u_mouse-0.5)*0.6;",
      " vec2 q=vec2(fbm(p*1.6+t),fbm(p*1.6+vec2(3.1,1.7)-t));",
      " vec2 r=vec2(fbm(p*1.6+q*1.8+mo+t*1.3),fbm(p*1.6+q*1.8+vec2(8.3,2.8)-mo));",
      " float f=fbm(p*1.7+r*2.0);",
      " f=pow(clamp(f,0.0,1.0),1.35);",
      " float veins=fbm(p*3.0+r*3.0-t*2.0);",
      " f+=0.18*pow(clamp(veins,0.0,1.0),3.0);",
      " vec3 c0=vec3(0.035,0.045,0.065);",
      " vec3 c1=vec3(0.24,0.11,0.045);",
      " vec3 c2=vec3(0.72,0.40,0.15);",
      " vec3 c3=vec3(1.0,0.55,0.20);",
      " vec3 c4=vec3(1.0,0.86,0.56);",
      " vec3 col=mix(c0,c1,smoothstep(0.15,0.45,f));",
      " col=mix(col,c2,smoothstep(0.42,0.68,f));",
      " col=mix(col,c3,smoothstep(0.66,0.82,f));",
      " col=mix(col,c4,smoothstep(0.83,0.98,f));",
      " vec2 fc=vec2(0.70,0.40);",           /* foyer de chaleur à droite */
      " float focal=1.0-smoothstep(0.15,1.05,length(uv-fc));",
      " col*=mix(0.35,1.15,focal);",
      " float glow=1.0-smoothstep(0.0,0.55,length(uv-(u_mouse*vec2(1.0,-1.0)+vec2(0.0,1.0))));",
      " col+=c3*glow*0.22*focal;",
      " float vig=1.0-smoothstep(0.6,1.5,length(uv-0.5));",
      " col*=mix(0.55,1.0,vig);",
      " col+=(hash(uv*u_time)-0.5)*0.02;",   /* grain fin */
      " gl_FragColor=vec4(col,1.0);",
      "}"
    ].join("\n");

    function compile(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return null; }
      return s;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, "u_res");
    var uTime = gl.getUniformLocation(prog, "u_time");
    var uMouse = gl.getUniformLocation(prog, "u_mouse");

    var scale = 0.8, dpr = Math.min(window.devicePixelRatio || 1, 1.3);
    function resize() {
      var w = Math.max(1, Math.floor(canvas.clientWidth * dpr * scale));
      var h = Math.max(1, Math.floor(canvas.clientHeight * dpr * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    }

    var mouse = [0.72, 0.42], mTarget = [0.72, 0.42];
    if (finePointer && !prefersReduced) {
      window.addEventListener("pointermove", function (e) {
        mTarget[0] = e.clientX / window.innerWidth;
        mTarget[1] = 1 - e.clientY / window.innerHeight;
      }, { passive: true });
    }

    var running = true, visible = true, started = false, startT = null, raf = 0;
    function frame(now) {
      raf = 0;
      if (!running || !visible) return;
      if (startT === null) startT = now;
      resize();
      mouse[0] += (mTarget[0] - mouse[0]) * 0.05;
      mouse[1] += (mTarget[1] - mouse[1]) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - startT) / 1000);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!started) { started = true; canvas.classList.add("is-live"); }
      if (!prefersReduced) raf = requestAnimationFrame(frame);
    }
    function loop() { if (!raf && running && visible) raf = requestAnimationFrame(frame); }

    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }, false);

    if ("IntersectionObserver" in window && cover) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible = en.isIntersecting; if (visible) loop(); });
      }, { threshold: 0 });
      vio.observe(cover);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) { running = false; } else { running = true; startT = null; loop(); } });

    if (prefersReduced) { resize(); startT = 0; frame(performance.now()); } /* une seule image figée */
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
})();
