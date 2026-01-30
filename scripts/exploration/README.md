# Exploration Scripts

Skripte zur Exploration und Verifikation der Excel-Datenquellen.

## Übersicht

| Skript | Beschreibung |
|--------|--------------|
| `verify_university_codes.py` | Extrahiert und verifiziert Universitäts-Codes aus Excel |
| `analyze_excel_structure.py` | Analysiert Struktur aller Excel-Dateien |

## Verwendung

### Universitäts-Codes verifizieren

```bash
python scripts/exploration/verify_university_codes.py
```

Gibt eine Markdown-Tabelle mit allen verifizierten Codes aus und prüft Konsistenz über mehrere Dateien.

### Excel-Struktur analysieren

```bash
# Alle Dateien
python scripts/exploration/analyze_excel_structure.py

# Nur Wissensbilanz-Kennzahlen
python scripts/exploration/analyze_excel_structure.py --category wissensbilanz

# Nur UniData-Kennzahlen
python scripts/exploration/analyze_excel_structure.py --category unidata

# Einzelne Datei
python scripts/exploration/analyze_excel_structure.py --file "1-A-1 Personal - Köpfe.xlsx"
```

## Erkenntnisse

### Datei-Formate

Es gibt zwei verschiedene Excel-Formate:

1. **Standard-Format** (XLCubed OLAP)
   - Sheet-Name: `Tab`
   - Header-Bereich: Zeilen 0-20
   - Daten ab Zeile 20+

2. **Dokumentations-Format**
   - Sheet-Name: `Sheet1`
   - Enthält Definitionen und Metadaten
   - Dateien mit Underscore-Notation: `1-A-1_Personal_Koepfe.xlsx`

### Stichtage (aus Excel verifiziert)

| Stichtag | Verwendung |
|----------|------------|
| 31.12.YYYY | Personal (Wintersemester) |
| 28.02.YYYY | Studierende (endgültig) |
| 03.01.YYYY | Studierende (vorläufig) |
| 30.09.YYYY | Studienjahr-Daten |

---

*Stand: 2026-01-22*
