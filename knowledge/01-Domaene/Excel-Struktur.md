---
created: 2026-01-22
status: validated
aliases: [XLCubed, OLAP-Format]
tags: [status/validated, phase/exploration]
---

# Excel-Struktur

Alle Wissensbilanz-Dateien verwenden XLCubed OLAP-Formatierung.

---

## Dateiaufbau

```
┌─────────────────────────────────────────────────────────────┐
│  Zeilen 1-10: HEADER-BEREICH                                │
│  - Titel und Untertitel                                     │
│  - Quellenangabe (bmfwf)                                    │
│  - Filtereinstellungen (Slicer)                             │
├─────────────────────────────────────────────────────────────┤
│  Zeilen 11-20: ZWISCHEN-BEREICH                             │
│  - Zusätzliche Filter                                       │
│  - Legende                                                  │
├─────────────────────────────────────────────────────────────┤
│  Zeile ~21: SPALTENÜBERSCHRIFTEN                            │
│  - Universität | Codex | Langtext | Kategorie | Jahre...    │
├─────────────────────────────────────────────────────────────┤
│  Zeilen 22+: DATENBEREICH                                   │
│  - Eine Zeile pro Universität/Kategorie                     │
│  - Hierarchisch eingerückt                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Typische Spaltenstruktur

| Spalte | Index | Inhalt |
|--------|-------|--------|
| A | 0 | Universität (oder leer bei Unterkategorien) |
| B | 1 | Universität (Codex) - **2-Buchstaben-Code** |
| C | 2 | Universität (Langtext) |
| D | 3 | Verwendung/Studienart/etc. |
| E+ | 4+ | Messwerte (Frauen, Männer, Gesamt, Anteile) |

---

## Header-Zeile erkennen

Die Header-Zeile enthält typischerweise:
- `Wintersemester YYYY (Stichtag: DD.MM.YYYY)`
- `Studienjahr YYYY/YY`
- `WS2024`

**Python-Logik:**
```python
def extract_year_from_header(header_text):
    # WS2024 Format
    match = re.search(r'WS(\d{4})', str(header_text))
    if match:
        return int(match.group(1))

    # Wintersemester 2024 Format
    match = re.search(r'Wintersemester\s*(\d{4})', str(header_text))
    if match:
        return int(match.group(1))
```

---

## Sheets

| Sheet | Inhalt |
|-------|--------|
| **Tab** | Hauptdaten (formatierte Pivot-Tabelle) |
| Tabelle2 | Rohdaten (unformatiert) |
| XLCubedFormats | Formatierungsinformationen (ignorieren) |

> [!tip] Parsing-Strategie
> Immer zuerst Sheet "Tab" versuchen, dann auf erstes Sheet zurückfallen.

---

## Zwei Excel-Formate

| Format | Erkennung | Beispiel |
|--------|-----------|----------|
| Standard (XLCubed) | Sheet "Tab" vorhanden | `1-A-1 Personal - Köpfe.xlsx` |
| Dokumentation | Sheet "Sheet1" | `1-A-1_Personal_Koepfe.xlsx` |

Dateien mit Underscore-Notation sind Dokumentationsformat und enthalten Definitionen statt Daten.

---

## Hierarchische Einrückung

Die Daten sind hierarchisch strukturiert:

```
Universität Wien
   Wissenschaftliches Personal
      Professorinnen und Professoren
      Äquivalente zu ProfessorInnen
   Allgemeines Personal
      ...
Universität Graz
   ...
```

**Parsing:** Nur Zeilen mit gültigem Uni-Code (Spalte B) extrahieren.

---

*Verknüpft mit: [[Datenquellen]], [[L003-Verifikations-Skripte]]*
