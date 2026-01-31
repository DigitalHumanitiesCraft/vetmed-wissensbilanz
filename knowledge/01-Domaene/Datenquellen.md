---
created: 2026-01-22
updated: 2026-01-30
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
| **Anzahl Dateien** | 78 Excel-Dateien |

---

## Dateikategorien

### Thematische Cluster

| Cluster | Dateien | Beschreibung |
|---------|---------|--------------|
| **Personal** | 12 | Köpfe, VZÄ, Verwendung, Altersverteilung |
| **Studierende** | 25 | Neuzugelassene, Ordentliche, Mobilität |
| **Studien** | 18 | Belegte Studien, Studienarten, ISCED |
| **Studienabschlüsse** | 8 | Abschlüsse, Toleranzzeit, Ausland |
| **Wissensbilanz-Kennzahlen** | 15 | Offizielle WB-Kennzahlen (1-A-x, 2-A-x, etc.) |

### Dateitypen

| Typ | Erkennung | Anzahl | Status |
|-----|-----------|--------|--------|
| **WB-Kennzahlen** | Prefix `X-Y-Z` | 15 | [x] konvertiert |
| **Detaildaten** | Deskriptiver Name | 63 | [ ] nicht konvertiert |
| **Dokumentation** | Underscore `_` | 4 | -- ignorieren |

Für Kennzahl-Details siehe [[Kennzahlen]].

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
      |
      v
scripts/convert_excel_to_json.py
      |
      v
docs/data/json/*.json
      |
      v
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

## Excel-Dateien nach Thema

### Personal (12 Dateien)

| Datei | Inhalt | Kombinierbar mit |
|-------|--------|------------------|
| `Personal an Universitäten - Kopfzahl.xlsx` | Gesamtpersonal Köpfe | VZÄ-Pendant |
| `Personal an Universitäten - VZÄ.xlsx` | Gesamtpersonal VZÄ | Köpfe-Pendant |
| `Stammpersonal an Universitäten - Kopfzahl.xlsx` | Stammpersonal Köpfe | VZÄ-Pendant |
| `Stammpersonal an Universitäten - VZÄ.xlsx` | Stammpersonal VZÄ | Köpfe-Pendant |
| `Personal nach Verwendung.xlsx` | Nach Verwendungskategorie | Funktionen |
| `Funktionen an Universitäten.xlsx` | Funktionsgruppen | Verwendung |
| `Altersverteilung nach Verwendung.xlsx` | Alter × Verwendung | Altersverteilung Prof |
| `Altersverteilung von ProfessorInnen nach Universitäten.xlsx` | Alter × Uni × Prof | 1-A-1 |
| `Lehrlinge nach Universitäten.xlsx` | Lehrlinge | - |

### Studierende (25 Dateien)

| Datei | Inhalt | Kombinierbar mit |
|-------|--------|------------------|
| `Ordentliche Studierende an Universitäten - Zeitreihe.xlsx` | Zeitreihe | Nach Universitäten |
| `Ordentliche Studierende nach Universitäten.xlsx` | Snapshot | Zeitreihe |
| `Ordentliche Studierende an Universitäten nach Altersklassen.xlsx` | Alter × Uni | Neuzugelassene Alter |
| `Ordentliche Studierende an Universitäten nach Form der allgemeinen Universitätsreife.xlsx` | Zugangsberechtigung | Neuzugelassene Zugang |
| `Inländische ordentliche Studierende nach regionaler Herkunft.xlsx` | Regional | Neuzugelassene Regional |
| `Studierende an Universitäten - Zeitreihe Wintersemester.xlsx` | Alle Studierende | Ordentliche |
| `Senioren-Studierende an Universitäten - Zeitreihe.xlsx` | Senioren | - |
| `Ordentliche Neuzugelassene...` (6 Varianten) | Neuzulassungen | Studierende |
| `Neuzugelassene an Universitäten - Zeitreihe` (3 Varianten) | Zeitreihen | - |

### Studien (18 Dateien)

| Datei | Inhalt | Kombinierbar mit |
|-------|--------|------------------|
| `Ordentliche Studien - Zeitreihe Wintersemester.xlsx` | Zeitreihe | Nach Unis |
| `Ordentliche Studien nach Universitäten.xlsx` | Snapshot | Zeitreihe |
| `Ordentliche Studien nach nationalen Gruppen.xlsx` | ISCED national | ISCED international |
| `Ordentliche Studien nach internationalen Gruppen.xlsx` | ISCED-F | National |
| `Ordentliche Studien nach Studienart.xlsx` | Bachelor/Master/Doktorat | - |
| `Ordentliche Studien im ersten Semester...` (8 Varianten) | Erstsemester | Studierende |
| `Liste aller belegten Studien...` (2 Varianten) | Detailliert | - |

### Studienabschlüsse (8 Dateien)

| Datei | Inhalt | Kombinierbar mit |
|-------|--------|------------------|
| `Studienabschlüsse an Universitäten - Zeitreihe.xlsx` | Zeitreihe | Nach Unis |
| `Studienabschlüsse nach Universitäten.xlsx` | Snapshot | Zeitreihe |
| `3-A-1 Außerordentliche Studienabschlüsse.xlsx` | Außerordentlich | Ordentlich |
| `3-A-2 Studienabschlüsse in Toleranzstudiendauer.xlsx` | In Toleranzzeit | 3-A-3 |
| `3-A-3 Studienabschlüsse mit Auslandsaufenthalt.xlsx` | Mit Ausland | 3-A-2 |

### Mobilität (6 Dateien)

| Datei | Inhalt | Kombinierbar mit |
|-------|--------|------------------|
| `Studierendenmobilität an Universitäten - Outgoing.xlsx` | Outgoing Zeitreihe | Incoming |
| `Studierendenmobilität nach Universitäten - Outgoing.xlsx` | Outgoing Snapshot | Incoming |
| `Studierendenmobilität nach Kontinenten - Outgoing.xlsx` | Nach Kontinent | - |
| `2-A-8 Ordentliche Studierende (outgoing).xlsx` | WB-Kennzahl | 2-A-9 |
| `2-A-9 Ordentliche Studierende (incoming).xlsx` | WB-Kennzahl | 2-A-8 |

---

## Sinnvolle Datenkombinationen (Extended Views)

### View 1: Personal-Überblick
Kombiniert Köpfe und VZÄ für Vergleich von Personalstand und -intensität.
- `1-A-1.json` (Köpfe)
- `1-A-1-VZA.json` (VZÄ)
- **Insight:** Durchschnittlicher Beschäftigungsgrad = VZÄ/Köpfe

### View 2: Gleichstellung
Gender-Perspektive auf Personal und Führungspositionen.
- `1-A-3.json` (Frauenquote Kollegialorgane)
- `1-A-4.json` (Gender Pay Gap)
- `1-A-5.json` (Frauen in Berufungsverfahren)
- **Insight:** Zusammenhang zwischen Berufungen und Pay Gap

### View 3: Studierendenfluß
Von Neuzulassung über Studium zu Abschluss.
- `2-A-5.json` (Studierende)
- `2-A-6.json` (Prüfungsaktive)
- `3-A-2.json` (Abschlüsse in Toleranzzeit)
- **Insight:** Studienerfolgsquote und Studienfortschritt

### View 4: Mobilität
Incoming vs. Outgoing Vergleich.
- `2-A-8.json` (Outgoing)
- `2-A-9.json` (Incoming)
- **Insight:** Netto-Mobilität pro Universität

### View 5: Betreuungsrelation
Verhältnis Professuren zu Studierenden.
- `2-A-1.json` (Professuren)
- `2-A-5.json` (Studierende)
- **Insight:** Betreuungsverhältnis = Studierende/Professuren

---

## Konvertierungsstatus

| Status | Kennzahlen | Details |
|--------|------------|---------|
| [x] Konvertiert | 19 | In `docs/data/json/` verfuegbar |
| [ ] Fehlend (WB) | 1 | 4-A-1 (keine Quelldatei) |
| [ ] Nicht konvertiert | 58 | Detaildaten (keine WB-Kennzahlen) |

### Datenqualität (Stand: 30.01.2026)

| Datei | Datenpunkte | Unis | Jahre | Status |
|-------|-------------|------|-------|--------|
| 1-A-1 bis 1-A-4 | 66 | 22 | 2022-2024 | OK |
| 1-A-5 | 3 | 1 | 2022-2024 | Nur UA (Uni Wien) |
| 2-A-x | 63-66 | 21-22 | 2021-2024 | OK |
| 3-A-1 | 3 | 1 | 2021-2023 | Nur UM (Donau-Uni) |
| 3-A-2 | 63 | 21 | 2021-2023 | OK |
| 3-A-3 | 63 | 21 | 2020-2022 | OK |

**Gesamt:** 1104 Datenpunkte, 3 Nullwerte

### Fehlende WB-Kennzahlen

| Code | Name | Grund |
|------|------|-------|
| 4-A-1 | Drittmittel | Keine Quelldatei vorhanden |

---

*Verknüpft mit: [[Excel-Struktur]], [[Kennzahlen]], [[Universitaeten]]*
