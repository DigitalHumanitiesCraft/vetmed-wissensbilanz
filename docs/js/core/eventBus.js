/**
 * EventBus - Zentrale Event-Kommunikation
 *
 * Ermöglicht lose gekoppelte Kommunikation zwischen Komponenten.
 * Basiert auf dem Pub/Sub-Pattern.
 *
 * Verwendung:
 *   import { eventBus } from './eventBus.js';
 *
 *   // Listener registrieren
 *   eventBus.on('filter:change', (data) => console.log(data));
 *
 *   // Event auslösen
 *   eventBus.emit('filter:change', { universities: ['UI'] });
 *
 *   // Listener entfernen
 *   eventBus.off('filter:change', handler);
 */

import { log } from './logger.js';

class EventBus {
    constructor() {
        this.listeners = new Map();
        this.debounceTimers = new Map();
    }

    /**
     * Registriert einen Event-Listener
     * @param {string} event - Event-Name (z.B. 'filter:change')
     * @param {Function} callback - Callback-Funktion
     * @returns {Function} Unsubscribe-Funktion
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        // Unsubscribe-Funktion zurückgeben
        return () => this.off(event, callback);
    }

    /**
     * Registriert einen einmaligen Event-Listener
     * @param {string} event - Event-Name
     * @param {Function} callback - Callback-Funktion
     */
    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    /**
     * Entfernt einen Event-Listener
     * @param {string} event - Event-Name
     * @param {Function} callback - Callback-Funktion
     */
    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    /**
     * Loest ein Event aus
     * @param {string} event - Event-Name
     * @param {*} data - Event-Daten
     */
    emit(event, data) {
        // Debug-Logging wenn aktiviert
        if (log.isDebugEnabled?.()) {
            log.debug('EventBus', `Emit: ${event}`, data);
        }

        const callbacks = this.listeners.get(event);
        if (callbacks && callbacks.size > 0) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    log.error('EventBus', `${event} handler error:`, error.message);
                }
            });
        }
    }

    /**
     * Loest ein Event mit Debounce aus (fuer haeufige Events wie FILTER_CHANGE)
     * Mehrere Aufrufe innerhalb des Delays werden zu einem zusammengefasst
     * @param {string} event - Event-Name
     * @param {*} data - Event-Daten
     * @param {number} delay - Debounce-Delay in ms (default: 100)
     */
    emitDebounced(event, data, delay = 100) {
        // Vorherigen Timer loeschen
        if (this.debounceTimers.has(event)) {
            clearTimeout(this.debounceTimers.get(event));
        }

        // Neuen Timer setzen
        const timer = setTimeout(() => {
            this.emit(event, data);
            this.debounceTimers.delete(event);
        }, delay);

        this.debounceTimers.set(event, timer);
    }

    /**
     * Entfernt alle Listener für ein Event (oder alle Events)
     * @param {string} [event] - Event-Name (optional, sonst alle)
     */
    clear(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }

    /**
     * Debug: Zeigt alle registrierten Events
     */
    debug() {
        console.group('EventBus - Registered Events');
        this.listeners.forEach((callbacks, event) => {
            console.log(`${event}: ${callbacks.size} listener(s)`);
        });
        console.groupEnd();
    }
}

// Singleton-Instanz
export const eventBus = new EventBus();

// Event-Namen als Konstanten (verhindert Tippfehler)
export const EVENTS = {
    // Filter-Events
    FILTER_CHANGE: 'filter:change',
    FILTER_RESET: 'filter:reset',
    UNIVERSITY_SELECT: 'filter:university:select',
    YEAR_RANGE_CHANGE: 'filter:year:change',
    KENNZAHL_SELECT: 'filter:kennzahl:select',

    // Daten-Events
    DATA_LOADING: 'data:loading',
    DATA_LOADED: 'data:loaded',
    DATA_ERROR: 'data:error',

    // UI-Events
    PAGE_CHANGE: 'ui:page:change',
    TAB_CHANGE: 'ui:tab:change',
    SIDEBAR_TOGGLE: 'ui:sidebar:toggle',
    EXPORT_REQUEST: 'ui:export:request',

    // LLM-Events
    REPORT_GENERATE: 'report:generate',
    REPORT_READY: 'report:ready',
    REPORT_ERROR: 'report:error',

    // Visualization Events
    VIZ_CHANGE: 'ui:viz:change',
    VIZ_READY: 'ui:viz:ready',

    // Tutorial Events
    TUTORIAL_TOGGLE: 'tutorial:toggle',
    TUTORIAL_SECTION_CHANGE: 'tutorial:section:change',
    TUTORIAL_BADGE_CLICK: 'tutorial:badge:click',
    TUTORIAL_MODE_CHANGE: 'tutorial:mode:change',
    ANNOTATION_VIEWED: 'tutorial:annotation:viewed',
    TUTORIAL_LEVEL_UP: 'tutorial:level:up'
};
