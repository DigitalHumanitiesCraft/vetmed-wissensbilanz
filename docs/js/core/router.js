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
 *
 * Dual-Mode-Parameter:
 *   &k2=1-A-1-VZA  - Zweite Kennzahl
 *   &comb=scatter  - Kombinations-Typ (dualAxis, ratio, scatter)
 */

import { state } from './state.js';
import { eventBus, EVENTS } from './eventBus.js';
import { log } from './logger.js';
import { UNI_BY_CODE, KENNZAHL_BY_CODE } from '../data/metadata.js';

// Gueltige Werte fuer URL-Parameter
const VALID_PAGES = ['dashboard', 'promptotyping', 'about'];
const VALID_TABS = ['chart', 'table', 'report'];
const VALID_VIZ_TYPES = ['line', 'smallMultiples', 'heatmap', 'ranking'];
const VALID_COMBO_TYPES = ['dualAxis', 'ratio', 'scatter'];
const VALID_TUTORIAL_SECTIONS = ['filters', 'viz', 'reports'];
const VALID_YEAR_RANGE = { min: 2019, max: 2030 };

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

        // Bei Seiten-Wechsel URL aktualisieren
        eventBus.on(EVENTS.PAGE_CHANGE, () => {
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
     * Liest Filter-State aus URL-Parametern mit Validierung
     */
    loadFromUrl() {
        this.isUpdating = true;

        try {
            const params = new URLSearchParams(window.location.search);

            // Universitaeten - nur gueltige Codes akzeptieren
            const unis = params.get('unis');
            if (unis) {
                const validUnis = unis.split(',')
                    .map(u => u.trim())
                    .filter(u => UNI_BY_CODE[u]); // Nur bekannte Uni-Codes

                if (validUnis.length > 0) {
                    state.set('selectedUniversities', validUnis);
                    log.info('Router', `Loaded unis from URL: ${validUnis.join(', ')}`);
                } else {
                    log.warn('Router', `No valid university codes in URL: ${unis}`);
                }
            }

            // Kennzahl (primaer) - validieren gegen Metadaten
            const kennzahl = params.get('k');
            if (kennzahl) {
                if (KENNZAHL_BY_CODE[kennzahl]) {
                    state.set('selectedKennzahl', kennzahl);
                    log.info('Router', `Loaded kennzahl from URL: ${kennzahl}`);
                } else {
                    log.warn('Router', `Unknown kennzahl code in URL: ${kennzahl}`);
                }
            }

            // Zweite Kennzahl (Dual-Mode) - validieren
            const secondaryKennzahl = params.get('k2');
            if (secondaryKennzahl) {
                if (KENNZAHL_BY_CODE[secondaryKennzahl]) {
                    state.set('secondaryKennzahl', secondaryKennzahl);
                    state.set('dualMode', true);
                    log.info('Router', `Loaded secondary kennzahl from URL: ${secondaryKennzahl}`);
                } else {
                    log.warn('Router', `Unknown secondary kennzahl code in URL: ${secondaryKennzahl}`);
                }
            }

            // Kombinations-Typ (Dual-Mode)
            const combinationType = params.get('comb');
            if (combinationType && VALID_COMBO_TYPES.includes(combinationType)) {
                state.set('combinationType', combinationType);
                log.info('Router', `Loaded combination type from URL: ${combinationType}`);
            }

            // Zeitraum - mit Bereichsvalidierung und Korrektur
            const start = params.get('von');
            const end = params.get('bis');
            if (start || end) {
                let startYear = parseInt(start) || VALID_YEAR_RANGE.min;
                let endYear = parseInt(end) || VALID_YEAR_RANGE.max;

                // Werte auf gueltigen Bereich begrenzen
                startYear = Math.max(VALID_YEAR_RANGE.min, Math.min(VALID_YEAR_RANGE.max, startYear));
                endYear = Math.max(startYear, Math.min(VALID_YEAR_RANGE.max, endYear));

                state.set('yearRange', { start: startYear, end: endYear });
                log.info('Router', `Loaded yearRange from URL: ${startYear}-${endYear}`);
            }

            // Page (dashboard, promptotyping, about)
            const page = params.get('page');
            if (page && VALID_PAGES.includes(page)) {
                state.set('activePage', page);
                this.activatePage(page);
            }

            // Tab (nur relevant auf Dashboard)
            const tab = params.get('tab');
            if (tab && VALID_TABS.includes(tab)) {
                state.set('activeTab', tab);
                this.activateTab(tab);
            }

            // Visualization Type
            const viz = params.get('viz');
            if (viz && VALID_VIZ_TYPES.includes(viz)) {
                state.set('vizType', viz);
                log.info('Router', `Loaded vizType from URL: ${viz}`);
            }

            // Tutorial Section
            const tutorial = params.get('tutorial');
            if (tutorial && VALID_TUTORIAL_SECTIONS.includes(tutorial)) {
                state.set('tutorialSection', tutorial);
                state.set('tutorialMode', true);
                log.info('Router', `Loaded tutorial section from URL: ${tutorial}`);
            }

        } catch (error) {
            log.error('Router', 'Error loading from URL', error);
        } finally {
            this.isUpdating = false;
        }
    }

    /**
     * Schreibt aktuellen State in URL-Parameter
     */
    updateUrl() {
        const filterState = state.getFilterState();
        const activePage = state.get('activePage');
        const activeTab = state.get('activeTab');
        const params = new URLSearchParams();

        // Page nur wenn nicht Default (dashboard)
        if (activePage && activePage !== 'dashboard') {
            params.set('page', activePage);
        }

        // Nur setzen wenn nicht Default
        if (filterState.universities.length > 0) {
            params.set('unis', filterState.universities.join(','));
        }

        if (filterState.kennzahl && filterState.kennzahl !== '1-A-1') {
            params.set('k', filterState.kennzahl);
        }

        // Dual-Mode: Zweite Kennzahl und Kombinations-Typ
        const secondaryKennzahl = state.get('secondaryKennzahl');
        const combinationType = state.get('combinationType');
        if (secondaryKennzahl) {
            params.set('k2', secondaryKennzahl);
        }
        if (combinationType) {
            params.set('comb', combinationType);
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
     * Aktiviert eine Seite in der UI
     */
    activatePage(pageId) {
        const navButtons = document.querySelectorAll('.top-nav__item');
        const pages = document.querySelectorAll('.page');
        const sidebar = document.querySelector('.sidebar');

        navButtons.forEach(btn => {
            btn.classList.toggle('top-nav__item--active', btn.dataset.page === pageId);
        });

        pages.forEach(page => {
            page.classList.toggle('page--active', page.id === `${pageId}Page`);
        });

        // Sidebar nur auf Dashboard anzeigen
        if (sidebar) {
            sidebar.style.display = pageId === 'dashboard' ? '' : 'none';
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
