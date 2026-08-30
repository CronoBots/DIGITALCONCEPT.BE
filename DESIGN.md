# Design

<!-- impeccable:design-schema 1 -->
<!-- Monde construit pour la page d'accueil (index.html + home.css + home.js). Les autres pages (légales, pages SEO) suivent encore styles.css / chrome legal-page. -->

## Direction

**Atelier en fusion** (seed 02e1f084, mode persuade, code-led ; monde épinglé par le client). L'accueil est une scène obsidienne filmée dans le noir : une matière métallique en fusion (WebGL vivant) est forgée à la main en produit fini. Refuse deux ruts à la fois — l'ancienne monographie papier ET le « near-black + un néon froid » du studio-tech générique. La chaleur est **bronze/ambre**, dans la continuité de la marque, jamais un néon.

## Palette

Stratégie : **committed / drenched** — l'obsidienne noie toute la surface, la chaleur de forge (bronze→ambre) est l'unique accent porteur (hero, CTA, filets, états, incandescence du mot-marque).

| Rôle | Token | Valeur |
|---|---|---|
| Obsidienne (fond) | `--bg` | `#0A0C10` |
| Obsidienne 2 / 3 | `--bg-2` `--bg-3` | `#0D1017` · `#0F131B` |
| Panneau élevé | `--panel` `--panel-2` | `#12161F` · `#171C28` |
| Verre (vitrines, backdrop-blur réel) | `--glass` `--glass-2` | `rgba(18,22,31,.62)` · `rgba(24,29,41,.7)` |
| Encre claire chaude (texte) | `--ink` | `#F2EEE6` |
| Secondaire /obsidienne (teinté froid) | `--ink-soft` | `#9AA2B4` |
| Légendes, tampons (teinté chaud) | `--ink-warm` | `#CBBEA9` |
| Texte discret (AA ≥4.5:1) | `--ink-dim` | `#878FA1` |
| Chaleur — grand affichage, fills, filets | `--heat` | `#FF9D3D` |
| Bronze / continuité de marque | `--heat-2` `--heat-deep` | `#C6772E` · `#B9762A` |
| Cœur incandescent, hautes lumières | `--heat-core` | `#FFD89A` |
| Petit texte ocre sur obsidienne (AA) | `--heat-txt` | `#FFAB55` |
| Filet · filet chaud | `--line` `--line-2` `--line-heat` | `rgba(242,238,230,.10)` · `.17` · `rgba(255,157,61,.28)` |

Règle : le mot-marque incandescent du titre est une **couleur pleine** (`--heat`) + halo (`text-shadow`), jamais un gradient-text. L'ocre vif porte le grand affichage et les aplats ; le petit texte ocre passe par `--heat-txt`.

## Typographie

- **Bricolage Grotesque** (`--f-display`) — titres, wordmark, chiffres géants. `.display` clamp 2.3→6rem (poids 800), tracking -0.04em. Caractère « fait main » conservé de l'ADN de marque.
- **Libre Franklin** (`--f-body`) — corps, boutons, lead. Mesure 62–68ch.
- **Spline Sans Mono** (`--f-mono`) — folios, labels de formulaire, URL navigateur, téléphone, tampons. Réservé aux **données/mesures**.

## Composants

- **Scène en fusion (`.cover` + `canvas[data-forge]`)** : hero plein écran (`100svh`, colonne, contenu ancré en bas). Shader WebGL fragment (fbm + domain-warp + rampe de chaleur, réactif au pointeur) ; repli CSS (dégradé de forge) si WebGL/`reduced-motion` absent. Voile (`.forge-veil`) pour la lisibilité du texte à gauche.
- **Vitrines de verre (`.step`, `.showcase-stage`, `.commission-side`, `.portrait`)** : panneaux à `backdrop-filter`, filet haut chauffé, profondeur par ombres à offset + blur (`--sh-glass`, `--bloom`).
- **Showcase (`.showcase`)** : maquette navigateur + téléphone dans une vitrine à halo de chaleur, parallaxe 3D à la souris, rotation auto 3.8 s, points de progression ocre. **Élément conservé** (demande explicite du client).
- **Signature (`.sig`)** : tracé SVG (getTotalLength) qui s'écrit à l'entrée, filtre `drop-shadow` chaud — le fil humain « la main qui forge ». Instantané en `reduced-motion`.
- **Index services (`.field-list` / `.field-row`)** : liste typographique numérotée, barre de chaleur qui monte + décalage du contenu (`translateX`) au survol des lignes liées. **Pas de grille de cartes.**
- **FAQ (`.qa`)** : `<details>` à filets, marqueur « + » ocre.
- **Formulaire (`.cta-form`)** : champs à filet bas (registre ledger), labels mono, validation + envoi AJAX (formsubmit.co) sans quitter la page, coche SVG animée.
- **Boutons (`.btn--mark`)** : remplissage chaleur (dégradé bronze→ambre), bloom, aimantés au curseur (`[data-magnetic]`) sur pointeur fin.
- **Colophon (`.colophon`)** : pied — wordmark, colonnes Le champ / L'atelier / Contact, mentions légales, signature « Conçu & développé par Vincent Buron ».

## Motion

Grammaire unique « la chaleur qui monte » : révélations `.reveal` (translateY 28px → 0, ease-out `cubic-bezier(.2,.7,.2,1)`, délais d1–d4), signature qui se trace, shader qui respire (temps réel, en pause hors-viewport / onglet caché), boutons magnétiques, barre de chaleur au survol. Toutes les transitions d'interaction passent par `transform`/`opacity` (aucune animation de propriété de layout). Tout respecte `prefers-reduced-motion` (shader figé sur une image, révélations désactivées).

## Surfaces navigateur

`::selection` (ambre/obsidienne), scrollbar (dégradé bronze sur obsidienne), focus visible (contour ocre 2px), placeholder teinté AA, caret hérité. Themées depuis la palette.

## Périmètre

Ce monde couvre **index.html** (via `home.css` + `home.js`, autonomes, FR). Un hook de capture (`?still` → classe `.capture`) fige les entrées et borne le hero pour la revue plein-page ; inerte en usage normal. Les pages légales et les 4 pages SEO restent sur `styles.css` + le chrome `legal-page` ; l'accueil les lie (services + colophon). `styles.css`, `script.js`, `i18n.js` ne sont plus chargés par l'accueil mais servent encore ces pages. Contraintes respectées : statique GitHub Pages (aucun backend), SEO/schema/Core Web Vitals préservés, `theme-color` `#0A0C10`.
