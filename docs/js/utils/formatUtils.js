/**
 * Format Utilities - Zentrale Formatierungsfunktionen
 *
 * Stellt konsistente Formatierung fuer Werte, Trends und Zahlen bereit.
 */

/**
 * Formatiert einen numerischen Wert mit passender Einheit
 * @param {number} value - Der zu formatierende Wert
 * @param {string} unit - Die Einheit (z.B. 'Koepfe', '%', 'VZAe')
 * @param {Object} options - Optionen { decimals, locale }
 * @returns {string} Formatierter Wert mit Einheit
 */
export function formatValue(value, unit = '', options = {}) {
    const { decimals = 1, locale = 'de-AT' } = options;

    if (value == null || isNaN(value)) {
        return '–';
    }

    // Prozent-Werte
    if (unit === '%') {
        return `${value.toFixed(decimals)} %`;
    }

    // Grosse Zahlen (Tausender)
    if (Math.abs(value) >= 1000) {
        return value.toLocaleString(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals
        });
    }

    // Kleine Zahlen
    if (Math.abs(value) < 1 && value !== 0) {
        return value.toFixed(3);
    }

    return value.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    });
}

/**
 * Formatiert einen Trend-Prozentsatz mit Vorzeichen
 * @param {number} percent - Trend in Prozent
 * @param {Object} options - Optionen { decimals, showArrow }
 * @returns {string} Formatierter Trend (z.B. '+5.2%' oder '▲ +5.2%')
 */
export function formatTrend(percent, options = {}) {
    const { decimals = 1, showArrow = false } = options;

    if (percent == null || isNaN(percent)) {
        return '–';
    }

    const sign = percent >= 0 ? '+' : '';
    const arrow = showArrow ? (percent >= 0 ? '▲ ' : '▼ ') : '';

    return `${arrow}${sign}${percent.toFixed(decimals)}%`;
}

/**
 * Formatiert eine Zahl als kompakte Darstellung (K, M, etc.)
 * @param {number} value - Die zu formatierende Zahl
 * @param {Object} options - Optionen { decimals }
 * @returns {string} Kompakte Zahl (z.B. '1.2K', '3.5M')
 */
export function formatCompact(value, options = {}) {
    const { decimals = 1 } = options;

    if (value == null || isNaN(value)) {
        return '–';
    }

    if (Math.abs(value) >= 1000000) {
        return (value / 1000000).toFixed(decimals) + 'M';
    }

    if (Math.abs(value) >= 1000) {
        return (value / 1000).toFixed(decimals) + 'K';
    }

    return value.toString();
}

/**
 * Formatiert ein Datum als deutsches Datumsformat
 * @param {Date|string|number} date - Das Datum
 * @param {Object} options - Optionen { format: 'short' | 'long' }
 * @returns {string} Formatiertes Datum
 */
export function formatDate(date, options = {}) {
    const { format = 'short' } = options;

    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return '–';
    }

    if (format === 'long') {
        return d.toLocaleDateString('de-AT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    return d.toLocaleDateString('de-AT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Formatiert einen Jahresbereich
 * @param {number} start - Startjahr
 * @param {number} end - Endjahr
 * @returns {string} Formatierter Bereich (z.B. '2021 – 2024')
 */
export function formatYearRange(start, end) {
    if (start === end) {
        return start.toString();
    }
    return `${start} – ${end}`;
}

/**
 * Formatiert ein Verhaeltnis als Dezimalzahl
 * @param {number} value - Verhaeltniswert
 * @param {Object} options - Optionen { decimals }
 * @returns {string} Formatiertes Verhaeltnis
 */
export function formatRatio(value, options = {}) {
    const { decimals = 3 } = options;

    if (value == null || isNaN(value)) {
        return '–';
    }

    return value.toFixed(decimals);
}
