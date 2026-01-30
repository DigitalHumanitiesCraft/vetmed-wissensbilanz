/**
 * Heatmap - Matrix-Ansicht: Universitäten × Jahre
 *
 * Custom Canvas-Implementierung (Chart.js hat keine native Heatmap)
 *
 * Implementiert:
 * - 22 Zeilen (Unis) × 4 Spalten (Jahre)
 * - Farbintensität basierend auf normalisiertem Wert
 * - Hover-Tooltip mit Details
 */

import { state } from '../core/state.js';
import { KENNZAHL_BY_CODE, formatValue, UNI_TYPES } from '../data/metadata.js';

export class Heatmap {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = options;
        this.tooltip = null;
        this.cells = [];
    }

    render() {
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const { rows, years, valueRange } = this.prepareData();

        this.container.innerHTML = `
            <div class="heatmap-container">
                <div class="heatmap-header-row">
                    <h3 class="heatmap-title">${kennzahl?.name || 'Kennzahl'}</h3>
                </div>
                <div class="heatmap-wrapper">
                    <div class="heatmap-labels" id="heatmapLabels">
                        ${rows.map(row => `
                            <div class="heatmap-label" title="${row.university.name}">
                                <span class="heatmap-label__badge"
                                      style="background: ${UNI_TYPES[row.university.type]?.color || '#6c757d'}">
                                </span>
                                ${row.university.shortName}
                            </div>
                        `).join('')}
                    </div>
                    <div class="heatmap-grid">
                        <div class="heatmap-header">
                            ${years.map(year => `
                                <div class="heatmap-header__cell">${year}</div>
                            `).join('')}
                        </div>
                        <div class="heatmap-body" id="heatmapBody">
                            ${rows.map(row => `
                                <div class="heatmap-row" data-uni="${row.uniCode}">
                                    ${years.map(year => {
                                        const cell = this.getCellData(row, year, valueRange, kennzahl);
                                        return `
                                            <div class="heatmap-cell ${cell.isNull ? 'heatmap-cell--null' : ''}"
                                                 style="background: ${cell.color}"
                                                 data-uni="${row.uniCode}"
                                                 data-year="${year}"
                                                 data-value="${cell.value}"
                                                 data-formatted="${cell.formatted}">
                                                ${cell.isNull ? '–' : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="heatmap-legend">
                    <span class="heatmap-legend__label">Niedrig</span>
                    <div class="heatmap-legend__gradient"></div>
                    <span class="heatmap-legend__label">Hoch</span>
                </div>
                <div class="heatmap-tooltip" id="heatmapTooltip"></div>
            </div>
        `;

        this.tooltip = this.container.querySelector('#heatmapTooltip');
        this.attachEventListeners();
    }

    prepareData() {
        // Alle Jahre sammeln
        const years = [...new Set(
            Object.values(this.data)
                .flatMap(g => g.data.map(d => d.year))
        )].sort();

        // Alle Werte für Normalisierung
        const allValues = Object.values(this.data)
            .flatMap(g => g.data.map(d => d.value))
            .filter(v => v !== null);

        const valueRange = {
            min: Math.min(...allValues),
            max: Math.max(...allValues)
        };

        // Zeilen vorbereiten (sortiert nach Uni-Typ, dann Name)
        const rows = Object.entries(this.data)
            .map(([uniCode, group]) => ({
                uniCode,
                university: group.university,
                data: group.data
            }))
            .sort((a, b) => {
                const typeOrder = ['voll', 'tech', 'med', 'kunst', 'weiterb'];
                const typeA = typeOrder.indexOf(a.university.type);
                const typeB = typeOrder.indexOf(b.university.type);
                if (typeA !== typeB) return typeA - typeB;
                return a.university.shortName.localeCompare(b.university.shortName);
            });

        return { rows, years, valueRange };
    }

    getCellData(row, year, valueRange, kennzahl) {
        const dataPoint = row.data.find(d => d.year === year);
        const value = dataPoint?.value;

        if (value === null || value === undefined) {
            return {
                value: null,
                formatted: 'Keine Daten',
                color: 'transparent',
                isNull: true
            };
        }

        // Normalisieren auf 0-1
        const normalized = (value - valueRange.min) / (valueRange.max - valueRange.min);

        // Farbe basierend auf Uni-Typ mit Opacity
        const uniColor = UNI_TYPES[row.university.type]?.color || '#1a5490';
        const opacity = Math.round(20 + normalized * 80); // 20-100%

        return {
            value,
            formatted: formatValue(value, kennzahl?.unit || ''),
            color: this.hexToRgba(uniColor, opacity / 100),
            isNull: false
        };
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    attachEventListeners() {
        const body = this.container.querySelector('#heatmapBody');
        if (!body) return;

        // Hover für Tooltip
        body.addEventListener('mouseover', (e) => {
            const cell = e.target.closest('.heatmap-cell');
            if (cell && !cell.classList.contains('heatmap-cell--null')) {
                this.showTooltip(cell, e);
            }
        });

        body.addEventListener('mouseout', (e) => {
            const cell = e.target.closest('.heatmap-cell');
            if (cell) {
                this.hideTooltip();
            }
        });

        body.addEventListener('mousemove', (e) => {
            if (this.tooltip.classList.contains('is-visible')) {
                this.positionTooltip(e);
            }
        });
    }

    showTooltip(cell, e) {
        const uni = this.data[cell.dataset.uni]?.university;
        const year = cell.dataset.year;
        const formatted = cell.dataset.formatted;

        this.tooltip.innerHTML = `
            <strong>${uni?.shortName || cell.dataset.uni}</strong><br>
            ${year}: ${formatted}
        `;
        this.tooltip.classList.add('is-visible');
        this.positionTooltip(e);
    }

    positionTooltip(e) {
        const containerRect = this.container.getBoundingClientRect();
        const x = e.clientX - containerRect.left + 10;
        const y = e.clientY - containerRect.top - 30;

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    hideTooltip() {
        this.tooltip.classList.remove('is-visible');
    }

    update(newData) {
        this.data = newData;
        this.render();
    }

    destroy() {
        // Nichts zu zerstören (kein Chart.js)
    }

    resize() {
        // CSS-basiert, keine Action nötig
    }
}
