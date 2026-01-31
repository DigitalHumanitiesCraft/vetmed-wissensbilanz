/**
 * Toolbar - Unified Toolbar Component
 *
 * Verwaltet:
 * - Kennzahl-Selektor (Primary + Secondary)
 * - Dual-Mode Controls (Kombinations-Typen)
 * - Output-Tabs (Chart/Tabelle/Bericht)
 * - Viz-Type Buttons (Zeitreihe/Heatmap/etc.)
 * - Stats-Display
 */

import { state } from '../core/state.js';
import { router } from '../core/router.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { log } from '../core/logger.js';
import { KENNZAHL_BY_CODE, KENNZAHLEN_BY_CATEGORY, KENNZAHL_CATEGORIES, formatValue } from '../data/metadata.js';

class Toolbar {
    constructor() {
        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.initKennzahlSelectors();
        this.initDualModeControls();
        this.initOutputTabs();
        this.initVizTypeButtons();
        this.initShareButton();
        this.initStatsDisplay();
        this.restoreFromState();

        log.info('Toolbar', 'initialized');
    }

    cacheElements() {
        this.elements = {
            // Primary Kennzahl
            primarySelect: document.getElementById('toolbarKennzahl'),
            primaryUnit: document.getElementById('kennzahlUnit'),

            // Secondary Kennzahl
            secondarySelect: document.getElementById('secondaryKennzahl'),
            secondaryUnit: document.getElementById('secondaryUnit'),
            secondaryGroup: document.getElementById('secondaryGroup'),
            combinationGroup: document.getElementById('combinationGroup'),
            addSecondBtn: document.getElementById('addSecondKennzahl'),
            removeSecondBtn: document.getElementById('removeSecondKennzahl'),

            // Viz Type
            vizTypeGroup: document.getElementById('vizTypeGroup'),
            vizTypeDivider: document.getElementById('vizTypeDivider'),

            // Stats
            statsPoints: document.getElementById('statsPoints'),
            statsAverage: document.getElementById('statsAverage'),
            statsTrend: document.getElementById('statsTrend'),

            // Share
            shareBtn: document.getElementById('shareBtn')
        };
    }

    // ========================================
    // KENNZAHL SELECTOR
    // ========================================

    initKennzahlSelectors() {
        const { primarySelect, primaryUnit } = this.elements;

        if (!primarySelect) return;

        // Primary Kennzahl initialisieren
        this.populateKennzahlSelect(primarySelect, state.get('selectedKennzahl'));
        this.updateUnitDisplay(primaryUnit, state.get('selectedKennzahl'));

        primarySelect.addEventListener('change', (e) => {
            state.set('selectedKennzahl', e.target.value);
            this.updateUnitDisplay(primaryUnit, e.target.value);
        });

        // Sync from state (URL restore)
        state.subscribe('selectedKennzahl', (code) => {
            primarySelect.value = code;
            this.updateUnitDisplay(primaryUnit, code);
        });

        // Secondary Kennzahl initialisieren
        this.initSecondaryKennzahl();
    }

    initSecondaryKennzahl() {
        const { secondarySelect, secondaryUnit, secondaryGroup, combinationGroup, addSecondBtn, removeSecondBtn } = this.elements;

        if (!secondarySelect || !addSecondBtn) return;

        // Default-Werte befuellen
        this.populateKennzahlSelect(secondarySelect, '1-A-1-VZA');

        // Add Second Kennzahl
        addSecondBtn.addEventListener('click', () => {
            const primaryCode = state.get('selectedKennzahl');
            let secondaryCode = '1-A-1-VZA';
            if (primaryCode === secondaryCode) {
                secondaryCode = '1-A-1';
            }

            state.set('secondaryKennzahl', secondaryCode);
            state.set('dualMode', true);
            state.set('combinationType', 'dualAxis');

            secondarySelect.value = secondaryCode;
            this.updateUnitDisplay(secondaryUnit, secondaryCode);
            this.showDualMode(true);

            eventBus.emit(EVENTS.FILTER_CHANGE, state.getFilterState());
        });

        // Remove Second Kennzahl
        removeSecondBtn?.addEventListener('click', () => {
            state.set('secondaryKennzahl', null);
            state.set('dualMode', false);
            state.set('combinationType', null);

            this.showDualMode(false);

            eventBus.emit(EVENTS.FILTER_CHANGE, state.getFilterState());
        });

        // Secondary Kennzahl change
        secondarySelect.addEventListener('change', (e) => {
            state.set('secondaryKennzahl', e.target.value);
            this.updateUnitDisplay(secondaryUnit, e.target.value);
            eventBus.emit(EVENTS.FILTER_CHANGE, state.getFilterState());
        });

        // Sync Dual-Mode from state
        state.subscribe('secondaryKennzahl', (code) => {
            if (code) {
                secondarySelect.value = code;
                this.updateUnitDisplay(secondaryUnit, code);
                this.showDualMode(true);
            } else {
                this.showDualMode(false);
            }
        });
    }

    populateKennzahlSelect(selectEl, selectedCode) {
        if (!selectEl) return;

        selectEl.innerHTML = Object.values(KENNZAHL_CATEGORIES).map(cat => {
            const kennzahlen = KENNZAHLEN_BY_CATEGORY[cat.id] || [];
            return `
                <optgroup label="${cat.name}">
                    ${kennzahlen.map(k => `
                        <option value="${k.code}" ${k.code === selectedCode ? 'selected' : ''}>
                            ${k.code}: ${k.name}
                        </option>
                    `).join('')}
                </optgroup>
            `;
        }).join('');
    }

    updateUnitDisplay(unitEl, kennzahlCode) {
        if (!unitEl) return;
        const kennzahl = KENNZAHL_BY_CODE[kennzahlCode];
        unitEl.textContent = kennzahl?.unit || '';
    }

    showDualMode(show) {
        const { secondaryGroup, combinationGroup, addSecondBtn, vizTypeGroup, vizTypeDivider } = this.elements;

        if (show) {
            secondaryGroup?.classList.remove('toolbar__group--hidden');
            combinationGroup?.classList.remove('toolbar__group--hidden');
            addSecondBtn?.classList.add('toolbar__group--hidden');
            vizTypeGroup?.classList.add('toolbar__group--hidden');
            vizTypeDivider?.classList.add('toolbar__group--hidden');
        } else {
            secondaryGroup?.classList.add('toolbar__group--hidden');
            combinationGroup?.classList.add('toolbar__group--hidden');
            addSecondBtn?.classList.remove('toolbar__group--hidden');

            // Viz-Type nur zeigen wenn Chart-Tab aktiv
            if (state.get('activeTab') === 'chart') {
                vizTypeGroup?.classList.remove('toolbar__group--hidden');
                vizTypeDivider?.classList.remove('toolbar__group--hidden');
            }
        }
    }

    // ========================================
    // DUAL MODE CONTROLS
    // ========================================

    initDualModeControls() {
        document.querySelectorAll('.toolbar__btn[data-combination]').forEach(btn => {
            btn.addEventListener('click', () => {
                const combType = btn.dataset.combination;
                if (combType === state.get('combinationType')) return;

                // Update buttons
                document.querySelectorAll('.toolbar__btn[data-combination]').forEach(b =>
                    b.classList.remove('toolbar__btn--active'));
                btn.classList.add('toolbar__btn--active');

                state.set('combinationType', combType);
                eventBus.emit(EVENTS.VIZ_CHANGE, combType);
            });
        });

        // Sync from state
        state.subscribe('combinationType', (type) => {
            document.querySelectorAll('.toolbar__btn[data-combination]').forEach(b => {
                b.classList.toggle('toolbar__btn--active', b.dataset.combination === type);
            });
        });
    }

    // ========================================
    // OUTPUT TABS
    // ========================================

    initOutputTabs() {
        document.querySelectorAll('.toolbar__btn[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;

                // Update buttons
                document.querySelectorAll('.toolbar__btn[data-tab]').forEach(b =>
                    b.classList.remove('toolbar__btn--active'));
                btn.classList.add('toolbar__btn--active');

                // Update panels
                document.querySelectorAll('.tabs__panel').forEach(p =>
                    p.classList.remove('tabs__panel--active'));
                document.getElementById(tab + 'Panel')?.classList.add('tabs__panel--active');

                // Viz-Type Buttons ein/ausblenden
                this.updateVizTypeVisibility(tab);

                state.set('activeTab', tab);
                eventBus.emit(EVENTS.TAB_CHANGE, tab);
            });
        });

        // Sync from state
        state.subscribe('activeTab', (tab) => {
            document.querySelectorAll('.toolbar__btn[data-tab]').forEach(b => {
                b.classList.toggle('toolbar__btn--active', b.dataset.tab === tab);
            });
        });

        // Dual-Mode-Wechsel: Viz-Typ-Buttons ein/ausblenden
        state.subscribe('dualMode', (isDual) => {
            this.updateVizTypeVisibility(state.get('activeTab'), isDual);
        });
    }

    updateVizTypeVisibility(tab, isDualMode = state.get('dualMode')) {
        const { vizTypeGroup, vizTypeDivider } = this.elements;

        if (tab === 'chart' && !isDualMode) {
            vizTypeGroup?.classList.remove('toolbar__group--hidden');
            vizTypeDivider?.classList.remove('toolbar__group--hidden');
        } else {
            vizTypeGroup?.classList.add('toolbar__group--hidden');
            vizTypeDivider?.classList.add('toolbar__group--hidden');
        }
    }

    // ========================================
    // VIZ TYPE BUTTONS
    // ========================================

    initVizTypeButtons() {
        document.querySelectorAll('.toolbar__btn[data-viz]').forEach(btn => {
            btn.addEventListener('click', () => {
                const vizType = btn.dataset.viz;
                if (vizType === state.get('vizType')) return;

                // Update buttons
                document.querySelectorAll('.toolbar__btn[data-viz]').forEach(b =>
                    b.classList.remove('toolbar__btn--active'));
                btn.classList.add('toolbar__btn--active');

                state.set('vizType', vizType);
                eventBus.emit(EVENTS.VIZ_CHANGE, vizType);
            });
        });

        // Sync from state
        state.subscribe('vizType', (type) => {
            document.querySelectorAll('.toolbar__btn[data-viz]').forEach(b => {
                b.classList.toggle('toolbar__btn--active', b.dataset.viz === type);
            });
        });
    }

    // ========================================
    // SHARE BUTTON
    // ========================================

    initShareButton() {
        const { shareBtn } = this.elements;
        if (!shareBtn) return;

        shareBtn.addEventListener('click', async () => {
            const success = await router.copyUrlToClipboard();
            if (success) {
                shareBtn.title = 'Kopiert!';
                shareBtn.classList.add('btn--success');
                setTimeout(() => {
                    shareBtn.title = 'Link kopieren';
                    shareBtn.classList.remove('btn--success');
                }, 2000);
            }
        });
    }

    // ========================================
    // STATS DISPLAY
    // ========================================

    initStatsDisplay() {
        state.subscribe('dataStats', (stats) => {
            this.updateStats(stats);
        });
    }

    updateStats(stats) {
        const { statsPoints, statsAverage, statsTrend } = this.elements;
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];

        if (statsPoints) {
            statsPoints.textContent = stats.totalPoints.toLocaleString('de-AT');
        }

        if (statsAverage) {
            statsAverage.textContent = formatValue(stats.average, kennzahl?.unit || '');
        }

        if (statsTrend) {
            if (stats.trend > 0) {
                statsTrend.textContent = `+${stats.trend.toFixed(1)}%`;
                statsTrend.className = 'toolbar__stat-value toolbar__stat-value--positive';
            } else if (stats.trend < 0) {
                statsTrend.textContent = `${stats.trend.toFixed(1)}%`;
                statsTrend.className = 'toolbar__stat-value toolbar__stat-value--negative';
            } else {
                statsTrend.textContent = '0%';
                statsTrend.className = 'toolbar__stat-value';
            }
        }
    }

    // ========================================
    // STATE RESTORATION
    // ========================================

    restoreFromState() {
        // Dual-Mode wiederherstellen wenn aus URL geladen
        const secondaryKennzahl = state.get('secondaryKennzahl');
        if (secondaryKennzahl) {
            const { secondarySelect, secondaryUnit } = this.elements;
            if (secondarySelect) {
                secondarySelect.value = secondaryKennzahl;
                this.updateUnitDisplay(secondaryUnit, secondaryKennzahl);
            }
            this.showDualMode(true);

            // Combination Type setzen
            const combType = state.get('combinationType') || 'dualAxis';
            document.querySelectorAll('.toolbar__btn[data-combination]').forEach(b => {
                b.classList.toggle('toolbar__btn--active', b.dataset.combination === combType);
            });
        }

        // Viz-Type wiederherstellen
        const vizType = state.get('vizType');
        if (vizType) {
            document.querySelectorAll('.toolbar__btn[data-viz]').forEach(b => {
                b.classList.toggle('toolbar__btn--active', b.dataset.viz === vizType);
            });
        }

        // Tab wiederherstellen
        const activeTab = state.get('activeTab');
        if (activeTab) {
            document.querySelectorAll('.toolbar__btn[data-tab]').forEach(b => {
                b.classList.toggle('toolbar__btn--active', b.dataset.tab === activeTab);
            });
        }
    }
}

// Singleton exportieren
let toolbarInstance = null;

export function initToolbar() {
    if (!toolbarInstance) {
        toolbarInstance = new Toolbar();
    }
    return toolbarInstance;
}

export { Toolbar };
