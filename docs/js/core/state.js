/**
 * State - Zentraler Application State
 *
 * Verwaltet den globalen Zustand der Anwendung.
 * Benachrichtigt Subscriber bei Änderungen (reaktiv).
 *
 * Verwendung:
 *   import { state } from './state.js';
 *
 *   // State lesen
 *   const unis = state.get('selectedUniversities');
 *
 *   // State ändern
 *   state.set('selectedUniversities', ['UI', 'UM']);
 *
 *   // Auf Änderungen reagieren
 *   state.subscribe('selectedUniversities', (newValue) => console.log(newValue));
 */

import { eventBus, EVENTS } from './eventBus.js';

class AppState {
    constructor() {
        this.state = {
            // Filter-State
            selectedUniversities: ['UI'], // Default: VetMed Wien
            selectedUniTypes: [],
            yearRange: { start: 2021, end: 2024 },
            selectedKennzahl: '1-A-1', // Default: Personal Köpfe

            // UI-State
            activePage: 'dashboard', // 'dashboard' | 'promptotyping' | 'about'
            activeTab: 'chart', // 'chart' | 'table' | 'report'
            sidebarOpen: true,
            isLoading: false,

            // Daten-State
            currentData: null,
            filteredData: null,
            dataStats: {
                totalPoints: 0,
                average: 0,
                trend: 0
            },

            // Report-State
            reportTemplate: 'comparison', // 'summary' | 'comparison' | 'trend' | 'anomaly'
            reportContent: '',
            reportSources: [],

            // Visualization State
            vizType: 'line', // 'line' | 'smallMultiples' | 'heatmap' | 'ranking'
            vizOptions: {
                showAverage: false,
                rankingYear: 2024
            },

            // Tutorial State
            tutorialMode: false,
            tutorialSection: null, // 'filters' | 'viz' | 'reports' | null
            viewedLearnings: [] // Persistiert in localStorage
        };

        // Tutorial-Progress aus localStorage laden
        this.loadTutorialProgress();

        this.subscribers = new Map();
    }

    /**
     * Liest einen State-Wert
     * @param {string} key - State-Schlüssel
     * @returns {*} State-Wert
     */
    get(key) {
        return this.state[key];
    }

    /**
     * Liest den gesamten State
     * @returns {Object} Gesamter State
     */
    getAll() {
        return { ...this.state };
    }

    /**
     * Setzt einen State-Wert und benachrichtigt Subscriber
     * @param {string} key - State-Schlüssel
     * @param {*} value - Neuer Wert
     */
    set(key, value) {
        const oldValue = this.state[key];
        if (JSON.stringify(oldValue) === JSON.stringify(value)) {
            return; // Keine Änderung
        }

        this.state[key] = value;
        this.notifySubscribers(key, value, oldValue);

        // Filter-Änderungen an EventBus weiterleiten
        if (key.startsWith('selected') || key === 'yearRange') {
            eventBus.emit(EVENTS.FILTER_CHANGE, this.getFilterState());
        }
    }

    /**
     * Aktualisiert mehrere State-Werte gleichzeitig
     * @param {Object} updates - Objekt mit key-value Paaren
     */
    update(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Setzt den Filter-State auf Standardwerte zurück
     */
    resetFilters() {
        this.update({
            selectedUniversities: ['UI'],
            selectedUniTypes: [],
            yearRange: { start: 2021, end: 2024 },
            selectedKennzahl: '1-A-1'
        });
        eventBus.emit(EVENTS.FILTER_RESET);
    }

    /**
     * Gibt den aktuellen Filter-State zurück
     * @returns {Object} Filter-State
     */
    getFilterState() {
        return {
            universities: this.state.selectedUniversities,
            uniTypes: this.state.selectedUniTypes,
            yearRange: this.state.yearRange,
            kennzahl: this.state.selectedKennzahl
        };
    }

    /**
     * Registriert einen Subscriber für State-Änderungen
     * @param {string} key - State-Schlüssel (oder '*' für alle)
     * @param {Function} callback - Callback(newValue, oldValue)
     * @returns {Function} Unsubscribe-Funktion
     */
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);

        // Unsubscribe-Funktion
        return () => {
            const subs = this.subscribers.get(key);
            if (subs) {
                subs.delete(callback);
            }
        };
    }

    /**
     * Benachrichtigt alle Subscriber einer State-Änderung
     * @private
     */
    notifySubscribers(key, newValue, oldValue) {
        // Spezifische Subscriber
        const subs = this.subscribers.get(key);
        if (subs) {
            subs.forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (error) {
                    console.error(`[State] ${key} subscriber error:`, error.message);
                }
            });
        }

        // Wildcard Subscriber
        const wildcardSubs = this.subscribers.get('*');
        if (wildcardSubs) {
            wildcardSubs.forEach(callback => {
                try {
                    callback({ key, newValue, oldValue });
                } catch (error) {
                    console.error('[State] wildcard subscriber error:', error.message);
                }
            });
        }
    }

    /**
     * Berechnet Statistiken für die gefilterten Daten
     * @param {Array} data - Gefilterte Datenpunkte
     */
    calculateStats(data) {
        if (!data || data.length === 0) {
            this.set('dataStats', { totalPoints: 0, average: 0, trend: 0 });
            return;
        }

        const values = data.map(d => d.value).filter(v => v !== null && v !== undefined);
        const totalPoints = values.length;
        const average = values.reduce((a, b) => a + b, 0) / totalPoints;

        // Trend: Vergleich letztes Jahr vs. vorletztes Jahr
        let trend = 0;
        if (data.length >= 2) {
            const sorted = [...data].sort((a, b) => b.year - a.year);
            const lastYear = sorted[0]?.value;
            const prevYear = sorted[1]?.value;
            if (lastYear && prevYear) {
                trend = ((lastYear - prevYear) / prevYear) * 100;
            }
        }

        this.set('dataStats', {
            totalPoints,
            average: Math.round(average * 10) / 10,
            trend: Math.round(trend * 10) / 10
        });
    }

    /**
     * Debug: Zeigt aktuellen State
     */
    debug() {
        console.group('AppState');
        console.table(this.state);
        console.groupEnd();
    }

    /**
     * Gibt den aktuellen Visualisierungs-State zurück
     * @returns {Object} Viz-State
     */
    getVizState() {
        return {
            type: this.state.vizType,
            options: this.state.vizOptions
        };
    }

    /**
     * Speichert Tutorial-Progress in localStorage
     */
    saveTutorialProgress() {
        try {
            localStorage.setItem('wissensbilanz_tutorial', JSON.stringify({
                viewedLearnings: this.state.viewedLearnings,
                tutorialMode: this.state.tutorialMode
            }));
        } catch (e) {
            console.warn('[State] Could not save tutorial progress:', e.message);
        }
    }

    /**
     * Lädt Tutorial-Progress aus localStorage
     */
    loadTutorialProgress() {
        try {
            const saved = localStorage.getItem('wissensbilanz_tutorial');
            if (saved) {
                const { viewedLearnings, tutorialMode } = JSON.parse(saved);
                this.state.viewedLearnings = viewedLearnings || [];
                // tutorialMode nicht automatisch laden - User soll bewusst aktivieren
            }
        } catch (e) {
            console.warn('[State] Could not load tutorial progress:', e.message);
        }
    }

    /**
     * Markiert ein Learning als gesehen
     * @param {string} learningId - z.B. 'L006'
     */
    markLearningViewed(learningId) {
        if (!this.state.viewedLearnings.includes(learningId)) {
            this.state.viewedLearnings = [...this.state.viewedLearnings, learningId];
            this.saveTutorialProgress();
        }
    }
}

// Singleton-Instanz
export const state = new AppState();
