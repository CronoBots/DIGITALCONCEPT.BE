# Digital Concept

Site de **Digital Concept** (digitalconcept.be) — Vincent Buron, développeur web
indépendant à Neupré près de Liège. Un site web qui vous ressemble, fait par une
seule personne : sites web pour indépendants et artistes, applications mobiles.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil en trois écrans : qui (Vincent), le travail (4 sites), le contact (formulaire). SEO + JSON-LD |
| `creation-site-web-liege.html` | Page SEO — création de site web à Liège & Neupré |
| `creation-application-mobile-belgique.html` | Page SEO — application mobile iOS & Android |
| `mentions-legales.html` · `conditions-generales.html` · `politique-confidentialite.html` · `politique-cookies.html` | Pages légales |
| `home.css` / `home.js` | Thème et script de l'accueil (autonomes) |
| `styles.css` + `page-theme.css` | Thème des pages SEO et légales (`page-theme.css` chargée après : surcharge claire) |
| `fonts.css` + `fonts/*.woff2` | Manrope et Spline Sans Mono, auto-hébergées |
| `cookies.js` | Bandeau et préférences cookies |
| `img/*.webp` | Captures des réalisations et portrait |
| `favicon.svg` · `og-image.png` | Icône et image de partage |
| `CNAME` · `robots.txt` · `sitemap.xml` | Domaine et référencement |

## Optimisations intégrées

- **Zéro requête tierce** : polices auto-hébergées, aucun script externe. Aucune donnée visiteur envoyée à un tiers au chargement.
- **Léger** : ~390 Ko et 12 requêtes pour l'accueil, LCP ≈ 0,1 s en local, CLS 0.
- **Accessible** : 0 violation axe-core sur les 7 pages, contrastes AA, focus visibles, `prefers-reduced-motion`.
- **SEO** : meta, Open Graph, canonical, sitemap, données structurées (`ProfessionalService`, `Person`, `Service`, `FAQPage`, `BreadcrumbList`).

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

- Pas de témoignages ni de logos clients : rien n'est publié tant que les avis ne sont pas réels.
- Aucun tarif affiché — tout passe par le devis (gratuit, sous 24 h).
- Français uniquement, par choix.
