/**
 * DualAxisChart - Zwei Kennzahlen mit zwei Y-Achsen
 *
 * Zeigt zwei Kennzahlen in einem Chart:
 * - Primaer: Durchgezogene Linien (linke Y-Achse)
 * - Sekundaer: Gestrichelte Linien (rechte Y-Achse)
 */

import { state } from '../core/state.js';
import { UNI_BY_CODE, KENNZAHL_BY_CODE, formatValue } from '../data/metadata.js';
import { getUniColor } from '../utils/colorUtils.js';

export class DualAxisChart {
    /**
     * @param {HTMLElement} container - Container-Element
     * @param {Object} primaryData - Gruppierte Daten fuer primaere Kennzahl
     * @param {Object} secondaryData - Gruppierte Daten fuer sekundaere Kennzahl
     * @param {Object} options - Optionen
     */
    constructor(container, primaryData, secondaryData, options = {}) {
        this.container = container;
        this.primaryData = primaryData;
        this.secondaryData = secondaryData;
        this.options = options;
        this.chart = null;
    }

    render() {
        const primaryKennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const secondaryKennzahl = KENNZAHL_BY_CODE[state.get('secondaryKennzahl')];

        this.container.innerHTML = `
            <div class="chart-header">
                <div class="chart-legend" id="chartLegend"></div>
                <div class="chart-actions">
                    <button class="btn btn--ghost btn--sm" id="exportPng" title="Als PNG exportieren">
                        PNG Export
                    </button>
                </div>
            </div>
            <div class="chart-canvas-wrapper">
                <canvas id="dualAxisCanvas"></canvas>
            </div>
            <div class="dual-axis-legend">
                <span class="dual-axis-legend__item dual-axis-legend__item--primary">
                    <span class="dual-axis-legend__line"></span>
                    ${primaryKennzahl?.name || 'Primaer'} (${primaryKennzahl?.unit || ''})
                </span>
                <span class="dual-axis-legend__item dual-axis-legend__item--secondary">
                    <span class="dual-axis-legend__line dual-axis-legend__line--dashed"></span>
                    ${secondaryKennzahl?.name || 'Sekundaer'} (${secondaryKennzahl?.unit || ''})
                </span>
            </div>
        `;

        this.attachEventListeners();
        this.createChart();
        this.renderLegend();
    }

    attachEventListeners() {
        this.container.querySelector('#exportPng')?.addEventListener('click', () => {
            this.exportAsPng();
        });
    }

    createChart() {
        const canvas = this.container.querySelector('#dualAxisCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const primaryKennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const secondaryKennzahl = KENNZAHL_BY_CODE[state.get('secondaryKennzahl')];

        const datasets = [];

        // Primaere Daten (durchgezogen, linke Y-Achse)
        Object.entries(this.primaryData).forEach(([uniCode, group]) => {
            const uni = group.university;
            const color = this.getColorForUni(uni);

            datasets.push({
                label: `${uni.shortName}`,
                data: group.data.map(d => ({ x: d.year, y: d.value })),
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false,
                yAxisID: 'y',
                isPrimary: true,
                uniCode: uniCode
            });
        });

        // Sekundaere Daten (gestrichelt, rechte Y-Achse)
        if (this.secondaryData) {
            Object.entries(this.secondaryData).forEach(([uniCode, group]) => {
                const uni = group.university;
                const color = this.getColorForUni(uni);

                datasets.push({
                    label: `${uni.shortName} (2)`,
                    data: group.data.map(d => ({ x: d.year, y: d.value })),
                    borderColor: color,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointStyle: 'rect',
                    fill: false,
                    yAxisID: 'y1',
                    isPrimary: false,
                    uniCode: uniCode
                });
            });
        }

        // Alle Jahre sammeln
        const allYears = [...new Set([
            ...Object.values(this.primaryData).flatMap(g => g.data.map(d => d.year)),
            ...(this.secondaryData ? Object.values(this.secondaryData).flatMap(g => g.data.map(d => d.year)) : [])
        ])].sort();

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
                        text: `${primaryKennzahl?.code || ''} vs ${secondaryKennzahl?.code || ''}`,
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
                                const isPrimary = context.dataset.isPrimary;
                                const kennzahl = isPrimary ? primaryKennzahl : secondaryKennzahl;
                                const value = formatValue(context.parsed.y, kennzahl?.unit || '');
                                const suffix = isPrimary ? '' : ' (2)';
                                return `${context.dataset.label.replace(' (2)', '')}${suffix}: ${value}`;
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
                        type: 'linear',
                        position: 'left',
                        beginAtZero: primaryKennzahl?.unit === '%' ? false : true,
                        title: {
                            display: true,
                            text: `${primaryKennzahl?.name || 'Primaer'} (${primaryKennzahl?.unit || ''})`,
                            color: '#1a5490'
                        },
                        ticks: {
                            callback: (value) => formatValue(value, primaryKennzahl?.unit || ''),
                            color: '#1a5490'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: secondaryKennzahl?.unit === '%' ? false : true,
                        title: {
                            display: true,
                            text: `${secondaryKennzahl?.name || 'Sekundaer'} (${secondaryKennzahl?.unit || ''})`,
                            color: '#dc3545'
                        },
                        ticks: {
                            callback: (value) => formatValue(value, secondaryKennzahl?.unit || ''),
                            color: '#dc3545'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    renderLegend() {
        const legendContainer = this.container.querySelector('#chartLegend');
        if (!legendContainer) return;

        // Nur primaere Unis anzeigen (Farben sind identisch)
        legendContainer.innerHTML = Object.entries(this.primaryData).map(([uniCode, group]) => {
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
                this.toggleUniVisibility(uniCode);
                item.classList.toggle('is-hidden');
            });
        });
    }

    // Verwendet zentrale colorUtils
    getColorForUni(uni) {
        return getUniColor(uni);
    }

    toggleUniVisibility(uniCode) {
        if (!this.chart) return;

        // Toggle both primary and secondary datasets for this uni
        this.chart.data.datasets.forEach((ds, index) => {
            if (ds.uniCode === uniCode) {
                const meta = this.chart.getDatasetMeta(index);
                meta.hidden = !meta.hidden;
            }
        });
        this.chart.update();
    }

    update(primaryData, secondaryData) {
        this.primaryData = primaryData;
        this.secondaryData = secondaryData;
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

        const primary = state.get('selectedKennzahl') || 'chart';
        const secondary = state.get('secondaryKennzahl') || '';
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `wissensbilanz_${primary}_vs_${secondary}_${timestamp}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = this.chart.toBase64Image('image/png', 1);
        link.click();
    }
}
