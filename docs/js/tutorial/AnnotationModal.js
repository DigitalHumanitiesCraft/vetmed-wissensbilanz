/**
 * AnnotationModal - Zeigt Entstehungsgeschichte einer Design-Entscheidung
 *
 * Modal-Inhalt:
 * - Design-Prinzip Code und Name (z.B. "F1: Progressive Offenlegung")
 * - Promptotyping-Phase (mit Farbe)
 * - Beschreibung
 * - Ursprungs-Hypothese (falls vorhanden)
 * - Insight / Learning
 * - Link zur vollständigen Dokumentation
 */

import { PHASE_COLORS } from './TutorialBadgeSystem.js';
import { eventBus, EVENTS } from '../core/eventBus.js';

class AnnotationModal {
    constructor() {
        this.element = null;
        this.isOpen = false;
        this.currentAnnotation = null;
    }

    /**
     * Initialisiert das Modal
     */
    init() {
        this.createModal();
        this.attachEventListeners();
    }

    /**
     * Erstellt das Modal-Element
     */
    createModal() {
        this.element = document.createElement('div');
        this.element.className = 'annotation-modal';
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');
        this.element.setAttribute('aria-labelledby', 'annotation-modal-title');
        document.body.appendChild(this.element);
    }

    /**
     * Bindet Event-Listener
     */
    attachEventListeners() {
        // Custom Event für Badge-Klicks
        window.addEventListener('tutorial:showAnnotation', (e) => {
            this.show(e.detail);
        });

        // ESC zum Schließen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
            }
        });
    }

    /**
     * Zeigt das Modal mit Annotation-Details
     */
    show(annotation) {
        this.currentAnnotation = annotation;
        const phaseColor = PHASE_COLORS[annotation.phase] || PHASE_COLORS.destillation;
        const phaseName = this.getPhaseName(annotation.phase);

        this.element.innerHTML = `
            <div class="annotation-modal__backdrop"></div>
            <div class="annotation-modal__content">
                <button class="annotation-modal__close" aria-label="Schließen">×</button>

                <header class="annotation-modal__header">
                    <span class="annotation-modal__code annotation-modal__code--${annotation.category}">
                        ${annotation.code}
                    </span>
                    <h2 class="annotation-modal__title" id="annotation-modal-title">
                        ${annotation.name}
                    </h2>
                </header>

                <div class="annotation-modal__phase" style="background: ${phaseColor.bg}; color: ${phaseColor.text};">
                    <span class="annotation-modal__phase-label">Promptotyping-Phase:</span>
                    <strong>${phaseName}</strong>
                </div>

                <div class="annotation-modal__body">
                    <p class="annotation-modal__description">${annotation.description}</p>

                    ${annotation.origin ? this.renderOrigin(annotation.origin) : ''}
                </div>

                <footer class="annotation-modal__footer">
                    <button class="btn btn--primary" data-action="open-doc">
                        Dokumentation lesen →
                    </button>
                </footer>
            </div>
        `;

        // Event Listener für Modal-Interaktionen
        this.element.querySelector('.annotation-modal__backdrop')
            .addEventListener('click', () => this.hide());

        this.element.querySelector('.annotation-modal__close')
            .addEventListener('click', () => this.hide());

        this.element.querySelector('[data-action="open-doc"]')
            .addEventListener('click', () => this.navigateToDoc());

        // Modal öffnen
        this.element.classList.add('annotation-modal--open');
        this.isOpen = true;

        // Fokus auf Close-Button
        this.element.querySelector('.annotation-modal__close').focus();
    }

    /**
     * Rendert die Entstehungsgeschichte
     */
    renderOrigin(origin) {
        return `
            <div class="annotation-modal__origin">
                <h3>Entstehungsgeschichte</h3>
                ${origin.hypothesis ? `
                    <div class="origin-item">
                        <span class="origin-label">Hypothese:</span>
                        <span class="origin-value">${origin.hypothesis}</span>
                    </div>
                ` : ''}
                <div class="origin-item">
                    <span class="origin-label">Erkenntnis:</span>
                    <span class="origin-value">${origin.insight}</span>
                </div>
                ${origin.iteration ? `
                    <div class="origin-item">
                        <span class="origin-label">Iteration:</span>
                        <span class="origin-value">${origin.iteration}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Schließt das Modal
     */
    hide() {
        this.element.classList.remove('annotation-modal--open');
        this.isOpen = false;
        this.currentAnnotation = null;
    }

    /**
     * Navigiert zur Dokumentation
     */
    navigateToDoc() {
        if (!this.currentAnnotation) return;

        const docRef = this.currentAnnotation.documentRef;
        this.hide();

        // Event emittieren für Navigation zum Dokument
        // Format: "02-Design/UI-Prinzipien.md"
        const [category, filename] = docRef.split('/');

        eventBus.emit(EVENTS.PAGE_CHANGE, 'promptotyping');

        // Nach kurzer Verzögerung das Dokument laden
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('tutorial:loadDocument', {
                detail: { category, filename }
            }));
        }, 100);
    }

    /**
     * Gibt den deutschen Namen einer Phase zurück
     */
    getPhaseName(phaseId) {
        const names = {
            foundation: 'Foundation',
            preparation: 'Preparation',
            exploration: 'Exploration',
            destillation: 'Destillation',
            meta: 'Meta-Learning',
            chronicle: 'Chronicle'
        };
        return names[phaseId] || phaseId;
    }
}

// Singleton-Instanz
export const annotationModal = new AnnotationModal();

/**
 * Initialisiert das Annotation-Modal
 */
export function initAnnotationModal() {
    annotationModal.init();
    return annotationModal;
}
