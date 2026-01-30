---
created: 2026-01-30
status: offen
tags: [validierung/offen, workshop/vorbereitung]
---

# H4: Plausibilitätsprüfung

## User Story

> Als Wissensbilanz-Verantwortlicher will ich Auffälligkeiten in den Daten schnell erkennen, um Fehler oder interessante Entwicklungen zu identifizieren.

---

## Annahme

Forster prüft Daten auf Plausibilität, bevor er sie weiterverwendet. Große Abweichungen könnten auf Fehler oder relevante Entwicklungen hinweisen.

**Konfidenz:** mittel

---

## Validierungsfragen

1. "Wie prüfen Sie, ob die Daten korrekt sind?"
2. "Gab es schon Fälle, wo Daten falsch waren?"
3. "Was würde Ihnen helfen, Auffälligkeiten schneller zu finden?"

---

## Implikation für das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| Anomalie-Erkennung einbauen | Nur Visualisierung |
| Alerts bei großen Abweichungen | Keine automatischen Hinweise |
| Trend-Analyse mit Ausreißer-Markierung | Einfache Liniendiagramme |

---

## Implementierte Features

- [x] Trend-Anzeige (% Veränderung zum Vorjahr)
- [x] Durchschnittslinie im Chart (V3)
- [ ] Automatische Ausreißer-Erkennung
- [ ] Alerts bei Schwellenwert-Überschreitung

---

## LLM-Template "Auffälligkeiten"

Das Template "Auffälligkeiten" adressiert diese Hypothese:

> Identifiziere auffällige Werte:
> 1. Werte, die mehr als 1,5 Standardabweichungen vom Durchschnitt entfernt sind
> 2. Unerwartete Sprünge zwischen Jahren
> 3. Universitäten mit untypischen Mustern

---

## Status nach Workshop

- [ ] Validiert
- [ ] Falsifiziert
- [ ] Modifiziert

**Notizen:** (nach Workshop ausfüllen)

---

*Verknüpft mit: [[03-Hypothesen/index]], [[UI-Prinzipien]] (V3, V4)*
