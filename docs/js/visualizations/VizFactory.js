/**
 * VizFactory - Factory Pattern für Visualisierungen
 *
 * Erstellt die passende Visualisierungs-Instanz basierend auf dem Typ.
 * Ermöglicht einfaches Wechseln zwischen verschiedenen Chart-Typen.
 * Unterstuetzt Single-Mode und Dual-Mode (zwei Kennzahlen).
 */

import { LineChart } from './LineChart.js';
import { SmallMultiples } from './SmallMultiples.js';
import { Heatmap } from './Heatmap.js';
import { RankingChart } from './RankingChart.js';
import { DualAxisChart } from './DualAxisChart.js';
import { ScatterChart } from './ScatterChart.js';

export class VizFactory {
    /**
     * Erstellt eine Visualisierung basierend auf dem Typ (Single-Mode)
     * @param {string} type - 'line' | 'smallMultiples' | 'heatmap' | 'ranking'
     * @param {HTMLElement} container - Container-Element
     * @param {Object} data - Gruppierte Daten von dataLoader
     * @param {Object} options - Visualisierungs-Optionen
     * @returns {BaseVisualization} Visualisierungs-Instanz
     */
    static create(type, container, data, options = {}) {
        switch (type) {
            case 'line':
                return new LineChart(container, data, options);
            case 'smallMultiples':
                return new SmallMultiples(container, data, options);
            case 'heatmap':
                return new Heatmap(container, data, options);
            case 'ranking':
                return new RankingChart(container, data, options);
            default:
                console.warn(`[VizFactory] Unknown type "${type}", falling back to LineChart`);
                return new LineChart(container, data, options);
        }
    }

    /**
     * Erstellt eine Dual-Mode-Visualisierung (zwei Kennzahlen)
     * @param {string} combinationType - 'dualAxis' | 'ratio' | 'scatter'
     * @param {HTMLElement} container - Container-Element
     * @param {Object} dualData - { primary, secondary, merged } von dataLoader
     * @param {Object} options - Visualisierungs-Optionen
     * @returns {BaseVisualization} Visualisierungs-Instanz
     */
    static createDual(combinationType, container, dualData, options = {}) {
        switch (combinationType) {
            case 'dualAxis':
                return new DualAxisChart(
                    container,
                    dualData.primaryGrouped,
                    dualData.secondaryGrouped,
                    options
                );
            case 'scatter':
                return new ScatterChart(container, dualData.merged, options);
            case 'ratio':
                // Ratio nutzt LineChart mit berechneten Verhaeltnisdaten
                return new LineChart(container, dualData.ratioGrouped, {
                    ...options,
                    isRatio: true
                });
            default:
                console.warn(`[VizFactory] Unknown combination type "${combinationType}", falling back to dualAxis`);
                return new DualAxisChart(
                    container,
                    dualData.primaryGrouped,
                    dualData.secondaryGrouped,
                    options
                );
        }
    }

    /**
     * Gibt alle verfügbaren Visualisierungs-Typen zurück (Single-Mode)
     * @returns {Array} Typen mit Metadaten
     */
    static getAvailableTypes() {
        return [
            {
                id: 'line',
                name: 'Zeitreihe',
                description: 'Liniendiagramm mit allen ausgewählten Universitäten',
                icon: 'chart-line'
            },
            {
                id: 'smallMultiples',
                name: 'Small Multiples',
                description: 'Kleine Charts gruppiert nach Universitäts-Typ',
                icon: 'grid'
            },
            {
                id: 'heatmap',
                name: 'Heatmap',
                description: 'Matrix-Ansicht: Universitäten × Jahre',
                icon: 'grid-heat'
            },
            {
                id: 'ranking',
                name: 'Ranking',
                description: 'Balkendiagramm sortiert nach Wert',
                icon: 'bar-chart'
            }
        ];
    }

    /**
     * Gibt alle verfügbaren Kombinations-Typen zurück (Dual-Mode)
     * @returns {Array} Typen mit Metadaten
     */
    static getCombinationTypes() {
        return [
            {
                id: 'dualAxis',
                name: 'Dual-Achse',
                description: 'Zwei Y-Achsen fuer direkten Vergleich',
                icon: 'chart-dual'
            },
            {
                id: 'ratio',
                name: 'Verhaeltnis',
                description: 'Verhaeltnis A/B berechnet und angezeigt',
                icon: 'divide'
            },
            {
                id: 'scatter',
                name: 'Scatter',
                description: 'Korrelationsanalyse zwischen zwei Kennzahlen',
                icon: 'scatter'
            }
        ];
    }
}
