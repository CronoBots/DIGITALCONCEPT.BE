# Design

## Direction

**Clair, une couleur, trois écrans.** L'accueil dit qui est Vincent, montre son travail, et propose une seule action : le formulaire. Fond blanc, vert profond en unique accent, Manrope partout. Aucune animation lourde, aucune requête tierce. Le site se lit en 30 secondes.

## Palette

| Rôle | Token | Valeur |
|---|---|---|
| Fond | `--bg` | `#FFFFFF` |
| Fond doux (contact, captures) | `--bg-2` | `#F4F7F5` |
| Texte | `--ink` | `#131A18` |
| Texte secondaire (AA) | `--ink-2` | `#5A6663` |
| Filet | `--line` | `#E1E7E4` |
| **La couleur** | `--green` | `#0E5E4A` |
| Survol | `--green-2` | `#0B4C3C` |
| Halo, focus | `--green-soft` | `#E3F0EA` |

Règle : une seule couleur. Elle porte le mot fort du titre, les boutons, les liens, le focus. Rien d'autre n'est coloré ; les captures de sites apportent le reste.

## Typographie

- **Manrope** (`--f`) — tout : titres (800, tracking −0.03em), corps (400), boutons (700). Auto-hébergée (`fonts/manrope-*.woff2`, variable 200–800).
- **Spline Sans Mono** (`--f-mono`) — uniquement les très petites étiquettes (lien « ↗ » des captures).

## Accueil (`index.html` + `home.css` + `home.js`)

1. **Qui** — vignette ronde, « Vincent Buron · développeur web, Neupré (Liège) », puis le titre : *Un site web qui vous ressemble, fait par une seule personne.* Deux lignes, un bouton vers le formulaire, un lien vers les réalisations.
2. **Le travail** — quatre captures en grand (Jayden, Pizzeria Pino, Yuméa, Toukin), nom, type, lien. Sous la grille, quatre promesses en une ligne chacune.
3. **Le contact** — bandeau doux, texte court, téléphone et adresse, formulaire : nom, e-mail, téléphone (facultatif), message. Envoi AJAX, repli e-mail si l'envoi échoue.

Motion : apparition discrète des captures (`.reveal`, 14 px, 0,6 s), filet sous l'en-tête au défilement. Tout respecte `prefers-reduced-motion`.

## Pages de service et légales

`styles.css` + `page-theme.css` (surcharge claire, chargée après) : mêmes tokens, même typo, hero blanc à filet, cartes blanches, bouton vert. Deux pages de service : création de site web à Liège, application mobile.

## Ce qui n'existe plus

Le monde « obsidienne / réseau vivant », la signature en particules, le carrousel, le Labo et ses cinq outils, les pages crypto / IA / bots, le multilingue. Décision du client : le site doit être simple, personnel, lisible au premier défilement.
