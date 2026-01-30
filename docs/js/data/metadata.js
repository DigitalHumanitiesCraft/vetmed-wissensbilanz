/**
 * Metadata - Universitäten und Kennzahlen
 *
 * Zentrale Definition aller Metadaten.
 * Dient als Single Source of Truth für das Dashboard.
 *
 * WICHTIG: Uni-Codes aus offizieller Wissensbilanz-Verordnung
 * Verifiziert aus: 1-A-1 Personal - Köpfe.xlsx (Spalte "Codex")
 */

/**
 * Universitäts-Typen mit Farben (V1: Konsistente Farbkodierung)
 * Keys sind lowercase für einfachen Lookup mit university.type
 */
export const UNI_TYPES = {
    voll: {
        id: 'voll',
        name: 'Volluniversitäten',
        color: '#1a5490',
        bgColor: 'rgba(26, 84, 144, 0.1)'
    },
    tech: {
        id: 'tech',
        name: 'Technische Universitäten',
        color: '#28a745',
        bgColor: 'rgba(40, 167, 69, 0.1)'
    },
    med: {
        id: 'med',
        name: 'Medizinische Universitäten',
        color: '#dc3545',
        bgColor: 'rgba(220, 53, 69, 0.1)'
    },
    kunst: {
        id: 'kunst',
        name: 'Kunst-Universitäten',
        color: '#6f42c1',
        bgColor: 'rgba(111, 66, 193, 0.1)'
    },
    weiterb: {
        id: 'weiterb',
        name: 'Weiterbildungsuniversität',
        color: '#fd7e14',
        bgColor: 'rgba(253, 126, 20, 0.1)'
    }
};

/**
 * Alle 22 Universitäten mit offiziellen Codex-Codes
 * Quelle: Wissensbilanz-Verordnung, Excel "Universität (Codex)"
 */
export const UNIVERSITIES = [
    // Volluniversitäten (6)
    { code: 'UA', name: 'Universität Wien', type: 'voll', shortName: 'Uni Wien' },
    { code: 'UB', name: 'Universität Graz', type: 'voll', shortName: 'Uni Graz' },
    { code: 'UC', name: 'Universität Innsbruck', type: 'voll', shortName: 'Uni Innsbruck' },
    { code: 'UD', name: 'Universität Salzburg', type: 'voll', shortName: 'Uni Salzburg' },
    { code: 'UK', name: 'Universität Linz', type: 'voll', shortName: 'JKU Linz' },
    { code: 'UL', name: 'Universität Klagenfurt', type: 'voll', shortName: 'AAU Klagenfurt' },

    // Technische Universitäten (3)
    { code: 'UE', name: 'Technische Universität Wien', type: 'tech', shortName: 'TU Wien' },
    { code: 'UF', name: 'Technische Universität Graz', type: 'tech', shortName: 'TU Graz' },
    { code: 'UG', name: 'Montanuniversität Leoben', type: 'tech', shortName: 'MU Leoben' },

    // Medizinische Universitäten (4)
    { code: 'UN', name: 'Medizinische Universität Wien', type: 'med', shortName: 'Med Uni Wien' },
    { code: 'UO', name: 'Medizinische Universität Graz', type: 'med', shortName: 'Med Uni Graz' },
    { code: 'UQ', name: 'Medizinische Universität Innsbruck', type: 'med', shortName: 'Med Uni IBK' },
    { code: 'UI', name: 'Veterinärmedizinische Universität Wien', type: 'med', shortName: 'VetMed' },

    // Sonderformen (2)
    { code: 'UH', name: 'Universität für Bodenkultur Wien', type: 'voll', shortName: 'BOKU' },
    { code: 'UJ', name: 'Wirtschaftsuniversität Wien', type: 'voll', shortName: 'WU Wien' },

    // Kunst-Universitäten (6)
    { code: 'UR', name: 'Akademie der bildenden Künste Wien', type: 'kunst', shortName: 'Akademie Wien' },
    { code: 'US', name: 'Universität für angewandte Kunst Wien', type: 'kunst', shortName: 'Angewandte' },
    { code: 'UT', name: 'Universität für Musik und darstellende Kunst Wien', type: 'kunst', shortName: 'MDW' },
    { code: 'UU', name: 'Universität Mozarteum Salzburg', type: 'kunst', shortName: 'Mozarteum' },
    { code: 'UV', name: 'Universität für Musik und darstellende Kunst Graz', type: 'kunst', shortName: 'KUG' },
    { code: 'UW', name: 'Universität für künstlerische und industrielle Gestaltung Linz', type: 'kunst', shortName: 'Kunst Uni Linz' },

    // Weiterbildung (1)
    { code: 'UM', name: 'Universität für Weiterbildung Krems', type: 'weiterb', shortName: 'Donau-Uni' }
];

/**
 * Universitäten nach Typ gruppiert (für Filter-UI)
 */
export const UNIVERSITIES_BY_TYPE = Object.keys(UNI_TYPES).reduce((acc, typeId) => {
    acc[typeId] = UNIVERSITIES.filter(uni => uni.type === typeId);
    return acc;
}, {});

/**
 * Schneller Lookup: Code → Universität
 */
export const UNI_BY_CODE = UNIVERSITIES.reduce((acc, uni) => {
    acc[uni.code] = uni;
    return acc;
}, {});

/**
 * Kennzahl-Kategorien
 */
export const KENNZAHL_CATEGORIES = {
    PERSONAL: {
        id: 'personal',
        name: 'Personal',
        description: 'Personalstand und -struktur'
    },
    STUDIERENDE: {
        id: 'studierende',
        name: 'Studierende',
        description: 'Studierendenzahlen und Abschlüsse'
    },
    FORSCHUNG: {
        id: 'forschung',
        name: 'Forschung',
        description: 'Forschungsleistung und -output'
    }
};

/**
 * Kennzahlen - Abgestimmt auf die generierten JSON-Dateien
 * Dateinamen entsprechen dem Output von convert_excel_to_json.py
 */
export const KENNZAHLEN = [
    // Personal (5)
    {
        code: '1-A-1',
        name: 'Personal - Köpfe',
        category: 'personal',
        unit: 'Köpfe',
        description: 'Gesamtpersonal nach Köpfen',
        filename: '1-A-1.json'
    },
    {
        code: '1-A-1-VZA',
        name: 'Personal - VZÄ',
        category: 'personal',
        unit: 'VZÄ',
        description: 'Vollzeitäquivalente des Personals',
        filename: '1-A-1-VZA.json'
    },
    {
        code: '1-A-2',
        name: 'Berufungen an die Universität',
        category: 'personal',
        unit: 'Anzahl',
        description: 'Anzahl der Berufungen',
        filename: '1-A-2.json'
    },
    {
        code: '1-A-3',
        name: 'Frauenquote in Kollegialorganen',
        category: 'personal',
        unit: '%',
        description: 'Frauenanteil in Kollegialorganen',
        filename: '1-A-3.json'
    },
    {
        code: '1-A-4',
        name: 'Gender Pay Gap',
        category: 'personal',
        unit: '%',
        description: 'Gehaltsunterschied nach Geschlecht',
        filename: '1-A-4.json'
    },
    {
        code: '1-A-5',
        name: 'Repräsentanz von Frauen in Berufungsverfahren',
        category: 'personal',
        unit: '%',
        description: 'Frauenanteil in Berufungsverfahren',
        filename: '1-A-5.json'
    },

    // Studierende (10)
    {
        code: '2-A-1',
        name: 'ProfessorInnen und Äquivalente',
        category: 'studierende',
        unit: 'Köpfe',
        description: 'Anzahl Professuren',
        filename: '2-A-1.json'
    },
    {
        code: '2-A-2',
        name: 'Eingerichtete Studien',
        category: 'studierende',
        unit: 'Anzahl',
        description: 'Anzahl eingerichteter Studien',
        filename: '2-A-2.json'
    },
    {
        code: '2-A-3',
        name: 'Studienabschlussquote',
        category: 'studierende',
        unit: '%',
        description: 'Quote der Studienabschlüsse',
        filename: '2-A-3.json'
    },
    {
        code: '2-A-4',
        name: 'Besondere Zulassungsbedingungen',
        category: 'studierende',
        unit: 'Anzahl',
        description: 'Studien mit besonderen Zulassungsbedingungen',
        filename: '2-A-4.json'
    },
    {
        code: '2-A-5',
        name: 'Anzahl Studierender',
        category: 'studierende',
        unit: 'Köpfe',
        description: 'Gesamtzahl der Studierenden',
        filename: '2-A-5.json'
    },
    {
        code: '2-A-6',
        name: 'Anzahl Prüfungsaktive',
        category: 'studierende',
        unit: 'Köpfe',
        description: 'Prüfungsaktive Studierende',
        filename: '2-A-6.json'
    },
    {
        code: '2-A-7',
        name: 'Belegte ordentliche Studien',
        category: 'studierende',
        unit: 'Anzahl',
        description: 'Anzahl belegter ordentlicher Studien',
        filename: '2-A-7.json'
    },
    {
        code: '2-A-8',
        name: 'Ordentliche Studierende (Outgoing)',
        category: 'studierende',
        unit: 'Köpfe',
        description: 'Outgoing-Mobilität',
        filename: '2-A-8.json'
    },
    {
        code: '2-A-9',
        name: 'Ordentliche Studierende (Incoming)',
        category: 'studierende',
        unit: 'Köpfe',
        description: 'Incoming-Mobilität',
        filename: '2-A-9.json'
    },
    {
        code: '2-B-1',
        name: 'Doktoratsstudierende mit Betreuungsverhältnis',
        category: 'studierende',
        unit: 'Köpfe',
        description: 'Doktoratsstudierende mit BV zur Universität',
        filename: '2-B-1.json'
    },

    // Forschung (2)
    {
        code: '3-A-2',
        name: 'Studienabschlüsse in Toleranzstudiendauer',
        category: 'forschung',
        unit: '%',
        description: 'Abschlüsse innerhalb der Toleranzstudiendauer',
        filename: '3-A-2.json'
    }
];

/**
 * Kennzahlen nach Kategorie gruppiert (für Filter-UI)
 */
export const KENNZAHLEN_BY_CATEGORY = Object.values(KENNZAHL_CATEGORIES).reduce((acc, cat) => {
    acc[cat.id] = KENNZAHLEN.filter(k => k.category === cat.id);
    return acc;
}, {});

/**
 * Schneller Lookup: Code → Kennzahl
 */
export const KENNZAHL_BY_CODE = KENNZAHLEN.reduce((acc, k) => {
    acc[k.code] = k;
    return acc;
}, {});

/**
 * Verfügbare Jahre in den Daten (aus Excel-Konvertierung)
 */
export const AVAILABLE_YEARS = {
    start: 2021,
    end: 2024
};

/**
 * Formatiert einen Zahlenwert abhängig von der Einheit
 * @param {number} value - Zahlenwert
 * @param {string} unit - Einheit (€, %, VZÄ, etc.)
 * @returns {string} Formatierter Wert
 */
export function formatValue(value, unit) {
    if (value === null || value === undefined) {
        return '–'; // Bindestrich für fehlende Werte
    }

    const formatter = new Intl.NumberFormat('de-AT', {
        maximumFractionDigits: unit === '%' ? 1 : 0
    });

    if (unit === '€') {
        // Millionen formatieren
        if (value >= 1000000) {
            return `${formatter.format(value / 1000000)} Mio. €`;
        }
        return `${formatter.format(value)} €`;
    }

    if (unit === '%') {
        return `${formatter.format(value)} %`;
    }

    return formatter.format(value);
}

/**
 * Gibt die Farbe für einen Universitäts-Typ zurück
 * @param {string} typeId - Typ-ID
 * @returns {string} CSS-Variable für die Farbe
 */
export function getUniTypeColor(typeId) {
    const type = Object.values(UNI_TYPES).find(t => t.id === typeId);
    return type ? type.color : 'var(--color-text-muted)';
}
