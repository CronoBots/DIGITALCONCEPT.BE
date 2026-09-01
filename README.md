# Digital Concept

Site vitrine de **Digital Concept** (digitalconcept.be) — agence digitale en
Belgique. Création de **sites web**, **applications mobiles**, solutions
d'**intelligence artificielle**, **crypto/blockchain** et **bots pour réseaux
sociaux**. Des solutions sur mesure pour faire grandir votre entreprise.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'accueil (hero réseau vivant, thèse, travaux, artisan, signature, le champ, et après, questions, commande) + SEO et données structurées JSON-LD |
| `creation-site-web-liege.html` | Page SEO — création de site web à Liège & Neupré |
| `creation-application-mobile-belgique.html` | Page SEO — application mobile iOS & Android |
| `chatbot-ia-pme-belgique.html` | Page SEO — chatbot IA & automatisation pour PME |
| `creation-token-crypto-belgique.html` | Page SEO — token & smart contract |
| `bot-telegram-discord-belgique.html` | Page SEO — bots Telegram, Discord & WhatsApp |
| `labo.html` | Le Labo — hub des outils vivants |
| `labo-estimateur.html` · `labo-assistant.html` · `labo-bot-telegram.html` · `labo-playground.html` · `labo-comparateur.html` | Les cinq outils : estimateur de projet, assistant de démonstration, simulateur de bot Telegram, playground HTML/CSS/JS, comparateur |
| `labo.css` / `labo.js` | Styles et moteur des outils (un seul fichier JS, initialisé par `data-tool` sur `<body>`) |
| `mentions-legales.html` · `conditions-generales.html` · `politique-confidentialite.html` · `politique-cookies.html` | Pages légales |
| `home.css` / `home.js` | Thème et scripts de la page d'accueil (autonomes) |
| `styles.css` + `page-theme.css` | Thème des pages SEO et légales (`page-theme.css` chargée après) |
| `fonts.css` + `fonts/*.woff2` | Polices de marque auto-hébergées (Bricolage Grotesque, Libre Franklin, Spline Sans Mono) |
| `cookies.js` | Bandeau et préférences cookies |
| `img/*.webp` | Aperçus des réalisations et portrait |
| `favicon.svg` | Monogramme « DC » de l'onglet |
| `CNAME` | Domaine personnalisé GitHub Pages (`digitalconcept.be`) |
| `robots.txt` / `sitemap.xml` | Référencement |

> `script.js` et `i18n.js` sont l'héritage de l'ancienne page d'accueil : plus aucune page ne les charge.

## Le Labo

Cinq outils interactifs, écrits à la main, sans bibliothèque ni serveur — la démonstration du savoir-faire est le site lui-même :

- **Estimateur** : cinq questions → lots de travail, planning indicatif, points de vigilance, résumé prêt à envoyer (préremplit le formulaire de l'accueil via `?projet=…&type=…`). Aucun prix.
- **Assistant** : chat qui répond depuis le contenu du site (moteur de correspondance local, pas d'IA générative — c'est dit clairement à l'écran).
- **Bot Telegram** : simulateur de communauté — commandes, accueil, anti-liens pour les nouveaux, suppression du spam, avertissements, stats.
- **Playground** : éditeur HTML/CSS/JS, rendu live dans une iframe `sandbox="allow-scripts"`, console captée par `postMessage`, quatre exemples.
- **Comparateur** : vitrine / e-commerce / app / sur mesure, et trois questions qui donnent une recommandation.

## Optimisations intégrées

- **Zéro requête tierce** : polices auto-hébergées (WOFF2 variables, sous-ensembles latin/latin-ext, `font-display: swap`, préchargées). Aucun appel à Google Fonts, donc aucune donnée visiteur envoyée à un tiers au chargement.
- **Images** : aperçus en WebP (≈ 50 % de moins que les JPEG), dimensions déclarées (pas de décalage de mise en page), `fetchpriority="high"` sur le premier aperçu et préchargement paresseux des suivants (un cran à l'avance, jamais avant le premier rendu).
- **Poids** : ~394 Ko et 11 requêtes au premier affichage de l'accueil, contre ~1,65 Mo et 17 requêtes auparavant.
- **Performance** : aucune dépendance, aucun build, JS léger et `passive` sur le scroll.
- **Accessibilité** : 0 violation axe-core sur les 16 pages, lien d'évitement, focus visibles, `aria-*`, contrastes AA, respect de `prefers-reduced-motion`.
- **SEO** : balises meta, Open Graph/Twitter, canonical, `sitemap.xml`, `robots.txt`, données structurées (`ProfessionalService`, `Service`, `FAQPage`, `BreadcrumbList`), maillage interne croisé entre les 5 pages de service et le Labo.
- **UX** : navigation active au scroll, animations d'apparition, micro-interactions, retour-en-haut, champ « type de projet » qui qualifie les demandes.

## Lancer en local

Aucune dépendance, aucun build. Ouvrez `index.html` dans un navigateur, ou servez
le dossier :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déploiement

Hébergé sur **GitHub Pages** (workflow `.github/workflows/deploy-pages.yml`), avec
le domaine personnalisé `digitalconcept.be` (fichier `CNAME`). Hébergeable tel quel
sur n'importe quel hébergement statique (Netlify, Cloudflare Pages…).

## Formulaire de contact

Le formulaire de l'accueil poste en AJAX vers **FormSubmit** (`data-endpoint` du
`<form id="contact-form">`), sans quitter la page. Un repli `data-mailto` ouvre la
messagerie du visiteur si l'envoi échoue. Le champ « Type de projet » est transmis
avec le message pour qualifier la demande d'emblée.

## Points ouverts

- Pas de témoignages ni de logos clients sur le site : rien n'est publié tant que
  les avis ne sont pas réels.
- Aucun tarif affiché — tout passe par le devis (gratuit, sous 24 h).
- Site en français uniquement. Les traductions EN/NL de `i18n.js` ne sont plus
  branchées : une version multilingue demanderait des URL distinctes (`/en/`,
  `/nl/`) avec `hreflang`, pas une bascule côté client.
