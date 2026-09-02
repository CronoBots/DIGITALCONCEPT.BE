# Design

## Direction

**Studio obsidienne — réseau vivant**, le monde du client, sur la structure en trois écrans du brief. Une scène obsidienne filmée dans le noir : une constellation de nœuds reliés en 3D (Canvas temps réel) qui respire et réagit au visiteur, l'accent indigo/violet, les vitrines de verre, le carrousel des réalisations, la signature « DC » en particules. Aucune requête tierce. Tout respecte `prefers-reduced-motion`.

## Palette

| Rôle | Token | Valeur |
|---|---|---|
| Obsidienne indigo (fond) | `--bg` | `#0B0B16` |
| Panneau, verre | `--panel` `--glass` | `#12161F` · `rgba(18,22,31,.62)` |
| Encre claire chaude | `--ink` | `#F2EEE6` |
| Secondaire | `--ink-soft` | `#9AA2B4` |
| Violet clair — grand affichage, fills | `--heat` | `#8B7CFF` |
| Indigo — liens | `--heat-2` | `#6366F1` |
| Cœur clair | `--heat-core` | `#C4B5FD` |
| Petit texte violet (AA) | `--heat-txt` | `#A99CFF` |

## Typographie

- **Bricolage Grotesque** (`--f-display`) — titres, wordmark, chiffres.
- **Libre Franklin** (`--f-body`) — corps, boutons.
- **Spline Sans Mono** (`--f-mono`) — folios, étiquettes, téléphone.
Toutes auto-hébergées (`fonts.css`, `fonts/*.woff2`).

## Accueil (`index.html` + `home.css` + `home.js`)

1. **Qui** — scène obsidienne plein écran, réseau de nœuds 3D derrière le titre *Un site web qui vous ressemble, fait par une seule personne.*, portrait à droite (vignette au-dessus du titre sur mobile), deux pastilles (Sites web, Applications), bouton magnétique + téléphone, faits 25 / 1 / 24 h.
2. **Le travail** — carrousel « vitrine » (maquette ordinateur + téléphone, rotation auto, parallaxe) avec Jayden, Pizzeria Pino, Yuméa, Toukin ; sous le carrousel, trois vitrines de verre (sur mesure, un seul interlocuteur, et après). Puis le moment signature : les particules se reforment en « DC ».
3. **Le contact** — formulaire nom / e-mail / téléphone / message, envoi AJAX, repli e-mail ; à côté, téléphone, WhatsApp, adresse.

Motion : réseau vivant (parallaxe souris, nœud illuminé sous le curseur, pause hors viewport), révélations « la chaleur qui monte », boutons magnétiques, signature qui se trace, fil de progression à gauche, halo au curseur. Tout se fige sous `prefers-reduced-motion`.

## Pages de service et légales

`styles.css` + `page-theme.css` (surcharge obsidienne, chargée après) : mêmes tokens, même typo, hero à champ de points, cartes verre, accent violet. Deux pages de service : création de site web à Liège, application mobile.

## Ce qui n'existe plus

Le Labo et ses cinq outils, les pages crypto / IA / bots, le multilingue, les sections thèse / artisan / champ / questions de l'ancien accueil (leur contenu vit dans les trois écrans). Les essais clair / verre liquide / Slate-Mint ont été abandonnés à la demande du client, qui préfère son monde d'origine.
