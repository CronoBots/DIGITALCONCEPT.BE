# Design

<!-- impeccable:design-schema 1 -->
<!-- Monde construit pour la page d'accueil (index.html + home.css + home.js). Les autres pages (SEO et légales) suivent styles.css + page-theme.css / chrome legal-page. -->

## Direction

**Studio obsidienne — réseau vivant** (seed 02e1f084, mode persuade, code-led ; monde épinglé par le client). L'accueil est une scène obsidienne filmée dans le noir : une constellation de nœuds reliés en 3D (Canvas temps réel) qui respire et réagit au visiteur — elle évoque d'un seul visuel le web (connexions), l'IA (réseau de neurones), la crypto (nœuds) et les bots (automatisation). Refuse deux ruts à la fois — l'ancienne monographie papier ET le « near-black + un néon bleu » du studio-tech générique. L'accent est **indigo/violet** (neural) sur obsidienne : le réseau prend des allures de réseau de neurones — premium, à l'écart du cyan par défaut.

## Palette

Stratégie : **committed / drenched** — l'obsidienne indigo noie toute la surface, l'accent indigo→violet est l'unique porteur (hero, CTA, filets, états, mot-marque du titre).

| Rôle | Token | Valeur |
|---|---|---|
| Obsidienne indigo (fond) | `--bg` | `#0B0B16` |
| Obsidienne 2 / 3 | `--bg-2` `--bg-3` | `#0D1017` · `#0F131B` |
| Panneau élevé | `--panel` `--panel-2` | `#12161F` · `#171C28` |
| Verre (vitrines, backdrop-blur réel) | `--glass` `--glass-2` | `rgba(18,22,31,.62)` · `rgba(24,29,41,.7)` |
| Encre claire chaude (texte) | `--ink` | `#F2EEE6` |
| Secondaire /obsidienne (teinté froid) | `--ink-soft` | `#9AA2B4` |
| Légendes, tampons (teinté chaud) | `--ink-warm` | `#CBBEA9` |
| Texte discret (AA ≥4.5:1) | `--ink-dim` | `#878FA1` |
| Violet clair — grand affichage, fills, filets | `--heat` | `#8B7CFF` |
| Indigo — liens / indigo profond | `--heat-2` `--heat-deep` | `#6366F1` · `#4F46E5` |
| Cœur clair, hautes lumières | `--heat-core` | `#C4B5FD` |
| Petit texte violet sur obsidienne (AA) | `--heat-txt` | `#A99CFF` |
| Filet · filet chaud | `--line` `--line-2` `--line-heat` | `rgba(242,238,230,.10)` · `.17` · `rgba(255,157,61,.28)` |

Règle : le mot-marque incandescent du titre est une **couleur pleine** (`--heat`) + halo (`text-shadow`), jamais un gradient-text. L'ocre vif porte le grand affichage et les aplats ; le petit texte ocre passe par `--heat-txt`.

## Typographie

Les trois familles sont **auto-hébergées** (`fonts.css` + `fonts/*.woff2`, sous-ensembles latin / latin-ext, WOFF2 variables, `font-display: swap`). Aucune requête vers `fonts.googleapis.com` : le rendu du texte ne dépend plus d'un tiers, et le site ne dépose plus aucune donnée chez Google.

- **Bricolage Grotesque** (`--f-display`) — titres, wordmark, chiffres géants. `.display` clamp 2.3→6rem (poids 800), tracking -0.04em. Caractère « fait main » conservé de l'ADN de marque.
- **Libre Franklin** (`--f-body`) — corps, boutons, lead. Mesure 62–68ch.
- **Spline Sans Mono** (`--f-mono`) — folios, labels de formulaire, URL navigateur, téléphone, tampons. Réservé aux **données/mesures**.

## Composants

- **Réseau vivant (`.cover` + `canvas[data-forge]`)** : hero plein écran (`100svh`, colonne, contenu ancré en bas). Constellation de nœuds en **Canvas 2D à projection 3D** (perspective, rotation lente auto, drift, connexions par proximité écran, parallaxe à la souris, nœud illuminé + liens vers le curseur ; ~44 nœuds mobile / ~90 desktop, DPR ≤2, en pause hors-viewport et onglet caché). Repli CSS (dégradé sombre) si Canvas/`reduced-motion` absent (image figée). Voile (`.forge-veil`) pour la lisibilité du texte à gauche. Le foyer du réseau est décalé à droite (`cx≈0.6W`) sur desktop.
- **Vitrines de verre (`.step`, `.showcase-stage`, `.commission-side`, `.portrait`)** : panneaux à `backdrop-filter`, filet haut chauffé, profondeur par ombres à offset + blur (`--sh-glass`, `--bloom`).
- **Showcase (`.showcase`)** : maquette navigateur + téléphone dans une vitrine à halo de chaleur, parallaxe 3D à la souris, rotation auto 3.8 s, points de progression ocre. **Élément conservé** (demande explicite du client).
- **Signature (`.sig`)** : tracé SVG (getTotalLength) qui s'écrit à l'entrée, filtre `drop-shadow` chaud — le fil humain « la main qui forge ». Instantané en `reduced-motion`.
- **Index services (`.field-list` / `.field-row`)** : liste typographique numérotée, barre de chaleur qui monte + décalage du contenu (`translateX`) au survol des lignes liées. **Pas de grille de cartes.**
- **Et après (`.aftercare`)** : section propre (folio `IV·b`), triade de vitrines `.step` — hébergement, maintenance, évolutions. Rend visible l'accompagnement dans la durée, qui ne vivait que dans la FAQ. Volontairement hors de la grille sticky de `#champ` (deux colonnes) pour occuper toute la largeur.
- **FAQ (`.qa`)** : `<details>` à filets, marqueur « + » ocre.
- **Formulaire (`.cta-form`)** : champs à filet bas (registre ledger), labels mono, validation + envoi AJAX (formsubmit.co) sans quitter la page, coche SVG animée.
- **Boutons (`.btn--mark`)** : remplissage violet (dégradé indigo→violet), bloom, aimantés au curseur (`[data-magnetic]`) sur pointeur fin.
- **Colophon (`.colophon`)** : pied — wordmark, colonnes Le champ / L'atelier / Contact, mentions légales, signature « Conçu & développé par Vincent Buron ».

## Motion

Grammaire unique « la chaleur qui monte » : révélations `.reveal` (translateY 28px → 0, ease-out `cubic-bezier(.2,.7,.2,1)`, délais d1–d4), signature qui se trace, réseau de nœuds qui respire (temps réel, en pause hors-viewport / onglet caché), boutons magnétiques, barre de chaleur au survol. Toutes les transitions d'interaction passent par `transform`/`opacity` (aucune animation de propriété de layout). Tout respecte `prefers-reduced-motion` (shader figé sur une image, révélations désactivées).

## Surfaces navigateur

`::selection` (violet/obsidienne), scrollbar (dégradé indigo sur obsidienne), focus visible (contour violet 2px), placeholder teinté AA, caret hérité. Themées depuis la palette.

## Périmètre

Ce monde couvre **index.html** (via `home.css` + `home.js`, autonomes, FR). Un hook de capture (`?still` → classe `.capture`) fige les entrées et borne le hero pour la revue plein-page ; inerte en usage normal. Les **5 pages SEO** (catégories, dont `creation-application-mobile-belgique.html`) chargent `page-theme.css` **après** `styles.css` : surcharge qui harmonise leur chrome `legal-page` au monde obsidienne indigo (fond, typo Bricolage/Libre Franklin/Spline, cartes verre, accent violet, hero à champ de points rappelant le réseau). Les **4 pages légales** chargent désormais la même surcharge : tout le site parle la même langue graphique, et `styles.css` pointe sur les polices de marque plutôt que sur l'ancien trio Space Grotesk / Inter / Space Mono, qui n'est plus servi.

`script.js` et `i18n.js` ne sont plus chargés par aucune page (héritage de l'ancienne page d'accueil) ; ils sont conservés tels quels, sans coût au chargement. Contraintes respectées : statique GitHub Pages (aucun backend), SEO/schema/Core Web Vitals préservés, `theme-color` `#0B0B16`, zéro requête tierce sur l'ensemble des 10 pages.
