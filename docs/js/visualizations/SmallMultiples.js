/**
 * SmallMultiples - Grid von Mini-Charts nach Uni-Typ
 *
 * Implementiert:
 * - 5 Panels (voll, tech, med, kunst, weiterb)
 * - Je ein Line-Chart pro Uni-Typ
 * - Klick auf Panel filtert auf diesen Typ
 */

import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { KENNZAHL_BY_CODE, UNI_TYPES, formatValue } from '../data/metadata.js';

export class SmallMultiples {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = options;
        this.charts = [];
    }

    render() {
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];

        // Daten nach Uni-Typ gruppieren
        const byType = this.groupByUniType();

        this.container.innerHTML = `
            <div class="small-multiples-container">
                <div class="small-multiples-header">
                    <h3 class="small-multiples-title">${kennzahl?.name || 'Kennzahl'}</h3>
                    <p class="small-multiples-subtitle">Gruppiert nach Universitäts-Typ</p>
                </div>
                <div class="small-multiples-grid" id="smallMultiplesGrid">
                    ${Object.entries(UNI_TYPES).map(([typeId, typeMeta]) => `
                        <div class="small-multiples-grid__panel" data-type="${typeId}">
                            <div class="small-multiples-grid__title">
                                <span class="small-multiples-grid__type-badge"
                                      style="background: ${typeMeta.color}"></span>
                                ${typeMeta.name}
                                <span class="small-multiples-grid__count">
                                    (${byType[typeId]?.length || 0})
                                </span>
                            </div>
                            <canvas class="small-multiples-grid__canvas"
                                    id="chart-${typeId}"></canvas>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.renderCharts(byType, kennzahl);
    }

    groupByUniType() {
        const byType = {};

        Object.entries(this.data).forEach(([uniCode, group]) => {
            const type = group.university.type;
            if (!byType[type]) {
                byType[type] = [];
            }
            byType[type].push({
                uniCode,
                university: group.university,
                data: group.data
            });
        });

        return byType;
    }

    renderCharts(byType, kennzahl) {
        // Alle Jahre für konsistente X-Achse
        const allYears = [...new Set(
            Object.values(this.data)
                .flatMap(g => g.data.map(d => d.year))
        )].sort();

        // Alle Werte für konsistente Y-Achse
        const allValues = Object.values(this.data)
            .flatMap(g => g.data.map(d => d.value))
            .filter(v => v !== null);

        const yMin = Math.min(...allValues);
        const yMax = Math.max(...allValues);

        Object.entries(UNI_TYPES).forEach(([typeId, typeMeta]) => {
            const canvas = this.container.querySelector(`#chart-${typeId}`);
            if (!canvas) return;

            const typeData = byType[typeId] || [];
            const ctx = canvas.getContext('2d');

            const datasets = typeData.map(item => ({
                label: item.university.shortName,
                data: item.data.map(d => ({ x: d.year, y: d.value })),
                borderColor: typeMeta.color,
                backgroundColor: typeMeta.color + '20',
                borderWidth: 1.5,
                tension: 0.1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false
            }));

            const chart = new Chart(ctx, {
                type: 'line',
                data: { datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false, // Performance
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(33, 37, 41, 0.95)',
                            titleFont: { size: 11 },
                            bodyFont: { size: 10 },
                            padding: 8,
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
                                font: { size: 9 },
                                callback: (value) => value.toString()
                            },
                            grid: { display: false }
                        },
                        y: {
                            min: yMin * 0.9,
                            max: yMax * 1.1,
                            ticks: {
                                font: { size: 9 },
                                callback: (value) => {
                                    if (kennzahl?.unit === '%') return value.toFixed(0) + '%';
                                    if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
                                    return value.toFixed(0);
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        }
                    }
                }
            });

            this.charts.push(chart);
        });
    }

    attachEventListeners() {
        // Klick auf Panel = Filter auf Uni-Typ
        this.container.querySelectorAll('.small-multiples-grid__panel').forEach(panel => {
            panel.addEventListener('click', () => {
                const type = panel.dataset.type;
                this.highlightPanel(panel);
                eventBus.emit(EVENTS.UNI_TYPE_FILTER, type);
            });
        });
    }

    highlightPanel(activePanel) {
        this.container.querySelectorAll('.small-multiples-grid__panel').forEach(panel => {
            panel.classList.remove('small-multiples-grid__panel--active');
        });
        activePanel.classList.add('small-multiples-grid__panel--active');
    }

    update(newData) {
        this.data = newData;
        this.destroy();
        this.render();
    }

    destroy() {
        this.charts.forEach(chart => chart.destroy());
        this.charts = [];
    }

    resize() {
        this.charts.forEach(chart => chart.resize());
    }
}
