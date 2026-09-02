# Design

## Direction

**Verre liquide, une couleur, trois écrans.** L'accueil dit qui est Vincent, montre son travail, et propose une seule action : le formulaire. Fond clair traversé de halos colorés qui dérivent lentement ; par-dessus, des surfaces de verre floutées (`backdrop-filter`) à reflet spéculaire, façon Liquid Glass d'Apple : barre de navigation flottante, cadres des captures, promesses, formulaire, pied de page. Les cadres des réalisations s'inclinent en 3D sous le curseur et une lueur suit la souris. Slate Ocean `#2F4858` et Cloud Mint `#DDFBEF` pour seules couleurs, Manrope partout, aucune requête tierce. Tout se fige sous `prefers-reduced-motion`.

## Palette

| Rôle | Token | Valeur |
|---|---|---|
| Fond | `--bg` | `#F6FBF8` |
| Halos | `--h1` … `--h4` | Cloud Mint `#DDFBEF`, menthe dense `#BFEFD9`, ardoise pâle `#D6E4EA`, Cloud Mint |
| Verre | `--glass` `--glass-2` `--glass-edge` | `rgba(255,255,255,.55)` · `.72` · bord `.85` |
| Texte, encre | `--ink` | Slate Ocean `#2F4858` |
| Texte secondaire (AA) | `--ink-2` | `#4E6470` |
| Filet | `--line` | `#E1E7E4` |
| **Accent** (boutons, liens) | `--green` | Slate Ocean `#2F4858` |
| Survol | `--green-2` | `#223A48` |
| Surligneur du titre, focus | `--green-soft` | Cloud Mint `#DDFBEF` |

Règle : deux couleurs, Slate Ocean et Cloud Mint, et rien d'autre. L'ardoise est l'encre et la matière des boutons (texte menthe dessus, comme dans la palette d'origine) ; le menthe est la lumière : halos, surligneur du mot fort du titre, focus. Les halos sont de la lumière, pas de la couleur : pâles, floutés à 70 px, toujours derrière le verre, jamais sous le texte sans verre. Le texte reste AA partout (`--ink-2` `#4F5B58` sur verre).

## Typographie

- **Manrope** (`--f`) — tout : titres (800, tracking −0.03em), corps (400), boutons (700). Auto-hébergée (`fonts/manrope-*.woff2`, variable 200–800).
- **Spline Sans Mono** (`--f-mono`) — uniquement les très petites étiquettes (lien « ↗ » des captures).

## Accueil (`index.html` + `home.css` + `home.js`)

1. **Qui** — vignette ronde, « Vincent Buron · développeur web, Neupré (Liège) », puis le titre : *Un site web qui vous ressemble, fait par une seule personne.* Deux lignes, un bouton vers le formulaire, un lien vers les réalisations.
2. **Le travail** — quatre captures en grand (Jayden, Pizzeria Pino, Yuméa, Toukin), nom, type, lien. Sous la grille, quatre promesses en une ligne chacune.
3. **Le contact** — bandeau doux, texte court, téléphone et adresse, formulaire : nom, e-mail, téléphone (facultatif), message. Envoi AJAX, repli e-mail si l'envoi échoue.

Motion :
- halos qui dérivent (26–38 s, alternance) et suivent très légèrement le curseur (`--mx`/`--my`, amorti à 6 %) ;
- cartes : `rotateX/Y` jusqu'à ±5°/±4° selon la position du pointeur, `perspective: 1400px`, lueur radiale au point de survol, retour en 0,5 s ;
- boutons : goutte de reflet en haut, balayage lumineux au survol, halo externe de 8 px ;
- portrait : anneau conique flouté qui tourne en 14 s ;
- apparition : `.reveal` sur les cadres, promesses et formulaire.
Tout s'arrête sous `prefers-reduced-motion` ; l'inclinaison et le suivi du curseur ne s'activent que sur pointeur fin (`hover: hover`).

## Pages de service et légales

`styles.css` + `page-theme.css` (surcharge claire, chargée après) : mêmes tokens, même typo, hero blanc à filet, cartes blanches, bouton vert. Deux pages de service : création de site web à Liège, application mobile.

## Ce qui n'existe plus

Le monde « obsidienne / réseau vivant », la signature en particules, le carrousel, le Labo et ses cinq outils, les pages crypto / IA / bots, le multilingue. Décision du client : le site doit être simple, personnel, lisible au premier défilement.
