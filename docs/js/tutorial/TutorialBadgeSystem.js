/**
 * TutorialBadgeSystem - Annotated Interface für Promptotyping
 *
 * Zentrale Koordination aller Design-Annotationen.
 * Jede Design-Entscheidung (F1-F4, V1-V6, R1-R6, L001-L008) ist mit
 * ihrer Entstehungsgeschichte dokumentiert.
 *
 * Drei-Schichten-Architektur:
 * 1. Layer 1: Tutorial-Badges an UI-Elementen
 * 2. Layer 2: Annotation-Modal mit Entstehungsgeschichte
 * 3. Layer 3: Promptotyping-Tab (vollständige Dokumentation)
 */

import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { TutorialBadge } from './TutorialBadge.js';

/**
 * Alle Design-Annotationen mit Entstehungsgeschichte
 */
export const DESIGN_ANNOTATIONS = {
    // ===== Filter-Prinzipien (F1-F4) =====
    'F1': {
        code: 'F1',
        name: 'Progressive Offenlegung',
        phase: 'destillation',
        category: 'filter',
        description: 'Basisfilter standardmäßig sichtbar, Expertenfilter auf Anfrage.',
        appliedTo: ['#uniAccordion'],
        learningPath: 1,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: 'H1: Ad-hoc Anfragen',
            insight: 'Führungskräfte brauchen schnelle Antworten, nicht alle Optionen gleichzeitig',
            iteration: 'Exploration Phase'
        }
    },
    'F2': {
        code: 'F2',
        name: 'Filter-Persistenz',
        phase: 'destillation',
        category: 'filter',
        description: 'URL-Parameter kodieren Filter-Zustand für teilbare Analysen.',
        appliedTo: ['#shareBtn'],
        learningPath: 2,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: null,
            insight: 'Teilbare Analysen ermöglichen Kollaboration im Team',
            iteration: 'Destillation Phase'
        }
    },
    'F3': {
        code: 'F3',
        name: 'Kategorisierte Filtergruppen',
        phase: 'destillation',
        category: 'filter',
        description: 'Filter gruppiert nach: Institutionell, Temporal, Inhaltlich.',
        appliedTo: ['#kennzahlSelect'],
        learningPath: 1,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: 'H1: Ad-hoc Anfragen',
            insight: 'Strukturierte Filter reduzieren kognitive Last',
            iteration: 'Destillation Phase'
        }
    },
    'F4': {
        code: 'F4',
        name: 'Sofortiges Filterfeedback',
        phase: 'destillation',
        category: 'filter',
        description: 'Datenpunkt-Anzahl vor Filteranwendung anzeigen.',
        appliedTo: ['#mainStatsBar'],
        learningPath: 1,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: 'H1: Ad-hoc Anfragen',
            insight: 'Verhindert leere Ergebnismengen und Frustration',
            iteration: 'Exploration Phase'
        }
    },

    // ===== Visualisierungs-Prinzipien (V1-V6) =====
    'V1': {
        code: 'V1',
        name: 'Semantische Farbkodierung',
        phase: 'destillation',
        category: 'viz',
        description: 'Konsistente Farben für Universitätstypen in allen Ansichten.',
        appliedTo: ['#chartPanel'],
        learningPath: 1,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: null,
            insight: 'Farben aus Farbpalette.md direkt als CSS-Variablen anwendbar',
            iteration: 'Destillation Phase'
        }
    },
    'V2': {
        code: 'V2',
        name: 'Fokus + Kontext',
        phase: 'destillation',
        category: 'viz',
        description: 'Ausgewählte Unis hervorgehoben, andere abgeblendet.',
        appliedTo: ['.chart-wrapper'],
        learningPath: 2,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: null,
            insight: 'Hervorhebung ohne Informationsverlust',
            iteration: 'Destillation Phase'
        }
    },
    'V3': {
        code: 'V3',
        name: 'Referenzlinien',
        phase: 'destillation',
        category: 'viz',
        description: 'Gestrichelte Durchschnittslinie als Orientierung.',
        appliedTo: ['.chart-canvas-wrapper'],
        learningPath: 2,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: null,
            insight: 'Durchschnitt ermöglicht schnellen Vergleich',
            iteration: 'Destillation Phase'
        }
    },
    'V4': {
        code: 'V4',
        name: 'Small Multiples',
        phase: 'destillation',
        category: 'viz',
        description: 'Gleiche Visualisierung für verschiedene Gruppen nebeneinander.',
        appliedTo: ['.viz-selector'],
        learningPath: 2,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: null,
            insight: 'Vergleiche zwischen Gruppen werden visuell unterstützt',
            iteration: 'Destillation Phase'
        }
    },

    // ===== LLM-Report-Prinzipien (R1-R6) =====
    'R1': {
        code: 'R1',
        name: 'Explizite Quellenattribution',
        phase: 'destillation',
        category: 'report',
        description: 'Jede Aussage im Bericht mit Datengrundlage verknüpft.',
        appliedTo: ['#reportPanel'],
        learningPath: 2,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: 'H2: LLM-Berichte',
            insight: 'Vertrauen durch Transparenz (vgl. TrustLLM, Huang 2024)',
            iteration: 'Destillation Phase'
        }
    },
    'R3': {
        code: 'R3',
        name: 'Template-basierte Strukturierung',
        phase: 'destillation',
        category: 'report',
        description: 'Vordefinierte Berichtstypen für konsistente Struktur.',
        appliedTo: ['.tabs__tab[data-tab="report"]'],
        learningPath: 2,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: 'H2: LLM-Berichte',
            insight: 'Templates reduzieren Variabilität des LLM-Outputs',
            iteration: 'Destillation Phase'
        }
    },
    'R5': {
        code: 'R5',
        name: 'Editierbare Zwischenergebnisse',
        phase: 'destillation',
        category: 'report',
        description: 'Generierter Text ist bearbeitbar, LLM als Ausgangspunkt.',
        appliedTo: ['#tablePanel'],
        learningPath: 3,
        documentRef: '02-Design/UI-Prinzipien.md',
        origin: {
            hypothesis: 'H2: LLM-Berichte',
            insight: 'LLM liefert Entwurf, Mensch finalisiert',
            iteration: 'Meta-Learning Phase'
        }
    },

    // ===== Methoden-Learnings (L001-L008) =====
    'L001': {
        code: 'L001',
        name: 'Iterative Synthese',
        phase: 'meta',
        category: 'method',
        description: 'Synthetisiere in kleinen Batches, verifiziere mit Primärquellen.',
        appliedTo: ['.sidebar'],
        learningPath: 3,
        documentRef: '04-Learnings/L001-Iterative-Synthese.md',
        origin: {
            hypothesis: null,
            insight: 'Uni-Codes wurden iterativ gegen Excel-Dateien geprüft',
            iteration: 'Preparation Phase'
        }
    },
    'L006': {
        code: 'L006',
        name: 'Vanilla JS für Lernbarkeit',
        phase: 'meta',
        category: 'method',
        description: 'Weniger Abstraktion = mehr Verständnis für Lernende.',
        appliedTo: ['.header__logo'],
        learningPath: 3,
        documentRef: '04-Learnings/L006-Vanilla-JS-Lernbarkeit.md',
        origin: {
            hypothesis: null,
            insight: 'Bei Lehrbeispielen sind Framework-Abstraktionen hinderlich',
            iteration: 'Meta-Learning Phase'
        }
    }
};

/**
 * Learning Paths für Progressive Disclosure
 */
export const LEARNING_PATHS = {
    1: {
        name: 'Basics',
        annotations: ['F1', 'F3', 'F4', 'V1'],
        unlockCondition: null
    },
    2: {
        name: 'Intermediate',
        annotations: ['F2', 'V2', 'V3', 'V4', 'R1', 'R3'],
        unlockCondition: 'complete_3_basics'
    },
    3: {
        name: 'Advanced',
        annotations: ['R5', 'L001', 'L006'],
        unlockCondition: 'complete_3_intermediate'
    }
};

/**
 * Phase-Farben (konsistent mit tutorial.css)
 */
export const PHASE_COLORS = {
    foundation: { bg: '#e8f4f8', text: '#0c5460' },
    preparation: { bg: '#d4edda', text: '#155724' },
    exploration: { bg: '#fff3cd', text: '#856404' },
    destillation: { bg: '#d1ecf1', text: '#0c5460' },
    meta: { bg: '#e2d9f3', text: '#5a3d8e' },
    chronicle: { bg: '#f8d7da', text: '#721c24' }
};

/**
 * Kategorie-Farben für Badges
 */
export const CATEGORY_COLORS = {
    filter: '#28a745',   // Grün (tech)
    viz: '#1a5490',      // Blau (voll)
    report: '#6f42c1',   // Violett (kunst)
    method: '#dc3545'    // Rot (med)
};

class TutorialBadgeSystem {
    constructor() {
        this.badges = [];
        this.isActive = false;
    }

    /**
     * Aktiviert Tutorial-Badges auf dem Dashboard
     */
    activate() {
        if (this.isActive) return;

        const currentLevel = this.getCurrentLevel();

        Object.values(DESIGN_ANNOTATIONS).forEach(annotation => {
            if (annotation.learningPath <= currentLevel) {
                this.createBadgesForAnnotation(annotation);
            }
        });

        this.isActive = true;
        eventBus.emit(EVENTS.TUTORIAL_MODE_CHANGE, true);
    }

    /**
     * Deaktiviert Tutorial-Badges
     */
    deactivate() {
        this.badges.forEach(badge => badge.remove());
        this.badges = [];
        this.isActive = false;
        eventBus.emit(EVENTS.TUTORIAL_MODE_CHANGE, false);
    }

    /**
     * Toggle Tutorial-Modus
     */
    toggle() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
        state.set('tutorialMode', this.isActive);
    }

    /**
     * Erstellt Badges für eine Annotation an allen Ziel-Elementen
     */
    createBadgesForAnnotation(annotation) {
        annotation.appliedTo.forEach(selector => {
            const target = document.querySelector(selector);
            if (target) {
                const badge = new TutorialBadge(annotation, target);
                badge.render();
                this.badges.push(badge);
            }
        });
    }

    /**
     * Gibt das aktuelle Learning-Path-Level zurück
     */
    getCurrentLevel() {
        const completed = state.get('completedAnnotations') || [];

        // Level 2 freigeschaltet?
        const basicsCompleted = LEARNING_PATHS[1].annotations
            .filter(code => completed.includes(code)).length;
        if (basicsCompleted < 3) return 1;

        // Level 3 freigeschaltet?
        const intermediateCompleted = LEARNING_PATHS[2].annotations
            .filter(code => completed.includes(code)).length;
        if (intermediateCompleted < 3) return 2;

        return 3;
    }

    /**
     * Markiert eine Annotation als gesehen
     */
    markViewed(code) {
        const completed = state.get('completedAnnotations') || [];
        if (!completed.includes(code)) {
            completed.push(code);
            state.set('completedAnnotations', completed);
            localStorage.setItem('tutorial_completed', JSON.stringify(completed));

            // Level-Up prüfen
            this.checkLevelUp();

            // Event emittieren
            eventBus.emit(EVENTS.ANNOTATION_VIEWED, code);
        }
    }

    /**
     * Prüft ob ein Level-Up stattgefunden hat
     */
    checkLevelUp() {
        const previousLevel = state.get('tutorialLevel') || 1;
        const currentLevel = this.getCurrentLevel();

        if (currentLevel > previousLevel) {
            state.set('tutorialLevel', currentLevel);
            eventBus.emit(EVENTS.TUTORIAL_LEVEL_UP, {
                level: currentLevel,
                name: LEARNING_PATHS[currentLevel].name
            });

            // Neue Badges aktivieren
            if (this.isActive) {
                Object.values(DESIGN_ANNOTATIONS).forEach(annotation => {
                    if (annotation.learningPath === currentLevel) {
                        this.createBadgesForAnnotation(annotation);
                    }
                });
            }
        }
    }

    /**
     * Gibt den Fortschritt zurück
     */
    getProgress() {
        const completed = state.get('completedAnnotations') || [];
        const total = Object.keys(DESIGN_ANNOTATIONS).length;

        return {
            completed: completed.length,
            total,
            percentage: Math.round((completed.length / total) * 100),
            level: this.getCurrentLevel(),
            levelName: LEARNING_PATHS[this.getCurrentLevel()].name
        };
    }

    /**
     * Gibt eine Annotation nach Code zurück
     */
    getAnnotation(code) {
        return DESIGN_ANNOTATIONS[code] || null;
    }

    /**
     * Initialisiert das System beim App-Start
     */
    init() {
        // Gespeicherten Fortschritt laden
        const saved = localStorage.getItem('tutorial_completed');
        if (saved) {
            state.set('completedAnnotations', JSON.parse(saved));
        }

        // Tutorial-Mode aus State wiederherstellen
        if (state.get('tutorialMode')) {
            this.activate();
        }

        // Event-Listener für Annotation-Klicks
        window.addEventListener('tutorial:showAnnotation', (e) => {
            this.markViewed(e.detail.code);
        });
    }
}

// Singleton-Instanz
export const tutorialBadgeSystem = new TutorialBadgeSystem();

/**
 * Initialisiert das Tutorial-Badge-System
 */
export function initTutorialBadgeSystem() {
    tutorialBadgeSystem.init();
    return tutorialBadgeSystem;
}
