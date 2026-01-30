/**
 * Router - URL-Parameter Synchronisation (F2)
 *
 * Ermöglicht:
 * - Teilen von Filter-Zuständen als Link
 * - Browser-Navigation (Zurück/Vorwärts)
 * - Bookmarks für spezifische Ansichten
 *
 * URL-Format:
 *   ?unis=UI,UN&k=1-A-1&von=2021&bis=2024&tab=chart&viz=heatmap&tutorial=filters
 */

import { state } from './state.js';
import { eventBus, EVENTS } from './eventBus.js';
import { log } from './logger.js';

class Router {
    constructor() {
        this.isUpdating = false; // Verhindert Endlosschleifen
    }

    /**
     * Initialisiert den Router
     */
    init() {
        // URL beim Start lesen
        this.loadFromUrl();

        // Bei Filter-Änderungen URL aktualisieren
        eventBus.on(EVENTS.FILTER_CHANGE, () => {
            if (!this.isUpdating) {
                this.updateUrl();
            }
        });

        // Bei Tab-Wechsel URL aktualisieren
        eventBus.on(EVENTS.TAB_CHANGE, (tab) => {
            if (!this.isUpdating) {
                this.updateUrl();
            }
        });

        // Bei Visualisierungs-Wechsel URL aktualisieren
        eventBus.on(EVENTS.VIZ_CHANGE, () => {
            if (!this.isUpdating) {
                this.updateUrl();
            }
        });

        // Bei Tutorial-Toggle URL aktualisieren
        eventBus.on(EVENTS.TUTORIAL_TOGGLE, () => {
            if (!this.isUpdating) {
                this.updateUrl();
            }
        });

        // Browser-Navigation (Zurück/Vorwärts)
        window.addEventListener('popstate', () => {
            this.loadFromUrl();
        });

        log.info('Router', 'initialized');
    }

    /**
     * Liest Filter-State aus URL-Parametern
     */
    loadFromUrl() {
        this.isUpdating = true;

        try {
            const params = new URLSearchParams(window.location.search);

            // Universitäten
            const unis = params.get('unis');
            if (unis) {
                const uniList = unis.split(',').filter(u => u.trim());
                if (uniList.length > 0) {
                    state.set('selectedUniversities', uniList);
                    log.info('Router', `Loaded unis from URL: ${uniList.join(', ')}`);
                }
            }

            // Kennzahl
            const kennzahl = params.get('k');
            if (kennzahl) {
                state.set('selectedKennzahl', kennzahl);
                log.info('Router', `Loaded kennzahl from URL: ${kennzahl}`);
            }

            // Zeitraum
            const start = params.get('von');
            const end = params.get('bis');
            if (start && end) {
                const startYear = parseInt(start);
                const endYear = parseInt(end);
                if (!isNaN(startYear) && !isNaN(endYear) && startYear <= endYear) {
                    state.set('yearRange', { start: startYear, end: endYear });
                    log.info('Router', `Loaded yearRange from URL: ${startYear}-${endYear}`);
                }
            }

            // Tab
            const tab = params.get('tab');
            if (tab && ['chart', 'table', 'report', 'promptotyping'].includes(tab)) {
                state.set('activeTab', tab);
                // Tab-UI aktualisieren
                this.activateTab(tab);
            }

            // Visualization Type (nur relevant wenn tab=chart)
            const viz = params.get('viz');
            if (viz && ['line', 'smallMultiples', 'heatmap', 'ranking'].includes(viz)) {
                state.set('vizType', viz);
                log.info('Router', `Loaded vizType from URL: ${viz}`);
            }

            // Tutorial Section
            const tutorial = params.get('tutorial');
            if (tutorial && ['filters', 'viz', 'reports'].includes(tutorial)) {
                state.set('tutorialSection', tutorial);
                state.set('tutorialMode', true); // Implizit aktivieren
                log.info('Router', `Loaded tutorial section from URL: ${tutorial}`);
            }

        } finally {
            this.isUpdating = false;
        }
    }

    /**
     * Schreibt aktuellen State in URL-Parameter
     */
    updateUrl() {
        const filterState = state.getFilterState();
        const activeTab = state.get('activeTab');
        const params = new URLSearchParams();

        // Nur setzen wenn nicht Default
        if (filterState.universities.length > 0) {
            params.set('unis', filterState.universities.join(','));
        }

        if (filterState.kennzahl && filterState.kennzahl !== '1-A-1') {
            params.set('k', filterState.kennzahl);
        }

        // Zeitraum nur wenn nicht Default (2021-2024)
        if (filterState.yearRange.start !== 2021 || filterState.yearRange.end !== 2024) {
            params.set('von', filterState.yearRange.start);
            params.set('bis', filterState.yearRange.end);
        }

        // Tab nur wenn nicht Default (chart)
        if (activeTab && activeTab !== 'chart') {
            params.set('tab', activeTab);
        }

        // Visualization Type nur wenn tab=chart und nicht Default (line)
        if (activeTab === 'chart') {
            const vizType = state.get('vizType');
            if (vizType && vizType !== 'line') {
                params.set('viz', vizType);
            }
        }

        // Tutorial Section nur wenn aktiv
        if (state.get('tutorialMode')) {
            const tutorialSection = state.get('tutorialSection');
            if (tutorialSection) {
                params.set('tutorial', tutorialSection);
            }
        }

        // URL aktualisieren ohne Page Reload
        const queryString = params.toString();
        const newUrl = queryString
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;

        // Nur aktualisieren wenn sich etwas geändert hat
        if (window.location.search !== (queryString ? `?${queryString}` : '')) {
            window.history.replaceState({}, '', newUrl);
            log.info('Router', `URL updated: ${newUrl}`);
        }
    }

    /**
     * Aktiviert einen Tab in der UI
     */
    activateTab(tabId) {
        const tabButtons = document.querySelectorAll('.tabs__tab');
        const tabPanels = document.querySelectorAll('.tabs__panel');

        tabButtons.forEach(btn => {
            btn.classList.toggle('tabs__tab--active', btn.dataset.tab === tabId);
        });

        tabPanels.forEach(panel => {
            panel.classList.toggle('tabs__panel--active', panel.id === `${tabId}Panel`);
        });
    }

    /**
     * Generiert eine teilbare URL für den aktuellen State
     * @returns {string} Vollständige URL
     */
    getShareableUrl() {
        this.updateUrl();
        return window.location.href;
    }

    /**
     * Kopiert die aktuelle URL in die Zwischenablage
     * @returns {Promise<boolean>} Erfolg
     */
    async copyUrlToClipboard() {
        try {
            const url = this.getShareableUrl();
            await navigator.clipboard.writeText(url);
            log.info('Router', 'URL copied to clipboard');
            return true;
        } catch (error) {
            log.error('Router', 'Failed to copy URL', error);
            return false;
        }
    }
}

// Singleton-Instanz
export const router = new Router();
