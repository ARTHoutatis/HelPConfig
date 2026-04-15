/**
 * HelPConfig - Main JavaScript
 * Gestion de la navigation et interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    initDocNavigation();
    initConfigurateur();
    initBackToTop();
});

/**
 * Navigation Documentation - Onglets
 */
function initDocNavigation() {
    const navLinks = document.querySelectorAll('.doc-nav-link');
    const sections = document.querySelectorAll('.doc-section');
    
    if (navLinks.length === 0) return;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Mettre à jour les liens actifs
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher la section correspondante
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // Scroll vers le haut sur mobile
            if (window.innerWidth <= 1024) {
                document.querySelector('.doc-content').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    function updateVisibility() {
        if (window.scrollY > 240) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Configurateur PC - Interactions basiques
 */
function initConfigurateur() {
    const selectButtons = document.querySelectorAll('.btn-select');
    const modal = document.getElementById('component-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    
    if (!modal) return;
    
    // Ouvrir le modal
    selectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const component = this.getAttribute('data-component');
            const componentNames = {
                'cpu': 'Processeur (CPU)',
                'gpu': 'Carte graphique (GPU)',
                'motherboard': 'Carte mère',
                'ram': 'Mémoire RAM',
                'storage': 'Stockage (SSD)',
                'psu': 'Alimentation (PSU)',
                'case': 'Boîtier',
                'cooling': 'Refroidissement'
            };
            
            modalTitle.textContent = 'Choisir : ' + (componentNames[component] || 'Composant');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Fermer le modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    const shareBtn = document.querySelector('.btn-share');
    const restartBtn = document.getElementById('btn-restart');
    const addButtons = document.querySelectorAll('.btn-add');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (!this.disabled) {
                alert('Lien de partage copié dans le presse-papiers !');
            }
        });
    }
    
    // Bouton redémarrer
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            if (confirm('Voulez-vous vraiment recommencer une nouvelle configuration ?')) {
                // Reset les compteurs
                document.getElementById('ram-count').textContent = '(0)';
                document.getElementById('storage-count').textContent = '(0)';
                document.getElementById('selected-count').textContent = '0/8';
                document.getElementById('total-price').textContent = '0 €';
                
                // Reset les prix
                document.querySelectorAll('.component-price').forEach(price => {
                    price.textContent = '--';
                });
                
                // Désactiver le bouton partager
                if (shareBtn) shareBtn.disabled = true;
                
                alert('Configuration redémarrée !');
            }
        });
    }
    
    // Boutons + pour ajouter des emplacements supplémentaires
    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const component = this.getAttribute('data-component');
            const slotsContainer = document.getElementById(component + '-slots');
            const countEl = document.getElementById(component + '-count');
            
            if (!slotsContainer) return;
            
            // Créer un nouvel emplacement
            const slotNumber = slotsContainer.children.length + 2;
            const slotDiv = document.createElement('div');
            slotDiv.className = 'component-row extra-slot';
            slotDiv.setAttribute('data-extra', component);
            
            const componentLabels = {
                'ram': 'RAM supplémentaire',
                'storage': 'SSD supplémentaire'
            };
            
            slotDiv.innerHTML = `
                <div class="component-info">
                    <span class="component-number sub-number">${slotNumber}</span>
                    <div class="component-details">
                        <h3>${componentLabels[component] || 'Composant'}</h3>
                        <p class="component-desc">Cliquez sur Choisir pour sélectionner</p>
                    </div>
                </div>
                <div class="component-actions">
                    <button class="btn btn-select" data-component="${component}">Choisir</button>
                    <span class="action-slot">
                        <button class="btn btn-remove" title="Supprimer cet emplacement">×</button>
                    </span>
                    <span class="component-price">--</span>
                </div>
            `;
            
            slotsContainer.appendChild(slotDiv);
            
            // Mettre à jour le compteur
            if (countEl) {
                let count = parseInt(countEl.textContent.replace(/[()]/g, '')) || 0;
                count++;
                countEl.textContent = '(' + count + ')';
            }
            
            // Ajouter l'événement de suppression
            const removeBtn = slotDiv.querySelector('.btn-remove');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    slotDiv.remove();
                    if (countEl) {
                        let count = parseInt(countEl.textContent.replace(/[()]/g, '')) || 0;
                        count = Math.max(0, count - 1);
                        countEl.textContent = '(' + count + ')';
                    }
                    // Renumber remaining slots
                    const remainingSlots = slotsContainer.querySelectorAll('.extra-slot');
                    remainingSlots.forEach((slot, idx) => {
                        slot.querySelector('.sub-number').textContent = idx + 2;
                    });
                });
            }
        });
    });
}

/**
 * Smooth scroll pour les ancres
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
