/**
 * ScatterChart - Korrelationsanalyse zwischen zwei Kennzahlen
 *
 * Zeigt Zusammenhaenge zwischen zwei Kennzahlen:
 * - X-Achse: Primaere Kennzahl
 * - Y-Achse: Sekundaere Kennzahl
 * - Punkte nach Uni-Typ gefaerbt
 * - Korrelationskoeffizient berechnet und angezeigt
 */

import { state } from '../core/state.js';
import { UNI_TYPES, KENNZAHL_BY_CODE, formatValue } from '../data/metadata.js';
import { getUniColor, getUniColorWithAlpha } from '../utils/colorUtils.js';

export class ScatterChart {
    /**
     * @param {HTMLElement} container - Container-Element
     * @param {Array} mergedData - Gematchte Daten { x, y, uniCode, year, university }
     * @param {Object} options - Optionen
     */
    constructor(container, mergedData, options = {}) {
        this.container = container;
        this.mergedData = mergedData || [];
        this.options = options;
        this.chart = null;
    }

    render() {
        const primaryKennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const secondaryKennzahl = KENNZAHL_BY_CODE[state.get('secondaryKennzahl')];
        const correlation = this.calculateCorrelation();

        this.container.innerHTML = `
            <div class="chart-header">
                <div class="scatter-info">
                    <span class="scatter-info__correlation" title="Pearson-Korrelationskoeffizient">
                        r = <strong>${correlation.toFixed(3)}</strong>
                        ${this.getCorrelationLabel(correlation)}
                    </span>
                    <span class="scatter-info__count">
                        ${this.mergedData.length} Datenpunkte
                    </span>
                </div>
                <div class="chart-actions">
                    <button class="btn btn--ghost btn--sm" id="toggleTrendline" title="Trendlinie ein/aus">
                        Trendlinie
                    </button>
                    <button class="btn btn--ghost btn--sm" id="exportPng" title="Als PNG exportieren">
                        PNG Export
                    </button>
                </div>
            </div>
            <div class="chart-canvas-wrapper">
                <canvas id="scatterCanvas"></canvas>
            </div>
            <div class="scatter-legend" id="scatterLegend"></div>
        `;

        this.attachEventListeners();
        this.createChart();
        this.renderLegend();
    }

    attachEventListeners() {
        this.container.querySelector('#exportPng')?.addEventListener('click', () => {
            this.exportAsPng();
        });

        this.container.querySelector('#toggleTrendline')?.addEventListener('click', () => {
            this.toggleTrendline();
        });
    }

    createChart() {
        const canvas = this.container.querySelector('#scatterCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const primaryKennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const secondaryKennzahl = KENNZAHL_BY_CODE[state.get('secondaryKennzahl')];

        // Daten nach Uni-Typ gruppieren
        const dataByType = {};
        this.mergedData.forEach(point => {
            const type = point.university?.type || 'unknown';
            if (!dataByType[type]) {
                dataByType[type] = [];
            }
            dataByType[type].push({
                x: point.x,
                y: point.y,
                uniCode: point.uniCode,
                year: point.year,
                uniName: point.university?.shortName || point.uniCode
            });
        });

        // Datasets erstellen
        const datasets = Object.entries(dataByType).map(([type, points]) => {
            const typeInfo = UNI_TYPES[type] || { name: type, color: '#6c757d' };

            return {
                label: typeInfo.name,
                data: points,
                backgroundColor: typeInfo.color + 'CC',
                borderColor: typeInfo.color,
                borderWidth: 1,
                pointRadius: 6,
                pointHoverRadius: 8,
                uniType: type  // Custom property fuer Uni-Typ (nicht Chart.js 'type'!)
            };
        });

        this.chart = new Chart(ctx, {
            type: 'scatter',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Korrelation: ${primaryKennzahl?.name || 'X'} vs ${secondaryKennzahl?.name || 'Y'}`,
                        font: { size: 16, weight: '600' },
                        padding: { bottom: 20 }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 37, 41, 0.95)',
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            title: (items) => {
                                const point = items[0]?.raw;
                                return point ? `${point.uniName} (${point.year})` : '';
                            },
                            label: (context) => {
                                const point = context.raw;
                                return [
                                    `${primaryKennzahl?.code || 'X'}: ${formatValue(point.x, primaryKennzahl?.unit || '')}`,
                                    `${secondaryKennzahl?.code || 'Y'}: ${formatValue(point.y, secondaryKennzahl?.unit || '')}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: `${primaryKennzahl?.name || 'Primaer'} (${primaryKennzahl?.unit || ''})`
                        },
                        ticks: {
                            callback: (value) => formatValue(value, primaryKennzahl?.unit || '')
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: `${secondaryKennzahl?.name || 'Sekundaer'} (${secondaryKennzahl?.unit || ''})`
                        },
                        ticks: {
                            callback: (value) => formatValue(value, secondaryKennzahl?.unit || '')
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    renderLegend() {
        const legendContainer = this.container.querySelector('#scatterLegend');
        if (!legendContainer) return;

        // Uni-Typen die in den Daten vorkommen
        const typesInData = [...new Set(this.mergedData.map(p => p.university?.type))].filter(Boolean);

        legendContainer.innerHTML = typesInData.map(type => {
            const typeInfo = UNI_TYPES[type] || { name: type, color: '#6c757d' };
            return `
                <div class="scatter-legend__item" data-type="${type}">
                    <span class="scatter-legend__color" style="background: ${typeInfo.color};"></span>
                    <span class="scatter-legend__label">${typeInfo.name}</span>
                </div>
            `;
        }).join('');

        // Klickbar machen
        legendContainer.querySelectorAll('.scatter-legend__item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                this.toggleTypeVisibility(type);
                item.classList.toggle('is-hidden');
            });
        });
    }

    toggleTypeVisibility(type) {
        if (!this.chart) return;

        const datasetIndex = this.chart.data.datasets.findIndex(ds => ds.uniType === type);
        if (datasetIndex >= 0) {
            const meta = this.chart.getDatasetMeta(datasetIndex);
            meta.hidden = !meta.hidden;
            this.chart.update();
        }
    }

    calculateCorrelation() {
        if (this.mergedData.length < 2) return 0;

        const n = this.mergedData.length;
        const xValues = this.mergedData.map(d => d.x);
        const yValues = this.mergedData.map(d => d.y);

        const meanX = xValues.reduce((a, b) => a + b, 0) / n;
        const meanY = yValues.reduce((a, b) => a + b, 0) / n;

        let numerator = 0;
        let denomX = 0;
        let denomY = 0;

        for (let i = 0; i < n; i++) {
            const dx = xValues[i] - meanX;
            const dy = yValues[i] - meanY;
            numerator += dx * dy;
            denomX += dx * dx;
            denomY += dy * dy;
        }

        const denominator = Math.sqrt(denomX * denomY);
        return denominator === 0 ? 0 : numerator / denominator;
    }

    getCorrelationLabel(r) {
        const absR = Math.abs(r);
        if (absR >= 0.8) return '(stark)';
        if (absR >= 0.5) return '(moderat)';
        if (absR >= 0.3) return '(schwach)';
        return '(sehr schwach)';
    }

    toggleTrendline() {
        if (!this.chart) return;

        const trendlineIndex = this.chart.data.datasets.findIndex(ds => ds.label === 'Trendlinie');

        if (trendlineIndex >= 0) {
            this.chart.data.datasets.splice(trendlineIndex, 1);
        } else {
            this.addTrendline();
        }

        this.chart.update();

        const btn = this.container.querySelector('#toggleTrendline');
        btn?.classList.toggle('btn--primary');
        btn?.classList.toggle('btn--ghost');
    }

    addTrendline() {
        if (this.mergedData.length < 2) return;

        // Lineare Regression berechnen
        const n = this.mergedData.length;
        const xValues = this.mergedData.map(d => d.x);
        const yValues = this.mergedData.map(d => d.y);

        const meanX = xValues.reduce((a, b) => a + b, 0) / n;
        const meanY = yValues.reduce((a, b) => a + b, 0) / n;

        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            numerator += (xValues[i] - meanX) * (yValues[i] - meanY);
            denominator += (xValues[i] - meanX) ** 2;
        }

        const slope = denominator !== 0 ? numerator / denominator : 0;
        const intercept = meanY - slope * meanX;

        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);

        this.chart.data.datasets.push({
            label: 'Trendlinie',
            type: 'line',
            data: [
                { x: minX, y: slope * minX + intercept },
                { x: maxX, y: slope * maxX + intercept }
            ],
            borderColor: '#6c757d',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
        });
    }

    update(newData) {
        this.mergedData = newData || [];
        this.destroy();
        this.render();
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    resize() {
        this.chart?.resize();
    }

    exportAsPng() {
        if (!this.chart) return;

        const primary = state.get('selectedKennzahl') || 'x';
        const secondary = state.get('secondaryKennzahl') || 'y';
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `wissensbilanz_scatter_${primary}_${secondary}_${timestamp}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = this.chart.toBase64Image('image/png', 1);
        link.click();
    }
}
