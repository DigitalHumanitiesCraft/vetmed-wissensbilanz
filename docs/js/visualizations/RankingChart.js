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
import { getUniColor } from '../utils/colorUtils.js';
import { exportElementAsPng } from '../utils/exportUtils.js';

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
            <div class="ranking-container" id="rankingExportArea">
                <div class="ranking-header">
                    <h3 class="ranking-title">${kennzahl?.name || 'Kennzahl'} - Ranking</h3>
                    <div class="ranking-header__controls">
                        <select class="form-select ranking-year-select" id="rankingYearSelect">
                            ${years.map(year => `
                                <option value="${year}" ${year === this.options.rankingYear ? 'selected' : ''}>
                                    ${year}
                                </option>
                            `).join('')}
                        </select>
                        <button class="btn btn--secondary btn--sm" id="exportRankingBtn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                            </svg>
                            PNG Export
                        </button>
                    </div>
                </div>
                <div class="ranking-chart" id="rankingChart">
                    ${this.renderBars(kennzahl)}
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.attachExportListener();
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
            const color = getUniColor(item.university);

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

    attachExportListener() {
        const exportBtn = this.container.querySelector('#exportRankingBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportAsPng());
        }
    }

    async exportAsPng() {
        const exportArea = this.container.querySelector('#rankingExportArea');
        if (!exportArea) {
            console.error('Ranking Export-Area nicht gefunden');
            return;
        }

        await exportElementAsPng(exportArea, 'ranking', {
            backgroundColor: '#ffffff',
            scale: 2
        });
    }
}
