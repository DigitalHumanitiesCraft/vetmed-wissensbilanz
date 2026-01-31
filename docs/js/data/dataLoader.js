/**
 * DataLoader - Lazy Loading und Caching für Wissensbilanz-Daten
 *
 * Lädt JSON-Daten bei Bedarf und cached sie im Memory.
 * Unterstützt Filterung und Aggregation.
 */

import { KENNZAHL_BY_CODE, UNI_BY_CODE } from './metadata.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { state } from '../core/state.js';
import { log } from '../core/logger.js';

class DataLoader {
    constructor() {
        this.cache = new Map();
        this.basePath = './data/json/';
    }

    /**
     * Lädt Daten für eine Kennzahl (mit Caching)
     * @param {string} kennzahlCode - Kennzahl-Code (z.B. '1-A-1')
     * @returns {Promise<Array>} Datenpunkte
     */
    async loadKennzahl(kennzahlCode) {
        // Cache prüfen
        if (this.cache.has(kennzahlCode)) {
            return this.cache.get(kennzahlCode);
        }

        const kennzahl = KENNZAHL_BY_CODE[kennzahlCode];
        if (!kennzahl) {
            throw new Error(`Unbekannte Kennzahl: ${kennzahlCode}`);
        }

        eventBus.emit(EVENTS.DATA_LOADING, { kennzahl: kennzahlCode });

        try {
            const response = await fetch(`${this.basePath}${kennzahl.filename}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.cache.set(kennzahlCode, data);

            eventBus.emit(EVENTS.DATA_LOADED, { kennzahl: kennzahlCode, count: data.length });
            return data;

        } catch (error) {
            // Nur einmal loggen, nicht bei jedem Request
            if (!this.cache.has(`_error_${kennzahlCode}`)) {
                log.warn('DataLoader', `${kennzahlCode}: JSON not found, using demo data`);
                this.cache.set(`_error_${kennzahlCode}`, true);
            }

            // Demo-Daten generieren und cachen
            const demoData = this.generateDemoData(kennzahlCode);
            this.cache.set(kennzahlCode, demoData);
            return demoData;
        }
    }

    /**
     * Lädt und filtert Daten basierend auf aktuellem State
     * @returns {Promise<Array>} Gefilterte Datenpunkte
     */
    async loadFiltered() {
        const filterState = state.getFilterState();
        const data = await this.loadKennzahl(filterState.kennzahl);

        const filtered = data.filter(point => {
            // Universitäten filtern
            if (filterState.universities.length > 0) {
                if (!filterState.universities.includes(point.uniCode)) {
                    return false;
                }
            }

            // Uni-Typen filtern (wenn gesetzt)
            if (filterState.uniTypes.length > 0) {
                const uni = UNI_BY_CODE[point.uniCode];
                if (!uni || !filterState.uniTypes.includes(uni.type)) {
                    return false;
                }
            }

            // Jahr filtern
            if (point.year < filterState.yearRange.start ||
                point.year > filterState.yearRange.end) {
                return false;
            }

            return true;
        });

        // Statistiken berechnen
        state.calculateStats(filtered);
        state.set('filteredData', filtered);

        return filtered;
    }

    /**
     * Aggregiert Daten nach Jahr (für Zeitreihen-Charts)
     * @param {Array} data - Datenpunkte
     * @param {string} aggregation - 'sum' | 'average' | 'count'
     * @returns {Array} Aggregierte Daten nach Jahr
     */
    aggregateByYear(data, aggregation = 'sum') {
        const byYear = new Map();

        data.forEach(point => {
            if (!byYear.has(point.year)) {
                byYear.set(point.year, []);
            }
            byYear.get(point.year).push(point.value);
        });

        return Array.from(byYear.entries())
            .map(([year, values]) => {
                let aggregatedValue;
                const validValues = values.filter(v => v !== null && v !== undefined);

                switch (aggregation) {
                    case 'sum':
                        aggregatedValue = validValues.reduce((a, b) => a + b, 0);
                        break;
                    case 'average':
                        aggregatedValue = validValues.length > 0
                            ? validValues.reduce((a, b) => a + b, 0) / validValues.length
                            : null;
                        break;
                    case 'count':
                        aggregatedValue = validValues.length;
                        break;
                    default:
                        aggregatedValue = validValues[0];
                }

                return { year, value: aggregatedValue };
            })
            .sort((a, b) => a.year - b.year);
    }

    /**
     * Gruppiert Daten nach Universität (für Vergleichs-Charts)
     * @param {Array} data - Datenpunkte
     * @returns {Object} Daten gruppiert nach Uni-Code
     */
    groupByUniversity(data) {
        const grouped = {};

        data.forEach(point => {
            if (!grouped[point.uniCode]) {
                grouped[point.uniCode] = {
                    university: UNI_BY_CODE[point.uniCode],
                    data: []
                };
            }
            grouped[point.uniCode].data.push({
                year: point.year,
                value: point.value
            });
        });

        // Daten innerhalb jeder Uni nach Jahr sortieren
        Object.values(grouped).forEach(group => {
            group.data.sort((a, b) => a.year - b.year);
        });

        return grouped;
    }

    /**
     * Generiert Demo-Daten falls echte Daten fehlen
     * @param {string} kennzahlCode - Kennzahl-Code
     * @returns {Array} Demo-Datenpunkte
     */
    generateDemoData(kennzahlCode) {
        // Offizielle Uni-Codes (Subset für Demo)
        const demoUniversities = ['UI', 'UN', 'UO', 'UE', 'UA'];
        const years = [2021, 2022, 2023, 2024];
        const data = [];

        demoUniversities.forEach(uniCode => {
            let baseValue = Math.random() * 1000 + 500;
            years.forEach(year => {
                // Leichte jährliche Variation
                const variation = (Math.random() - 0.5) * 0.1;
                baseValue = baseValue * (1 + variation);

                data.push({
                    uniCode,
                    year,
                    value: Math.round(baseValue),
                    kennzahl: kennzahlCode
                });
            });
        });

        return data;
    }

    // ========================================
    // DUAL-MODE METHODEN
    // ========================================

    /**
     * Lädt Daten für beide Kennzahlen im Dual-Mode
     * @returns {Promise<Object>} { primary, secondary, merged }
     */
    async loadDualFiltered() {
        const filterState = state.getFilterState();
        const primaryCode = filterState.kennzahl;
        const secondaryCode = state.get('secondaryKennzahl');

        if (!secondaryCode) {
            // Fallback auf Single-Mode
            const primary = await this.loadFiltered();
            return { primary, secondary: null, merged: null };
        }

        // Parallel laden
        const [primaryRaw, secondaryRaw] = await Promise.all([
            this.loadKennzahl(primaryCode),
            this.loadKennzahl(secondaryCode)
        ]);

        // Filter anwenden
        const filterFn = (point) => {
            if (filterState.universities.length > 0) {
                if (!filterState.universities.includes(point.uniCode)) {
                    return false;
                }
            }
            if (filterState.uniTypes.length > 0) {
                const uni = UNI_BY_CODE[point.uniCode];
                if (!uni || !filterState.uniTypes.includes(uni.type)) {
                    return false;
                }
            }
            if (point.year < filterState.yearRange.start ||
                point.year > filterState.yearRange.end) {
                return false;
            }
            return true;
        };

        const primary = primaryRaw.filter(filterFn);
        const secondary = secondaryRaw.filter(filterFn);

        // Merge für Korrelation (Scatter)
        const merged = this.mergeDataForCorrelation(primary, secondary);

        // Stats berechnen (nur für Primary)
        state.calculateStats(primary);
        state.set('filteredData', primary);

        return { primary, secondary, merged };
    }

    /**
     * Merged zwei Datensätze für Korrelationsanalyse
     * Matched by uniCode + year
     * @param {Array} primary - Primäre Datenpunkte
     * @param {Array} secondary - Sekundäre Datenpunkte
     * @returns {Array} Gematchte { x, y, uniCode, year } Paare
     */
    mergeDataForCorrelation(primary, secondary) {
        const merged = [];

        // Index für schnellen Lookup
        const secondaryIndex = new Map();
        secondary.forEach(point => {
            const key = `${point.uniCode}_${point.year}`;
            secondaryIndex.set(key, point.value);
        });

        // Matche primary mit secondary
        primary.forEach(point => {
            const key = `${point.uniCode}_${point.year}`;
            const secondaryValue = secondaryIndex.get(key);

            if (secondaryValue !== undefined && point.value !== null && secondaryValue !== null) {
                merged.push({
                    x: point.value,
                    y: secondaryValue,
                    uniCode: point.uniCode,
                    year: point.year,
                    university: UNI_BY_CODE[point.uniCode]
                });
            }
        });

        return merged;
    }

    /**
     * Berechnet Verhältnis zwischen zwei Kennzahlen
     * @param {Array} primary - Zähler
     * @param {Array} secondary - Nenner
     * @returns {Array} Verhältnis-Datenpunkte
     */
    calculateRatio(primary, secondary) {
        const ratioData = [];

        // Index für schnellen Lookup
        const secondaryIndex = new Map();
        secondary.forEach(point => {
            const key = `${point.uniCode}_${point.year}`;
            secondaryIndex.set(key, point.value);
        });

        primary.forEach(point => {
            const key = `${point.uniCode}_${point.year}`;
            const secondaryValue = secondaryIndex.get(key);

            if (secondaryValue && secondaryValue !== 0 && point.value !== null) {
                ratioData.push({
                    uniCode: point.uniCode,
                    year: point.year,
                    value: point.value / secondaryValue,
                    primaryValue: point.value,
                    secondaryValue: secondaryValue
                });
            }
        });

        return ratioData;
    }

    /**
     * Leert den Cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Setzt den Basispfad für JSON-Dateien
     * @param {string} path - Neuer Basispfad
     */
    setBasePath(path) {
        this.basePath = path;
    }
}

// Singleton-Instanz
export const dataLoader = new DataLoader();
