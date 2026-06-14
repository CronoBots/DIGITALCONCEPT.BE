# Perspective Web

Site vitrine de **Perspective Web** — création de sites internet modernes et mobiles
pour les commerces de la région du Condroz (Belgique).

Le site présente l'offre, les tarifs (Essentiel 29 €/mois · Pro 49 €/mois · Premium
79 €/mois), un exemple concret et un formulaire de demande de maquette gratuite.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page unique (hero, avantages, avant/après, méthode, exemple, tarifs, FAQ, contact) + SEO et données structurées JSON-LD |
| `styles.css` | Thème sombre premium, responsive, mobile-first, animations |
| `script.js` | Apparition au scroll, navigation active, compteurs animés, en-tête au scroll, retour-en-haut, menu mobile, validation du formulaire |
| `favicon.svg` | Icône de l'onglet |
| `robots.txt` / `sitemap.xml` | Référencement |

## Optimisations intégrées

- **Performance** : aucune dépendance, aucun build, JS léger et `passive` sur le scroll.
- **Accessibilité** : lien d'évitement, focus visibles, `aria-*`, contrastes, respect de `prefers-reduced-motion`.
- **SEO** : balises meta, Open Graph/Twitter, canonical, `sitemap.xml`, `robots.txt`, données structurées `ProfessionalService`.
- **UX** : navigation active au scroll, animations d'apparition, micro-interactions, retour-en-haut.

## Lancer en local

Aucune dépendance, aucun build. Ouvrez `index.html` dans un navigateur, ou servez
le dossier :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déploiement

Hébergeable tel quel sur n'importe quel hébergement statique (GitHub Pages,
Netlify, Cloudflare Pages…).

## À faire / à personnaliser

- Renseigner le **numéro de téléphone** réel (placeholders dans les CTA).
- Brancher le formulaire de contact à un service d'envoi d'e-mails (Formspree,
  Netlify Forms, ou une fonction serveur) — actuellement en démo front-end.
- Ajouter le logo définitif et des photos réelles une fois disponibles.
