---
created: 2026-01-22
status: active
aliases: [Projektübersicht, Hauptdokument]
tags: [status/active, phase/implementation]
---

# Use Case: Wissensbilanz Dashboard

Promptotype im Rahmen von [[VetMedAI Promptotyping und KI-Kompetenzaufbau]].

---

## Übersicht

| Eigenschaft | Wert |
|-------------|------|
| **Fachverantwortlicher** | Michael Forster |
| **Status** | produktiv (MVP abgeschlossen) |
| **Repository** | [chpollin/vetmed-wissensbilanz](https://github.com/chpollin/vetmed-wissensbilanz) |
| **Demo** | [chpollin.github.io/vetmed-wissensbilanz](https://chpollin.github.io/vetmed-wissensbilanz) |
| **Rohdaten** | [unidata.gv.at](https://unidata.gv.at/Pages/auswertungen.aspx) |

---

## Projektbeschreibung

Dashboard und Berichtsgenerator zur Analyse von Wissensbilanz-Daten österreichischer Universitäten. Das System konvertiert Excel-Dateien in JSON, visualisiert sie interaktiv und generiert LLM-gestützte Analyseberichte.

**Zwei Hauptfunktionen:**
1. **Explorative Analyse** - Filterung, Zeitreihen, Vergleiche
2. **Berichterstellung** - LLM-generierte Texte aus Daten

---

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│  Excel (UniData)  →  Python-Konverter  →  JSON             │
│                                              ↓              │
│  Browser-Frontend  ←  Chart.js + Vanilla JS  ←  JSON       │
│        ↓                                                    │
│  LLM-API (Claude)  →  Generierter Bericht                  │
└─────────────────────────────────────────────────────────────┘
```

### Technologie-Stack

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| Preprocessing | Python 3.x, openpyxl | Excel-Parsing nicht im Browser möglich |
| Frontend | Vanilla JavaScript | Kein Build-Step, [[L006-Vanilla-JS-Lernbarkeit]] |
| Visualisierung | Chart.js 4.4.1 | Einfache API, CDN-Delivery |
| LLM-Integration | Claude API | Haiku für schnelle Reports |
| Deployment | GitHub Pages | Statisch, kostenlos |

---

## Datenmodell

| Dimension | Umfang |
|-----------|--------|
| Kennzahlen | 17 konvertiert (von 21 möglich) |
| Datenpunkte | ~1000 |
| Universitäten | 22 ([[Universitaeten]]) |
| Zeitraum | 2021-2024 |

Siehe: [[Datenquellen]], [[Kennzahlen]]

---

## Implementierte Features

### Filter (F1-F4)
- [x] Universitäts-Auswahl nach Typ gruppiert
- [x] Zeitraum-Slider
- [x] Kennzahl-Dropdown
- [x] Live-Datenpunktanzahl

### Visualisierung (V1-V6)
- [x] Zeitreihen-Chart mit Uni-Typ-Farben
- [x] Klickbare Legende
- [x] Durchschnittslinie (optional)
- [ ] Small Multiples (Backlog)

### Tabelle
- [x] Sortierbare Spalten
- [x] Pagination (25/50/100)
- [x] CSV-Export
- [x] Null-Value-Handling

### LLM-Reports (R1-R6)
- [x] 4 Templates (Zusammenfassung, Vergleich, Trend, Auffälligkeiten)
- [x] Quellenattribution
- [x] Editierbares Textfeld
- [x] API-Key im Browser

---

## Offene Punkte

- [ ] Hypothesen [[H1-Ad-hoc-Anfragen]] bis [[H4-Plausibilitaetspruefung]] validieren
- [ ] Pagination-Schwellenwerte bestaetigen
- [ ] Report-Templates anpassen
- [ ] Export-Funktionen (PNG)

---

## Verknüpfte Dokumente

- [[Glossar]] - Begriffserklärungen
- [[UI-Prinzipien]] - Designentscheidungen
- [[Datenquellen]] - Excel-Struktur
- [[04-Learnings/index]] - Gesammelte Erkenntnisse

---

*Version 2.1 | Stand: Januar 2026*
