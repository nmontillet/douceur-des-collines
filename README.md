# Douceur des Collines — Site web

Site vitrine du GAEC de la Berbezie (Saint-Santin, Aveyron). HTML / CSS / JS statique pur, sans build step.

## Structure

```
site/
├── index.html              # Accueil
├── la-ferme.html           # La Ferme
├── nos-produits.html       # Nos produits
├── points-de-vente.html    # Points de vente (carte interactive)
├── professionnels.html     # Espace pro + formulaire
├── contact.html            # Contact + formulaire + carte
├── css/style.css           # Styles
├── js/main.js              # Interactivité (carte Leaflet, filtres, burger, etc.)
├── assets/                 # Photos + logos
├── netlify.toml            # Config déploiement Netlify
└── README.md               # Ce fichier
```

## Tester en local

Ouvrir simplement `index.html` dans un navigateur fonctionne pour la plupart des choses. Pour que la carte Leaflet et tous les liens marchent correctement, lancer un mini serveur :

```bash
# avec Python 3
python -m http.server 8000
# puis aller sur http://localhost:8000
```

Ou avec npx :
```bash
npx serve .
```

## Déployer sur Netlify

Le plus simple :

1. Aller sur [app.netlify.com](https://app.netlify.com) → "Add new site" → "Deploy manually"
2. **Drag & drop** tout le dossier `site/` dans la zone de dépôt
3. C'est en ligne. Netlify donne une URL du type `random-name.netlify.app`
4. Pour brancher un vrai domaine (`douceurdescollines.fr` par exemple) : Site settings → Domain management → Add custom domain

### Formulaires

Les deux formulaires (contact et pro) utilisent **Netlify Forms** — actifs automatiquement dès le déploiement. Les soumissions arrivent dans le dashboard Netlify (onglet Forms) et peuvent être notifiées par email.

Pour activer les notifications email :
- Netlify dashboard → Site → Forms → Settings → Form notifications → Add notification → Email
- Mettre l'email de Marie-José ou Laurent

### Domaine custom

1. Acheter `douceurdescollines.fr` (OVH, Gandi, Namecheap, etc.)
2. Sur Netlify : Site → Domain settings → Add custom domain
3. Suivre les instructions DNS (ajouter un CNAME ou A record chez le registrar)
4. HTTPS automatique via Let's Encrypt (rien à faire)

## Maintenance

### Ajouter / modifier un point de vente

Tout est dans `js/main.js`, en haut, tableau `POS_DATA`. Format :

```js
{ id: "id-unique", kind: "super|epicerie|halles|marche", dept: "12", name: "...", shortName: "...", town: "...", addr: "...", phone: "...", hours: "...", prods: "...", lat: 44.xxxx, lng: 2.xxxx }
```

Penser à mettre à jour le compteur dans le filtre correspondant (chips de la page `points-de-vente.html`).

### Modifier un texte

Chaque page est un fichier HTML autonome. Le contenu textuel est directement dans le HTML — facile à éditer.

### Mettre à jour une photo

Remplacer le fichier dans `assets/` en gardant le même nom. Idéalement compresser avec [squoosh.app](https://squoosh.app) pour rester sous 500 KB.

## Stack technique

- HTML5 sémantique
- CSS3 (variables CSS, grid, flexbox, clamp(), color-mix())
- JavaScript vanilla (pas de framework)
- [Leaflet 1.9.4](https://leafletjs.com/) pour la carte interactive
- Tuiles CartoDB Positron, filtrées CSS pour s'accorder à la palette
- [Google Fonts](https://fonts.google.com) : Fraunces (titres), Inter (corps), Pacifico + Yellowtail (logo)

## Origine

Design itéré sur [Claude Design](https://claude.ai/design), puis converti en site statique pour déploiement production.

Palette finale :
- Crème `#FAF7F0` · Sauge `#6B8E6F` · Brun foncé `#2E2520`
- Bleu nature `#2B7A9E` · Jaune vanille `#FCC917` · Beige `#F5E39E`
