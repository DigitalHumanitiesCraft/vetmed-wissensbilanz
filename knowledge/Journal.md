# Journal - Wissensbilanz Dashboard

Arbeitstagebuch für das Projekt vetmed-wissensbilanz.

---

## 2026-01-22

### Projektstart: Datenanalyse

**Ziel:** Alle Excel-Daten vollständig verstehen und in einer `inputdata.md` dokumentieren.

**Entscheidung:** Bevor wir mit der Implementierung beginnen, analysieren wir systematisch alle Datenquellen:
- Alle Spalten verstehen
- Inhalte genau verstehen
- Beziehungen zwischen Daten herstellen

**Bestandsaufnahme:**
- 75 Excel-Dateien im `/data` Ordner identifiziert
- Zwei Hauptkategorien erkennbar:
  1. **UniData-Kennzahlen** (z.B. "Personal an Universitäten", "Studierende")
  2. **Wissensbilanz-Kennzahlen** (mit Prefix "1-A-1", "2-A-3" etc.)

**Geplantes Vorgehen:**
1. Phase 1: Kategorisierung aller Dateien
2. Phase 2: Strukturanalyse (Spalten, Header, Dimensionen)
3. Phase 3: Beziehungen identifizieren
4. Phase 4: `inputdata.md` erstellen

**Nächster Schritt:** Repräsentative Excel-Dateien öffnen und Struktur analysieren.

---

### Datenanalyse abgeschlossen

**Durchgeführte Analysen:**

1. **Bestandsaufnahme korrigiert:** 79 Excel-Dateien (nicht 75)
   - 26 Wissensbilanz-Kennzahlen (mit Prefix wie 1-A-1, 2-A-3)
   - 53 UniData-Kennzahlen (ohne Prefix)

2. **Thematische Gruppierung identifiziert:**
   - Personal & Gleichstellung (16 Dateien)
   - Studierende (18 Dateien)
   - Studien (26 Dateien)
   - Studienabschlüsse (8 Dateien)
   - Mobilität (3 Dateien)
   - Sonstige (8 Dateien)

3. **Excel-Struktur verstanden:**
   - XLCubed OLAP-Format mit Multi-Level-Headers
   - Header-Bereich: Zeilen 0-15 (Titel, Quelle, Filter)
   - Datenbereich: ab Zeile 15-20
   - Separater XLCubedFormats-Sheet (nicht relevant für Daten)

4. **Gemeinsame Dimensionen dokumentiert:**
   - 22 österreichische öffentliche Universitäten (mit Codes UA-UW)
   - 5 Universitäts-Typen (Voll, Technisch, Medizinisch, Kunst, Weiterbildung)
   - Geschlecht (Frauen, Männer, Gesamt)
   - Semester-Format (Wintersemester YYYY mit Stichtag)
   - Verwendungskategorien WBV (Codes 11-70)
   - Studienarten und ISCED-Klassifikation

5. **Beziehungen zwischen Dateien:**
   - Kopfzahl vs. VZÄ (gleiche Struktur, andere Maßeinheit)
   - Zeitreihe vs. Querschnitt
   - Duplikate mit (1) Suffix

**Ergebnis:** `inputdata.md` erstellt mit vollständiger Dokumentation.

**Offene Fragen für nächste Schritte:**
- Welche Kennzahlen sind für VetMed besonders relevant?
- Welche Vergleiche (mit anderen Unis) sollen möglich sein?
- Welche Zeiträume sind wichtig?

---

### Qualitätssicherung durch Iteration

**Kontext:** Es existiert eine `data.md` aus einer früheren Promptotyping-Iteration (DHCraft/VedMedAI-2). Diese wurde zum Vergleich herangezogen.

**Methode:** Synthese aus zwei unabhängigen Analysen
1. **Iteration 1 (früher):** data.md aus VedMedAI-2 Projekt
2. **Iteration 2 (jetzt):** Neue Analyse direkt aus Excel-Dateien

**Erkenntnisse aus dem Vergleich:**

1. **Universitäts-Codes: Kritischer Fehler in Iteration 1**
   - Die data.md aus Iteration 1 hatte **falsche Code-Zuordnungen**
   - Beispiel: `UV` war dort VetMed, aber in den Excel-Daten ist `UI` = VetMed
   - **Ursache:** Vermutlich aus einer anderen/älteren Quelle übernommen
   - **Lösung:** Codes direkt aus `1-A-1 Personal - Köpfe.xlsx` verifiziert

2. **Verifizierte korrekte Codes (aus Excel):**
   ```
   UI = Veterinärmedizinische Universität Wien (NICHT UV!)
   UM = Universität für Weiterbildung Krems (NICHT UR!)
   UR = Akademie der bildenden Künste Wien
   ```

3. **Zusätzliche Dateien gefunden:**
   - 5 neue Dateien mit Underscore-Notation (z.B. `1-A-1_Personal_Koepfe.xlsx`)
   - Diese waren in Iteration 1 nicht dokumentiert

**Entscheidung:**
- `inputdata.md` enthält nur **verifizierte Daten** direkt aus Excel
- Jede kritische Information mit Quellenangabe versehen
- Beispiel: "Verifiziert aus: `1-A-1 Personal - Köpfe.xlsx`, Zeilen 21-395"

**Reflexion zur Methode:**
Die iterative Synthese erhöht die Qualität, weil:
- Fehler aus einer Iteration werden durch die andere aufgedeckt
- Diskrepanzen zwingen zur Verifikation an der Primärquelle (Excel)
- Unterschiedliche Perspektiven führen zu vollständigerer Dokumentation

**Lesson Learned:**
Bei kritischen Daten (wie Codes) immer direkt aus der Primärquelle verifizieren, nicht aus Sekundärdokumentation übernehmen.

---

### Exploration-Skripte erstellt

**Entscheidung:** Verifikationen sollen reproduzierbar und dokumentiert sein.

**Erstellte Struktur:**
```
scripts/
└── exploration/
    ├── README.md
    ├── verify_university_codes.py
    └── analyze_excel_structure.py
```

**Neue Erkenntnisse aus Skript-Analyse:**

1. **Zwei Excel-Formate identifiziert:**
   - **Standard-Format** (XLCubed OLAP): Sheet "Tab", Header Zeile 11-24
   - **Dokumentations-Format**: Sheet "Sheet1", enthält Definitionen
   - Dateien mit Underscore-Notation (`1-A-1_Personal_Koepfe.xlsx`) sind Dokumentations-Format

2. **Verifizierte Stichtage:**
   - `31.12.YYYY` - Personal (Wintersemester)
   - `28.02.YYYY` - Studierende (endgültig)
   - `03.01.YYYY` - Studierende (vorläufig)
   - `30.09.YYYY` - Studienjahr-Daten

3. **Header-Row-Positionen variieren:**
   - Wissensbilanz-Dateien: Zeile 11-24 (je nach Datei)
   - Muss pro Datei individuell ermittelt werden

**Dokumentation erstellt:**
- `Promptotyping-Learnings.md` - Gesammelte Learnings
- `scripts/exploration/README.md` - Skript-Dokumentation

---

## 2026-01-30

### Dokumentationsstruktur für Lernzwecke überarbeitet

**Kontext:** Das Repository soll nicht nur ein Softwareprojekt sein, sondern ein **Lehrbeispiel für Promptotyping**. Michael Forster soll am Entstehungsprozess lernen, wie man mit KI-Unterstützung Prototypen entwickelt.

**Erkenntnis:** Die bisherige Dokumentation war für Entwickler geschrieben, nicht für jemanden, der den Prozess lernen will. Es fehlte:
- Ein Einstiegspunkt (README.md im Root)
- Begriffserklärungen für Nicht-Techniker
- Explizite Hypothesen für den Workshop

**Neue Dokumente erstellt:**

1. **[README.md](../README.md)** - Einstiegspunkt für Forster
   - Erklärt Projektzweck
   - Definiert Lesereihenfolge
   - Verlinkt alle relevanten Dokumente

2. **[GLOSSAR.md](GLOSSAR.md)** - KI-Begriffe erklärt
   - Prompt, Token, Context Window
   - Halluzination, Temperature
   - Agentic Coding, Promptotyping
   - Technische Begriffe (API, JSON, GitHub Pages)

3. **[HYPOTHESES.md](HYPOTHESES.md)** - Synthetische User Stories
   - 4 Hypothesen (H1-H4) mit Validierungsfragen
   - Workshop-Fragestrategie
   - Kompetenzorientierte Erfolgskriterien

4. **[docs/index.html](../docs/index.html)** - Platzhalter für Dashboard
   - Zeigt Status "In Entwicklung"
   - Verlinkt auf Repository und Dokumentation
   - Bereit für GitHub Pages Deployment

**Entscheidung:** Die Dokumentation folgt dem Prinzip "Zeige den Prozess, nicht nur das Ergebnis". Jedes Dokument hat einen klaren Zweck im Lernpfad.

**Lesson Learned:**
Bei Projekten mit Schulungszweck ist die Dokumentationsstruktur selbst Teil des Produkts. Die Frage ist nicht "Was muss dokumentiert werden?", sondern "Wie lernt der Leser am besten?"

→ Siehe auch: [Promptotyping-Learnings.md](Promptotyping-Learnings.md)

---

### Dashboard-Implementierung gestartet (Phase 0-2)

**Kontext:** Nach Erstellung des Implementierungsplans basierend auf [UI-EVIDENCE.md](UI-EVIDENCE.md) wurde mit der Umsetzung begonnen.

**Erstellte Architektur:**

```
docs/
├── index.html              # SPA-Hauptseite mit HTML-Struktur
├── css/
│   ├── tokens.css          # Design-Tokens (Farben, Spacing, Typography)
│   ├── layout.css          # Grid-System, Container, Responsive
│   └── components.css      # UI-Komponenten (Buttons, Forms, etc.)
└── js/
    ├── app.js              # Bootstrap und Initialisierung
    ├── core/
    │   ├── eventBus.js     # Event-basierte Kommunikation
    │   └── state.js        # Zentraler Application State
    ├── data/
    │   ├── metadata.js     # 22 Unis + 21 Kennzahlen definiert
    │   └── dataLoader.js   # Lazy Loading + Caching
    └── components/
        ├── FilterPanel.js   # Universitäts- und Zeitfilter (F1-F4)
        ├── ChartContainer.js # Chart.js Visualisierung (V1-V3)
        ├── DataTable.js     # Tabelle mit Pagination
        └── ReportPanel.js   # LLM-Berichtsgenerierung (R1-R6)
```

**Implementierte Features:**

1. **Design-System** (Phase 0)
   - CSS Custom Properties für alle Farben (V1: Konsistente Farbkodierung)
   - 8px Spacing-Grid
   - Responsive Layout mit CSS Grid

2. **Data Layer** (Phase 1)
   - Alle 22 Universitäten mit Codes aus inputdata.md
   - Alle 21 Kennzahlen mit Kategorien
   - Demo-Daten-Generator falls JSON fehlt

3. **Filter-System** (Phase 2)
   - Universitäts-Auswahl nach Typ gruppiert (F3)
   - Zeitraum-Auswahl (Start/Ende)
   - Kennzahl-Dropdown nach Kategorien
   - Filter-Feedback mit Datenpunktanzahl (F4)

4. **Visualisierung** (Phase 3)
   - Chart.js Zeitreihen-Diagramm
   - Uni-Typ-spezifische Farben
   - Toggle für Durchschnittslinie
   - Klickbare Legende

5. **Tabelle** (Phase 4)
   - Sortierbare Spalten
   - Pagination (25/50/100 Zeilen)
   - CSV-Export
   - Null-Value-Handling (D4)

6. **LLM-Reports** (Phase 5)
   - 4 Report-Templates (Zusammenfassung, Vergleich, Trend, Auffälligkeiten)
   - Quellenattribution (R1)
   - Editierbares Textfeld (R5)
   - Claude API Integration

**Entscheidungen:**

- **Vanilla JavaScript** statt Framework (bewusste Entscheidung für Lernbarkeit)
- **ES6 Modules** für saubere Struktur
- **Chart.js 4.4** via CDN (keine Build-Tools nötig)
- **Demo-Daten** werden generiert falls JSON fehlt (robuste Fallback-Strategie)

**Nächste Schritte:**

- [ ] Excel-Daten zu JSON konvertieren (mindestens 3 Kennzahlen)
- [ ] Dashboard lokal testen
- [ ] Loading States und Error Handling verbessern
- [ ] Accessibility (ARIA Labels, Keyboard Navigation)

---
