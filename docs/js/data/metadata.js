/**
 * Metadata - Universitäten und Kennzahlen
 *
 * Zentrale Definition aller Metadaten aus inputdata.md.
 * Dient als Single Source of Truth für das Dashboard.
 *
 * Quelle: knowledge/inputdata.md
 */

/**
 * Universitäts-Typen mit Farben (V1: Konsistente Farbkodierung)
 */
export const UNI_TYPES = {
    VOLL: {
        id: 'voll',
        name: 'Volluniversitäten',
        color: 'var(--color-uni-voll)',
        bgColor: 'var(--color-uni-voll-bg)'
    },
    TECH: {
        id: 'tech',
        name: 'Technische Universitäten',
        color: 'var(--color-uni-tech)',
        bgColor: 'var(--color-uni-tech-bg)'
    },
    MED: {
        id: 'med',
        name: 'Medizinische Universitäten',
        color: 'var(--color-uni-med)',
        bgColor: 'var(--color-uni-med-bg)'
    },
    KUNST: {
        id: 'kunst',
        name: 'Kunst-Universitäten',
        color: 'var(--color-uni-kunst)',
        bgColor: 'var(--color-uni-kunst-bg)'
    },
    WEITERB: {
        id: 'weiterb',
        name: 'Weiterbildungsuniversität',
        color: 'var(--color-uni-weiterb)',
        bgColor: 'var(--color-uni-weiterb-bg)'
    }
};

/**
 * Alle 22 Universitäten mit Codes und Typen
 * Code-Schema gemäß UniData Excel (UI = VetMed Wien)
 */
export const UNIVERSITIES = [
    // Volluniversitäten (6)
    { code: 'UW', name: 'Universität Wien', type: 'voll', shortName: 'Uni Wien' },
    { code: 'UG', name: 'Universität Graz', type: 'voll', shortName: 'Uni Graz' },
    { code: 'UI', name: 'Universität für Veterinärmedizin Wien', type: 'med', shortName: 'VetMed' }, // VetMed!
    { code: 'US', name: 'Universität Salzburg', type: 'voll', shortName: 'Uni Salzburg' },
    { code: 'UL', name: 'Universität Linz', type: 'voll', shortName: 'JKU Linz' },
    { code: 'UK', name: 'Universität Klagenfurt', type: 'voll', shortName: 'AAU' },

    // Technische Universitäten (3)
    { code: 'TU', name: 'TU Wien', type: 'tech', shortName: 'TU Wien' },
    { code: 'TG', name: 'TU Graz', type: 'tech', shortName: 'TU Graz' },
    { code: 'MB', name: 'Montanuniversität Leoben', type: 'tech', shortName: 'MU Leoben' },

    // Medizinische Universitäten (4) - inkl. VetMed
    { code: 'MW', name: 'Medizinische Universität Wien', type: 'med', shortName: 'Med Uni Wien' },
    { code: 'MG', name: 'Medizinische Universität Graz', type: 'med', shortName: 'Med Uni Graz' },
    { code: 'MK', name: 'Medizinische Universität Innsbruck', type: 'med', shortName: 'Med Uni IBK' },

    // Kunst-Universitäten (7)
    { code: 'AW', name: 'Akademie der bildenden Künste Wien', type: 'kunst', shortName: 'Akademie Wien' },
    { code: 'AN', name: 'Universität für angewandte Kunst Wien', type: 'kunst', shortName: 'Angewandte' },
    { code: 'MO', name: 'Universität für Musik und darstellende Kunst Wien', type: 'kunst', shortName: 'MDW' },
    { code: 'MS', name: 'Universität Mozarteum Salzburg', type: 'kunst', shortName: 'Mozarteum' },
    { code: 'KG', name: 'Universität für Musik und darstellende Kunst Graz', type: 'kunst', shortName: 'KUG' },
    { code: 'KL', name: 'Kunstuniversität Linz', type: 'kunst', shortName: 'Kunst Uni Linz' },
    { code: 'FI', name: 'Filmakademie Wien', type: 'kunst', shortName: 'Filmakademie' },

    // Sonstige (2)
    { code: 'BO', name: 'Universität für Bodenkultur Wien', type: 'voll', shortName: 'BOKU' },
    { code: 'WU', name: 'Wirtschaftsuniversität Wien', type: 'voll', shortName: 'WU Wien' },

    // Weiterbildung (1)
    { code: 'DK', name: 'Universität für Weiterbildung Krems', type: 'weiterb', shortName: 'Donau-Uni' }
];

/**
 * Universitäten nach Typ gruppiert (für Filter-UI)
 */
export const UNIVERSITIES_BY_TYPE = Object.values(UNI_TYPES).reduce((acc, type) => {
    acc[type.id] = UNIVERSITIES.filter(uni => uni.type === type.id);
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
    },
    FINANZEN: {
        id: 'finanzen',
        name: 'Finanzen',
        description: 'Erlöse und Drittmittel'
    }
};

/**
 * Alle 21 Kennzahlen aus der Wissensbilanz-Verordnung
 */
export const KENNZAHLEN = [
    // Personal (4)
    {
        code: '1-A-1',
        name: 'Personal - Köpfe',
        category: 'personal',
        unit: 'Köpfe',
        description: 'Gesamtpersonal nach Köpfen',
        filename: '1-A-1_Personal_Koepfe.json'
    },
    {
        code: '1-A-2',
        name: 'Personal - VZÄ',
        category: 'personal',
        unit: 'VZÄ',
        description: 'Vollzeitäquivalente des Personals',
        filename: '1-A-2_Personal_VZÄ.json'
    },
    {
        code: '1-B-1',
        name: 'Berufungen',
        category: 'personal',
        unit: 'Anzahl',
        description: 'Anzahl der Berufungen auf Professuren',
        filename: '1-B-1_Berufungen.json'
    },
    {
        code: '1-B-2',
        name: 'Frauenquote Professuren',
        category: 'personal',
        unit: '%',
        description: 'Frauenanteil bei Professuren',
        filename: '1-B-2_Frauenquote.json'
    },

    // Studierende (8)
    {
        code: '2-A-1',
        name: 'Studien - Begonnene',
        category: 'studierende',
        unit: 'Anzahl',
        description: 'Anzahl begonnener Studien',
        filename: '2-A-1_Begonnene_Studien.json'
    },
    {
        code: '2-A-2',
        name: 'Studierende insgesamt',
        category: 'studierende',
        unit: 'Köpfe',
        description: 'Gesamtzahl der Studierenden',
        filename: '2-A-2_Studierende.json'
    },
    {
        code: '2-A-3',
        name: 'Studienabschlüsse',
        category: 'studierende',
        unit: 'Anzahl',
        description: 'Anzahl der Studienabschlüsse',
        filename: '2-A-3_Abschluesse.json'
    },
    {
        code: '2-A-4',
        name: 'Studiendauer',
        category: 'studierende',
        unit: 'Semester',
        description: 'Durchschnittliche Studiendauer',
        filename: '2-A-4_Studiendauer.json'
    },
    {
        code: '2-A-5',
        name: 'Erfolgsquote',
        category: 'studierende',
        unit: '%',
        description: 'Erfolgsquote ordentlicher Studien',
        filename: '2-A-5_Erfolgsquote.json'
    },
    {
        code: '2-A-6',
        name: 'Doktoratsabschlüsse',
        category: 'studierende',
        unit: 'Anzahl',
        description: 'Anzahl der Doktoratsabschlüsse',
        filename: '2-A-6_Doktorate.json'
    },
    {
        code: '2-A-8',
        name: 'Mobilitätsprogramme (Outgoing)',
        category: 'studierende',
        unit: 'Anzahl',
        description: 'Outgoing-Studierende in Mobilitätsprogrammen',
        filename: '2-A-8_Mobilitaet_Out.json'
    },
    {
        code: '2-A-9',
        name: 'Mobilitätsprogramme (Incoming)',
        category: 'studierende',
        unit: 'Anzahl',
        description: 'Incoming-Studierende in Mobilitätsprogrammen',
        filename: '2-A-9_Mobilitaet_In.json'
    },

    // Forschung (4)
    {
        code: '3-A-1',
        name: 'Publikationen',
        category: 'forschung',
        unit: 'Anzahl',
        description: 'Anzahl wissenschaftlicher Publikationen',
        filename: '3-A-1_Publikationen.json'
    },
    {
        code: '3-A-2',
        name: 'Vorträge und Poster',
        category: 'forschung',
        unit: 'Anzahl',
        description: 'Wissenschaftliche Vorträge und Posterpräsentationen',
        filename: '3-A-2_Vortraege.json'
    },
    {
        code: '3-B-1',
        name: 'Erlöse Forschungsprojekte',
        category: 'forschung',
        unit: '€',
        description: 'Erlöse aus F&E-Projekten',
        filename: '3-B-1_FE_Erloese.json'
    },
    {
        code: '3-B-2',
        name: 'Doktoratsstudierende (Betreuungsverhältnisse)',
        category: 'forschung',
        unit: 'Anzahl',
        description: 'Betreuungsverhältnisse bei Doktoratsstudien',
        filename: '3-B-2_Doktorat_Betreuung.json'
    },

    // Finanzen (5)
    {
        code: '4-A-1',
        name: 'Erlöse gesamt',
        category: 'finanzen',
        unit: '€',
        description: 'Gesamterlöse der Universität',
        filename: '4-A-1_Erloese_Gesamt.json'
    },
    {
        code: '4-A-2',
        name: 'Drittmittelerlöse',
        category: 'finanzen',
        unit: '€',
        description: 'Erlöse aus Drittmitteln',
        filename: '4-A-2_Drittmittel.json'
    },
    {
        code: '4-A-3',
        name: 'Investitionen',
        category: 'finanzen',
        unit: '€',
        description: 'Investitionsausgaben',
        filename: '4-A-3_Investitionen.json'
    },
    {
        code: '4-A-4',
        name: 'Erlöse je Professur',
        category: 'finanzen',
        unit: '€',
        description: 'Erlöse pro Professur',
        filename: '4-A-4_Erloese_Prof.json'
    },
    {
        code: '4-A-5',
        name: 'Erlöse je wissenschaftl. Personal',
        category: 'finanzen',
        unit: '€',
        description: 'Erlöse pro wissenschaftlichem Personal',
        filename: '4-A-5_Erloese_Wiss.json'
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
 * Verfügbare Jahre in den Daten
 */
export const AVAILABLE_YEARS = {
    start: 2019,
    end: 2023
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
