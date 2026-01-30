/**
 * ChartContainer - Visualisierung mit Chart.js
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
import { UNI_BY_CODE, KENNZAHL_BY_CODE, formatValue, getUniTypeColor } from '../data/metadata.js';

class ChartContainer {
    constructor(container) {
        this.container = container;
        this.chart = null;
        this.render();
        this.subscribeToState();
    }

    render() {
        this.container.innerHTML = `
            <div class="chart-wrapper">
                <div class="chart-header">
                    <div class="chart-legend" id="chartLegend"></div>
                    <div class="chart-actions">
                        <button class="btn btn--ghost btn--sm" id="toggleAverage" title="Durchschnittslinie ein/aus">
                            Ø Durchschnitt
                        </button>
                    </div>
                </div>
                <div class="chart-canvas-wrapper">
                    <canvas id="mainChart"></canvas>
                </div>
                <div class="chart-loading" id="chartLoading" style="display: none;">
                    <div class="spinner"></div>
                    <span>Daten werden geladen...</span>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.loadAndRenderChart();
    }

    attachEventListeners() {
        this.container.querySelector('#toggleAverage')?.addEventListener('click', () => {
            this.toggleAverageLine();
        });
    }

    subscribeToState() {
        // Bei Filter-Änderungen neu laden
        eventBus.on(EVENTS.FILTER_CHANGE, () => {
            this.loadAndRenderChart();
        });
    }

    async loadAndRenderChart() {
        this.showLoading(true);

        try {
            const filteredData = await dataLoader.loadFiltered();
            const groupedData = dataLoader.groupByUniversity(filteredData);

            this.renderChart(groupedData);
            this.renderLegend(groupedData);
        } catch (error) {
            console.error('Chart-Fehler:', error);
            this.showError('Daten konnten nicht geladen werden.');
        } finally {
            this.showLoading(false);
        }
    }

    renderChart(groupedData) {
        const canvas = this.container.querySelector('#mainChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];

        // Datasets vorbereiten
        const datasets = Object.entries(groupedData).map(([uniCode, group]) => {
            const uni = group.university;
            const color = this.getColorForUni(uni);

            return {
                label: uni.shortName,
                data: group.data.map(d => ({ x: d.year, y: d.value })),
                borderColor: color,
                backgroundColor: color + '20', // 20% Opacity
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false
            };
        });

        // Alle Jahre sammeln für X-Achse
        const allYears = [...new Set(
            Object.values(groupedData)
                .flatMap(g => g.data.map(d => d.year))
        )].sort();

        // Vorheriges Chart zerstören
        if (this.chart) {
            this.chart.destroy();
        }

        // Neues Chart erstellen
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
                        text: kennzahl ? `${kennzahl.code}: ${kennzahl.name}` : 'Kennzahl',
                        font: { size: 16, weight: '600' },
                        padding: { bottom: 20 }
                    },
                    legend: {
                        display: false // Custom Legend
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 37, 41, 0.95)',
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const value = formatValue(context.parsed.y, kennzahl?.unit || '');
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
                        beginAtZero: kennzahl?.unit === '%' ? false : true,
                        title: {
                            display: true,
                            text: kennzahl?.unit || 'Wert'
                        },
                        ticks: {
                            callback: (value) => formatValue(value, kennzahl?.unit || '')
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    renderLegend(groupedData) {
        const legendContainer = this.container.querySelector('#chartLegend');
        if (!legendContainer) return;

        legendContainer.innerHTML = Object.entries(groupedData).map(([uniCode, group]) => {
            const uni = group.university;
            const color = this.getColorForUni(uni);

            return `
                <div class="chart-legend__item" data-uni="${uniCode}">
                    <span class="chart-legend__color" style="background: ${color};"></span>
                    <span class="chart-legend__label">${uni.shortName}</span>
                </div>
            `;
        }).join('');

        // Legend-Items klickbar machen (toggle visibility)
        legendContainer.querySelectorAll('.chart-legend__item').forEach(item => {
            item.addEventListener('click', () => {
                const uniCode = item.dataset.uni;
                this.toggleDatasetVisibility(uniCode);
                item.classList.toggle('is-hidden');
            });
        });
    }

    getColorForUni(uni) {
        // Farbe basierend auf Uni-Typ
        const colorMap = {
            'voll': '#1a5490',
            'tech': '#28a745',
            'med': '#dc3545',
            'kunst': '#6f42c1',
            'weiterb': '#fd7e14'
        };
        return colorMap[uni.type] || '#6c757d';
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
        if (!this.chart) return;

        // Durchschnittslinie als zusätzliches Dataset
        const avgDatasetIndex = this.chart.data.datasets.findIndex(ds => ds.label === 'Durchschnitt');

        if (avgDatasetIndex >= 0) {
            // Entfernen
            this.chart.data.datasets.splice(avgDatasetIndex, 1);
        } else {
            // Hinzufügen
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

        this.chart.update();

        // Button-State updaten
        const btn = this.container.querySelector('#toggleAverage');
        if (btn) {
            btn.classList.toggle('btn--primary');
            btn.classList.toggle('btn--ghost');
        }
    }

    showLoading(show) {
        const loading = this.container.querySelector('#chartLoading');
        const canvas = this.container.querySelector('.chart-canvas-wrapper');

        if (loading) loading.style.display = show ? 'flex' : 'none';
        if (canvas) canvas.style.opacity = show ? '0.5' : '1';
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 class="empty-state__title">Fehler</h3>
                <p class="empty-state__description">${message}</p>
            </div>
        `;
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

export function initChartContainer(container) {
    return new ChartContainer(container);
}
