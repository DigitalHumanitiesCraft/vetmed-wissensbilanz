/**
 * VaultBrowser - Obsidian Vault Dateien laden und navigieren
 *
 * Lädt Markdown-Dateien aus knowledge/ und stellt sie zur Verfügung.
 * Jede Kategorie hat eine definierte Funktion im Promptotyping-Prozess.
 */

import { log } from '../core/logger.js';

/**
 * Vault-Kategorien mit ihrer Promptotyping-Funktion
 */
export const VAULT_CATEGORIES = {
    '00-Meta': {
        id: '00-Meta',
        name: 'Methodendefinition',
        promptotypingPhase: 'foundation',
        description: 'Was ist Promptotyping? Wie funktioniert diese Methode?',
        learningGoal: 'Verstehe die 4-Phasen-Methodik und den theoretischen Hintergrund',
        icon: 'book-open',
        files: [
            { name: 'Promptotyping-Methode.md', title: 'Die Promptotyping-Methode', purpose: 'Vollständige Methodenbeschreibung mit 4 Phasen' },
            { name: 'Use Case Wissensbilanz.md', title: 'Projekt-Übersicht', purpose: 'Warum dieses Projekt existiert und was es demonstriert' },
            { name: 'Glossar.md', title: 'KI-Glossar', purpose: 'Begriffserklärungen für Nicht-Techniker' }
        ]
    },
    '01-Domaene': {
        id: '01-Domaene',
        name: 'Domänenwissen',
        promptotypingPhase: 'preparation',
        description: 'Die Rohmaterialien: Datenquellen, Strukturen, Einschränkungen',
        learningGoal: 'Verstehe, warum Domänenwissen vor der Implementation kommt',
        icon: 'database',
        files: [
            { name: 'Datenquellen.md', title: 'Datenquellen', purpose: 'Woher die Daten kommen und wie sie verarbeitet werden' },
            { name: 'Kennzahlen.md', title: 'Kennzahlen', purpose: 'Die 21 offiziellen Wissensbilanz-Metriken' },
            { name: 'Universitaeten.md', title: 'Universitäten', purpose: 'Alle 22 österreichischen Universitäten mit Codes' }
        ]
    },
    '02-Design': {
        id: '02-Design',
        name: 'Design-Entscheidungen',
        promptotypingPhase: 'destillation',
        description: 'Wie Domänenwissen in UI-Prinzipien übersetzt wird',
        learningGoal: 'Lerne, evidenzbasierte Design-Entscheidungen zu dokumentieren',
        icon: 'palette',
        files: [
            { name: 'UI-Prinzipien.md', title: 'UI-Prinzipien', purpose: 'F1-F4 (Filter), V1-V6 (Visualisierung), R1-R6 (Reports)' },
            { name: 'Farbpalette.md', title: 'Farbpalette', purpose: 'Semantische Farbkodierung nach Universitäts-Typ' }
        ]
    },
    '03-Hypothesen': {
        id: '03-Hypothesen',
        name: 'Hypothesen',
        promptotypingPhase: 'exploration',
        description: 'Annahmen über Nutzerbedürfnisse vor der Validierung',
        learningGoal: 'Verstehe den Unterschied zwischen Hypothesen und Requirements',
        icon: 'lightbulb',
        files: [
            { name: 'index.md', title: 'Hypothesen-Übersicht', purpose: 'Die 4 zentralen Hypothesen (H1-H4)' },
            { name: 'H1-Ad-hoc-Anfragen.md', title: 'H1: Ad-hoc Anfragen', purpose: 'Schnelle Antworten für Führungskräfte' },
            { name: 'H2-LLM-Berichte.md', title: 'H2: LLM-Berichte', purpose: 'Narrative Berichte per KI generieren' },
            { name: 'H3-Datenaktualisierung.md', title: 'H3: Datenaktualisierung', purpose: 'Self-Service Datenimport' },
            { name: 'H4-Plausibilitaetspruefung.md', title: 'H4: Plausibilitätsprüfung', purpose: 'Anomalieerkennung in neuen Daten' }
        ]
    },
    '04-Learnings': {
        id: '04-Learnings',
        name: 'Learnings',
        promptotypingPhase: 'meta',
        description: 'Destillierte Erkenntnisse aus dem Prozess',
        learningGoal: 'Die übertragbaren Regeln für zukünftige Projekte',
        icon: 'graduation-cap',
        files: [
            { name: 'index.md', title: 'Learnings-Übersicht', purpose: 'Katalog aller 8 Learnings' },
            { name: 'L001-Iterative-Synthese.md', title: 'L001: Iterative Synthese', purpose: 'Kleine Batches + Primärquellen-Verifikation' },
            { name: 'L006-Vanilla-JS-Lernbarkeit.md', title: 'L006: Vanilla JS', purpose: 'Weniger Abstraktion = mehr Verständnis' },
            { name: 'L007-Demo-Daten-Fallback.md', title: 'L007: Demo-Daten', purpose: 'Robustheit durch Fallback-Daten' },
            { name: 'L008-Vault-Refactoring.md', title: 'L008: Vault-Struktur', purpose: 'Obsidian für skalierbares Wissensmanagement' }
        ]
    },
    '05-Journal': {
        id: '05-Journal',
        name: 'Journal',
        promptotypingPhase: 'chronicle',
        description: 'Chronologisches Protokoll der Entstehung',
        learningGoal: 'Nachvollziehen, wie Entscheidungen über Zeit entstanden',
        icon: 'calendar',
        files: [
            { name: 'index.md', title: 'Journal-Index', purpose: 'Navigation zu allen Einträgen' },
            { name: '2026-01-22.md', title: '22. Januar 2026', purpose: 'Preparation & Exploration Phase' },
            { name: '2026-01-30.md', title: '30. Januar 2026', purpose: 'Implementation & Refactoring Phase' }
        ]
    }
};

/**
 * Promptotyping-Phasen mit Erklärungen
 */
export const PROMPTOTYPING_PHASES = {
    foundation: {
        name: 'Foundation',
        order: 0,
        description: 'Methodische Grundlagen verstehen',
        categories: ['00-Meta']
    },
    preparation: {
        name: 'Preparation',
        order: 1,
        description: 'Domänenwissen sammeln und strukturieren',
        categories: ['01-Domaene']
    },
    exploration: {
        name: 'Exploration',
        order: 2,
        description: 'Hypothesen formulieren und User Stories ableiten',
        categories: ['03-Hypothesen']
    },
    destillation: {
        name: 'Destillation',
        order: 3,
        description: 'Wissen in konkrete Design-Prinzipien übersetzen',
        categories: ['02-Design']
    },
    meta: {
        name: 'Meta-Learning',
        order: 4,
        description: 'Übertragbare Erkenntnisse extrahieren',
        categories: ['04-Learnings']
    },
    chronicle: {
        name: 'Chronicle',
        order: 5,
        description: 'Prozess dokumentieren für Transparenz',
        categories: ['05-Journal']
    }
};

class VaultBrowser {
    constructor() {
        this.cache = new Map();
        this.basePath = '../knowledge';
    }

    /**
     * Lädt eine Markdown-Datei aus dem Vault
     * @param {string} category - Kategorie-ID (z.B. '00-Meta')
     * @param {string} filename - Dateiname (z.B. 'Glossar.md')
     * @returns {Promise<{content: string, metadata: Object}>}
     */
    async loadFile(category, filename) {
        const cacheKey = `${category}/${filename}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const path = `${this.basePath}/${category}/${filename}`;
            const response = await fetch(path);

            if (!response.ok) {
                throw new Error(`File not found: ${path}`);
            }

            const rawContent = await response.text();
            const parsed = this.parseMarkdown(rawContent);

            this.cache.set(cacheKey, parsed);
            log.info('VaultBrowser', `Loaded: ${cacheKey}`);

            return parsed;
        } catch (error) {
            log.error('VaultBrowser', `Failed to load ${cacheKey}:`, error.message);
            throw error;
        }
    }

    /**
     * Parsed Markdown mit YAML-Frontmatter
     * @param {string} content - Raw Markdown-Inhalt
     * @returns {{content: string, metadata: Object}}
     */
    parseMarkdown(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        if (match) {
            const metadata = this.parseYaml(match[1]);
            return {
                metadata,
                content: match[2].trim()
            };
        }

        return {
            metadata: {},
            content: content.trim()
        };
    }

    /**
     * Einfacher YAML-Parser für Frontmatter
     */
    parseYaml(yaml) {
        const result = {};
        const lines = yaml.split('\n');

        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();

                // Arrays erkennen
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(s => s.trim());
                }

                result[key] = value;
            }
        }

        return result;
    }

    /**
     * Gibt alle Kategorien zurück
     */
    getCategories() {
        return Object.values(VAULT_CATEGORIES);
    }

    /**
     * Gibt Kategorien nach Promptotyping-Phase sortiert zurück
     */
    getCategoriesByPhase() {
        const phases = Object.entries(PROMPTOTYPING_PHASES)
            .sort((a, b) => a[1].order - b[1].order);

        return phases.map(([phaseId, phase]) => ({
            ...phase,
            id: phaseId,
            categories: phase.categories.map(catId => VAULT_CATEGORIES[catId])
        }));
    }

    /**
     * Gibt Dateien einer Kategorie zurück
     */
    getFilesInCategory(categoryId) {
        return VAULT_CATEGORIES[categoryId]?.files || [];
    }

    /**
     * Sucht nach einem Begriff in allen geladenen Dateien
     */
    search(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        for (const [key, value] of this.cache.entries()) {
            if (value.content.toLowerCase().includes(lowerQuery)) {
                const [category, filename] = key.split('/');
                results.push({
                    category,
                    filename,
                    excerpt: this.getExcerpt(value.content, lowerQuery)
                });
            }
        }

        return results;
    }

    /**
     * Extrahiert einen Textausschnitt um den Suchbegriff
     */
    getExcerpt(content, query, contextLength = 100) {
        const lowerContent = content.toLowerCase();
        const index = lowerContent.indexOf(query);

        if (index === -1) return '';

        const start = Math.max(0, index - contextLength);
        const end = Math.min(content.length, index + query.length + contextLength);

        let excerpt = content.substring(start, end);

        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';

        return excerpt;
    }
}

// Singleton-Instanz
export const vaultBrowser = new VaultBrowser();
