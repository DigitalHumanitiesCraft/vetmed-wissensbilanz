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
                <div class="filter-uni-accordion" id="uniAccordion">
                    ${this.renderUniAccordion()}
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

    renderUniAccordion() {
        const selectedUnis = state.get('selectedUniversities');

        return Object.values(UNI_TYPES).map(type => {
            const unis = UNIVERSITIES_BY_TYPE[type.id] || [];
            if (unis.length === 0) return '';

            // Check how many unis of this type are selected
            const selectedCount = unis.filter(u => selectedUnis.includes(u.code)).length;
            const allSelected = selectedCount === unis.length;
            const someSelected = selectedCount > 0 && selectedCount < unis.length;

            return `
                <div class="accordion-item" data-type="${type.id}">
                    <div class="accordion-header">
                        <label class="checkbox checkbox--uni-${type.id}">
                            <input type="checkbox"
                                   class="checkbox__input"
                                   data-uni-type="${type.id}"
                                   ${allSelected ? 'checked' : ''}
                                   ${someSelected ? 'data-indeterminate="true"' : ''}>
                            <span class="checkbox__box"></span>
                            <span class="checkbox__label">${type.name}</span>
                        </label>
                        <button class="accordion-toggle" type="button" aria-expanded="false">
                            <span class="accordion-count">${selectedCount}/${unis.length}</span>
                            <svg class="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                    <div class="accordion-content">
                        ${unis.map(uni => `
                            <label class="checkbox checkbox--uni-${type.id}">
                                <input type="checkbox"
                                       class="checkbox__input"
                                       data-uni-code="${uni.code}"
                                       ${selectedUnis.includes(uni.code) ? 'checked' : ''}>
                                <span class="checkbox__box"></span>
                                <span class="checkbox__label">${uni.shortName}</span>
                            </label>
                        `).join('')}
                    </div>
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
        // Accordion Toggle
        this.container.querySelectorAll('.accordion-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const item = toggle.closest('.accordion-item');
                const content = item.querySelector('.accordion-content');
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                toggle.setAttribute('aria-expanded', !isExpanded);
                item.classList.toggle('accordion-item--expanded', !isExpanded);

                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
        });

        // Set indeterminate state for checkboxes
        this.container.querySelectorAll('[data-indeterminate="true"]').forEach(checkbox => {
            checkbox.indeterminate = true;
        });

        // Uni-Typ Checkboxen (select/deselect all of type)
        this.container.querySelectorAll('[data-uni-type]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const type = e.target.dataset.uniType;
                const unis = UNIVERSITIES_BY_TYPE[type].map(u => u.code);
                const currentUnis = state.get('selectedUniversities');

                if (e.target.checked) {
                    state.set('selectedUniversities', [...new Set([...currentUnis, ...unis])]);
                } else {
                    state.set('selectedUniversities', currentUnis.filter(u => !unis.includes(u)));
                }

                this.updateAccordionState(type);
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

                // Update parent checkbox state
                const item = checkbox.closest('.accordion-item');
                if (item) {
                    this.updateAccordionState(item.dataset.type);
                }
            });
        });

        // Jahr-Auswahl mit Validierung (Bis >= Von)
        const yearStart = this.container.querySelector('#yearStart');
        const yearEnd = this.container.querySelector('#yearEnd');

        yearStart.addEventListener('change', (e) => {
            const newStart = parseInt(e.target.value);
            const current = state.get('yearRange');

            // Wenn Start > End, passe End an
            const newEnd = Math.max(newStart, current.end);
            state.set('yearRange', { start: newStart, end: newEnd });

            // UI synchronisieren falls End angepasst wurde
            if (newEnd !== current.end) {
                yearEnd.value = newEnd;
            }
            this.updateYearDisplay();
        });

        yearEnd.addEventListener('change', (e) => {
            const newEnd = parseInt(e.target.value);
            const current = state.get('yearRange');

            // Wenn End < Start, passe Start an
            const newStart = Math.min(current.start, newEnd);
            state.set('yearRange', { start: newStart, end: newEnd });

            // UI synchronisieren falls Start angepasst wurde
            if (newStart !== current.start) {
                yearStart.value = newStart;
            }
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

    updateAccordionState(typeId) {
        const selectedUnis = state.get('selectedUniversities');
        const unis = UNIVERSITIES_BY_TYPE[typeId] || [];
        const selectedCount = unis.filter(u => selectedUnis.includes(u.code)).length;
        const allSelected = selectedCount === unis.length;
        const someSelected = selectedCount > 0 && selectedCount < unis.length;

        const item = this.container.querySelector(`.accordion-item[data-type="${typeId}"]`);
        if (!item) return;

        const typeCheckbox = item.querySelector(`[data-uni-type="${typeId}"]`);
        const countSpan = item.querySelector('.accordion-count');

        if (typeCheckbox) {
            typeCheckbox.checked = allSelected;
            typeCheckbox.indeterminate = someSelected;
        }

        if (countSpan) {
            countSpan.textContent = `${selectedCount}/${unis.length}`;
        }
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
