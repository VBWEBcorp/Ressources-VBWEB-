// Initialisation de Supabase
// Trouvez ces informations dans votre projet Supabase :
// 1. Allez sur https://app.supabase.com
// 2. Cliquez sur votre projet
// 3. Dans "Settings" > "API"
// 4. Copiez "Project URL" ici :
const SUPABASE_URL = 'https://aleczxflwsftalprcbad.supabase.co'
// 5. Copiez "anon public" ici :
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZWN6eGZsd3NmdGFscHJjYmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1ODE1MTcsImV4cCI6MjA1MzE1NzUxN30.pFmhzmZ79u0DxbvF2TfnF3wflps2aa362_nBM8rPr2Y'

// Création du client Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Fonction pour afficher le modal
function showModal(ebookType) {
    const modal = document.getElementById(`modal-${ebookType}`);
    if (modal) {
        modal.classList.add('show');
    }
}

// Fonction pour fermer le modal
function closeModal(ebookType) {
    const modal = document.getElementById(`modal-${ebookType}`);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Fermer le modal si on clique en dehors
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

// Fonction pour valider l'email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Fonction pour valider le numéro de téléphone (format français)
function isValidPhone(phone) {
    return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone);
}

// Fonction pour afficher les erreurs
function showError(element, message) {
    element.textContent = message;
    element.style.display = "block";
    element.style.color = "red";
    console.error('Erreur de formulaire:', message);
}

// Fonction pour gérer la soumission du formulaire
async function handleSubmit(event, ebookType) {
    event.preventDefault();
    console.log('Soumission du formulaire pour:', ebookType);
    
    const form = event.target;
    const errorElement = form.querySelector('.error-message');
    
    try {
        const formData = {
            firstname: form.querySelector('[name="firstname"]').value.trim(),
            lastname: form.querySelector('[name="lastname"]').value.trim(),
            email: form.querySelector('[name="email"]').value.trim(),
            phone: form.querySelector('[name="phone"]').value.trim(),
            ebook: ebookType
        };

        console.log('Données du formulaire:', formData);

        // Validation
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone) {
            throw new Error("Tous les champs sont obligatoires");
        }

        if (!isValidEmail(formData.email)) {
            throw new Error("Format d'email invalide");
        }

        if (!isValidPhone(formData.phone)) {
            throw new Error("Format de numéro de téléphone invalide (format français attendu)");
        }

        console.log('Tentative d\'insertion dans Supabase...');
        
        // Vérifier d'abord si l'email existe déjà
        const { data: existingUser } = await supabase
            .from('users')
            .select('id, ebook')
            .eq('email', formData.email)
            .single();

        if (existingUser) {
            // Si l'utilisateur existe déjà et demande le même ebook
            if (existingUser.ebook === ebookType) {
                console.log('Utilisateur existant, redirection vers l\'ebook...');
                closeModal(ebookType);
                window.location.href = `ebook-${ebookType}.html`;
                return;
            }
            // Si l'utilisateur existe mais demande un ebook différent
            const { data, error } = await supabase
                .from('users')
                .update({ ebook: ebookType, last_access: new Date().toISOString() })
                .eq('id', existingUser.id);

            if (error) throw error;
        } else {
            // Nouvel utilisateur
            const { data, error } = await supabase
                .from('users')
                .insert([formData]);

            if (error) throw error;
        }

        // Redirection vers l'e-book
        closeModal(ebookType);
        window.location.href = `ebook-${ebookType}.html`;
    } catch (error) {
        console.error('Erreur complète:', error);
        if (error.message.includes('duplicate key value')) {
            showError(errorElement, "Cette adresse email est déjà utilisée. Vous allez être redirigé vers l'e-book.");
            setTimeout(() => {
                closeModal(ebookType);
                window.location.href = `ebook-${ebookType}.html`;
            }, 2000);
        } else {
            showError(errorElement, error.message || "Une erreur est survenue. Veuillez réessayer.");
        }
    }
}
