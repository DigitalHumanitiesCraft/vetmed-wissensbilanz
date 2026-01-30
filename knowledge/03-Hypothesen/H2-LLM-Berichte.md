---
created: 2026-01-30
status: offen
tags: [validierung/offen, workshop/vorbereitung]
---

# H2: LLM-gestützte Berichterstellung

## User Story

> Als Wissensbilanz-Verantwortlicher will ich den narrativen Teil des Jahresberichts effizienter erstellen, weil das Formulieren repetitiv ist und viel Zeit kostet.

---

## Annahme

Forster schreibt regelmäßig Texte, die Kennzahlen interpretieren. Diese Texte folgen einem ähnlichen Muster und könnten teilweise automatisiert werden.

**Konfidenz:** mittel

---

## Validierungsfragen

1. "Beschreiben Sie, wie Sie einen Wissensbilanz-Bericht erstellen."
2. "Welcher Teil dauert am längsten?"
3. "Gibt es Textbausteine, die Sie wiederverwenden?"

---

## Implikation für das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| LLM-Berichtsgenerierung ist Kernfeature | LLM-Integration optional |
| Verschiedene Report-Templates anbieten | Nur Export (CSV/PNG) |
| Prompt-Vorlagen für verschiedene Zwecke | Keine Prompts nötig |

---

## Implementierte Templates

| Template | Länge | Verwendung |
|----------|-------|------------|
| Zusammenfassung | max. 150 Wörter | Schneller Überblick |
| Vergleich | max. 300 Wörter | Uni A vs. B |
| Trend-Fokus | max. 200 Wörter | Jahresveränderungen |
| Auffälligkeiten | max. 200 Wörter | Anomalie-Erkennung |

---

## Status nach Workshop

- [ ] Validiert
- [ ] Falsifiziert
- [ ] Modifiziert

**Notizen:** (nach Workshop ausfüllen)

---

*Verknüpft mit: [[03-Hypothesen/index]], [[UI-Prinzipien]] (R1-R6)*
