const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques depuis le répertoire courant
app.use(express.static(__dirname));

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes pour les e-books
app.get('/ebook-seo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'ebook-seo.html'));
});

app.get('/ebook-services.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'ebook-services.html'));
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
