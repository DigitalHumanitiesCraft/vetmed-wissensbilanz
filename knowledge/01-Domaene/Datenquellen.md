---
created: 2026-01-22
status: validated
aliases: [inputdata, Excel-Daten]
tags: [status/validated, phase/preparation]
---

# Datenquellen

Dokumentation aller Excel-Datenquellen für das Wissensbilanz-Dashboard.

---

## Übersicht

| Eigenschaft | Wert |
|-------------|------|
| **Quelle** | [UniData Austria](https://unidata.gv.at/Pages/auswertungen.aspx) |
| **Datenlieferant** | Datenmeldungen der Universitäten auf Basis UHSBV |
| **Zeitraum** | 2005-2024 (variiert je nach Kennzahl) |
| **Aktuellster Stand** | Wintersemester 2024 (Stichtag: 31.12.2024) |
| **Format** | Excel (.xlsx) mit XLCubed OLAP-Formatierung |
| **Anzahl Dateien** | 79 Excel-Dateien |

---

## Dateikategorien

| Kategorie | Anzahl | Beschreibung |
|-----------|--------|--------------|
| **Wissensbilanz-Kennzahlen** | 26 | Mit Prefix (1-A-1, 2-A-3, etc.) |
| **UniData-Kennzahlen** | 53 | Detaildaten ohne Prefix |

Für Details siehe [[Kennzahlen]].

---

## Stichtage

| Datum | Verwendung |
|-------|------------|
| 31.12.YYYY | Personal (Wintersemester) |
| 28.02.YYYY | Studierende (endgültig) |
| 03.01.YYYY | Studierende (vorläufig) |
| 30.09.YYYY | Studienjahr-Daten |

---

## Datenqualität

### Null-Value-Handling

| Zustand | Bedeutung | Darstellung |
|---------|-----------|-------------|
| `not_applicable` | Strukturell nicht anwendbar | grau, kursiv |
| `no_data` | Keine Meldung erfolgt | grau, kursiv |
| `invalid_format` | Parser konnte nicht extrahieren | grau, kursiv |

**Beispiel:** Donau-Uni Krems (UM) bietet keine Doktoratsstudien an - daher `not_applicable` für 2-B-1.

### Bekannte Einschränkungen

- Rundungsdifferenzen bei Verteilungsschlüssel (§ 22 Abs. 2 UHSBV)
- TU Wien: vorläufige Zahlen seit WS 2019
- Seit 2023: neue Verwendung 88 (AssistenzprofessorIn KV)

---

## Verarbeitungspipeline

```
Excel (UniData)
      │
      ▼
scripts/convert_excel_to_json.py
      │
      ▼
docs/data/json/*.json
      │
      ▼
Dashboard (dataLoader.js)
```

### Konvertierungsskript

```bash
python scripts/convert_excel_to_json.py
python scripts/convert_excel_to_json.py --file "1-A-1 Personal - Köpfe.xlsx"
python scripts/convert_excel_to_json.py --analyze
```

---

## JSON-Format

```json
{
  "uniCode": "UI",
  "year": 2024,
  "value": 1320.0,
  "kennzahl": "1-A-1"
}
```

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| uniCode | string | 2-Buchstaben-Code ([[Universitaeten]]) |
| year | number | Kalenderjahr |
| value | number/null | Messwert |
| kennzahl | string | Kennzahl-Code |

---

*Verknüpft mit: [[Excel-Struktur]], [[Kennzahlen]], [[Universitaeten]]*
