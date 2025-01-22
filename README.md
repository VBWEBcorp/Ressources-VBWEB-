# Ressources VBWEB

Une page web moderne et responsive pour la distribution d'e-books et la collecte d'informations utilisateur.

## Structure du projet

```
ressources/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    ├── ebook1.jpg
    ├── ebook1.pdf
    ├── ebook2.jpg
    └── ebook2.pdf
```

## Fonctionnalités

- Interface responsive et moderne
- Affichage des e-books sous forme de cartes
- Formulaire de collecte d'informations avant téléchargement
- Design optimisé pour mobile
- Thème personnalisé avec les couleurs de la marque (#264060 et #4EBAEC)

## Comment ajouter un nouvel e-book

1. Placez les fichiers de l'e-book dans le dossier `assets/`:
   - L'image de couverture (format recommandé : JPG, 800x600px)
   - Le fichier PDF de l'e-book

2. Modifiez le fichier `js/main.js` et ajoutez l'e-book dans le tableau `ebooks` :

```javascript
const ebooks = [
    // ... e-books existants ...
    {
        id: 3, // Incrémentez l'ID
        title: "Titre de votre nouvel e-book",
        description: "Description de l'e-book",
        image: "assets/nom-image.jpg",
        downloadUrl: "assets/nom-ebook.pdf"
    }
];
```

## Personnalisation

### Couleurs
Les couleurs principales sont définies dans le fichier `css/styles.css` sous forme de variables CSS :
```css
:root {
    --primary-color: #264060;
    --accent-color: #4EBAEC;
}
```

### Formulaire
Pour modifier les champs du formulaire, éditez la section correspondante dans `index.html`.
