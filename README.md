# Perspective Web

Site vitrine de **Perspective Web** — création de sites internet modernes et mobiles
pour les commerces de la région du Condroz (Belgique).

Le site présente l'offre, les tarifs (Essentiel 29 €/mois · Pro 49 €/mois · Premium
79 €/mois), un exemple concret et un formulaire de demande de maquette gratuite.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page unique (hero, avantages, étapes, exemple, tarifs, FAQ, contact) |
| `styles.css` | Thème sombre, responsive, mobile-first |
| `script.js` | Menu mobile, validation du formulaire, année dynamique |

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
