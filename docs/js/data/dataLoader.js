/**
 * DataLoader - Lazy Loading und Caching für Wissensbilanz-Daten
 *
 * Lädt JSON-Daten bei Bedarf und cached sie im Memory.
 * Unterstützt Filterung und Aggregation.
 */

import { KENNZAHL_BY_CODE, UNI_BY_CODE } from './metadata.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { state } from '../core/state.js';

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
            console.error(`Fehler beim Laden von ${kennzahlCode}:`, error);
            eventBus.emit(EVENTS.DATA_ERROR, { kennzahl: kennzahlCode, error: error.message });

            // Demo-Daten zurückgeben falls Datei fehlt
            return this.generateDemoData(kennzahlCode);
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
        const demoUniversities = ['UI', 'MW', 'MG', 'TU', 'UW'];
        const years = [2019, 2020, 2021, 2022, 2023];
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

        console.warn(`Demo-Daten generiert für ${kennzahlCode}`);
        return data;
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
