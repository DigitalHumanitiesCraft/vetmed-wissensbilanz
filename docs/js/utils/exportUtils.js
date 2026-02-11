/**
 * exportUtils.js
 * Zentrale Export-Funktionalität für alle Visualisierungstypen
 *
 * Unterstützte Formate:
 * - PNG (über Chart.js oder HTML2Canvas)
 * - SVG (für Chart.js-basierte Charts)
 * - CSV (Tabellendaten)
 * - Excel (.xlsx über ExcelJS)
 * - JSON (Rohdaten)
 */

import { state } from '../core/State.js';
import { KENNZAHL_BY_CODE } from '../data/Metadata.js';
import { UNI_BY_CODE } from '../data/Metadata.js';

/**
 * Generiert konsistente Dateinamen für Exports
 * Format: wissensbilanz_[kennzahl]_[visualisierungstyp]_[datum].ext
 */
export function generateFilename(extension, vizType = 'chart') {
    const kennzahl = state.get('selectedKennzahl') || 'export';
    const timestamp = new Date().toISOString().split('T')[0];
    return `wissensbilanz_${kennzahl}_${vizType}_${timestamp}.${extension}`;
}

/**
 * Erstellt Download-Link und triggert Download
 */
function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * PNG-Export über Chart.js (für LineChart, DualAxis, Scatter)
 */
export function exportChartAsPng(chart, vizType = 'chart', resolution = 'standard') {
    if (!chart) {
        console.error('Kein Chart-Objekt vorhanden');
        return;
    }

    const filename = generateFilename('png', vizType);

    // Standard-Auflösung
    const link = document.createElement('a');
    link.download = filename;
    link.href = chart.toBase64Image('image/png', 1);
    link.click();
}

/**
 * PNG-Export über HTML2Canvas (für Heatmap, Ranking, SmallMultiples)
 * Benötigt: <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
 */
export async function exportElementAsPng(element, vizType = 'chart', options = {}) {
    if (!element) {
        console.error('Kein DOM-Element vorhanden');
        return;
    }

    // Prüfe ob html2canvas verfügbar ist
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas ist nicht geladen. Bitte füge <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script> in index.html ein.');
        return;
    }

    const defaultOptions = {
        backgroundColor: '#ffffff',
        scale: 2, // Höhere Auflösung
        logging: false,
        ...options
    };

    try {
        const canvas = await html2canvas(element, defaultOptions);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const filename = generateFilename('png', vizType);
        triggerDownload(blob, filename);
    } catch (error) {
        console.error('Fehler beim PNG-Export:', error);
    }
}

/**
 * SVG-Export (experimentell - nur für Chart.js)
 * Chart.js unterstützt nativ kein SVG, daher konvertieren wir Canvas → SVG
 */
export async function exportChartAsSvg(chart, vizType = 'chart') {
    console.warn('SVG-Export ist experimentell und nicht für alle Charts verfügbar');

    // Für echten SVG-Export bräuchten wir eine Library wie canvg
    // Alternativer Ansatz: Chart.js mit svg-Plugin ersetzen oder D3.js nutzen
    alert('SVG-Export ist aktuell nicht verfügbar. Nutzen Sie PNG-Export.');
}

/**
 * CSV-Export (für Tabellendaten)
 */
export function exportDataAsCsv(data, vizType = 'data') {
    if (!data || data.length === 0) {
        console.error('Keine Daten zum Exportieren');
        return;
    }

    const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];

    // CSV-Header
    const headers = ['Universität', 'Code', 'Jahr', 'Wert', 'Einheit'];

    // Datenzeilen
    const rows = data.map(row => [
        UNI_BY_CODE[row.uniCode]?.name || row.uniCode,
        row.uniCode,
        row.year || '',
        row.value ?? '',
        kennzahl?.unit || ''
    ]);

    // CSV-String erstellen (BOM für UTF-8 Excel-Kompatibilität)
    const csvContent = [
        headers.join(';'),
        ...rows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = generateFilename('csv', vizType);
    triggerDownload(blob, filename);
}

/**
 * JSON-Export (Rohdaten)
 */
export function exportDataAsJson(data, vizType = 'data') {
    if (!data) {
        console.error('Keine Daten zum Exportieren');
        return;
    }

    const exportData = {
        metadata: {
            kennzahl: state.get('selectedKennzahl'),
            kennzahlName: KENNZAHL_BY_CODE[state.get('selectedKennzahl')]?.name,
            exportDatum: new Date().toISOString(),
            filter: {
                universitaeten: state.get('selectedUniversities'),
                zeitraum: {
                    von: state.get('yearFrom'),
                    bis: state.get('yearTo')
                }
            }
        },
        daten: data
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const filename = generateFilename('json', vizType);
    triggerDownload(blob, filename);
}

/**
 * Excel-Export (.xlsx) über ExcelJS
 * Benötigt: <script src="https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js"></script>
 */
export async function exportDataAsExcel(data, vizType = 'data') {
    if (!data || data.length === 0) {
        console.error('Keine Daten zum Exportieren');
        return;
    }

    // Prüfe ob ExcelJS verfügbar ist
    if (typeof ExcelJS === 'undefined') {
        console.error('ExcelJS ist nicht geladen. Bitte füge <script src="https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js"></script> in index.html ein.');
        return;
    }

    const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
    const workbook = new ExcelJS.Workbook();

    // Metadaten
    workbook.creator = 'Wissensbilanz Dashboard';
    workbook.created = new Date();

    // Sheet 1: Daten
    const worksheet = workbook.addWorksheet('Daten');

    // Header-Zeile
    worksheet.columns = [
        { header: 'Universität', key: 'uni', width: 40 },
        { header: 'Code', key: 'code', width: 10 },
        { header: 'Jahr', key: 'year', width: 10 },
        { header: 'Wert', key: 'value', width: 15 },
        { header: 'Einheit', key: 'unit', width: 15 }
    ];

    // Header formatieren
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    // Datenzeilen
    data.forEach(row => {
        worksheet.addRow({
            uni: UNI_BY_CODE[row.uniCode]?.name || row.uniCode,
            code: row.uniCode,
            year: row.year || '',
            value: row.value ?? '',
            unit: kennzahl?.unit || ''
        });
    });

    // Sheet 2: Metadaten
    const metaSheet = workbook.addWorksheet('Metadaten');
    metaSheet.columns = [
        { header: 'Parameter', key: 'param', width: 25 },
        { header: 'Wert', key: 'value', width: 40 }
    ];

    metaSheet.getRow(1).font = { bold: true };
    metaSheet.addRow({ param: 'Kennzahl', value: kennzahl?.name || '' });
    metaSheet.addRow({ param: 'Kennzahl-Code', value: state.get('selectedKennzahl') || '' });
    metaSheet.addRow({ param: 'Einheit', value: kennzahl?.unit || '' });
    metaSheet.addRow({ param: 'Export-Datum', value: new Date().toLocaleString('de-AT') });
    metaSheet.addRow({ param: 'Zeitraum Von', value: state.get('yearFrom') || '' });
    metaSheet.addRow({ param: 'Zeitraum Bis', value: state.get('yearTo') || '' });
    metaSheet.addRow({ param: 'Anzahl Universitäten', value: state.get('selectedUniversities')?.length || 0 });

    // Excel-Datei generieren und downloaden
    try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const filename = generateFilename('xlsx', vizType);
        triggerDownload(blob, filename);
    } catch (error) {
        console.error('Fehler beim Excel-Export:', error);
    }
}

/**
 * Export-Format-Detektion basierend auf Chart-Typ
 */
export function getAvailableFormats(vizType) {
    const baseFormats = ['png', 'csv', 'json'];

    // Excel wenn ExcelJS verfügbar
    if (typeof ExcelJS !== 'undefined') {
        baseFormats.push('excel');
    }

    // Für Chart.js-basierte Charts
    if (['line', 'dualaxis', 'scatter'].includes(vizType)) {
        // Chart.js unterstützt direkten PNG-Export
        return baseFormats;
    }

    // Für Custom-Charts (Heatmap, Ranking, SmallMultiples)
    if (['heatmap', 'ranking', 'smallmultiples'].includes(vizType)) {
        // Benötigt HTML2Canvas
        if (typeof html2canvas !== 'undefined') {
            return baseFormats;
        } else {
            return baseFormats.filter(f => f !== 'png');
        }
    }

    return baseFormats;
}
