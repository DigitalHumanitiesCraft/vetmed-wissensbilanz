/**
 * ChartContainer - Visualisierung mit VizFactory
 *
 * Refactored: Delegiert an VizFactory für verschiedene Chart-Typen
 *
 * Implementiert:
 * - V1: Konsistente Farbkodierung (Uni-Typ-Farben)
 * - V2: Zeitreihen als Primärformat
 * - V3: Referenzlinien (Durchschnitt)
 * - V5: Responsive Charts
 */

import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { dataLoader } from '../data/dataLoader.js';
import { VizFactory } from '../visualizations/VizFactory.js';
import { log } from '../core/logger.js';

class ChartContainer {
    constructor(container) {
        this.container = container;
        this.currentViz = null;
        this.vizType = state.get('vizType') || 'line';
        this.render();
        this.subscribeToState();
    }

    render() {
        this.container.innerHTML = `
            <div class="chart-wrapper">
                <div class="viz-content" id="vizContent">
                    <!-- Visualization wird hier gerendert -->
                </div>
                <div class="chart-loading" id="chartLoading" style="display: none;">
                    <div class="spinner"></div>
                    <span>Daten werden geladen...</span>
                </div>
            </div>
        `;

        this.loadAndRenderViz();
    }

    subscribeToState() {
        // Bei Filter-Änderungen neu laden
        eventBus.on(EVENTS.FILTER_CHANGE, () => {
            this.loadAndRenderViz();
        });

        // Bei Visualisierungs-Wechsel
        eventBus.on(EVENTS.VIZ_CHANGE, (newType) => {
            log.info('ChartContainer', `Viz type changed to: ${newType}`);
            this.vizType = newType;
            this.loadAndRenderViz();
        });
    }

    async loadAndRenderViz() {
        this.showLoading(true);

        try {
            const filteredData = await dataLoader.loadFiltered();
            const groupedData = dataLoader.groupByUniversity(filteredData);

            // Vorherige Visualization zerstören
            if (this.currentViz) {
                this.currentViz.destroy();
                this.currentViz = null;
            }

            const vizContent = this.container.querySelector('#vizContent');
            if (!vizContent) return;

            // Visualisierungs-Optionen basierend auf State
            const options = {
                showAverage: state.get('vizOptions')?.showAverage || false,
                rankingYear: state.get('vizOptions')?.rankingYear || 2024
            };

            // Neue Visualization erstellen via Factory
            this.currentViz = VizFactory.create(
                this.vizType,
                vizContent,
                groupedData,
                options
            );

            // Rendern
            this.currentViz.render();

            // Event emittieren
            eventBus.emit(EVENTS.VIZ_READY, this.vizType);

            log.info('ChartContainer', `Rendered ${this.vizType} with ${Object.keys(groupedData).length} universities`);
        } catch (error) {
            log.error('ChartContainer', 'render error:', error.message);
            this.showError('Daten konnten nicht geladen werden.');
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const loading = this.container.querySelector('#chartLoading');
        const content = this.container.querySelector('#vizContent');

        if (loading) loading.style.display = show ? 'flex' : 'none';
        if (content) content.style.opacity = show ? '0.5' : '1';
    }

    showError(message) {
        const vizContent = this.container.querySelector('#vizContent');
        if (!vizContent) return;

        vizContent.innerHTML = `
            <div class="viz-error">
                <svg class="viz-error__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>Fehler beim Laden</h3>
                <p>${message}</p>
                <button class="btn btn--primary" id="retryChartBtn">
                    Erneut versuchen
                </button>
            </div>
        `;

        vizContent.querySelector('#retryChartBtn')?.addEventListener('click', () => {
            this.loadAndRenderViz();
        });
    }

    destroy() {
        if (this.currentViz) {
            this.currentViz.destroy();
            this.currentViz = null;
        }
    }
}

export function initChartContainer(container) {
    return new ChartContainer(container);
}
