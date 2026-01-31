---
created: 2026-01-30
status: active
tags: [status/active, phase/destillation]
---

# H4: Plausibilitaetspruefung

## User Story

> Als Wissensbilanz-Verantwortlicher will ich Auffaelligkeiten in den Daten schnell erkennen, um Fehler oder interessante Entwicklungen zu identifizieren.

---

## Annahme

Der Fachverantwortliche prueft Daten auf Plausibilitaet, bevor er sie weiterverwendet. Grosse Abweichungen koennten auf Fehler oder relevante Entwicklungen hinweisen.

**Konfidenz:** mittel

---

## Implikation fuer das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| Anomalie-Erkennung einbauen | Nur Visualisierung |
| Alerts bei grossen Abweichungen | Keine automatischen Hinweise |
| Trend-Analyse mit Ausreisser-Markierung | Einfache Liniendiagramme |

---

## Implementierte Features

- [x] Trend-Anzeige (% Veraenderung zum Vorjahr)
- [x] Durchschnittslinie im Chart (V3)
- [ ] Automatische Ausreisser-Erkennung
- [ ] Alerts bei Schwellenwert-Ueberschreitung

---

## LLM-Template "Auffaelligkeiten"

Das Template "Auffaelligkeiten" adressiert diese Hypothese:

> Identifiziere auffaellige Werte:
> 1. Werte, die mehr als 1,5 Standardabweichungen vom Durchschnitt entfernt sind
> 2. Unerwartete Spruenge zwischen Jahren
> 3. Universitaeten mit untypischen Mustern

---

*Verknuepft mit: [[03-Hypothesen/index]], [[UI-Prinzipien]] (V3, V4)*
