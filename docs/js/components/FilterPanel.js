/**
 * FilterPanel - Sidebar mit allen Filtermöglichkeiten
 *
 * Implementiert:
 * - F1: Filter kontrollieren alles
 * - F3: Progressive Disclosure (Gruppen → Einzelauswahl)
 * - F4: Filter Feedback (Datenpunkt-Anzahl)
 *
 * Komponenten:
 * - Universitäts-Typ-Gruppen
 * - Einzelne Universitäten
 * - Zeitraum-Slider
 * - Kennzahl-Auswahl
 */

import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import {
    UNIVERSITIES,
    UNIVERSITIES_BY_TYPE,
    UNI_TYPES,
    KENNZAHLEN_BY_CATEGORY,
    KENNZAHL_CATEGORIES
} from '../data/metadata.js';

class FilterPanel {
    constructor(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
        this.subscribeToState();
    }

    render() {
        this.container.innerHTML = `
            <div class="sidebar__section">
                <h3 class="sidebar__section-title">Universitäten</h3>
                <div class="filter-uni-types" id="uniTypeFilters">
                    ${this.renderUniTypeGroups()}
                </div>
                <div class="filter-universities" id="universityFilters" style="margin-top: var(--space-3);">
                    ${this.renderUniversityCheckboxes()}
                </div>
            </div>

            <div class="sidebar__section">
                <h3 class="sidebar__section-title">Zeitraum</h3>
                <div class="range-slider" id="yearRangeSlider">
                    <div class="range-slider__value" id="yearRangeValue">
                        ${state.get('yearRange').start} – ${state.get('yearRange').end}
                    </div>
                    <div class="range-slider__inputs">
                        <label class="form-label text-sm">Von</label>
                        <select class="form-select" id="yearStart">
                            ${this.renderYearOptions(state.get('yearRange').start, 'start')}
                        </select>
                        <label class="form-label text-sm" style="margin-top: var(--space-2);">Bis</label>
                        <select class="form-select" id="yearEnd">
                            ${this.renderYearOptions(state.get('yearRange').end, 'end')}
                        </select>
                    </div>
                </div>
            </div>

            <div class="sidebar__section">
                <h3 class="sidebar__section-title">Kennzahl</h3>
                <select class="form-select" id="kennzahlSelect">
                    ${this.renderKennzahlOptions()}
                </select>
            </div>

            <div class="sidebar__footer">
                <div class="stats-bar stats-bar--vertical" id="filterStats">
                    <div class="stats-bar__item">
                        <span class="stats-bar__label">Datenpunkte:</span>
                        <span class="stats-bar__value" id="statsTotalPoints">–</span>
                    </div>
                </div>
                <button class="btn btn--secondary" id="resetFiltersBtn" style="width: 100%; margin-top: var(--space-4);">
                    Filter zurücksetzen
                </button>
            </div>
        `;
    }

    renderUniTypeGroups() {
        return Object.values(UNI_TYPES).map(type => {
            const unis = UNIVERSITIES_BY_TYPE[type.id] || [];
            const count = unis.length;

            return `
                <label class="checkbox checkbox--uni-${type.id}" style="margin-bottom: var(--space-2);">
                    <input type="checkbox"
                           class="checkbox__input"
                           data-uni-type="${type.id}"
                           ${state.get('selectedUniTypes').includes(type.id) ? 'checked' : ''}>
                    <span class="checkbox__box"></span>
                    <span class="checkbox__label">${type.name} (${count})</span>
                </label>
            `;
        }).join('');
    }

    renderUniversityCheckboxes() {
        const selectedUnis = state.get('selectedUniversities');

        // Gruppiert nach Typ anzeigen
        return Object.values(UNI_TYPES).map(type => {
            const unis = UNIVERSITIES_BY_TYPE[type.id] || [];
            if (unis.length === 0) return '';

            return `
                <div class="filter-uni-group" data-type="${type.id}">
                    <div class="filter-uni-group__header text-sm text-muted" style="margin: var(--space-2) 0 var(--space-1);">
                        ${type.name}
                    </div>
                    ${unis.map(uni => `
                        <label class="checkbox checkbox--uni-${type.id}" style="margin-bottom: var(--space-1); margin-left: var(--space-2);">
                            <input type="checkbox"
                                   class="checkbox__input"
                                   data-uni-code="${uni.code}"
                                   ${selectedUnis.includes(uni.code) ? 'checked' : ''}>
                            <span class="checkbox__box"></span>
                            <span class="checkbox__label">${uni.shortName}</span>
                        </label>
                    `).join('')}
                </div>
            `;
        }).join('');
    }

    renderYearOptions(selected, type) {
        const years = [2019, 2020, 2021, 2022, 2023];
        return years.map(year => `
            <option value="${year}" ${year === selected ? 'selected' : ''}>${year}</option>
        `).join('');
    }

    renderKennzahlOptions() {
        const selectedKennzahl = state.get('selectedKennzahl');

        return Object.values(KENNZAHL_CATEGORIES).map(cat => {
            const kennzahlen = KENNZAHLEN_BY_CATEGORY[cat.id] || [];
            return `
                <optgroup label="${cat.name}">
                    ${kennzahlen.map(k => `
                        <option value="${k.code}" ${k.code === selectedKennzahl ? 'selected' : ''}>
                            ${k.code}: ${k.name}
                        </option>
                    `).join('')}
                </optgroup>
            `;
        }).join('');
    }

    attachEventListeners() {
        // Uni-Typ Checkboxen
        this.container.querySelectorAll('[data-uni-type]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const type = e.target.dataset.uniType;
                const types = [...state.get('selectedUniTypes')];

                if (e.target.checked) {
                    types.push(type);
                    // Alle Unis dieses Typs selektieren
                    const unis = UNIVERSITIES_BY_TYPE[type].map(u => u.code);
                    const currentUnis = state.get('selectedUniversities');
                    state.set('selectedUniversities', [...new Set([...currentUnis, ...unis])]);
                } else {
                    const index = types.indexOf(type);
                    if (index > -1) types.splice(index, 1);
                    // Unis dieses Typs deselektieren
                    const unis = UNIVERSITIES_BY_TYPE[type].map(u => u.code);
                    const currentUnis = state.get('selectedUniversities');
                    state.set('selectedUniversities', currentUnis.filter(u => !unis.includes(u)));
                }

                state.set('selectedUniTypes', types);
                this.updateUniversityCheckboxes();
            });
        });

        // Einzelne Uni Checkboxen
        this.container.querySelectorAll('[data-uni-code]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const code = e.target.dataset.uniCode;
                const unis = [...state.get('selectedUniversities')];

                if (e.target.checked) {
                    unis.push(code);
                } else {
                    const index = unis.indexOf(code);
                    if (index > -1) unis.splice(index, 1);
                }

                state.set('selectedUniversities', unis);
            });
        });

        // Jahr-Auswahl
        const yearStart = this.container.querySelector('#yearStart');
        const yearEnd = this.container.querySelector('#yearEnd');

        yearStart.addEventListener('change', (e) => {
            const current = state.get('yearRange');
            state.set('yearRange', {
                start: parseInt(e.target.value),
                end: Math.max(parseInt(e.target.value), current.end)
            });
            this.updateYearDisplay();
        });

        yearEnd.addEventListener('change', (e) => {
            const current = state.get('yearRange');
            state.set('yearRange', {
                start: Math.min(current.start, parseInt(e.target.value)),
                end: parseInt(e.target.value)
            });
            this.updateYearDisplay();
        });

        // Kennzahl-Auswahl
        this.container.querySelector('#kennzahlSelect').addEventListener('change', (e) => {
            state.set('selectedKennzahl', e.target.value);
        });

        // Reset-Button
        this.container.querySelector('#resetFiltersBtn').addEventListener('click', () => {
            state.resetFilters();
            this.render();
            this.attachEventListeners();
        });
    }

    subscribeToState() {
        // Auf Statistik-Änderungen reagieren
        state.subscribe('dataStats', (stats) => {
            this.updateStats(stats);
        });
    }

    updateUniversityCheckboxes() {
        const selectedUnis = state.get('selectedUniversities');
        this.container.querySelectorAll('[data-uni-code]').forEach(checkbox => {
            checkbox.checked = selectedUnis.includes(checkbox.dataset.uniCode);
        });
    }

    updateYearDisplay() {
        const range = state.get('yearRange');
        const display = this.container.querySelector('#yearRangeValue');
        if (display) {
            display.textContent = `${range.start} – ${range.end}`;
        }
    }

    updateStats(stats) {
        const totalEl = this.container.querySelector('#statsTotalPoints');
        if (totalEl) {
            totalEl.textContent = stats.totalPoints.toLocaleString('de-AT');
        }
    }
}

export function initFilterPanel(container) {
    return new FilterPanel(container);
}
