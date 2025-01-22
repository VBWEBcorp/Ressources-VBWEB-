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
});
