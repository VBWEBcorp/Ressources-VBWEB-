document.addEventListener('DOMContentLoaded', function() {
    const chapters = document.querySelectorAll('.chapter');
    const chapterItems = document.querySelectorAll('.chapter-item');
    const prevButton = document.getElementById('prevChapter');
    const nextButton = document.getElementById('nextChapter');
    const currentChapterSpan = document.getElementById('currentChapter');
    const progressBar = document.getElementById('readingProgress');
    let currentChapterIndex = 0;
    let isAnimating = false;

    // Fonction pour animer la transition entre les chapitres
    function animateChapterTransition(from, to, direction) {
        if (isAnimating) return;
        isAnimating = true;

        const fromChapter = chapters[from];
        const toChapter = chapters[to];
        
        // Préparation de l'animation
        toChapter.style.display = 'block';
        toChapter.style.opacity = '0';
        toChapter.style.transform = `translateX(${direction * 50}px)`;

        // Animation de sortie
        fromChapter.style.opacity = '0';
        fromChapter.style.transform = `translateX(${direction * -50}px)`;

        // Attendre la fin de l'animation de sortie
        setTimeout(() => {
            fromChapter.style.display = 'none';
            
            // Animation d'entrée
            toChapter.style.opacity = '1';
            toChapter.style.transform = 'translateX(0)';

            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }, 300);
    }

    // Navigation vers un chapitre spécifique
    function navigateToChapter(index) {
        if (index < 0 || index >= chapters.length || isAnimating) return;

        const direction = index > currentChapterIndex ? 1 : -1;
        animateChapterTransition(currentChapterIndex, index, direction);
        
        currentChapterIndex = index;
        updateNavigation();
        updateProgress();

        // Scroll fluide vers le haut
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Mise à jour des boutons de navigation avec animation
    function updateNavigation() {
        // Animation des boutons
        [prevButton, nextButton].forEach(button => {
            button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        prevButton.disabled = currentChapterIndex === 0;
        nextButton.disabled = currentChapterIndex === chapters.length - 1;
        
        // Animation du compteur
        currentChapterSpan.style.transform = 'scale(0.8)';
        setTimeout(() => {
            currentChapterSpan.textContent = currentChapterIndex + 1;
            currentChapterSpan.style.transform = 'scale(1)';
        }, 150);

        // Mise à jour du menu latéral avec animation
        chapterItems.forEach((item, index) => {
            if (index === currentChapterIndex) {
                item.classList.add('active');
                item.style.transform = 'translateX(5px)';
            } else {
                item.classList.remove('active');
                item.style.transform = 'translateX(0)';
            }
        });
    }

    // Mise à jour de la barre de progression avec animation fluide
    function updateProgress() {
        const progress = ((currentChapterIndex + 1) / chapters.length) * 100;
        progressBar.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        progressBar.style.width = `${progress}%`;
    }

    // Gestionnaires d'événements
    prevButton.addEventListener('click', () => {
        navigateToChapter(currentChapterIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        navigateToChapter(currentChapterIndex + 1);
    });

    // Animation au survol des boutons
    [prevButton, nextButton].forEach(button => {
        button.addEventListener('mouseover', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(-2px)';
            }
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    chapterItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            navigateToChapter(index);
        });

        // Animation au survol des éléments du menu
        item.addEventListener('mouseover', () => {
            if (index !== currentChapterIndex) {
                item.style.transform = 'translateX(5px)';
            }
        });

        item.addEventListener('mouseout', () => {
            if (index !== currentChapterIndex) {
                item.style.transform = 'translateX(0)';
            }
        });
    });

    // Gestion du défilement avec animation fluide
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
            const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const currentChapter = chapters[currentChapterIndex];
            
            if (currentChapter) {
                const chapterRect = currentChapter.getBoundingClientRect();
                const chapterVisibility = 1 - (chapterRect.bottom / window.innerHeight);
                const totalProgress = ((currentChapterIndex + chapterVisibility) / chapters.length) * 100;
                
                progressBar.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                progressBar.style.width = `${Math.min(totalProgress, (currentChapterIndex + 1) * 25)}%`;
            }
        }, 20);
    });

    // Gestion des raccourcis clavier avec retour visuel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevButton.classList.add('active');
            navigateToChapter(currentChapterIndex - 1);
            setTimeout(() => prevButton.classList.remove('active'), 200);
        } else if (e.key === 'ArrowRight') {
            nextButton.classList.add('active');
            navigateToChapter(currentChapterIndex + 1);
            setTimeout(() => nextButton.classList.remove('active'), 200);
        }
    });

    // Animation initiale
    function initializeChapters() {
        chapters.forEach((chapter, index) => {
            if (index === 0) {
                chapter.style.display = 'block';
                setTimeout(() => {
                    chapter.style.opacity = '1';
                    chapter.style.transform = 'translateY(0)';
                }, 100);
            }
        });
        updateNavigation();
        updateProgress();
    }

    // Initialisation avec un léger délai pour permettre le rendu initial
    setTimeout(initializeChapters, 100);
});
