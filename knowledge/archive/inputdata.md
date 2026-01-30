# Input Data - Wissensbilanz Dashboard

Dokumentation aller Excel-Datenquellen für das Wissensbilanz-Dashboard.

---

## Datenquellen

| Eigenschaft | Wert |
|-------------|------|
| **Quelle** | [UniData Austria](https://unidata.gv.at/Pages/auswertungen.aspx) |
| **Datenlieferant** | Datenmeldungen der Universitäten auf Basis UHSBV |
| **Datenprüfung** | bmfwf, Abt. I/2 |
| **Datenaufbereitung** | bmfwf, Abt. I/10 |
| **Zeitraum** | 2005 - 2024 (variiert je nach Kennzahl) |
| **Aktuellster Stand** | Wintersemester 2024 (Stichtag: 31.12.2024) |
| **Format** | Excel (.xlsx) mit XLCubed OLAP-Formatierung |
| **Anzahl Dateien** | 79 Excel-Dateien |

---

## Dateikategorien

### Übersicht

| Kategorie | Anzahl | Beschreibung |
|-----------|--------|--------------|
| **Wissensbilanz-Kennzahlen** | 26 | Offizielle WB-Kennzahlen mit Prefix (1-A-1, 2-A-3, etc.) |
| **UniData-Kennzahlen** | 53 | Detaildaten ohne Prefix |

---

## Wissensbilanz-Kennzahlen (26 Dateien)

Offizielle Kennzahlen gemäß Wissensbilanz-Verordnung mit standardisiertem Nummerierungsschema.

### Nummerierungsschema

```
[Bereich]-[Kategorie]-[Nummer]
    │         │          │
    │         │          └── Laufende Nummer
    │         └──────────── A = Pflicht, B = Optional
    └────────────────────── 1 = Personal, 2 = Studium, 3 = Abschlüsse, 4 = Finanzen
```

### Bereich 1: Personal & Gleichstellung

| Kennzahl | Datei | Dimensionen | Jahre |
|----------|-------|-------------|-------|
| **1-A-1** | Personal - Köpfe.xlsx | Universität, Verwendung, Geschlecht | 2022-2024 |
| **1-A-1** | Personal - VZÄ.xlsx | Universität, Verwendung, Geschlecht | 2022-2024 |
| **1-A-2** | Berufungen an die Universität.xlsx | Universität, Berufungsart | - |
| **1-A-3** | Frauenquote in Kollegialorganen.xlsx | Universität, Organ | - |
| **1-A-4** | Gender pay gap.xlsx | Universität, Verwendung | - |
| **1-A-5** | Repräsentanz von Frauen in Berufungsverfahren.xlsx | Universität, Verfahrensphase | - |

### Bereich 2: Studium & Lehre

| Kennzahl | Datei | Dimensionen | Jahre |
|----------|-------|-------------|-------|
| **2-A-1** | ProfessorInnen und Äquivalente.xlsx | Universität, ISCED | - |
| **2-A-2** | Eingerichtete Studien.xlsx | Universität, Studienart | - |
| **2-A-3** | Studienabschlussquote.xlsx | Universität, Studienart | 2021-2023 |
| **2-A-4** | Besondere Zulassungsbedingungen.xlsx | Universität, ISCED | - |
| **2-A-5** | Anzahl Studierenden.xlsx | Universität, Geschlecht, Staatsgruppe | 2022-2024 |
| **2-A-6** | Anzahl Prüfungsaktive.xlsx | Universität, Studienart, ISCED | 2021-2023 |
| **2-A-7** | Anzahl belegte ordentliche Studien.xlsx | Universität, ISCED, Studienart | 2022-2024 |
| **2-A-7** | Anzahl belegte Universitätslehrgänge.xlsx | Universität, ISCED, Geschlecht | 2023-2024 |
| **2-A-8** | Ordentliche Studierende (outgoing).xlsx | Universität, Geschlecht | 2021-2023 |
| **2-A-9** | Ordentliche Studierende (incoming).xlsx | Universität, Mobilität, Geschlecht | 2022-2024 |
| **2-B-1** | Doktoratsstudierende mit BV zur Universität.xlsx | Universität | - |

### Bereich 3: Studienabschlüsse

| Kennzahl | Datei | Dimensionen | Jahre |
|----------|-------|-------------|-------|
| **3-A-1** | Ordentliche Studienabschlüsse.xlsx | Universität, Studienart, ISCED | 2022-2024 |
| **3-A-1** | Außerordentliche Studienabschlüsse.xlsx | Universität, ISCED, Geschlecht | 2022-2024 |
| **3-A-2** | Studienabschlüsse in der Toleranzstudiendauer.xlsx | Universität, Studienart, ISCED | 2021-2023 |
| **3-A-3** | Studienabschlüsse mit studienbez. Auslandsaufenthalt.xlsx | Universität | 2021-2022 |

### Bereich 4: Finanzen

| Kennzahl | Datei | Dimensionen | Jahre |
|----------|-------|-------------|-------|
| **4-A-1** | Drittmittel.xlsx | Universität | - |

---

## UniData-Kennzahlen (53 Dateien)

Detailliertere Auswertungen nach verschiedenen Dimensionen.

### Thema: Personal (12 Dateien)

| Datei | Inhalt | Dimensionen | Jahre |
|-------|--------|-------------|-------|
| Personal an Universitäten - Kopfzahl.xlsx | Köpfe gesamt | Semester, Verwendung, Geschlecht | 2005-2024 |
| Personal an Universitäten - VZÄ.xlsx | Vollzeitäquivalente | Semester, Verwendung, Geschlecht | 2005-2024 |
| Stammpersonal an Universitäten - Kopfzahl.xlsx | Nur Stammpersonal | Semester, Universität, Geschlecht | 2019-2024 |
| Stammpersonal an Universitäten - VZÄ.xlsx | Nur Stammpersonal VZÄ | Semester, Universität, Geschlecht | 2019-2024 |
| Personal nach Verwendung.xlsx | Nach Verwendungskategorie | Semester, Verwendung, Geschlecht | - |
| Funktionen an Universitäten.xlsx | Leitungsfunktionen | Semester, Funktion, Geschlecht | 2019-2024 |
| Altersverteilung nach Verwendung.xlsx | Altersstruktur | Semester, Verwendung, Altersklasse | 2019-2024 |
| Altersverteilung von ProfessorInnen.xlsx | Professoren-Alter | Semester, Universität, Altersklasse | 2019-2024 |
| Lehrlinge nach Universitäten.xlsx | Lehrlingsstatistik | Semester, Universität, Geschlecht | 2019-2024 |

### Thema: Studierende (15 Dateien)

| Datei | Inhalt | Dimensionen | Jahre |
|-------|--------|-------------|-------|
| Ordentliche Studierende nach Universitäten.xlsx | Studierende je Uni | Semester, Universität, Geschlecht | 2024 |
| Ordentliche Studierende - Zeitreihe Wintersemester.xlsx | Zeitreihe | Semester, Universität, Geschlecht | 2022-2024 |
| Ordentliche Studierende nach Altersklassen.xlsx | Altersstruktur | Semester, Altersklasse, Geschlecht | 2024 |
| Ordentliche Studierende nach Universitätsreife.xlsx | Zugangsqualifikation | Semester, Reifetyp, Geschlecht | 2024 |
| Inländische ordentliche Studierende nach Herkunft.xlsx | Regionale Herkunft | Semester, Bundesland, Geschlecht | 2024 |
| Studierende an Universitäten - Zeitreihe.xlsx | Alle Studierenden | Semester, Universität | - |
| Senioren-Studierende - Zeitreihe.xlsx | Über 60 Jahre | Semester, Universität | - |

### Thema: Neuzugelassene (8 Dateien)

| Datei | Inhalt | Dimensionen | Jahre |
|-------|--------|-------------|-------|
| Ordentliche Neuzugelassene nach Universitäten.xlsx | Erstzulassungen | Semester, Universität, Geschlecht | 2024 |
| Ordentliche Neuzugelassene - Zeitreihe.xlsx | Zeitreihe | Semester, Universität | 2022-2024 |
| Ordentliche Neuzugelassene nach Altersklassen.xlsx | Altersstruktur | Semester, Altersklasse, Geschlecht | - |
| Ordentliche Neuzugelassene nach Universitätsreife.xlsx | Zugangsqualifikation | Semester, Reifetyp, Geschlecht | 2024 |
| Inländische Neuzugelassene nach Herkunft.xlsx | Regionale Herkunft | Semester, Bundesland | 2024 |
| Neuzugelassene an Universitäten - Zeitreihe.xlsx | Alle Neuzugelassenen | Semester, Universität | 2022-2024 |

### Thema: Studien (18 Dateien)

| Datei | Inhalt | Dimensionen | Jahre |
|-------|--------|-------------|-------|
| Ordentliche Studien nach Universitäten.xlsx | Belegte Studien | Semester, Universität, Geschlecht | - |
| Ordentliche Studien - Zeitreihe.xlsx | Zeitreihe | Semester, Universität | 2022-2024 |
| Ordentliche Studien nach Studienart.xlsx | Bachelor/Master/Dr | Semester, Studienart, Geschlecht | - |
| Ordentliche Studien nach nationalen Gruppen.xlsx | Österr. Klassifikation | Semester, Studiengruppe | - |
| Ordentliche Studien nach internationalen Gruppen.xlsx | ISCED-Klassifikation | Semester, ISCED-F | - |
| Ordentliche Studien im ersten Semester.xlsx | Erstsemester-Studien | Studienjahr, diverse | 2024 |
| Ordentliche Studien nach Universitätsreife.xlsx | Zugangsqualifikation | Semester, Reifetyp | 2024 |
| Liste aller belegten Studien.xlsx | Detailliste | Universität, Studium | 2024 |

### Thema: Studienabschlüsse (8 Dateien)

| Datei | Inhalt | Dimensionen | Jahre |
|-------|--------|-------------|-------|
| Studienabschlüsse nach Universitäten.xlsx | Abschlüsse je Uni | Studienjahr, Universität, Geschlecht | 2023/24 |
| Studienabschlüsse - Zeitreihe Studienjahr.xlsx | Zeitreihe | Studienjahr, Universität | - |

### Thema: Mobilität (3 Dateien)

| Datei | Inhalt | Dimensionen | Jahre |
|-------|--------|-------------|-------|
| Studierendenmobilität nach Universitäten - Outgoing.xlsx | Ausgehende | Studienjahr, Universität, Geschlecht | 2024/25 |
| Studierendenmobilität - Outgoing - Zeitreihe.xlsx | Zeitreihe | Studienjahr, Universität | - |
| Studierendenmobilität nach Kontinenten - Outgoing.xlsx | Nach Zielregion | Studienjahr, Kontinent | - |

### Sonstige (3 Dateien)

| Datei | Inhalt | Dimensionen |
|-------|--------|-------------|
| Nutzfläche nach Universitäten.xlsx | Gebäudeflächen | Universität, Flächenart |

---

## Gemeinsame Dimensionen

### Universitäten (22 öffentliche Universitäten)

**Verifiziert aus:** `1-A-1 Personal - Köpfe.xlsx`, Zeilen 21-395

| Code | Kurztext | Langtext | Typ | Bundesland |
|------|----------|----------|-----|------------|
| UA | Universität Wien | Universität Wien | Volluniversität | Wien |
| UB | Universität Graz | Universität Graz | Volluniversität | Steiermark |
| UC | Universität Innsbruck | Universität Innsbruck | Volluniversität | Tirol |
| UD | Universität Salzburg | Universität Salzburg | Volluniversität | Salzburg |
| UE | Technische Universität Wien | Techn.Universität Wien | Technisch | Wien |
| UF | Technische Universität Graz | Techn.Universität Graz | Technisch | Steiermark |
| UG | Montanuniversität Leoben | Montanuniversität Leoben | Technisch | Steiermark |
| UH | Universität für Bodenkultur Wien | Univ.f.Bodenkultur Wien | Technisch | Wien |
| UI | Veterinärmedizinische Universität Wien | Veterinärmed.Univ.Wien | Medizinisch | Wien |
| UJ | Wirtschaftsuniversität Wien | Wirtschaftsuniv.Wien | Volluniversität | Wien |
| UK | Universität Linz | Universität Linz | Volluniversität | Oberösterreich |
| UL | Universität Klagenfurt | Universität Klagenfurt | Volluniversität | Kärnten |
| UM | Universität für Weiterbildung Krems | Univ.f.Weiterbild.Krems | Weiterbildung | Niederösterreich |
| UN | Medizinische Universität Wien | Medizinische Univ.Wien | Medizinisch | Wien |
| UO | Medizinische Universität Graz | Medizinische Univ.Graz | Medizinisch | Steiermark |
| UQ | Medizinische Universität Innsbruck | Medizin.Univ.Innsbruck | Medizinisch | Tirol |
| UR | Akademie der bildenden Künste Wien | Akad.d.bild.Künste Wien | Kunst | Wien |
| US | Universität für angewandte Kunst Wien | Univ.f.angew.Kunst Wien | Kunst | Wien |
| UT | Universität für Musik und darstellende Kunst Wien | Univ.f.Mus.u.darst.K.Wien | Kunst | Wien |
| UU | Universität Mozarteum Salzburg | Univ.Mozarteum Salzburg | Kunst | Salzburg |
| UV | Universität für Musik und darstellende Kunst Graz | Univ.f.Mus.u.darst.K.Graz | Kunst | Steiermark |
| UW | Universität für künstlerische und industrielle Gestaltung Linz | Univ.künst.u.i.Gest.Linz | Kunst | Oberösterreich |

### Universitäts-Typen

| Typ | Farbcode | Universitäten |
|-----|----------|---------------|
| Volluniversität | #1a5490 | Wien, Graz, Innsbruck, Salzburg, WU, Linz, Klagenfurt |
| Technisch | #28a745 | TU Wien, TU Graz, Montanuniv., BOKU |
| Medizinisch | #dc3545 | Med Uni Wien, Med Uni Graz, Med Uni Innsbruck, VetMed |
| Kunst | #6f42c1 | Angewandte, MDW Wien, Mozarteum, KUG, Kunstuni Linz, Akademie |
| Weiterbildung | #fd7e14 | Donau-Uni Krems |

### Geschlecht

| Wert | Beschreibung |
|------|--------------|
| Frauen | Weiblich |
| Männer | Männlich |
| Gesamt | Summe |

### Semester und Datenstichtag

| Format | Beispiel | Beschreibung |
|--------|----------|--------------|
| Wintersemester YYYY (Stichtag: DD.MM.YYYY) | Wintersemester 2024 (Stichtag: 31.12.2024) | Standard-Format |
| Studienjahr YYYY/YY (endgültig) | Studienjahr 2023/24 (endgültig) | Für Abschlüsse |

### Verwendungskategorien WBV (Personal)

| Code | Kategorie |
|------|-----------|
| 11-18 | Wissenschaftliches und künstlerisches Personal |
| 11 | Professorinnen und Professoren |
| 12 | Äquivalente zu ProfessorInnen |
| 14 | Dozentinnen und Dozenten |
| 16 | Assoziierte ProfessorInnen (KV) |
| 17 | AssistenzprofessorInnen (KV) |
| 21-28 | Wissenschaftliche/künstlerische MitarbeiterInnen |
| 30-70 | Allgemeines Personal |

### Studienarten

| Wert | Beschreibung |
|------|--------------|
| Bachelorstudium | 6 Semester |
| Masterstudium | 4 Semester |
| Diplomstudium | 8-12 Semester |
| Doktoratsstudium | 6 Semester |
| Universitätslehrgang | Weiterbildung |

### ISCED-Klassifikation

Internationale Standard-Klassifikation für Bildungsbereiche (ISCED-F 2013).

---

## Excel-Dateistruktur

### XLCubed OLAP Format

Alle Dateien verwenden XLCubed-Formatierung mit:

1. **Header-Bereich** (Zeilen 0-15):
   - Titel und Untertitel
   - Quellenangabe und Datenprüfung
   - Filtereinstellungen (Slicer)

2. **Datenbereich** (ab Zeile 15-20):
   - Spaltenüberschriften (mehrzeilig)
   - Datenzeilen mit Universitäten/Kategorien
   - Subtotals und Gesamt

3. **Format-Sheet** (XLCubedFormats):
   - Formatierungsinformationen
   - Nicht für Datenextraktion relevant

### Typische Spaltenstruktur

```
Spalte 0: Universität (oder leer bei Unterkategorien)
Spalte 1: Universität (Codex) oder Kategorie
Spalte 2: Universität (Langtext) oder Kategorie
Spalte 3: Verwendung/Studienart/etc.
Spalte 4+: Messwerte (Frauen, Männer, Gesamt, Anteile)
```

---

## Datenqualität

### Null-Value-Handling

| Zustand | Bedeutung | Beispiel |
|---------|-----------|----------|
| `not_applicable` | Strukturell nicht anwendbar | Krems hat kein Doktorat |
| `no_data` | Keine Meldung erfolgt | Fehlende Datenlieferung |
| `invalid_format` | Parser konnte nicht extrahieren | Formatierungsfehler |

### Bekannte Einschränkungen

- Rundungsdifferenzen bei Verteilungsschlüssel (§ 22 Abs. 2 UHSBV)
- Änderungen in Erhebungsmethoden beeinträchtigen Zeitvergleiche
- TU Wien: vorläufige Zahlen seit WS 2019
- Seit 2023: neue Verwendung 88 (AssistenzprofessorIn KV)

---

## Beziehungen zwischen Dateien

### Kopfzahl vs. VZÄ

| Kopfzahl-Datei | VZÄ-Datei | Beschreibung |
|----------------|-----------|--------------|
| Personal an Universitäten - Kopfzahl.xlsx | Personal an Universitäten - VZÄ.xlsx | Gleiche Struktur, andere Maßeinheit |
| 1-A-1 Personal - Köpfe.xlsx | 1-A-1 Personal - VZÄ.xlsx | Wissensbilanz-Version |
| Stammpersonal - Kopfzahl.xlsx | Stammpersonal - VZÄ.xlsx | Nur Stammpersonal |

### Zeitreihe vs. Querschnitt

| Zeitreihe | Querschnitt | Zeitraum |
|-----------|-------------|----------|
| Ordentliche Studierende - Zeitreihe.xlsx | Ordentliche Studierende nach Universitäten.xlsx | Mehrere Jahre vs. aktuelles Semester |
| Studienabschlüsse - Zeitreihe.xlsx | Studienabschlüsse nach Universitäten.xlsx | Mehrere Jahre vs. aktuelles Studienjahr |

### Duplikate (gleiche Daten, verschiedene Formate)

Einige Dateien existieren in mehreren Versionen:
- `Datei.xlsx` und `Datei (1).xlsx` - identisch oder leicht unterschiedlich
- Wissensbilanz-Format vs. UniData-Format

---

*Stand: 22. Januar 2026*
