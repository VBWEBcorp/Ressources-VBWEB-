const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'vbweb_ebooks';

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Route pour l'authentification
app.post('/api/auth', async (req, res) => {
    const client = new MongoClient(mongoUrl);

    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('users');

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await users.findOne({ email: req.body.email });

        if (!existingUser) {
            // Si l'utilisateur n'existe pas, on l'ajoute
            await users.insertOne({
                ...req.body,
                createdAt: new Date()
            });
        } else {
            // Si l'utilisateur existe, on met à jour son dernier accès
            await users.updateOne(
                { email: req.body.email },
                { 
                    $set: { 
                        lastAccess: new Date(),
                        ebook: req.body.ebook 
                    }
                }
            );
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erreur MongoDB:', error);
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    } finally {
        await client.close();
    }
});

// Route pour les e-books
app.get('/ebook-:name.html', (req, res) => {
    res.sendFile(path.join(__dirname, `ebook-${req.params.name}.html`));
});

const port = 8000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
