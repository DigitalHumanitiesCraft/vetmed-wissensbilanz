/**
 * SparklineRenderer - Mini-Charts für Tabellenzellen
 *
 * Rendert kompakte Trend-Visualisierungen (100×30px Canvas).
 * Verwendet für die DataTable "Trend"-Spalte.
 */

import { UNI_BY_CODE, UNI_TYPES } from '../data/metadata.js';

/**
 * Erstellt ein Sparkline-Canvas
 * @param {HTMLElement} cell - Tabellenzelle
 * @param {Array<{year: number, value: number}>} data - Zeitreihendaten
 * @param {string} uniCode - Uni-Code für Farbgebung
 * @returns {HTMLCanvasElement}
 */
export function createSparkline(cell, data, uniCode) {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 30;
    canvas.className = 'sparkline';
    canvas.style.cssText = 'display: block;';

    const ctx = canvas.getContext('2d');
    if (!ctx || !data || data.length < 2) {
        cell.appendChild(canvas);
        return canvas;
    }

    // Sortiere nach Jahr
    const sorted = [...data].sort((a, b) => a.year - b.year);
    const values = sorted.map(d => d.value).filter(v => v !== null && v !== undefined);

    if (values.length < 2) {
        cell.appendChild(canvas);
        return canvas;
    }

    // Berechne Min/Max für Skalierung
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    // Farbe basierend auf Uni-Typ
    const uni = UNI_BY_CODE[uniCode];
    const uniType = uni ? UNI_TYPES[uni.type] : null;
    const color = uniType?.color || '#6c757d';

    // Padding
    const padding = { top: 3, bottom: 3, left: 2, right: 2 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;

    // Punkte berechnen
    const points = values.map((v, i) => ({
        x: padding.left + (i / (values.length - 1)) * chartWidth,
        y: padding.top + chartHeight - ((v - min) / range) * chartHeight
    }));

    // Linie zeichnen
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    points.forEach((p, i) => {
        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    ctx.stroke();

    // Endpunkt hervorheben
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Trend-Indikator (Pfeil)
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const trend = lastValue > firstValue ? '↑' : lastValue < firstValue ? '↓' : '→';
    const trendColor = lastValue > firstValue ? '#28a745' : lastValue < firstValue ? '#dc3545' : '#6c757d';

    // Trend als Text neben Canvas
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; align-items: center; gap: 4px;';
    wrapper.appendChild(canvas);

    const trendSpan = document.createElement('span');
    trendSpan.textContent = trend;
    trendSpan.style.cssText = `color: ${trendColor}; font-size: 14px; font-weight: bold;`;
    wrapper.appendChild(trendSpan);

    cell.appendChild(wrapper);
    return canvas;
}

/**
 * Gruppiert Daten nach Universität für Sparkline-Rendering
 * @param {Array} data - Alle Datenpunkte
 * @returns {Map<string, Array>} - Map von uniCode zu Zeitreihe
 */
export function groupDataByUni(data) {
    const grouped = new Map();

    data.forEach(d => {
        if (!grouped.has(d.uniCode)) {
            grouped.set(d.uniCode, []);
        }
        grouped.get(d.uniCode).push({
            year: d.year,
            value: d.value
        });
    });

    return grouped;
}
