---
created: 2026-01-30
status: active
tags: [status/active, phase/destillation]
---

# H2: LLM-gestuetzte Berichterstellung

## User Story

> Als Wissensbilanz-Verantwortlicher will ich den narrativen Teil des Jahresberichts effizienter erstellen, weil das Formulieren repetitiv ist und viel Zeit kostet.

---

## Annahme

Der Fachverantwortliche schreibt regelmaessig Texte, die Kennzahlen interpretieren. Diese Texte folgen einem aehnlichen Muster und koennten teilweise automatisiert werden.

**Konfidenz:** mittel

---

## Implikation fuer das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| LLM-Berichtsgenerierung ist Kernfeature | LLM-Integration optional |
| Verschiedene Report-Templates anbieten | Nur Export (CSV/PNG) |
| Prompt-Vorlagen fuer verschiedene Zwecke | Keine Prompts noetig |

---

## Implementierte Templates

| Template | Laenge | Verwendung |
|----------|--------|------------|
| Zusammenfassung | max. 150 Woerter | Schneller Ueberblick |
| Vergleich | max. 300 Woerter | Uni A vs. B |
| Trend-Fokus | max. 200 Woerter | Jahresveraenderungen |
| Auffaelligkeiten | max. 200 Woerter | Anomalie-Erkennung |

---

*Verknuepft mit: [[03-Hypothesen/index]], [[UI-Prinzipien]] (R1-R6)*
