/**
 * VizFactory - Factory Pattern für Visualisierungen
 *
 * Erstellt die passende Visualisierungs-Instanz basierend auf dem Typ.
 * Ermöglicht einfaches Wechseln zwischen verschiedenen Chart-Typen.
 */

import { LineChart } from './LineChart.js';
import { SmallMultiples } from './SmallMultiples.js';
import { Heatmap } from './Heatmap.js';
import { RankingChart } from './RankingChart.js';

export class VizFactory {
    /**
     * Erstellt eine Visualisierung basierend auf dem Typ
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
     * Gibt alle verfügbaren Visualisierungs-Typen zurück
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
}
