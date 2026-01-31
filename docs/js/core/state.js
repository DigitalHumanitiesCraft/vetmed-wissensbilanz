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
import { log } from './logger.js';

/**
 * State-Validatoren fuer wichtige State-Keys
 * Gibt true zurueck wenn Wert gueltig, false wenn ungueltig
 */
const STATE_VALIDATORS = {
    selectedUniversities: (val) => Array.isArray(val) && val.length >= 0,
    selectedUniTypes: (val) => Array.isArray(val),
    yearRange: (val) => {
        if (!val || typeof val !== 'object') return false;
        const { start, end } = val;
        return Number.isInteger(start) && Number.isInteger(end) &&
               start >= 2019 && end <= 2030 && start <= end;
    },
    selectedKennzahl: (val) => typeof val === 'string' && val.length > 0,
    secondaryKennzahl: (val) => val === null || (typeof val === 'string' && val.length > 0),
    combinationType: (val) => val === null || ['dualAxis', 'ratio', 'scatter'].includes(val),
    dualMode: (val) => typeof val === 'boolean',
    activeTab: (val) => ['chart', 'table', 'report'].includes(val),
    vizType: (val) => ['line', 'smallMultiples', 'heatmap', 'ranking'].includes(val),
    isLoading: (val) => typeof val === 'boolean',
    tutorialMode: (val) => typeof val === 'boolean'
};

class AppState {
    constructor() {
        this.state = {
            // Filter-State
            selectedUniversities: ['UI'], // Default: VetMed Wien
            selectedUniTypes: [],
            yearRange: { start: 2021, end: 2024 },
            selectedKennzahl: '1-A-1', // Default: Personal Köpfe

            // Dual-Mode (Kennzahl-Kombinationen)
            secondaryKennzahl: null, // Zweite Kennzahl fuer kombinierte Ansichten
            dualMode: false, // Single/Dual Modus
            combinationType: null, // 'dualAxis' | 'ratio' | 'scatter'

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
            tutorialLevel: 1, // 1 = Basics, 2 = Intermediate, 3 = Advanced
            viewedLearnings: [], // Persistiert in localStorage
            completedAnnotations: [] // F1, V1, R1, L006, etc.
        };

        // Tutorial-Progress aus localStorage laden
        this.loadTutorialProgress();

        this.subscribers = new Map();
        this.isBatching = false; // Fuer batch() Methode
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
     * @param {string} key - State-Schluessel
     * @param {*} value - Neuer Wert
     * @returns {boolean} true wenn erfolgreich, false wenn Validierung fehlschlaegt
     */
    set(key, value) {
        // Validierung wenn Validator existiert
        const validator = STATE_VALIDATORS[key];
        if (validator && !validator(value)) {
            log.warn('State', `Ungültiger Wert für ${key}:`, value);
            return false;
        }

        const oldValue = this.state[key];
        if (JSON.stringify(oldValue) === JSON.stringify(value)) {
            return true; // Keine Änderung, aber kein Fehler
        }

        this.state[key] = value;

        // Nicht benachrichtigen wenn im Batch-Modus
        if (!this.isBatching) {
            this.notifySubscribers(key, value, oldValue);

            // Filter-Änderungen an EventBus weiterleiten
            if (key.startsWith('selected') || key === 'yearRange') {
                eventBus.emit(EVENTS.FILTER_CHANGE, this.getFilterState());
            }
        }

        return true;
    }

    /**
     * Batch-Update: Setzt mehrere Werte ohne zwischenzeitliche Events
     * Events werden erst am Ende gesammelt ausgeloest
     * @param {Object} updates - Objekt mit key-value Paaren
     */
    batch(updates) {
        this.isBatching = true;
        const changedKeys = [];

        Object.entries(updates).forEach(([key, value]) => {
            const oldValue = this.state[key];
            if (this.set(key, value) && JSON.stringify(oldValue) !== JSON.stringify(value)) {
                changedKeys.push({ key, oldValue, newValue: value });
            }
        });

        this.isBatching = false;

        // Jetzt alle Subscriber benachrichtigen
        changedKeys.forEach(({ key, oldValue, newValue }) => {
            this.notifySubscribers(key, newValue, oldValue);
        });

        // Ein FILTER_CHANGE Event wenn Filter geaendert wurden
        const filterChanged = changedKeys.some(c =>
            c.key.startsWith('selected') || c.key === 'yearRange'
        );
        if (filterChanged) {
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
     * Berechnet Statistiken fuer die gefilterten Daten
     * @param {Array} data - Gefilterte Datenpunkte
     */
    calculateStats(data) {
        if (!data || data.length === 0) {
            this.set('dataStats', { totalPoints: 0, average: 0, trend: 0 });
            return;
        }

        const values = data.map(d => d.value).filter(v => v !== null && v !== undefined && !isNaN(v));
        const totalPoints = values.length;

        // Guard: Keine gueltigen Werte
        if (totalPoints === 0) {
            this.set('dataStats', { totalPoints: 0, average: 0, trend: 0 });
            return;
        }

        const average = values.reduce((a, b) => a + b, 0) / totalPoints;

        // Trend: Vergleich erstes vs. letztes Jahr (aggregiert ueber alle Unis)
        // Gruppiere nach Jahr und berechne Durchschnitt pro Jahr
        let trend = 0;
        const byYear = new Map();
        data.forEach(d => {
            if (d.value !== null && d.value !== undefined && !isNaN(d.value)) {
                if (!byYear.has(d.year)) {
                    byYear.set(d.year, []);
                }
                byYear.get(d.year).push(d.value);
            }
        });

        if (byYear.size >= 2) {
            // Sortiere Jahre und nimm erstes und letztes
            const years = [...byYear.keys()].sort((a, b) => a - b);
            const firstYear = years[0];
            const lastYear = years[years.length - 1];

            const firstValues = byYear.get(firstYear);
            const lastValues = byYear.get(lastYear);

            // Durchschnitt pro Jahr berechnen
            const firstAvg = firstValues.reduce((a, b) => a + b, 0) / firstValues.length;
            const lastAvg = lastValues.reduce((a, b) => a + b, 0) / lastValues.length;

            // Division durch 0 vermeiden mit sinnvollen Edge-Cases
            if (firstAvg !== 0) {
                trend = ((lastAvg - firstAvg) / firstAvg) * 100;
            } else if (lastAvg > 0) {
                // Von 0 auf positiv = maximales Wachstum (100%)
                trend = 100;
            } else if (lastAvg < 0) {
                // Von 0 auf negativ = maximaler Rueckgang (-100%)
                trend = -100;
            }
            // Wenn beide 0 sind: trend bleibt 0
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
