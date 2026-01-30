/**
 * App - Bootstrap und Initialisierung
 *
 * Einstiegspunkt der Single-Page Application.
 * Initialisiert alle Komponenten und verbindet sie.
 */

import { state } from './core/state.js';
import { eventBus, EVENTS } from './core/eventBus.js';
import { log } from './core/logger.js';
import { initFilterPanel } from './components/FilterPanel.js';
import { initChartContainer } from './components/ChartContainer.js';
import { initDataTable } from './components/DataTable.js';
import { initReportPanel } from './components/ReportPanel.js';

class App {
    constructor() {
        this.components = {};
    }

    async init() {
        log.info('App', 'init');

        // DOM ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        // Komponenten initialisieren
        this.initComponents();

        // Tab-Navigation
        this.initTabs();

        // Sidebar Toggle (Mobile)
        this.initSidebarToggle();

        // URL-Parameter lesen
        this.loadFromUrl();

        log.info('App', 'ready');
    }

    initComponents() {
        // Filter Panel
        const sidebarEl = document.querySelector('.sidebar');
        if (sidebarEl) {
            this.components.filterPanel = initFilterPanel(sidebarEl);
        }

        // Chart Container
        const chartEl = document.querySelector('#chartPanel');
        if (chartEl) {
            this.components.chart = initChartContainer(chartEl);
        }

        // Data Table
        const tableEl = document.querySelector('#tablePanel');
        if (tableEl) {
            this.components.table = initDataTable(tableEl);
        }

        // Report Panel
        const reportEl = document.querySelector('#reportPanel');
        if (reportEl) {
            this.components.report = initReportPanel(reportEl);
        }
    }

    initTabs() {
        const tabButtons = document.querySelectorAll('.tabs__tab');
        const tabPanels = document.querySelectorAll('.tabs__panel');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;

                // Buttons aktualisieren
                tabButtons.forEach(b => b.classList.remove('tabs__tab--active'));
                btn.classList.add('tabs__tab--active');

                // Panels aktualisieren
                tabPanels.forEach(panel => {
                    panel.classList.toggle('tabs__panel--active', panel.id === `${tabId}Panel`);
                });

                // State aktualisieren
                state.set('activeTab', tabId);
                eventBus.emit(EVENTS.TAB_CHANGE, tabId);
            });
        });
    }

    initSidebarToggle() {
        const toggleBtn = document.querySelector('#sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('is-open');
                backdrop?.classList.toggle('is-visible');
            });

            backdrop?.addEventListener('click', () => {
                sidebar.classList.remove('is-open');
                backdrop.classList.remove('is-visible');
            });
        }
    }

    loadFromUrl() {
        const params = new URLSearchParams(window.location.search);

        // Universitäten aus URL
        const unis = params.get('unis');
        if (unis) {
            state.set('selectedUniversities', unis.split(','));
        }

        // Kennzahl aus URL
        const kennzahl = params.get('k');
        if (kennzahl) {
            state.set('selectedKennzahl', kennzahl);
        }

        // Zeitraum aus URL
        const start = params.get('von');
        const end = params.get('bis');
        if (start && end) {
            state.set('yearRange', {
                start: parseInt(start),
                end: parseInt(end)
            });
        }
    }

    /**
     * Aktualisiert die URL mit aktuellen Filtern (F2: URL-Parameter)
     */
    updateUrl() {
        const filterState = state.getFilterState();
        const params = new URLSearchParams();

        if (filterState.universities.length > 0) {
            params.set('unis', filterState.universities.join(','));
        }
        params.set('k', filterState.kennzahl);
        params.set('von', filterState.yearRange.start);
        params.set('bis', filterState.yearRange.end);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }
}

// App starten
const app = new App();
app.init().catch(console.error);

// Für Debugging im Browser
window.wissensbilanz = {
    state,
    eventBus,
    app,
    log
};
