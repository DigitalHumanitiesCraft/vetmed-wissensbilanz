/**
 * TutorialBadge - Einzelne Badge-Komponente
 *
 * Rendert einen interaktiven Badge an einem UI-Element.
 * Bei Klick wird ein Event emittiert, das das AnnotationModal öffnet.
 */

import { state } from '../core/state.js';
import { CATEGORY_COLORS } from './TutorialBadgeSystem.js';

export class TutorialBadge {
    constructor(annotation, targetElement) {
        this.annotation = annotation;
        this.target = targetElement;
        this.element = null;
    }

    /**
     * Rendert den Badge und fügt ihn zum Target hinzu
     */
    render() {
        // Badge-Element erstellen
        this.element = document.createElement('button');
        this.element.className = `tutorial-badge tutorial-badge--${this.annotation.category}`;
        this.element.dataset.code = this.annotation.code;
        this.element.dataset.phase = this.annotation.phase;
        this.element.setAttribute('aria-label', `${this.annotation.code}: ${this.annotation.name}`);
        this.element.title = this.annotation.name;

        // Farbe basierend auf Kategorie
        const color = CATEGORY_COLORS[this.annotation.category] || '#6c757d';
        this.element.style.setProperty('--badge-color', color);

        // Badge-Inhalt
        this.element.innerHTML = `
            <span class="tutorial-badge__code">${this.annotation.code}</span>
            ${this.isNew() ? '<span class="tutorial-badge__pulse"></span>' : ''}
        `;

        // Target als relative Position setzen (falls nicht bereits)
        const targetPosition = window.getComputedStyle(this.target).position;
        if (targetPosition === 'static') {
            this.target.style.position = 'relative';
        }

        // Badge ans Target anhängen
        this.target.appendChild(this.element);

        // Event Listener
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleClick();
        });

        // Keyboard-Unterstützung
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleClick();
            }
        });
    }

    /**
     * Prüft ob dieser Badge neu (noch nicht gesehen) ist
     */
    isNew() {
        const completed = state.get('completedAnnotations') || [];
        return !completed.includes(this.annotation.code);
    }

    /**
     * Handler für Badge-Klick
     */
    handleClick() {
        // Custom Event für Modal
        window.dispatchEvent(new CustomEvent('tutorial:showAnnotation', {
            detail: this.annotation
        }));

        // Puls-Animation entfernen nach erstem Klick
        const pulse = this.element.querySelector('.tutorial-badge__pulse');
        if (pulse) {
            pulse.remove();
        }
        this.element.classList.add('tutorial-badge--viewed');
    }

    /**
     * Entfernt den Badge aus dem DOM
     */
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }

    /**
     * Aktualisiert den Badge-Status
     */
    update() {
        if (!this.element) return;

        if (!this.isNew()) {
            this.element.classList.add('tutorial-badge--viewed');
            const pulse = this.element.querySelector('.tutorial-badge__pulse');
            if (pulse) {
                pulse.remove();
            }
        }
    }
}
