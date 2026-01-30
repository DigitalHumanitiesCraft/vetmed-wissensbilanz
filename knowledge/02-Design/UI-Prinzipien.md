---
created: 2026-01-30
status: active
aliases: [UI-Evidence, Design-Prinzipien]
tags: [status/active, phase/destillation]
---

# UI-Prinzipien

Evidenzbasierte Gestaltungsprinzipien für das Wissensbilanz-Dashboard.

---

## Theoretische Grundlagen

### Cognitive Load Theory (Sweller, 1988)

| Belastungstyp | Beschreibung | Designimplikation |
|---------------|--------------|-------------------|
| Intrinsisch | Inhärente Aufgabenkomplexität | Nicht reduzierbar |
| Extrinsisch | Durch Präsentation erzeugt | Minimieren |
| German | Förderliche Last | Maximieren |

**Faustregel:** Maximal 7 sichtbare Filteroptionen, 5-7 Zeitreihen pro Diagramm.

### Visual Information Seeking Mantra (Shneiderman, 1996)

> "Overview first, zoom and filter, then details on demand"

> [!warning] Kritische Einordnung
> Das Mantra ist kaum empirisch validiert (Craft & Cairns, 2005). Als Heuristik behandeln, nicht als Gesetz.

---

## Filter-Prinzipien (F1-F4)

### F1: Progressive Offenlegung

Basisfilter standardmäßig sichtbar, Expertenfilter auf Anfrage.

- **Sichtbar:** Universität, Zeit, Kennzahl
- **Versteckt:** Verwendungskategorien, ISCED

### F2: Filter-Persistenz

URL-Parameter kodieren Filter-Zustand für teilbare Analysen.

```
?unis=UI,UN,UO&k=1-A-1&von=2022&bis=2024
```

### F3: Kategorisierte Filtergruppen

| Gruppe | Filter |
|--------|--------|
| Institutionell | Universität, Typ, Bundesland |
| Temporal | Jahr, Semester |
| Inhaltlich | Kennzahl, Verwendung, Studienart |

### F4: Sofortiges Filterfeedback

> "127 Datenpunkte für 3 Universitäten über 3 Jahre"

Warnung vor leeren Ergebnismengen vor Filteranwendung.

---

## Visualisierungs-Prinzipien (V1-V6)

### V1: Semantische Farbkodierung

Konsistente Farben für Universitätstypen in allen Ansichten.

| Typ | Farbe | Hex |
|-----|-------|-----|
| Volluniversität | Blau | `#1a5490` |
| Technisch | Grün | `#28a745` |
| Medizinisch | Rot | `#dc3545` |
| Kunst | Violett | `#6f42c1` |
| Weiterbildung | Orange | `#fd7e14` |

Siehe auch: [[Farbpalette]]

### V2: Coordinated Views mit Brushing

Selektion in einer Ansicht hebt entsprechende Datenpunkte in allen anderen Ansichten hervor.

**Status:** Nicht implementiert (Backlog)

### V3: Referenzlinien

Optionale gestrichelte Linie für Durchschnitt.

```javascript
borderDash: [5, 5]
```

### V4: Kontextannotationen

Marker für relevante Events (COVID, Methodenänderungen).

**Status:** Nicht implementiert (erfordert Datenkuration)

### V5: Small Multiples

Bei mehr als 5 Universitäten Grid-Darstellung anbieten.

**Status:** Nicht implementiert (Backlog)

### V6: Moderate Hilfslinien

Horizontale Linien bei 25%, 50%, 75% der Y-Achse. Abschaltbar.

---

## LLM-Report-Prinzipien (R1-R6)

### R1: Explizite Quellenattribution

Jede Aussage mit nachvollziehbarer Datengrundlage.

> "Die VetMed verzeichnete einen Personalzuwachs von 5,6% (von 1.250 auf 1.320 Personen, Quelle: Kennzahl 1-A-1, 2022-2024)."

### R2: Confidence ≠ Correctness

Keine prominenten Confidence Scores (irreführend).

### R3: Template-basierte Strukturierung

| Template | Länge |
|----------|-------|
| Executive Summary | max. 150 Wörter |
| Detaillierte Analyse | max. 400 Wörter |
| Trend-Fokus | max. 200 Wörter |
| Vergleich | max. 300 Wörter |

### R4: Niedrige Temperature

`temperature: 0.3` für Konsistenz und Faktentreue.

### R5: Editierbare Zwischenergebnisse

Generierter Bericht in editierbarem Textfeld, nicht als finale Ausgabe.

### R6: Transparente Limitationen

Warnung bei komplexen Vergleichen (>5 Unis, >2 Kennzahlen).

---

## Implementierungsstatus

| Prinzip | Status | Aufwand |
|---------|--------|---------|
| F1-F4 | implementiert | - |
| V1, V3 | implementiert | - |
| V2 | offen | 8-16h |
| V4, V5, V6 | offen | Backlog |
| R1, R3, R5 | implementiert | - |
| R2, R4, R6 | implementiert | - |

---

## Referenzen

- Sweller (1988): Cognitive Load Theory
- Shneiderman (1996): Visual Information Seeking Mantra
- Tufte (1983): Data-Ink-Ratio
- Huang et al. (2024): TrustLLM

Vollständige Quellenangaben in der ursprünglichen [[UI-EVIDENCE.md]].

---

*Verknüpft mit: [[Farbpalette]], [[Accessibility]], [[Use Case Wissensbilanz]]*
