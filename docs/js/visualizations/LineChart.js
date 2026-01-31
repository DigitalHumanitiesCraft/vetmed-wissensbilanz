/**
 * LineChart - Zeitreihen-Visualisierung mit Chart.js
 *
 * Implementiert:
 * - V1: Konsistente Farbkodierung (Uni-Typ-Farben)
 * - V2: Zeitreihen als Primärformat
 * - V3: Referenzlinien (Durchschnitt)
 * - V5: Responsive Charts
 */

import { state } from '../core/state.js';
import { UNI_BY_CODE, KENNZAHL_BY_CODE, formatValue } from '../data/metadata.js';
import { getUniColor } from '../utils/colorUtils.js';

export class LineChart {
    /**
     * @param {HTMLElement} container - Container-Element
     * @param {Object} data - Gruppierte Daten { uniCode: { university, data: [...] } }
     * @param {Object} options - Optionen { showAverage: boolean }
     */
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = {
            showAverage: false,
            ...options
        };
        this.chart = null;
    }

    /**
     * Rendert das Line Chart
     */
    render() {
        this.container.innerHTML = `
            <div class="chart-header">
                <div class="chart-legend" id="chartLegend"></div>
                <div class="chart-actions">
                    <button class="btn btn--ghost btn--sm" id="toggleAverage" title="Durchschnittslinie ein/aus">
                        Durchschnitt
                    </button>
                    <button class="btn btn--ghost btn--sm" id="exportPng" title="Als PNG exportieren">
                        PNG Export
                    </button>
                </div>
            </div>
            <div class="chart-canvas-wrapper">
                <canvas id="lineChartCanvas"></canvas>
            </div>
        `;

        this.attachEventListeners();
        this.createChart();
        this.renderLegend();
    }

    attachEventListeners() {
        this.container.querySelector('#toggleAverage')?.addEventListener('click', () => {
            this.toggleAverageLine();
        });

        this.container.querySelector('#exportPng')?.addEventListener('click', () => {
            this.exportAsPng();
        });
    }

    createChart() {
        const canvas = this.container.querySelector('#lineChartCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const isRatio = this.options.isRatio;
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const secondaryKennzahl = KENNZAHL_BY_CODE[state.get('secondaryKennzahl')];

        // Titel und Y-Achsen-Label fuer Ratio-Modus
        let chartTitle, yAxisLabel;
        if (isRatio && kennzahl && secondaryKennzahl) {
            chartTitle = `Verhaeltnis: ${kennzahl.code} / ${secondaryKennzahl.code}`;
            yAxisLabel = `${kennzahl.name} / ${secondaryKennzahl.name}`;
        } else {
            chartTitle = kennzahl ? `${kennzahl.code}: ${kennzahl.name}` : 'Kennzahl';
            yAxisLabel = kennzahl?.unit || 'Wert';
        }

        // Datasets vorbereiten
        const datasets = Object.entries(this.data).map(([uniCode, group]) => {
            const uni = group.university;
            const color = this.getColorForUni(uni);

            return {
                label: uni.shortName,
                data: group.data.map(d => ({ x: d.year, y: d.value })),
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false
            };
        });

        // Alle Jahre sammeln für X-Achse
        const allYears = [...new Set(
            Object.values(this.data)
                .flatMap(g => g.data.map(d => d.year))
        )].sort();

        // Chart erstellen
        this.chart = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
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
                            label: (context) => {
                                const value = isRatio
                                    ? context.parsed.y.toFixed(3)
                                    : formatValue(context.parsed.y, kennzahl?.unit || '');
                                return `${context.dataset.label}: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        min: Math.min(...allYears),
                        max: Math.max(...allYears),
                        ticks: {
                            stepSize: 1,
                            callback: (value) => value.toString()
                        },
                        title: {
                            display: true,
                            text: 'Jahr'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        beginAtZero: isRatio ? false : (kennzahl?.unit === '%' ? false : true),
                        title: {
                            display: true,
                            text: yAxisLabel
                        },
                        ticks: {
                            callback: (value) => isRatio ? value.toFixed(2) : formatValue(value, kennzahl?.unit || '')
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });

        // Wenn showAverage initial true, Durchschnitt anzeigen
        if (this.options.showAverage) {
            this.addAverageLine();
        }
    }

    renderLegend() {
        const legendContainer = this.container.querySelector('#chartLegend');
        if (!legendContainer) return;

        legendContainer.innerHTML = Object.entries(this.data).map(([uniCode, group]) => {
            const uni = group.university;
            const color = this.getColorForUni(uni);

            return `
                <div class="chart-legend__item" data-uni="${uniCode}">
                    <span class="chart-legend__color" style="background: ${color};"></span>
                    <span class="chart-legend__label">${uni.shortName}</span>
                </div>
            `;
        }).join('');

        // Legend-Items klickbar machen
        legendContainer.querySelectorAll('.chart-legend__item').forEach(item => {
            item.addEventListener('click', () => {
                const uniCode = item.dataset.uni;
                this.toggleDatasetVisibility(uniCode);
                item.classList.toggle('is-hidden');
            });
        });
    }

    // Verwendet zentrale colorUtils - Legacy-Methode fuer Kompatibilitaet
    getColorForUni(uni) {
        return getUniColor(uni);
    }

    toggleDatasetVisibility(uniCode) {
        if (!this.chart) return;

        const datasetIndex = this.chart.data.datasets.findIndex(ds => {
            const uni = UNI_BY_CODE[uniCode];
            return ds.label === uni?.shortName;
        });

        if (datasetIndex >= 0) {
            const meta = this.chart.getDatasetMeta(datasetIndex);
            meta.hidden = !meta.hidden;
            this.chart.update();
        }
    }

    toggleAverageLine() {
        const avgDatasetIndex = this.chart?.data.datasets.findIndex(ds => ds.label === 'Durchschnitt');

        if (avgDatasetIndex >= 0) {
            this.chart.data.datasets.splice(avgDatasetIndex, 1);
        } else {
            this.addAverageLine();
        }

        this.chart?.update();

        // Button-State updaten
        const btn = this.container.querySelector('#toggleAverage');
        btn?.classList.toggle('btn--primary');
        btn?.classList.toggle('btn--ghost');
    }

    addAverageLine() {
        if (!this.chart) return;

        const stats = state.get('dataStats');
        const yearRange = state.get('yearRange');

        this.chart.data.datasets.push({
            label: 'Durchschnitt',
            data: [
                { x: yearRange.start, y: stats.average },
                { x: yearRange.end, y: stats.average }
            ],
            borderColor: '#6c757d',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
        });
    }

    /**
     * Aktualisiert die Daten
     * @param {Object} newData - Neue gruppierte Daten
     */
    update(newData) {
        this.data = newData;
        this.destroy();
        this.render();
    }

    /**
     * Zerstört die Chart-Instanz
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    /**
     * Passt Groesse an Container an
     */
    resize() {
        this.chart?.resize();
    }

    /**
     * Exportiert Chart als PNG
     */
    exportAsPng() {
        if (!this.chart) return;

        const kennzahl = state.get('selectedKennzahl') || 'chart';
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `wissensbilanz_${kennzahl}_${timestamp}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = this.chart.toBase64Image('image/png', 1);
        link.click();
    }
}
