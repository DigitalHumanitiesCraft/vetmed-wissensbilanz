/**
 * DataTable - Tabelle mit Pagination
 *
 * Implementiert:
 * - Sortierbare Spalten
 * - Pagination (25/50/100 Zeilen)
 * - D4: Null-Value Handling (drei Zustände)
 * - Export als CSV
 */

import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { dataLoader } from '../data/dataLoader.js';
import { UNI_BY_CODE, KENNZAHL_BY_CODE, formatValue } from '../data/metadata.js';

class DataTable {
    constructor(container) {
        this.container = container;
        this.data = [];
        this.sortColumn = 'year';
        this.sortDirection = 'desc';
        this.currentPage = 1;
        this.pageSize = 25;

        this.render();
        this.subscribeToState();
    }

    render() {
        this.container.innerHTML = `
            <div class="table-container">
                <div class="table-header">
                    <div class="table-info" id="tableInfo">
                        Lade Daten...
                    </div>
                    <div class="table-actions">
                        <select class="form-select" id="pageSizeSelect" style="width: auto;">
                            <option value="25" ${this.pageSize === 25 ? 'selected' : ''}>25 Zeilen</option>
                            <option value="50" ${this.pageSize === 50 ? 'selected' : ''}>50 Zeilen</option>
                            <option value="100" ${this.pageSize === 100 ? 'selected' : ''}>100 Zeilen</option>
                        </select>
                        <button class="btn btn--secondary btn--sm" id="exportCsvBtn">
                            CSV Export
                        </button>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="data-table" id="dataTable">
                        <thead>
                            <tr>
                                <th class="sortable" data-column="uniCode">
                                    Universität
                                    <span class="sort-icon"></span>
                                </th>
                                <th class="sortable" data-column="year">
                                    Jahr
                                    <span class="sort-icon"></span>
                                </th>
                                <th class="sortable" data-column="value">
                                    Wert
                                    <span class="sort-icon"></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                        </tbody>
                    </table>
                </div>

                <div class="table-pagination" id="tablePagination">
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.loadData();
    }

    attachEventListeners() {
        // Sortierung
        this.container.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.column;
                if (this.sortColumn === column) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = column;
                    this.sortDirection = 'asc';
                }
                this.updateSortIndicators();
                this.renderTable();
            });
        });

        // Page Size
        this.container.querySelector('#pageSizeSelect')?.addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
        });

        // CSV Export
        this.container.querySelector('#exportCsvBtn')?.addEventListener('click', () => {
            this.exportToCsv();
        });
    }

    subscribeToState() {
        eventBus.on(EVENTS.FILTER_CHANGE, () => {
            this.currentPage = 1;
            this.loadData();
        });
    }

    async loadData() {
        try {
            this.data = await dataLoader.loadFiltered();
            this.renderTable();
        } catch (error) {
            console.error('[Table] load error:', error.message);
            this.showError('Daten konnten nicht geladen werden.');
        }
    }

    renderTable() {
        const sorted = this.getSortedData();
        const paginated = this.getPaginatedData(sorted);
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];

        // Table Body
        const tbody = this.container.querySelector('#tableBody');
        if (tbody) {
            tbody.innerHTML = paginated.map(row => {
                const uni = UNI_BY_CODE[row.uniCode];
                const valueDisplay = this.formatCellValue(row.value, kennzahl?.unit);

                return `
                    <tr>
                        <td>
                            <span class="uni-badge" style="--uni-color: ${this.getUniColor(uni)};">
                                ${uni?.shortName || row.uniCode}
                            </span>
                        </td>
                        <td>${row.year}</td>
                        <td class="${valueDisplay.class}">${valueDisplay.text}</td>
                    </tr>
                `;
            }).join('');
        }

        // Info
        this.updateTableInfo(sorted.length);

        // Pagination
        this.renderPagination(sorted.length);
    }

    getSortedData() {
        return [...this.data].sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];

            // Null-Werte ans Ende
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            // String-Vergleich für Uni-Codes
            if (this.sortColumn === 'uniCode') {
                const aUni = UNI_BY_CODE[aVal]?.shortName || aVal;
                const bUni = UNI_BY_CODE[bVal]?.shortName || bVal;
                return this.sortDirection === 'asc'
                    ? aUni.localeCompare(bUni, 'de')
                    : bUni.localeCompare(aUni, 'de');
            }

            // Numerischer Vergleich
            return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        });
    }

    getPaginatedData(data) {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return data.slice(start, end);
    }

    formatCellValue(value, unit) {
        // D4: Drei-Zustand-Darstellung für Null-Values
        if (value === null) {
            return { text: '–', class: 'value-no-data' };
        }
        if (value === undefined) {
            return { text: 'n/a', class: 'value-not-applicable' };
        }
        if (typeof value !== 'number' || isNaN(value)) {
            return { text: '!', class: 'value-invalid' };
        }

        return { text: formatValue(value, unit), class: '' };
    }

    getUniColor(uni) {
        const colorMap = {
            'voll': '#1a5490',
            'tech': '#28a745',
            'med': '#dc3545',
            'kunst': '#6f42c1',
            'weiterb': '#fd7e14'
        };
        return colorMap[uni?.type] || '#6c757d';
    }

    updateSortIndicators() {
        this.container.querySelectorAll('.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.column === this.sortColumn) {
                th.classList.add(`sort-${this.sortDirection}`);
            }
        });
    }

    updateTableInfo(totalRows) {
        const info = this.container.querySelector('#tableInfo');
        if (info) {
            const start = (this.currentPage - 1) * this.pageSize + 1;
            const end = Math.min(this.currentPage * this.pageSize, totalRows);
            info.textContent = `${start}–${end} von ${totalRows} Einträgen`;
        }
    }

    renderPagination(totalRows) {
        const totalPages = Math.ceil(totalRows / this.pageSize);
        const pagination = this.container.querySelector('#tablePagination');

        if (!pagination || totalPages <= 1) {
            if (pagination) pagination.innerHTML = '';
            return;
        }

        let pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            // Erste, letzte und um aktuelle Seite herum
            pages = [1];
            const start = Math.max(2, this.currentPage - 1);
            const end = Math.min(totalPages - 1, this.currentPage + 1);

            if (start > 2) pages.push('...');
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        pagination.innerHTML = `
            <button class="btn btn--ghost btn--sm" ${this.currentPage === 1 ? 'disabled' : ''} data-page="prev">
                ← Zurück
            </button>
            ${pages.map(p =>
                p === '...'
                    ? '<span class="pagination-ellipsis">...</span>'
                    : `<button class="btn ${p === this.currentPage ? 'btn--primary' : 'btn--ghost'} btn--sm" data-page="${p}">${p}</button>`
            ).join('')}
            <button class="btn btn--ghost btn--sm" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="next">
                Weiter →
            </button>
        `;

        // Event Listeners für Pagination
        pagination.querySelectorAll('button[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                if (page === 'prev') {
                    this.currentPage = Math.max(1, this.currentPage - 1);
                } else if (page === 'next') {
                    this.currentPage = Math.min(totalPages, this.currentPage + 1);
                } else {
                    this.currentPage = parseInt(page);
                }
                this.renderTable();
            });
        });
    }

    exportToCsv() {
        const sorted = this.getSortedData();
        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];

        // CSV-Header
        const headers = ['Universität', 'Code', 'Jahr', 'Wert', 'Einheit'];
        const rows = sorted.map(row => {
            const uni = UNI_BY_CODE[row.uniCode];
            return [
                uni?.name || row.uniCode,
                row.uniCode,
                row.year,
                row.value ?? '',
                kennzahl?.unit || ''
            ];
        });

        // CSV erstellen
        const csvContent = [
            headers.join(';'),
            ...rows.map(r => r.join(';'))
        ].join('\n');

        // Download
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wissensbilanz_${kennzahl?.code || 'export'}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="alert alert--danger">
                <div class="alert__content">
                    <div class="alert__title">Fehler beim Laden</div>
                    <p>${message}</p>
                    <button class="btn btn--secondary btn--sm" id="retryTableBtn" style="margin-top: var(--space-3);">
                        Erneut versuchen
                    </button>
                </div>
            </div>
        `;

        this.container.querySelector('#retryTableBtn')?.addEventListener('click', () => {
            this.render();
        });
    }
}

export function initDataTable(container) {
    return new DataTable(container);
}
