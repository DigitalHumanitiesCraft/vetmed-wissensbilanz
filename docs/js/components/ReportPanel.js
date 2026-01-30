/**
 * ReportPanel - LLM-gestützte Berichtsgenerierung
 *
 * Implementiert:
 * - R1: Quellenattribution (Datenbasis transparent)
 * - R3: Template-basierte Prompts
 * - R5: Editierbares Textfeld
 * - R6: Export-Optionen
 */

import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { dataLoader } from '../data/dataLoader.js';
import { UNI_BY_CODE, KENNZAHL_BY_CODE, UNIVERSITIES, formatValue } from '../data/metadata.js';

// Report-Templates (R3)
const REPORT_TEMPLATES = {
    summary: {
        name: 'Zusammenfassung',
        description: 'Kompakte Übersicht der ausgewählten Daten',
        prompt: (context) => `
Erstelle eine prägnante Zusammenfassung der folgenden Wissensbilanz-Daten.

**Kennzahl:** ${context.kennzahl.name} (${context.kennzahl.code})
**Zeitraum:** ${context.yearRange.start}–${context.yearRange.end}
**Universitäten:** ${context.universities.map(u => u.shortName).join(', ')}

**Datenpunkte:**
${context.dataPoints}

Fasse die wichtigsten Erkenntnisse in 2-3 Sätzen zusammen. Nenne konkrete Zahlen.
`
    },
    comparison: {
        name: 'Vergleich',
        description: 'Vergleich zwischen ausgewählten Universitäten',
        prompt: (context) => `
Vergleiche die folgenden Universitäten anhand der Kennzahl "${context.kennzahl.name}".

**Zeitraum:** ${context.yearRange.start}–${context.yearRange.end}
**Universitäten:** ${context.universities.map(u => u.name).join(', ')}

**Daten pro Universität:**
${context.dataByUni}

Erstelle einen strukturierten Vergleich:
1. Welche Universität hat die höchsten/niedrigsten Werte?
2. Wie unterscheiden sich die Entwicklungen?
3. Gibt es auffällige Unterschiede zwischen Medizinischen und anderen Unis?

Formatiere als Fließtext mit konkreten Zahlen.
`
    },
    trend: {
        name: 'Trendanalyse',
        description: 'Analyse der zeitlichen Entwicklung',
        prompt: (context) => `
Analysiere den zeitlichen Verlauf der Kennzahl "${context.kennzahl.name}".

**Zeitraum:** ${context.yearRange.start}–${context.yearRange.end}
**Datenpunkte gesamt:** ${context.totalPoints}
**Durchschnitt:** ${context.average}
**Trend (letztes Jahr vs. Vorjahr):** ${context.trend}%

**Jährliche Entwicklung:**
${context.yearlyData}

Beschreibe:
1. Den allgemeinen Trend (steigend/fallend/stabil)
2. Besondere Jahre oder Ausreißer
3. Mögliche Interpretationen der Entwicklung

Antworte sachlich und mit konkreten Zahlenangaben.
`
    },
    anomaly: {
        name: 'Auffälligkeiten',
        description: 'Identifikation ungewöhnlicher Werte',
        prompt: (context) => `
Identifiziere auffällige Werte in den folgenden Wissensbilanz-Daten.

**Kennzahl:** ${context.kennzahl.name}
**Durchschnitt:** ${context.average}
**Standardabweichung:** ${context.stdDev}

**Alle Datenpunkte:**
${context.dataPoints}

Finde und erkläre:
1. Werte, die mehr als 1,5 Standardabweichungen vom Durchschnitt entfernt sind
2. Unerwartete Sprünge zwischen Jahren
3. Universitäten mit untypischen Mustern

Falls keine Auffälligkeiten vorliegen, sage das explizit.
`
    }
};

class ReportPanel {
    constructor(container) {
        this.container = container;
        this.apiKey = localStorage.getItem('llm_api_key') || '';
        this.isGenerating = false;

        this.render();
        this.subscribeToState();
    }

    render() {
        const currentTemplate = state.get('reportTemplate');

        this.container.innerHTML = `
            <div class="report-panel">
                <div class="report-config">
                    <div class="form-group">
                        <label class="form-label">Berichtstyp</label>
                        <select class="form-select" id="templateSelect">
                            ${Object.entries(REPORT_TEMPLATES).map(([key, tpl]) => `
                                <option value="${key}" ${key === currentTemplate ? 'selected' : ''}>
                                    ${tpl.name} – ${tpl.description}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            API Key
                            <span class="text-muted text-sm">(lokal gespeichert)</span>
                        </label>
                        <input type="password"
                               class="form-input"
                               id="apiKeyInput"
                               placeholder="sk-..."
                               value="${this.apiKey}">
                    </div>

                    <button class="btn btn--primary" id="generateBtn" style="width: 100%;">
                        Bericht generieren
                    </button>
                </div>

                <div class="report-source" id="sourceBlock">
                    <h4 class="text-sm font-semibold" style="margin-bottom: var(--space-2);">
                        Datenbasis (R1: Quellenattribution)
                    </h4>
                    <div class="source-info" id="sourceInfo">
                        Wählen Sie Filter und klicken Sie "Bericht generieren".
                    </div>
                </div>

                <div class="report-content">
                    <label class="form-label">
                        Generierter Bericht
                        <span class="badge badge--muted" id="editBadge" style="display: none;">Bearbeitet</span>
                    </label>
                    <textarea class="form-textarea"
                              id="reportTextarea"
                              rows="15"
                              placeholder="Der generierte Bericht erscheint hier. Sie können ihn anschließend bearbeiten."
                    >${state.get('reportContent')}</textarea>

                    <div class="report-actions" style="margin-top: var(--space-3); display: flex; gap: var(--space-2);">
                        <button class="btn btn--secondary btn--sm" id="copyBtn">
                            Kopieren
                        </button>
                        <button class="btn btn--secondary btn--sm" id="downloadBtn">
                            Als TXT speichern
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Template-Auswahl
        this.container.querySelector('#templateSelect')?.addEventListener('change', (e) => {
            state.set('reportTemplate', e.target.value);
        });

        // API Key speichern
        this.container.querySelector('#apiKeyInput')?.addEventListener('change', (e) => {
            this.apiKey = e.target.value;
            localStorage.setItem('llm_api_key', this.apiKey);
        });

        // Generieren
        this.container.querySelector('#generateBtn')?.addEventListener('click', () => {
            this.generateReport();
        });

        // Textarea-Änderungen tracken (R5)
        this.container.querySelector('#reportTextarea')?.addEventListener('input', (e) => {
            state.set('reportContent', e.target.value);
            this.container.querySelector('#editBadge').style.display = 'inline';
        });

        // Kopieren
        this.container.querySelector('#copyBtn')?.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Download
        this.container.querySelector('#downloadBtn')?.addEventListener('click', () => {
            this.downloadReport();
        });
    }

    subscribeToState() {
        eventBus.on(EVENTS.FILTER_CHANGE, () => {
            this.updateSourceBlock();
        });
    }

    async generateReport() {
        if (this.isGenerating) return;

        if (!this.apiKey) {
            alert('Bitte geben Sie einen API Key ein.');
            return;
        }

        this.isGenerating = true;
        const btn = this.container.querySelector('#generateBtn');
        const textarea = this.container.querySelector('#reportTextarea');

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner" style="width: 16px; height: 16px;"></span> Generiere...';

        try {
            // Daten laden
            const filteredData = await dataLoader.loadFiltered();
            const context = this.buildContext(filteredData);

            // Source Block aktualisieren
            this.updateSourceBlock(context);

            // Prompt erstellen
            const template = REPORT_TEMPLATES[state.get('reportTemplate')];
            const prompt = template.prompt(context);

            // LLM aufrufen (Anthropic Claude API)
            const report = await this.callLLM(prompt);

            // Report anzeigen
            textarea.value = report;
            state.set('reportContent', report);
            state.set('reportSources', context.sourceInfo);

            // Edit Badge zurücksetzen
            this.container.querySelector('#editBadge').style.display = 'none';

        } catch (error) {
            console.error('Report-Generierung fehlgeschlagen:', error);
            textarea.value = `Fehler bei der Generierung:\n${error.message}\n\n` +
                'Hinweis: Stellen Sie sicher, dass der API Key korrekt ist und Sie Zugriff auf die API haben.';
        } finally {
            this.isGenerating = false;
            btn.disabled = false;
            btn.textContent = 'Bericht generieren';
        }
    }

    buildContext(data) {
        const filterState = state.getFilterState();
        const kennzahl = KENNZAHL_BY_CODE[filterState.kennzahl];
        const stats = state.get('dataStats');

        // Universitäten
        const universities = filterState.universities.map(code => UNI_BY_CODE[code]).filter(Boolean);

        // Daten formatieren
        const dataPoints = data.map(d => {
            const uni = UNI_BY_CODE[d.uniCode];
            return `${uni?.shortName || d.uniCode} (${d.year}): ${formatValue(d.value, kennzahl?.unit)}`;
        }).join('\n');

        // Daten nach Uni gruppiert
        const grouped = dataLoader.groupByUniversity(data);
        const dataByUni = Object.entries(grouped).map(([code, group]) => {
            const uni = group.university;
            const values = group.data.map(d => `${d.year}: ${formatValue(d.value, kennzahl?.unit)}`).join(', ');
            return `**${uni.name}:** ${values}`;
        }).join('\n');

        // Jährliche Aggregation
        const byYear = dataLoader.aggregateByYear(data, 'average');
        const yearlyData = byYear.map(d => `${d.year}: ${formatValue(d.value, kennzahl?.unit)}`).join('\n');

        // Standardabweichung berechnen
        const values = data.map(d => d.value).filter(v => v !== null);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);

        return {
            kennzahl,
            yearRange: filterState.yearRange,
            universities,
            dataPoints,
            dataByUni,
            yearlyData,
            totalPoints: stats.totalPoints,
            average: formatValue(stats.average, kennzahl?.unit),
            trend: stats.trend,
            stdDev: formatValue(stdDev, kennzahl?.unit),
            sourceInfo: {
                kennzahl: kennzahl?.code,
                universities: universities.map(u => u.code),
                yearRange: filterState.yearRange,
                dataPoints: stats.totalPoints
            }
        };
    }

    async callLLM(prompt) {
        // Claude API Aufruf
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }

        const result = await response.json();
        return result.content[0].text;
    }

    updateSourceBlock(context) {
        const sourceInfo = this.container.querySelector('#sourceInfo');
        if (!sourceInfo) return;

        if (!context) {
            const filterState = state.getFilterState();
            const kennzahl = KENNZAHL_BY_CODE[filterState.kennzahl];
            const stats = state.get('dataStats');

            sourceInfo.innerHTML = `
                <p><strong>Kennzahl:</strong> ${kennzahl?.code}: ${kennzahl?.name}</p>
                <p><strong>Zeitraum:</strong> ${filterState.yearRange.start}–${filterState.yearRange.end}</p>
                <p><strong>Universitäten:</strong> ${filterState.universities.length} ausgewählt</p>
                <p><strong>Datenpunkte:</strong> ${stats.totalPoints}</p>
            `;
        } else {
            sourceInfo.innerHTML = `
                <p><strong>Kennzahl:</strong> ${context.kennzahl?.code}: ${context.kennzahl?.name}</p>
                <p><strong>Zeitraum:</strong> ${context.yearRange.start}–${context.yearRange.end}</p>
                <p><strong>Universitäten:</strong> ${context.universities.map(u => u.shortName).join(', ')}</p>
                <p><strong>Datenpunkte:</strong> ${context.totalPoints}</p>
                <p><strong>Durchschnitt:</strong> ${context.average}</p>
            `;
        }
    }

    copyToClipboard() {
        const textarea = this.container.querySelector('#reportTextarea');
        if (textarea) {
            navigator.clipboard.writeText(textarea.value);
            const btn = this.container.querySelector('#copyBtn');
            const originalText = btn.textContent;
            btn.textContent = 'Kopiert!';
            setTimeout(() => btn.textContent = originalText, 2000);
        }
    }

    downloadReport() {
        const content = state.get('reportContent');
        if (!content) return;

        const kennzahl = KENNZAHL_BY_CODE[state.get('selectedKennzahl')];
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bericht_${kennzahl?.code || 'export'}_${new Date().toISOString().slice(0, 10)}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

export function initReportPanel(container) {
    return new ReportPanel(container);
}
