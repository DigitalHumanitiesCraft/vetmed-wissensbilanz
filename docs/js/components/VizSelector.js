/**
 * VizSelector - Sub-Navigation für Visualisierungstypen
 *
 * Ermöglicht das Wechseln zwischen verschiedenen Chart-Typen:
 * - Zeitreihe (Line Chart)
 * - Small Multiples (5 Charts nach Uni-Typ)
 * - Heatmap (Unis × Jahre Matrix)
 * - Ranking (Horizontales Balkendiagramm)
 */

import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { VizFactory } from '../visualizations/VizFactory.js';

class VizSelector {
    constructor(container) {
        this.container = container;
        this.selectorEl = null;
        this.render();
        this.subscribeToState();
    }

    render() {
        // Selector-Container erstellen und am Anfang des chartPanel einfügen
        this.selectorEl = document.createElement('div');
        this.selectorEl.className = 'viz-selector';
        this.selectorEl.innerHTML = this.getButtonsHTML();

        // Vor dem chart-wrapper einfügen
        const chartWrapper = this.container.querySelector('.chart-wrapper');
        if (chartWrapper) {
            this.container.insertBefore(this.selectorEl, chartWrapper);
        } else {
            this.container.prepend(this.selectorEl);
        }

        this.attachEventListeners();
        this.updateActiveButton();
    }

    getButtonsHTML() {
        const types = VizFactory.getAvailableTypes();
        const currentType = state.get('vizType') || 'line';

        return `
            <div class="viz-selector__group">
                ${types.map(type => `
                    <button class="viz-selector__btn ${type.id === currentType ? 'viz-selector__btn--active' : ''}"
                            data-viz="${type.id}"
                            title="${type.description}">
                        ${this.getIcon(type.icon)}
                        <span class="viz-selector__label">${type.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    getIcon(iconName) {
        const icons = {
            'chart-line': `
                <svg class="viz-selector__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
            `,
            'grid': `
                <svg class="viz-selector__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
            `,
            'grid-heat': `
                <svg class="viz-selector__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="3" y1="15" x2="21" y2="15"></line>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
            `,
            'bar-chart': `
                <svg class="viz-selector__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            `
        };
        return icons[iconName] || '';
    }

    attachEventListeners() {
        this.selectorEl.querySelectorAll('.viz-selector__btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const vizType = btn.dataset.viz;
                if (vizType !== state.get('vizType')) {
                    state.set('vizType', vizType);
                    eventBus.emit(EVENTS.VIZ_CHANGE, vizType);
                }
            });
        });
    }

    subscribeToState() {
        // Auf vizType-Änderungen reagieren (z.B. von URL-Router)
        state.subscribe('vizType', () => {
            this.updateActiveButton();
        });
    }

    updateActiveButton() {
        const currentType = state.get('vizType') || 'line';

        this.selectorEl.querySelectorAll('.viz-selector__btn').forEach(btn => {
            btn.classList.toggle(
                'viz-selector__btn--active',
                btn.dataset.viz === currentType
            );
        });
    }

    destroy() {
        if (this.selectorEl) {
            this.selectorEl.remove();
            this.selectorEl = null;
        }
    }
}

export function initVizSelector(container) {
    return new VizSelector(container);
}
