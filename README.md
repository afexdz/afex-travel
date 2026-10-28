# AFEX Travel

Catalogue de sites démo pour les agences de voyages en Algérie : travel.afexad.app.

- `index.html` : la page du portfolio (liste `DEMOS`, catégories Omra et Hajj, Séjours et circuits, Billets et visas).
- `sites/<slug>/` : une démo par dossier, photos listées dans `images.txt` et téléchargées à la construction.
- `scripts/vercel-images.sh` : construction Vercel (photos, puis aperçus du portfolio via `scripts/covers.mjs`, sites listés dans `scripts/covers.json`).
