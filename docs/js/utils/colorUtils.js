/**
 * Color Utilities - Zentrale Farbverwaltung
 *
 * Stellt konsistente Farben fuer Universitaets-Typen bereit.
 * Ersetzt duplizierte getColorForUni() Funktionen in den Visualisierungen.
 */

import { UNI_TYPES } from '../data/metadata.js';

/**
 * Standard-Farben fuer Universitaets-Typen
 * Entspricht den CSS Custom Properties in tokens.css
 */
const UNI_TYPE_COLORS = {
    'voll': '#1a5490',      // Volluniversitaeten - Blau
    'tech': '#28a745',      // Technische Unis - Gruen
    'med': '#dc3545',       // Medizinische Unis - Rot
    'kunst': '#6f42c1',     // Kunst-Unis - Violett
    'weiterb': '#fd7e14'    // Weiterbildung - Orange
};

const DEFAULT_COLOR = '#6c757d';  // Grau fuer unbekannte Typen

/**
 * Gibt die Hex-Farbe fuer einen Universitaets-Typ zurueck
 * @param {Object|string} uni - Universitaets-Objekt mit type Property oder Typ-String
 * @returns {string} Hex-Farbcode (z.B. '#1a5490')
 */
export function getUniColor(uni) {
    // Wenn uni ein String ist (direkt der Typ)
    if (typeof uni === 'string') {
        return UNI_TYPE_COLORS[uni] || DEFAULT_COLOR;
    }

    // Wenn uni ein Objekt ist
    const type = uni?.type;
    return UNI_TYPE_COLORS[type] || UNI_TYPES[type]?.color || DEFAULT_COLOR;
}

/**
 * Gibt die Farbe mit Alpha-Transparenz als RGBA-String zurueck
 * @param {Object|string} uni - Universitaets-Objekt oder Typ-String
 * @param {number} alpha - Transparenz (0-1), Standard: 1
 * @returns {string} RGBA-Farbwert (z.B. 'rgba(26, 84, 144, 0.5)')
 */
export function getUniColorWithAlpha(uni, alpha = 1) {
    const hex = getUniColor(uni);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Konvertiert Hex-Farbe zu RGB-Objekt
 * @param {string} hex - Hex-Farbcode (z.B. '#1a5490')
 * @returns {Object} RGB-Objekt { r, g, b }
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

/**
 * Gibt alle verfuegbaren Uni-Typ-Farben zurueck
 * @returns {Object} Map von Typ-ID zu Hex-Farbe
 */
export function getAllUniTypeColors() {
    return { ...UNI_TYPE_COLORS };
}

/**
 * Berechnet eine kontrastierende Textfarbe (schwarz oder weiss)
 * basierend auf der Hintergrundfarbe
 * @param {string} hexColor - Hex-Hintergrundfarbe
 * @returns {string} '#000000' oder '#ffffff'
 */
export function getContrastColor(hexColor) {
    const { r, g, b } = hexToRgb(hexColor);
    // YIQ-Formel fuer Helligkeit
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
}
