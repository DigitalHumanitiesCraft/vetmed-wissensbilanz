/**
 * RankingChart - Horizontales Balkendiagramm mit Ranking
 *
 * Implementiert:
 * - Sortierte horizontale Balken
 * - Jahr-Auswahl
 * - Animierte Übergänge bei Jahrwechsel
 */

import { state } from '../core/state.js';
import { KENNZAHL_BY_CODE, formatValue, UNI_TYPES } from '../data/metadata.js';

export class RankingChart {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = {
            rankingYear: state.get('yearRange')?.end || 2024,
            ...options
        };
        this.chart = null;
    }

    render() {
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const years = this.getAvailableYears();

        this.container.innerHTML = `
            <div class="ranking-container">
                <div class="ranking-header">
                    <h3 class="ranking-title">${kennzahl?.name || 'Kennzahl'} - Ranking</h3>
                    <select class="form-select ranking-year-select" id="rankingYearSelect">
                        ${years.map(year => `
                            <option value="${year}" ${year === this.options.rankingYear ? 'selected' : ''}>
                                ${year}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="ranking-chart" id="rankingChart">
                    ${this.renderBars(kennzahl)}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    getAvailableYears() {
        return [...new Set(
            Object.values(this.data)
                .flatMap(g => g.data.map(d => d.year))
        )].sort();
    }

    renderBars(kennzahl) {
        const year = this.options.rankingYear;

        // Daten für das ausgewählte Jahr sammeln und sortieren
        const rankings = Object.entries(this.data)
            .map(([uniCode, group]) => {
                const dataPoint = group.data.find(d => d.year === year);
                return {
                    uniCode,
                    university: group.university,
                    value: dataPoint?.value,
                    formatted: dataPoint?.value !== null
                        ? formatValue(dataPoint.value, kennzahl?.unit || '')
                        : 'Keine Daten'
                };
            })
            .filter(item => item.value !== null && item.value !== undefined)
            .sort((a, b) => b.value - a.value);

        if (rankings.length === 0) {
            return `
                <div class="viz-empty">
                    <p>Keine Daten für ${year} verfügbar</p>
                </div>
            `;
        }

        // Max-Wert für Prozentberechnung
        const maxValue = Math.max(...rankings.map(r => r.value));

        return rankings.map((item, index) => {
            const percent = (item.value / maxValue) * 100;
            const color = UNI_TYPES[item.university.type]?.color || '#1a5490';

            return `
                <div class="ranking-bar" data-uni="${item.uniCode}">
                    <span class="ranking-bar__rank">${index + 1}.</span>
                    <span class="ranking-bar__label" title="${item.university.name}">
                        ${item.university.shortName}
                    </span>
                    <div class="ranking-bar__track">
                        <div class="ranking-bar__fill"
                             style="width: ${percent}%; background: ${color};">
                            <span class="ranking-bar__value">${item.formatted}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    attachEventListeners() {
        const yearSelect = this.container.querySelector('#rankingYearSelect');
        if (yearSelect) {
            yearSelect.addEventListener('change', (e) => {
                this.options.rankingYear = parseInt(e.target.value);
                this.updateBars();
            });
        }
    }

    updateBars() {
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const chartContainer = this.container.querySelector('#rankingChart');

        if (chartContainer) {
            // Fade out
            chartContainer.style.opacity = '0.5';

            setTimeout(() => {
                chartContainer.innerHTML = this.renderBars(kennzahl);
                chartContainer.style.opacity = '1';
            }, 150);
        }
    }

    update(newData) {
        this.data = newData;
        this.render();
    }

    destroy() {
        // Nichts zu zerstören
    }

    resize() {
        // CSS-basiert, keine Action nötig
    }
}
