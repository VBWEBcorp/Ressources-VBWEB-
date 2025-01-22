// Configuration des e-books
const ebooks = [
    {
        id: 1,
        title: "Guide pratique du SEO",
        description: "Découvrez comment booster votre trafic et décupler vos ventes grâce au référencement naturel",
        image: "assets/ebook-seo.jpg",
        downloadUrl: "assets/ebooks/guide-seo.pdf",
        features: [
            "Les 3 piliers fondamentaux du SEO",
            "Stratégies concrètes d'optimisation",
            "Méthodes d'évaluation des résultats"
        ]
    },
    {
        id: 2,
        title: "Boostez votre projet grâce au digital",
        description: "Guide complet des services web : création de sites, SEO et développement sur mesure",
        image: "assets/ebook-services.jpg",
        downloadUrl: "assets/ebooks/guide-services.pdf",
        features: [
            "Conception de sites internet professionnels",
            "Stratégies de référencement SEO",
            "Développement d'outils sur mesure"
        ]
    }
];

// Fonction pour créer les cartes d'e-books
function createResourceCards() {
    const grid = document.querySelector('.resources-grid');
    grid.innerHTML = ''; // Nettoyer la grille avant d'ajouter les cartes
    
    ebooks.forEach(ebook => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        
        const featuresList = ebook.features.map(feature => 
            `<li><i class="fas fa-check"></i> ${feature}</li>`
        ).join('');
        
        card.innerHTML = `
            <img src="${ebook.image}" alt="${ebook.title}" loading="lazy">
            <div class="resource-card-content">
                <h3>${ebook.title}</h3>
                <p>${ebook.description}</p>
                <ul class="feature-list">
                    ${featuresList}
                </ul>
                <button class="download-button" data-id="${ebook.id}">
                    <i class="fas fa-download"></i> Télécharger
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Gestion du modal
const modal = document.getElementById('downloadModal');
const closeButton = document.querySelector('.close-button');
let currentEbookId = null;

// Fermer le modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Réactiver le scroll
}

// Ouvrir le modal
function openModal(ebookId) {
    currentEbookId = ebookId;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Désactiver le scroll
}

// Fonction pour valider le formulaire
function validateForm(formData) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s-]{8,}$/;
    
    if (!formData.name || formData.name.length < 2) {
        throw new Error('Veuillez entrer un nom valide');
    }
    
    if (!emailRegex.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide');
    }
    
    if (!phoneRegex.test(formData.phone)) {
        throw new Error('Veuillez entrer un numéro de téléphone valide');
    }
}

// Fonction pour sauvegarder les données (à implémenter avec un backend)
async function saveUserData(formData) {
    // Simulation d'une requête API
    return new Promise((resolve) => {
        console.log('Données sauvegardées:', formData);
        setTimeout(resolve, 1000);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('authModal');
    const authForm = document.getElementById('authForm');
    let targetEbookUrl = '';

    // Vérifie si l'utilisateur est déjà authentifié
    const isAuthenticated = () => {
        const userData = localStorage.getItem('userData');
        return userData !== null;
    };

    // Gestionnaire de clic pour les boutons "Découvrir le guide"
    document.querySelectorAll('.cta-button').forEach(button => {
        if (button.getAttribute('href')?.includes('ebook-')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                targetEbookUrl = button.getAttribute('href');

                // Si l'utilisateur est déjà authentifié, on le redirige directement
                if (isAuthenticated()) {
                    window.location.href = targetEbookUrl;
                } else {
                    // Sinon on affiche le modal
                    authModal.classList.add('show');
                }
            });
        }
    });

    // Soumission du formulaire
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            timestamp: new Date().toISOString(),
            ebook: targetEbookUrl
        };

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Sauvegarde les données dans le localStorage
                localStorage.setItem('userData', JSON.stringify(formData));
                
                // Ferme le modal et redirige vers l'ebook
                authModal.classList.remove('show');
                window.location.href = targetEbookUrl;
            } else {
                throw new Error('Erreur lors de l\'enregistrement');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });

    // Fermer le modal en cliquant en dehors
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('show');
        }
    });

    createResourceCards();

    // Gérer les clics sur les boutons de téléchargement
    document.addEventListener('click', (e) => {
        if (e.target.closest('.download-button')) {
            const button = e.target.closest('.download-button');
            const ebookId = button.dataset.id;
            openModal(ebookId);
        }
    });

    // Fermer le modal avec le bouton X
    closeButton.addEventListener('click', closeModal);

    // Fermer le modal en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Gérer la soumission du formulaire
    const downloadForm = document.getElementById('downloadForm');
    downloadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            ebookId: currentEbookId,
            timestamp: new Date().toISOString()
        };

        try {
            // Valider les données du formulaire
            validateForm(formData);
            
            // Afficher un indicateur de chargement
            const submitButton = downloadForm.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
            submitButton.disabled = true;

            // Sauvegarder les données
            await saveUserData(formData);
            
            // Trouver l'URL de téléchargement
            const ebook = ebooks.find(eb => eb.id === parseInt(currentEbookId));
            if (ebook) {
                // Simuler le téléchargement
                const link = document.createElement('a');
                link.href = ebook.downloadUrl;
                link.download = ebook.title.replace(/\s+/g, '-').toLowerCase() + '.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Afficher un message de succès
                alert('Merci ! Votre e-book va commencer à se télécharger.');
            }
            
            // Réinitialiser le formulaire et fermer le modal
            downloadForm.reset();
            closeModal();
            
        } catch (error) {
            alert(error.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            // Restaurer le bouton
            const submitButton = downloadForm.querySelector('.submit-button');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    // Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('Initialisation de l\'authentification');
    const modal = document.getElementById('authModal');
    const form = document.getElementById('authForm');
    const ebookLinks = document.querySelectorAll('.ebook-link');
    
    console.log('Nombre de liens ebook trouvés:', ebookLinks.length);

    // Vérifie si l'utilisateur est déjà authentifié
    const isAuthenticated = localStorage.getItem('userAuthenticated');
    
    // Ajoute les listeners sur les liens d'ebooks
    ebookLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Clic sur un lien ebook');
            e.preventDefault();
            const ebookPath = link.getAttribute('href');
            console.log('Chemin de l\'ebook:', ebookPath);
            
            if (!isAuthenticated) {
                console.log('Utilisateur non authentifié, affichage du modal');
                // Stocke le chemin de l'ebook pour plus tard
                sessionStorage.setItem('pendingEbook', ebookPath);
                // Affiche le modal
                modal.style.display = 'block';
            } else {
                console.log('Utilisateur déjà authentifié, redirection directe');
                window.location.href = ebookPath;
            }
        });
    });

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Soumission du formulaire');
        
        const formData = {
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            ebook: sessionStorage.getItem('pendingEbook')
        };

        console.log('Données du formulaire:', formData);

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Réponse du serveur:', data);

            if (data.success) {
                console.log('Authentification réussie');
                // Stocke l'authentification
                localStorage.setItem('userAuthenticated', 'true');
                localStorage.setItem('userEmail', formData.email);
                
                // Redirige vers l'ebook
                const ebookPath = sessionStorage.getItem('pendingEbook');
                console.log('Redirection vers:', ebookPath);
                window.location.href = ebookPath;
                
                // Nettoie le storage
                sessionStorage.removeItem('pendingEbook');
                
                // Cache le modal
                modal.style.display = 'none';
            } else {
                console.error('Erreur d\'authentification');
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Auth Error:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });

    // Ferme le modal si on clique en dehors
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
