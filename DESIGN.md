# Design

<!-- impeccable:design-schema 1 -->
<!-- Monde construit pour la page d'accueil (index.html + home.css + home.js). Les autres pages (légales, pages SEO) suivent encore styles.css / chrome legal-page. -->

## Direction

**Monographie d'atelier signée** (seed 43bdd545, mode persuade, code-led). Le site d'accueil se comporte comme un livre d'auteur auto-édité : un seul artisan pense, dessine et code, et le visiteur s'adresse directement à lui. Refuse le hero sombre à dégradé + grille de cartes de services du studio-digital générique.

## Palette

Stratégie : **engagée** — l'encre porte les planches pleines (couverture, artisan, contact, ~40 % de la surface), le papier porte la lecture, l'ocre est l'unique accent (marque de maître, signature, filets, états).

| Rôle | Token | Valeur |
|---|---|---|
| Papier (fond) | `--paper` | `#ECE7DA` |
| Papier panneau | `--paper-2` | `#E4DDCC` |
| Papier liseré | `--paper-3` | `#DAD2BF` |
| Encre (fond plein + texte) | `--ink` | `#171C26` |
| Encre levée | `--ink-2` | `#232A38` |
| Texte secondaire /papier | `--ink-soft` | `#5A5346` (teinté, jamais gris neutre) |
| Texte secondaire /encre | `--paper-soft` | `#B3AC9B` |
| Ocre — grand affichage, filets, fills | `--mark` | `#B9762A` |
| Ocre — petit texte /papier (AA) | `--mark-txt` | `#8A5316` |
| Ocre — petit texte /encre (AA) | `--mark-txt` (scopé) | `#E2A455` |
| Filet /papier · /encre | `--line` `--line-ink` | `#CBC3B0` · `#333B4B` |

Règle de contraste : l'ocre vif (`--mark`) est réservé au grand affichage (≥ large), aux filets et aux aplats ; tout **petit texte ocre** passe par `--mark-txt`, qui s'assombrit sur papier et s'éclaircit sur encre pour tenir l'AA 4.5:1.

## Typographie

- **Bricolage Grotesque** (`--f-display`) — titres, folios, mots-marque. Caractère « fait main ». `.display` clamp jusqu'à 5.4rem (poids 800), `.h-sect` jusqu'à 3.5rem (700). Tracking -0.025 à -0.035em.
- **Libre Franklin** (`--f-body`) — corps, boutons, lead. Mesure de lecture 62ch (`.prose`), lead 38ch.
- **Spline Sans Mono** (`--f-mono`) — folios, numéros, labels de formulaire, téléphone, tampons. Réservé aux **données/mesures**, jamais comme costume « technique ».

## Composants

- **Planche (`.plate`, `.plate--ink`)** : unité de mise en page. Alternance encre/papier au fil du scroll.
- **Folio (`.folio`)** : marqueur de sommaire (chiffre romain I–VI + libellé) porté par le monde-livre ; porte une vraie séquence (ordre du menu). Ce n'est pas un eyebrow décoratif.
- **Boutons (`.btn`, `.btn--mark`, `.btn--ghost`)** : rectangulaires, à décalage d'ombre ocre au survol (translate -2/-2 + ombre pleine) — cohérent avec le clin d'œil imprimerie, jamais l'ombre dure neobrutaliste hors-monde.
- **Signature (`.sig`)** : tracé SVG (getTotalLength) qui s'écrit à l'entrée dans le viewport ; fil rouge « la main qui fabrique ». Instantané en `prefers-reduced-motion`.
- **Showcase (`.showcase`)** : maquette navigateur + téléphone, parallaxe 3D à la souris, rotation auto 3.8s, points de progression ocre. **Élément conservé** de l'ancien site (demande explicite du client), restylé pour le monde.
- **Index services (`.field-list` / `.field-row`)** : liste typographique numérotée avec flèche ocre sur les lignes liées (pages SEO) ; **pas de grille de cartes**.
- **FAQ (`.qa`)** : `<details>` à filets, marqueur « + » ocre.
- **Formulaire (`.cta-form`)** : champs à filet bas (registre ledger), labels mono, validation + envoi AJAX (formsubmit.co) sans quitter la page, coche animée.
- **Colophon (`.colophon`)** : pied « de livre » — wordmark, colonnes Le champ / L'atelier / Contact, mentions légales, signature « Conçu & développé par Vincent Buron ».

## Motion

Un seul moment orchestré : la **signature qui se trace** + les révélations douces (`.reveal`, translateY 26px → 0, ease-out `cubic-bezier(0.2,0.7,0.2,1)`, depuis un défaut déjà lisible). Micro-décalage de registre au survol (text-shadow ocre 2px) sur titres de sections/lignes. Tout respecte `prefers-reduced-motion`.

## Surfaces navigateur

`::selection` (ocre/papier), scrollbar (ocre sur papier-2), focus visible (contour ocre 2px), caret hérité. Themées depuis la palette.

## Périmètre

Ce monde couvre **index.html** (via `home.css` + `home.js`). Les pages légales et les 4 pages SEO (Liège, crypto, IA, bots) restent sur `styles.css` + le chrome `legal-page` ; l'accueil les lie (services + colophon). `styles.css`, `script.js`, `i18n.js` ne sont plus chargés par l'accueil mais servent encore ces pages.
