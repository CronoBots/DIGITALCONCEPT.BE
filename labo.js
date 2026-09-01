/* =====================================================================
   Digital Concept — labo.js
   Cinq outils, un fichier. Chaque page déclare data-tool sur <body> ;
   le module correspondant s'initialise. Aucune dépendance, aucun appel
   réseau : tout tourne dans le navigateur du visiteur.
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var norm = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); };
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================================
     1. ESTIMATEUR — questionnaire → périmètre + planning (sans prix)
     ===================================================================== */
  function initEstimateur(root) {
    var STEPS = [
      { key: "type", q: "Quel type de projet avez-vous en tête ?", hint: "Un seul choix. « Je ne sais pas » est une réponse valable.", multi: false, choices: [
        { v: "vitrine", b: "Site vitrine", s: "Présenter votre activité, être trouvé, générer des demandes." },
        { v: "ecommerce", b: "Site e-commerce", s: "Vendre en ligne, gérer un catalogue et des paiements." },
        { v: "app", b: "Application mobile", s: "Une app iOS & Android publiée sur les stores." },
        { v: "ia", b: "Chatbot / IA", s: "Un assistant ou une automatisation branchée sur vos données." },
        { v: "bot", b: "Bot Telegram, Discord…", s: "Animer, modérer, automatiser une communauté." },
        { v: "surmesure", b: "Plateforme sur mesure", s: "Un outil métier, un espace membres, une API…" },
        { v: "inconnu", b: "Je ne sais pas encore", s: "On cadrera ensemble — l'estimation part sur un site vitrine." }
      ] },
      { key: "taille", q: "Quelle ampleur ?", hint: "Pages pour un site, écrans pour une app, cas d'usage pour un bot ou une IA.", multi: false, choices: [
        { v: "s", b: "Compact", s: "1 à 5 pages ou écrans — l'essentiel, bien fait." },
        { v: "m", b: "Standard", s: "6 à 15 pages ou écrans — plusieurs parcours." },
        { v: "l", b: "Étendu", s: "Plus de 15 — plusieurs profils d'utilisateurs, beaucoup de contenu." }
      ] },
      { key: "fonctions", q: "De quoi avez-vous besoin ?", hint: "Plusieurs choix possibles. Passez si rien ne s'applique.", multi: true, choices: [
        { v: "resa", b: "Réservation / rendez-vous", s: "Agenda, créneaux, confirmations." },
        { v: "paiement", b: "Paiement en ligne", s: "Carte, Bancontact, abonnements." },
        { v: "membres", b: "Espace membres", s: "Comptes, connexion, contenu réservé." },
        { v: "multilingue", b: "Multilingue", s: "FR / NL / EN ou plus." },
        { v: "blog", b: "Blog / actualités", s: "Un espace que vous alimentez vous-même." },
        { v: "api", b: "Connexion à un outil existant", s: "CRM, caisse, ERP, API tierce." },
        { v: "admin", b: "Espace d'administration", s: "Gérer vos contenus ou données sans moi." },
        { v: "seo", b: "Référencement local renforcé", s: "Pages par ville ou par métier." }
      ] },
      { key: "contenu", q: "Où en sont vos contenus ?", hint: "Textes, photos, logo, fiches produits… C'est souvent ce qui rythme un projet.", multi: false, choices: [
        { v: "pret", b: "Tout est prêt", s: "Textes écrits, visuels disponibles, identité définie." },
        { v: "partiel", b: "En partie", s: "J'ai une base, il manque des éléments." },
        { v: "rien", b: "Rien encore", s: "On part d'une page blanche." }
      ] },
      { key: "delai", q: "Quel horizon ?", hint: "Pour calibrer le planning, pas pour vous presser.", multi: false, choices: [
        { v: "urgent", b: "Le plus vite possible", s: "Une date qui approche." },
        { v: "normal", b: "Dans les 2 à 3 mois", s: "Un rythme de travail confortable." },
        { v: "souple", b: "Pas de contrainte", s: "On prend le temps de bien faire." }
      ] }
    ];
    var state = { step: 0, answers: { fonctions: [] } };
    var body = $("[data-est-body]", root);
    var progress = $("[data-est-progress]", root);

    function render() {
      progress.innerHTML = STEPS.map(function (_, i) { return '<span class="' + (i <= state.step ? "on" : "") + '"></span>'; }).join("");
      if (state.step >= STEPS.length) return renderResult();
      var st = STEPS[state.step];
      var cur = state.answers[st.key];
      body.innerHTML = "";
      body.appendChild(el("p", "est-q", esc(st.q)));
      body.appendChild(el("p", "est-hint", esc(st.hint)));
      var grid = el("div", "est-choices");
      st.choices.forEach(function (c) {
        var b = el("button", "est-choice", "<b>" + esc(c.b) + "</b><span>" + esc(c.s) + "</span>");
        b.type = "button";
        var on = st.multi ? (cur || []).indexOf(c.v) > -1 : cur === c.v;
        if (on) b.classList.add("is-on");
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.addEventListener("click", function () {
          if (st.multi) {
            var arr = state.answers[st.key] = (state.answers[st.key] || []).slice();
            var i = arr.indexOf(c.v); i > -1 ? arr.splice(i, 1) : arr.push(c.v);
            b.classList.toggle("is-on"); b.setAttribute("aria-pressed", b.classList.contains("is-on") ? "true" : "false");
          } else {
            state.answers[st.key] = c.v;
            $$(".est-choice", grid).forEach(function (x) { x.classList.remove("is-on"); x.setAttribute("aria-pressed", "false"); });
            b.classList.add("is-on"); b.setAttribute("aria-pressed", "true");
            setTimeout(next, prefersReduced ? 0 : 180);
          }
        });
        grid.appendChild(b);
      });
      body.appendChild(grid);
      var nav = el("div", "est-nav");
      var back = el("button", "lab-btn", "← Précédent"); back.type = "button"; back.disabled = state.step === 0;
      back.addEventListener("click", function () { state.step--; render(); });
      var fwd = el("button", "lab-btn is-on", st.multi ? "Continuer →" : "Passer →"); fwd.type = "button";
      fwd.addEventListener("click", next);
      nav.appendChild(back); nav.appendChild(fwd);
      body.appendChild(nav);
      $(".est-q", body).setAttribute("tabindex", "-1"); $(".est-q", body).focus({ preventScroll: true });
    }
    function next() { state.step++; render(); }

    function compute(a) {
      var type = a.type === "inconnu" ? "vitrine" : (a.type || "vitrine");
      var f = a.fonctions || [];
      var lots = [], flags = [];
      var w = { cadrage: 1, maquettes: 1, dev: 2, tests: 1, miseEnLigne: 0.5 };
      var names = { vitrine: "Site vitrine", ecommerce: "Site e-commerce", app: "Application mobile iOS & Android", ia: "Assistant IA / automatisation", bot: "Bot de communauté", surmesure: "Plateforme sur mesure" };
      lots.push({ b: "Socle", s: names[type] + " — design sur mesure, structure, mise en ligne." });
      if (type === "ecommerce") { w.dev += 2; w.tests += 0.5; lots.push({ b: "Boutique", s: "Catalogue, panier, tunnel de commande, gestion des commandes." }); }
      if (type === "app") { w.maquettes += 1; w.dev += 3; w.tests += 1; w.miseEnLigne += 1; lots.push({ b: "Stores", s: "Comptes développeur, fiches App Store & Google Play, validation." }); }
      if (type === "ia") { w.cadrage += 0.5; w.dev += 1.5; lots.push({ b: "Connaissance", s: "Connexion de l'assistant à vos contenus (site, documents, FAQ)." }); }
      if (type === "bot") { w.maquettes -= 0.5; w.dev += 0.5; lots.push({ b: "Automatisations", s: "Commandes, accueil, modération, réponses automatiques." }); }
      if (type === "surmesure") { w.cadrage += 1; w.maquettes += 0.5; w.dev += 3; w.tests += 1; lots.push({ b: "Cadrage", s: "Cahier des charges fonctionnel écrit et validé avant le développement." }); }
      var size = { s: 0, m: 1, l: 2.5 }[a.taille || "s"];
      w.maquettes += size * 0.4; w.dev += size; w.tests += size * 0.3;
      if (a.taille === "l") flags.push("Un projet étendu se livre mieux par étapes : une première version utile, puis des ajouts.");
      var F = {
        resa: { b: "Réservation", s: "Agenda, créneaux, confirmations et rappels.", dev: 1 },
        paiement: { b: "Paiement", s: "Intégration d'un prestataire de paiement (carte, Bancontact).", dev: 1, tests: 0.5 },
        membres: { b: "Espace membres", s: "Comptes, connexion sécurisée, contenu réservé.", dev: 1.5, tests: 0.5 },
        multilingue: { b: "Multilingue", s: "Une URL par langue, balisage hreflang, contenus traduits.", dev: 0.7, flag: "Le multilingue multiplie les contenus à fournir : prévoyez la traduction en amont." },
        blog: { b: "Blog", s: "Espace éditorial que vous alimentez sans moi.", dev: 0.7 },
        api: { b: "Intégration", s: "Connexion à votre outil existant (CRM, caisse, ERP…).", dev: 1, cadrage: 0.5, flag: "Une intégration dépend de l'API de votre outil : on vérifie sa documentation dès le cadrage." },
        admin: { b: "Administration", s: "Interface pour gérer vos contenus ou vos données.", dev: 1.2 },
        seo: { b: "SEO local", s: "Pages par ville ou par métier, données structurées, fiche Google.", dev: 0.8 }
      };
      f.forEach(function (k) { var x = F[k]; if (!x) return; lots.push({ b: x.b, s: x.s }); w.dev += x.dev || 0; w.tests += x.tests || 0; w.cadrage += x.cadrage || 0; if (x.flag) flags.push(x.flag); });
      if (a.contenu === "rien") { w.cadrage += 1; flags.push("Sans contenus, le planning dépend surtout de vous : je peux structurer et rédiger avec vous, mais la matière doit venir de votre activité."); }
      if (a.contenu === "partiel") { w.cadrage += 0.5; flags.push("Listez dès maintenant ce qui manque (textes, photos, logo) : c'est ce qui bloque le plus souvent."); }
      if (a.delai === "urgent") flags.push("Délai serré : on réduit le périmètre de la première version plutôt que la qualité, puis on complète.");
      if (a.delai === "souple") flags.push("Pas de contrainte : on peut étaler les points de validation, mais un jalon clair par étape reste la meilleure garantie.");
      if (a.type === "inconnu") flags.push("Vous ne savez pas encore : c'est précisément ce que règle le premier échange, gratuit. L'estimation ci-dessous suppose un site vitrine.");
      var round = function (x) { return Math.max(0.5, Math.round(x * 2) / 2); };
      var tl = [
        { n: "Cadrage", w: round(w.cadrage) }, { n: "Maquettes", w: round(w.maquettes) },
        { n: "Développement", w: round(w.dev) }, { n: "Tests & retours", w: round(w.tests) }, { n: "Mise en ligne", w: round(w.miseEnLigne) }
      ];
      var total = tl.reduce(function (s, x) { return s + x.w; }, 0);
      return { name: names[type], lots: lots, tl: tl, total: total, flags: flags };
    }

    function fmtW(x) { return x === 0.5 ? "½ sem." : (x % 1 === 0 ? x + " sem." : Math.floor(x) + "½ sem."); }
    function renderResult() {
      var r = compute(state.answers);
      body.innerHTML = "";
      var wrap = el("div", "est-result");
      wrap.appendChild(el("p", "est-q", "Votre périmètre, en clair."));
      wrap.appendChild(el("p", "est-hint", "Estimation indicative, calculée dans votre navigateur. Le vrai planning se fixe après un échange — et il est tenu."));
      wrap.appendChild(el("h3", null, "Les lots"));
      var ul = el("ul", "est-lots");
      r.lots.forEach(function (l) { ul.appendChild(el("li", null, "<b>" + esc(l.b) + "</b><span>" + esc(l.s) + "</span>")); });
      wrap.appendChild(ul);
      wrap.appendChild(el("h3", null, "Le planning indicatif"));
      var max = Math.max.apply(null, r.tl.map(function (x) { return x.w; }));
      var ol = el("ul", "est-timeline");
      r.tl.forEach(function (x) { ol.appendChild(el("li", null, "<span>" + esc(x.n) + "</span><span class=\"bar\" style=\"width:" + Math.round(x.w / max * 100) + "%\"></span><span class=\"w\">" + fmtW(x.w) + "</span>")); });
      wrap.appendChild(ol);
      wrap.appendChild(el("p", "est-total", "≈ " + fmtW(r.total) + " de travail effectif, hors temps de validation de votre côté."));
      if (r.flags.length) { wrap.appendChild(el("h3", null, "Points de vigilance")); var fl = el("ul", "est-flags"); r.flags.forEach(function (f) { fl.appendChild(el("li", null, esc(f))); }); wrap.appendChild(fl); }
      wrap.appendChild(el("h3", null, "Le résumé à m'envoyer"));
      var txt = summary(r);
      var ta = el("textarea", "est-summary"); ta.value = txt; ta.readOnly = true; ta.setAttribute("aria-label", "Résumé du périmètre");
      wrap.appendChild(ta);
      var acts = el("div", "lab-actions");
      var send = el("a", "btn btn-primary", "Envoyer ce périmètre →"); send.href = "index.html?projet=" + encodeURIComponent(txt) + "&type=" + encodeURIComponent(r.name) + "#commande";
      var copy = el("button", "lab-btn", "Copier"); copy.type = "button";
      copy.addEventListener("click", function () { var done = function () { copy.textContent = "Copié ✓"; setTimeout(function () { copy.textContent = "Copier"; }, 1800); }; if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { ta.select(); document.execCommand("copy"); done(); }); else { ta.select(); document.execCommand("copy"); done(); } });
      var redo = el("button", "lab-btn", "Recommencer"); redo.type = "button";
      redo.addEventListener("click", function () { state = { step: 0, answers: { fonctions: [] } }; render(); });
      acts.appendChild(send); acts.appendChild(copy); acts.appendChild(redo);
      wrap.appendChild(acts);
      body.appendChild(wrap);
      $(".est-q", body).setAttribute("tabindex", "-1"); $(".est-q", body).focus({ preventScroll: true });
    }
    function summary(r) {
      var a = state.answers;
      var lab = function (key, v) { var st = STEPS.filter(function (s) { return s.key === key; })[0]; var c = st && st.choices.filter(function (c) { return c.v === v; })[0]; return c ? c.b : "—"; };
      var lines = ["Projet : " + r.name, "Ampleur : " + lab("taille", a.taille), "Besoins : " + ((a.fonctions || []).map(function (v) { return lab("fonctions", v); }).join(", ") || "—"), "Contenus : " + lab("contenu", a.contenu), "Horizon : " + lab("delai", a.delai), "", "Lots : " + r.lots.map(function (l) { return l.b; }).join(" · "), "Planning indicatif : ≈ " + fmtW(r.total) + " (" + r.tl.map(function (x) { return x.n.toLowerCase() + " " + fmtW(x.w); }).join(", ") + ")"];
      return lines.join("\n");
    }
    render();
  }

  /* =====================================================================
     2. ASSISTANT — moteur de réponse local (aucune IA générative ici)
     ===================================================================== */
  function initAssistant(root) {
    var KB = [
      { k: "bonjour salut hello bonsoir coucou hey", a: "Bonjour ! Je suis l'assistant de démonstration de Digital Concept. Posez-moi une question sur les services, les délais, la façon de travailler ou le contact — je réponds à partir du contenu du site." },
      { k: "service services proposez faites quoi offre offrez competence competences", a: "Digital Concept conçoit et développe sur mesure : sites web (vitrine, e-commerce, refonte), applications mobiles iOS & Android, chatbots et automatisations IA, tokens et smart contracts, bots Telegram / Discord / WhatsApp, et des plateformes sur mesure. Un seul artisan, du premier échange à la mise en ligne." },
      { k: "site web vitrine ecommerce e commerce boutique refonte wordpress", a: "Pour un site web, tout est dessiné et développé sur mesure — aucun thème acheté. Sites vitrines, e-commerce, refontes. Rapides, impeccables sur mobile, avec les bases SEO dès le départ. Détails : <a href=\"creation-site-web-liege.html\">création de site web à Liège</a>." },
      { k: "application app mobile ios android store apple play", a: "Une application mobile est développée à partir d'une seule base de code pour iOS et Android, publiée sur l'App Store et Google Play — publication comprise. On commence toujours par vérifier honnêtement qu'une app est la bonne réponse. Voir <a href=\"creation-application-mobile-belgique.html\">application mobile</a>." },
      { k: "ia intelligence artificielle chatbot assistant automatisation gpt automatiser", a: "Côté IA : chatbots de site connectés à vos contenus, assistants internes, automatisations (tri d'e-mails, saisie CRM, documents). L'objectif est de faire gagner du temps réel, pas d'ajouter un gadget. Voir <a href=\"chatbot-ia-pme-belgique.html\">chatbot IA pour PME</a>." },
      { k: "crypto token blockchain smart contract nft web3 ethereum", a: "Crypto & blockchain : création de tokens, smart contracts, dashboards, intégrations Web3 — avec sécurité et audit à chaque étape. Voir <a href=\"creation-token-crypto-belgique.html\">token & smart contract</a>." },
      { k: "bot telegram discord whatsapp instagram communaute moderation", a: "Les bots Telegram, Discord, WhatsApp et Instagram animent, modèrent et font grandir une communauté 24 h/24 : accueil, commandes, anti-spam, réponses automatiques. Vous pouvez en <a href=\"labo-bot-telegram.html\">tester un simulateur</a> dans le Labo." },
      { k: "prix tarif cout combien budget devis cher euros", a: "Il n'y a pas de grille tarifaire : un site vitrine et une plateforme sur mesure ne jouent pas dans la même cour. Après un premier échange, vous recevez un devis clair, détaillé et gratuit, sans engagement — et le prix convenu ne bouge plus. L'<a href=\"labo-estimateur.html\">estimateur</a> vous donne déjà un périmètre et un planning." },
      { k: "delai temps duree combien de temps livraison rapide vite quand", a: "Un site vitrine : de quelques jours à deux semaines. Une application ou un outil sur mesure : quelques semaines. Vous avez un planning précis dès le départ, et il est tenu." },
      { k: "technique jargon comprends comprendre pas technique novice debutant", a: "Vous n'avez pas besoin d'être technique : c'est le rôle de Vincent de traduire la technique en langage clair, de vous guider et de s'occuper de tout. Vous décidez, sans être noyé sous le jargon." },
      { k: "maintenance hebergement suivi apres mise en ligne mise a jour securite domaine", a: "Après la mise en ligne, Vincent reste votre interlocuteur : hébergement, nom de domaine, mises à jour, sauvegardes, corrections et évolutions, avec une formule adaptée à votre usage." },
      { k: "ou situe adresse liege neupre belgique bruxelles distance region local", a: "Digital Concept est basé à Neupré, à deux pas de Liège (rue Chapéchêne 10, 4120 Neupré). Les projets se font partout en Belgique et à distance, avec des points réguliers en visio." },
      { k: "contact contacter telephone appeler mail email whatsapp joindre rendez vous", a: "Le plus simple : le <a href=\"index.html#commande\">formulaire</a> (réponse sous 24 h), le téléphone au <a href=\"tel:+32460962146\">0460 96 21 46</a>, ou <a href=\"https://wa.me/32460962146\" target=\"_blank\" rel=\"noopener\">WhatsApp</a>." },
      { k: "qui vincent artisan seul agence equipe experience ans fondateur", a: "Derrière Digital Concept, une seule personne : Vincent Buron, plus de 25 ans à concevoir des sites, des applications et des systèmes sur mesure. Pas d'intermédiaire, pas de projet délégué à un junior : il pense, dessine et code lui-même." },
      { k: "seo referencement google trouver visible position", a: "Chaque site est construit avec des bases SEO solides : structure propre, performance mobile, données structurées et référencement local. Le site que vous lisez en est l'exemple : zéro requête tierce, Core Web Vitals au vert." },
      { k: "rgpd donnees confidentialite cookies vie privee", a: "La confidentialité est prise en compte dès la conception. Ce site, par exemple, ne charge aucune ressource tierce et ne dépose aucun cookie de traçage. Pour vos projets, hébergement et traitements sont pensés pour respecter le RGPD." },
      { k: "demo demonstration comment marche fonctionne vrai ia reel", a: "Cette démo tourne entièrement dans votre navigateur : un moteur de correspondance sur le contenu du site, sans IA générative ni serveur. En production, le même écran est branché sur un vrai modèle de langage, connecté à vos documents, avec vos règles." },
      { k: "merci super parfait genial top", a: "Avec plaisir. Si vous voulez aller plus loin, décrivez votre projet en deux lignes via le <a href=\"index.html#commande\">formulaire</a> — Vincent répond sous 24 h." }
    ].map(function (x) { x.keys = norm(x.k).split(" "); return x; });
    var SYN = { "app": "application", "appli": "application", "tel": "telephone", "mail": "email", "cout": "prix", "tarifs": "prix", "couts": "prix", "temps": "delai", "delais": "delai", "duree": "delai", "sites": "site", "bots": "bot", "chatbots": "chatbot", "tokens": "token" };
    var FALLBACK = ["Je n'ai pas cette information dans le site. Le plus sûr est de poser la question directement à Vincent via le <a href=\"index.html#commande\">formulaire</a> — réponse sous 24 h.", "Je ne suis pas certain de comprendre. Essayez « quels services », « délais », « maintenance » ou « contact », ou écrivez directement à Vincent via le <a href=\"index.html#commande\">formulaire</a>."];
    var CHIPS = ["Quels services ?", "Quels délais ?", "Et après la mise en ligne ?", "Où êtes-vous ?", "Cette démo, c'est une vraie IA ?"];

    var log = $("[data-chat-log]", root), form = $("[data-chat-form]", root), input = $("input", form), chips = $("[data-chat-chips]", root);
    function push(role, html) { var m = el("div", "chat__msg chat__msg--" + role); m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
    function answer(q) {
      var words = norm(q).split(" ").filter(Boolean).map(function (w) { return SYN[w] || w; });
      var best = null, bestScore = 0;
      KB.forEach(function (x) {
        var score = 0;
        words.forEach(function (w) { if (w.length < 3) return; x.keys.forEach(function (k) { if (k === w) score += 2; else if (k.length > 4 && (k.indexOf(w) === 0 || w.indexOf(k) === 0)) score += 1; }); });
        if (score > bestScore) { bestScore = score; best = x; }
      });
      return bestScore >= 2 ? best.a : FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    }
    function ask(q) {
      q = q.trim(); if (!q) return;
      push("user", esc(q)); input.value = "";
      var t = el("div", "chat__typing", "<i></i><i></i><i></i>"); log.appendChild(t); log.scrollTop = log.scrollHeight;
      setTimeout(function () { t.remove(); push("bot", answer(q)); }, prefersReduced ? 0 : 450 + Math.min(900, q.length * 20));
    }
    form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
    CHIPS.forEach(function (c) { var b = el("button", null, esc(c)); b.type = "button"; b.addEventListener("click", function () { ask(c); }); chips.appendChild(b); });
    push("bot", "Bonjour ! Je réponds à partir du contenu de ce site — services, délais, façon de travailler, contact. Qu'est-ce qui vous amène ?");
  }

  /* =====================================================================
     3. BOT TELEGRAM — simulateur de communauté (commandes, accueil, modération)
     ===================================================================== */
  function initTelegram(root) {
    var log = $("[data-tg-log]", root), form = $("[data-tg-form]", root), input = $("input", form);
    var stats = { members: 128, msgs: 0, deleted: 0, welcomed: 0 };
    var BAD = ["arnaque", "casino", "crypto gratuit", "gagnez", "idiot"];
    var names = ["Léa", "Mehdi", "Sofia", "Tom", "Inès", "Noah"];
    var now = function () { var d = new Date(); return (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes(); };
    function msg(kind, who, html) {
      var m = el("div", "tg__m tg__m--" + kind); m.innerHTML = (who ? "<span class=\"who\">" + esc(who) + "</span>" : "") + html + (kind !== "sys" ? "<span class=\"t\">" + now() + "</span>" : "");
      log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
    }
    function bot(html, delay) { setTimeout(function () { msg("bot", "DC Bot", html); }, prefersReduced ? 0 : (delay || 350)); }
    function sys(t) { msg("sys", null, esc(t)); }
    function refresh() { $("[data-tg-members]", root).textContent = stats.members; $("[data-tg-msgs]", root).textContent = stats.msgs; $("[data-tg-deleted]", root).textContent = stats.deleted; $("[data-tg-welcomed]", root).textContent = stats.welcomed; }
    var CMDS = {
      "/start": function () { bot("Bienvenue sur la communauté de démonstration ! Tapez <code>/help</code> pour voir ce que je sais faire."); },
      "/help": function () { bot("Commandes disponibles :<br><code>/regles</code> — les règles du groupe<br><code>/faq</code> — questions fréquentes<br><code>/horaires</code> — disponibilités<br><code>/contact</code> — joindre Vincent<br><code>/stats</code> — activité du groupe<br>Je supprime aussi les liens des nouveaux membres et les messages contraires aux règles."); },
      "/regles": function () { bot("Règles du groupe :<br>1. Respect entre membres.<br>2. Pas de publicité ni de lien sans autorisation.<br>3. Les questions techniques vont dans le sujet dédié.<br>Trois avertissements = exclusion automatique."); },
      "/faq": function () { bot("Questions fréquentes :<br>• <b>Délais ?</b> Site vitrine : quelques jours à deux semaines. Sur mesure : quelques semaines.<br>• <b>Prix ?</b> Sur devis gratuit, sous 24 h.<br>• <b>Suivi ?</b> Hébergement, maintenance et évolutions assurés dans la durée."); },
      "/horaires": function () { bot("Vincent répond du lundi au vendredi, généralement sous 24 h. En urgence : WhatsApp au 0460 96 21 46."); },
      "/contact": function () { bot("Pour parler d'un projet : <a href=\"index.html#commande\">le formulaire</a>, le 0460 96 21 46, ou WhatsApp. Réponse sous 24 h."); },
      "/stats": function () { bot("Activité : " + stats.members + " membres · " + stats.msgs + " messages dans cette session · " + stats.deleted + " supprimé(s) · " + stats.welcomed + " accueilli(s)."); }
    };
    function handle(text, who, isNew) {
      var m = msg(who ? "in" : "out", who || "Vous", esc(text)); stats.msgs++; refresh();
      var low = norm(text);
      var bad = BAD.filter(function (b) { return low.indexOf(norm(b)) > -1; })[0];
      var link = /https?:\/\/|www\.|\.(com|be|fr|io)\b/i.test(text);
      if (bad || (link && isNew)) {
        setTimeout(function () { m.classList.add("tg__m--del"); stats.deleted++; refresh(); sys("Message supprimé par DC Bot"); bot(bad ? "@" + (who || "vous") + " ce message enfreint la règle 1 (« " + esc(bad) + " »). Avertissement 1/3." : "@" + (who || "vous") + " les liens ne sont pas autorisés pour les nouveaux membres. Le message a été retiré — pas d'avertissement cette fois."); }, prefersReduced ? 0 : 500);
        return;
      }
      if (text.charAt(0) === "/") { var c = text.split(" ")[0].toLowerCase(); (CMDS[c] || function () { bot("Commande inconnue : <code>" + esc(c) + "</code>. Tapez <code>/help</code>."); })(); return; }
      if (/delai|combien de temps|quand/.test(low)) bot("Pour les délais, voyez <code>/faq</code> — ou décrivez votre projet, Vincent répond sous 24 h.");
      else if (/prix|tarif|cout|budget/.test(low)) bot("Les prix se font sur devis gratuit, sous 24 h. <code>/contact</code> pour le joindre.");
      else if (/bonjour|salut|hello/.test(low)) bot("Bonjour " + esc(who || "") + " ! Tapez <code>/help</code> pour voir ce que je peux faire.");
    }
    form.addEventListener("submit", function (e) { e.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t, null, false); });
    $$("[data-tg-cmd]", root).forEach(function (b) { b.addEventListener("click", function () { handle(b.getAttribute("data-tg-cmd"), null, false); }); });
    $("[data-tg-join]", root).addEventListener("click", function () {
      var n = names[Math.floor(Math.random() * names.length)]; stats.members++; stats.welcomed++; refresh();
      sys(n + " a rejoint le groupe");
      bot("Bienvenue " + esc(n) + " ! Présente-toi en deux mots, et jette un œil à <code>/regles</code>. Les liens sont bloqués pendant tes premières 24 h — c'est notre anti-spam.");
      setTimeout(function () { handle("Salut tout le monde ! Regardez mon site www.super-promo.com", n, true); }, prefersReduced ? 0 : 1600);
    });
    $("[data-tg-spam]", root).addEventListener("click", function () { var n = names[Math.floor(Math.random() * names.length)]; handle("Crypto gratuit ici, gagnez 500 € par jour !!!", n, false); });
    $("[data-tg-question]", root).addEventListener("click", function () { var n = names[Math.floor(Math.random() * names.length)]; handle("Bonjour, c'est quoi les délais pour un site ?", n, false); });
    refresh();
    sys("Simulation locale — aucun message ne quitte votre navigateur");
    bot("Bot en ligne. Tapez <code>/help</code>, ou déclenchez un événement à droite.", 200);
  }

  /* =====================================================================
     4. PLAYGROUND — éditeur HTML / CSS / JS + rendu live isolé
     ===================================================================== */
  function initPlayground(root) {
    var PRESETS = {
      bouton: { n: "Bouton magnétique", html: "<button class=\"btn\" id=\"b\">Survolez-moi</button>", css: "body{display:grid;place-items:center;min-height:100vh;margin:0;background:#0B0B16;font-family:system-ui}\n.btn{padding:.9rem 1.6rem;border:0;border-radius:999px;font-size:1rem;font-weight:600;color:#14100a;\n  background:linear-gradient(135deg,#C4B5FD,#8B7CFF);cursor:pointer;transition:transform .15s;\n  box-shadow:0 18px 40px -18px rgba(139,124,255,.8)}", js: "const b=document.getElementById('b');\nb.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();\n  const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;\n  b.style.transform=`translate(${x*.25}px,${y*.25}px)`;});\nb.addEventListener('mouseleave',()=>b.style.transform='');\nb.addEventListener('click',()=>console.log('Clic !', new Date().toLocaleTimeString()));" },
      carte: { n: "Carte produit", html: "<article class=\"card\">\n  <span class=\"tag\">Nouveau</span>\n  <h2>Lampe Nord</h2>\n  <p>Chêne massif, LED chaude, variateur tactile.</p>\n  <button>Ajouter au panier</button>\n</article>", css: "body{display:grid;place-items:center;min-height:100vh;margin:0;background:#f4f1ea;font-family:system-ui}\n.card{width:260px;padding:1.4rem;border-radius:18px;background:#fff;box-shadow:0 20px 50px -20px rgba(0,0,0,.25);position:relative}\n.tag{position:absolute;top:1rem;right:1rem;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:#6366F1}\nh2{margin:.2rem 0 .4rem;font-size:1.4rem}\np{color:#666;line-height:1.5;margin:0 0 1rem}\nbutton{width:100%;padding:.8rem;border:0;border-radius:10px;background:#0B0B16;color:#fff;font-weight:600;cursor:pointer}", js: "document.querySelector('button').onclick=e=>{e.target.textContent='Ajouté ✓';console.log('Panier : 1 article');};" },
      formulaire: { n: "Formulaire validé", html: "<form id=\"f\" novalidate>\n  <label>E-mail <input name=\"email\" type=\"email\" placeholder=\"vous@exemple.be\"></label>\n  <label>Message <textarea name=\"msg\" rows=\"3\"></textarea></label>\n  <button>Envoyer</button>\n  <p id=\"out\"></p>\n</form>", css: "body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B0B16;color:#F2EEE6;font-family:system-ui}\nform{width:300px;display:grid;gap:.9rem}label{display:grid;gap:.3rem;font-size:.85rem;color:#9AA2B4}\ninput,textarea{padding:.6rem;border-radius:8px;border:1px solid #333;background:#12161F;color:#fff;font:inherit}\ninput.bad{border-color:#E5534B}button{padding:.7rem;border:0;border-radius:8px;background:#8B7CFF;color:#14100a;font-weight:600}\n#out{margin:0;font-size:.9rem;color:#A99CFF}", js: "const f=document.getElementById('f'), out=document.getElementById('out');\nf.addEventListener('submit',e=>{e.preventDefault();\n  const email=f.email.value.trim(), ok=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n  f.email.classList.toggle('bad',!ok);\n  out.textContent= ok ? `Merci, message envoyé à ${email}` : 'Adresse e-mail invalide';\n  console[ok?'log':'warn'](ok?'Formulaire valide':'E-mail invalide :', email);});" },
      canvas: { n: "Particules (canvas)", html: "<canvas id=\"c\"></canvas>", css: "body{margin:0;background:#0B0B16;overflow:hidden}canvas{display:block;width:100vw;height:100vh}", js: "const c=document.getElementById('c'),x=c.getContext('2d');\nconst R=()=>{c.width=innerWidth;c.height=innerHeight};R();addEventListener('resize',R);\nconst P=Array.from({length:60},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6}));\n(function loop(){x.fillStyle='rgba(11,11,22,.35)';x.fillRect(0,0,c.width,c.height);\n  for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>c.width)p.vx*=-1;if(p.y<0||p.y>c.height)p.vy*=-1;}\n  x.strokeStyle='rgba(139,124,255,.25)';\n  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);\n    if(d<110){x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke();}}\n  x.fillStyle='#C4B5FD';for(const p of P){x.beginPath();x.arc(p.x,p.y,2,0,7);x.fill();}\n  requestAnimationFrame(loop);})();" }
    };
    var ta = { html: $("[data-pg=html]", root), css: $("[data-pg=css]", root), js: $("[data-pg=js]", root) };
    var frame = $("[data-pg-frame]", root), cons = $("[data-pg-console]", root), tabs = $$("[data-pg-tab]", root);
    var BRIDGE = "<script>(function(){var s=function(t,a){try{parent.postMessage({pg:1,t:t,m:Array.prototype.map.call(a,function(x){try{return typeof x==='object'?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(' ')},'*')}catch(e){}};['log','info','warn','error'].forEach(function(k){var o=console[k];console[k]=function(){s(k,arguments);o&&o.apply(console,arguments)}});window.onerror=function(m,u,l){s('error',[m+' (ligne '+l+')'])};})();<\/script>";
    var timer;
    function run() {
      cons.innerHTML = "";
      var doc = "<!doctype html><html><head><meta charset=utf-8>" + BRIDGE + "<style>" + ta.css.value + "</style></head><body>" + ta.html.value + "<script>" + ta.js.value.replace(/<\/script/gi, "<\\/script") + "<\/script></body></html>";
      frame.srcdoc = doc;
    }
    function schedule() { clearTimeout(timer); timer = setTimeout(run, 350); }
    window.addEventListener("message", function (e) { var d = e.data; if (!d || d.pg !== 1) return; var line = el("div", d.t === "error" ? "err" : d.t === "warn" ? "warn" : null, esc(d.m)); cons.appendChild(line); cons.scrollTop = cons.scrollHeight; });
    Object.keys(ta).forEach(function (k) {
      ta[k].addEventListener("input", schedule);
      ta[k].addEventListener("keydown", function (e) { if (e.key === "Tab") { e.preventDefault(); var s = ta[k].selectionStart, en = ta[k].selectionEnd; ta[k].value = ta[k].value.slice(0, s) + "  " + ta[k].value.slice(en); ta[k].selectionStart = ta[k].selectionEnd = s + 2; schedule(); } });
    });
    tabs.forEach(function (t) { t.addEventListener("click", function () { tabs.forEach(function (x) { x.setAttribute("aria-selected", "false"); }); t.setAttribute("aria-selected", "true"); Object.keys(ta).forEach(function (k) { ta[k].classList.toggle("is-on", k === t.getAttribute("data-pg-tab")); }); ta[t.getAttribute("data-pg-tab")].focus(); }); });
    function load(key) { var p = PRESETS[key]; ta.html.value = p.html; ta.css.value = p.css; ta.js.value = p.js; run(); $$("[data-pg-preset]", root).forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-pg-preset") === key); }); }
    $$("[data-pg-preset]", root).forEach(function (b) { b.addEventListener("click", function () { load(b.getAttribute("data-pg-preset")); }); });
    $("[data-pg-run]", root).addEventListener("click", run);
    $("[data-pg-clear]", root).addEventListener("click", function () { ta.html.value = "<h1>Bonjour</h1>"; ta.css.value = "body{font-family:system-ui;padding:2rem}"; ta.js.value = "console.log('Prêt.');"; run(); $$("[data-pg-preset]", root).forEach(function (b) { b.classList.remove("is-on"); }); });
    load("bouton");
  }

  /* =====================================================================
     5. COMPARATEUR — vitrine / e-commerce / app / sur mesure, sans prix
     ===================================================================== */
  function initComparateur(root) {
    var D = {
      vitrine: { n: "Site vitrine", pour: "Présenter clairement votre activité, être trouvé sur Google, transformer un visiteur en demande de contact.", delai: "Quelques jours à deux semaines", inclus: ["Design sur mesure, aucun thème acheté", "Pages métier et pages locales si utile", "Formulaire, téléphone, WhatsApp, itinéraire", "Bases SEO : structure, performance, données structurées", "Hébergement, domaine et certificat pris en charge"], fournir: ["Vos textes ou de la matière pour les écrire ensemble", "Photos et logo (ou on les crée)", "Une liste de vos services et de vos clients types"], maintenance: "Légère : mises à jour de contenu à la demande, surveillance, sauvegardes.", oui: "Vous vendez un service, un savoir-faire, un lieu. La demande de contact est l'objectif.", non: "Vous devez vendre des produits en ligne ou gérer des comptes clients : partez sur un e-commerce ou une plateforme." },
      ecommerce: { n: "Site e-commerce", pour: "Vendre en ligne, 24 h/24, avec un catalogue, un panier, des paiements et un suivi des commandes.", delai: "Trois à six semaines selon le catalogue", inclus: ["Tout le site vitrine", "Catalogue, variantes, stock", "Panier, tunnel de commande, paiement (carte, Bancontact)", "E-mails de confirmation, suivi de commande", "Espace de gestion des commandes et produits"], fournir: ["Fiches produits : titres, descriptions, prix, photos", "Conditions de vente et de livraison", "Un compte chez un prestataire de paiement"], maintenance: "Régulière : sécurité, prestataire de paiement, évolutions du catalogue.", oui: "Vous avez des produits identifiés, un stock ou un fournisseur, et le temps de gérer les commandes.", non: "Vous n'avez que quelques produits ou des ventes rares : une page de commande simple sur un site vitrine suffit souvent." },
      app: { n: "Application mobile", pour: "Être dans la poche de vos clients : notifications, usage fréquent, fonctions hors connexion, appareil photo, géolocalisation.", delai: "Quelques semaines pour une première version", inclus: ["Une base de code, deux applications natives (iOS & Android)", "Maquettes validées sur votre propre téléphone", "Publication sur l'App Store et Google Play", "Connexion à votre site ou vos outils si besoin", "Mises à jour pour les nouvelles versions d'iOS et d'Android"], fournir: ["Un cas d'usage précis : qui l'ouvre, quand, pour quoi faire", "Comptes développeur Apple et Google (je les crée avec vous)", "Contenus et règles métier"], maintenance: "Indispensable : les systèmes évoluent chaque année, une app non maintenue finit retirée des stores.", oui: "Vos clients reviennent souvent, ont besoin de notifications ou d'un usage hors ligne.", non: "Un usage occasionnel ou de la consultation d'information : un site web bien fait rend le même service, sans installation." },
      surmesure: { n: "Plateforme sur mesure", pour: "Un outil qui n'existe pas sur étagère : espace membres, outil métier, tableau de bord, API, automatisation.", delai: "Un à trois mois, par versions", inclus: ["Cahier des charges fonctionnel écrit et validé", "Architecture pensée pour évoluer", "Comptes utilisateurs, rôles, sécurité", "Interfaces d'administration", "Documentation et formation à l'usage"], fournir: ["Une description précise du processus actuel (même sur papier)", "Les règles métier et les cas particuliers", "Un interlocuteur disponible pour valider chaque étape"], maintenance: "Continue : c'est un logiciel, il vit avec votre activité.", oui: "Votre besoin est spécifique et vous perdez du temps ou de l'argent avec des outils inadaptés.", non: "Un outil existant couvre 90 % du besoin : on l'intègre plutôt que de le réécrire." }
    };
    var tabs = $$("[data-cmp-tab]", root), grid = $("[data-cmp-grid]", root);
    function show(key) {
      var d = D[key];
      tabs.forEach(function (t) { var on = t.getAttribute("data-cmp-tab") === key; t.classList.toggle("is-on", on); t.setAttribute("aria-selected", on ? "true" : "false"); });
      var li = function (arr) { return "<ul>" + arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; };
      grid.innerHTML = "<div class=\"cmp__cell\"><h3>À quoi ça sert</h3><p>" + esc(d.pour) + "</p></div>"
        + "<div class=\"cmp__cell\"><h3>Délai typique</h3><p class=\"big\">" + esc(d.delai) + "</p><p>Planning précis fixé au devis, et tenu.</p></div>"
        + "<div class=\"cmp__cell\"><h3>Ce qui est compris</h3>" + li(d.inclus) + "</div>"
        + "<div class=\"cmp__cell\"><h3>Ce que vous apportez</h3>" + li(d.fournir) + "</div>"
        + "<div class=\"cmp__cell\"><h3>Après la mise en ligne</h3><p>" + esc(d.maintenance) + "</p></div>"
        + "<div class=\"cmp__cell\"><h3>Le bon choix si…</h3><p>" + esc(d.oui) + "</p></div>"
        + "<div class=\"cmp__cell warn\"><h3>Pas le bon choix si…</h3><p>" + esc(d.non) + "</p></div>";
    }
    tabs.forEach(function (t) { t.addEventListener("click", function () { show(t.getAttribute("data-cmp-tab")); }); });
    show("vitrine");

    // Guide : trois questions → une recommandation
    var g = { vendre: null, frequence: null, specifique: null };
    var verdict = $("[data-cmp-verdict]", root);
    $$("[data-cmp-q]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        var q = b.getAttribute("data-cmp-q"), v = b.getAttribute("data-cmp-v"); g[q] = v;
        $$("[data-cmp-q=" + q + "]", root).forEach(function (x) { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        if (g.vendre && g.frequence && g.specifique) {
          var key = g.specifique === "oui" ? "surmesure" : g.vendre === "produits" ? "ecommerce" : g.frequence === "souvent" ? "app" : "vitrine";
          var why = { vitrine: "vous vendez un service et vos clients viennent ponctuellement : un site vitrine soigné fait le travail, sans installation ni maintenance lourde.", ecommerce: "vous vendez des produits : il faut un catalogue, un panier et des paiements — c'est un e-commerce.", app: "vos clients reviennent souvent : une application mobile justifie son installation par les notifications et l'usage rapide.", surmesure: "votre besoin est spécifique : on cadre un outil sur mesure, en commençant par une première version utile." }[key];
          verdict.innerHTML = "Ma recommandation : <b>" + esc(D[key].n) + "</b> — " + esc(why) + " <a href=\"index.html#commande\">On en parle ?</a>";
          verdict.hidden = false; show(key); verdict.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
        }
      });
    });
  }

  /* ---- Démarrage ---- */
  var tool = document.body.getAttribute("data-tool"), root = $("[data-tool-root]");
  if (root) ({ estimateur: initEstimateur, assistant: initAssistant, telegram: initTelegram, playground: initPlayground, comparateur: initComparateur }[tool] || function () {})(root);
})();
