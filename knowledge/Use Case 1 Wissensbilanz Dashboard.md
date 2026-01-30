# Use Case 1: vetmed-wissensbilanz

Promptotype im Rahmen von [[VetMedAI Promptotyping und KI-Kompetenzaufbau]].

## Übersicht

|                          |                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------- |
| **Fachverantwortlicher** | Michael Forster                                                                   |
| **Status**               | produktiv (MVP abgeschlossen)                                                     |
| **Repository**           | [chpollin/vetmed-wissensbilanz](https://github.com/chpollin/vetmed-wissensbilanz) |
| **Demo**                 | [chpollin.github.io/vetmed-wissensbilanz](https://chpollin.github.io/vetmed-wissensbilanz) |
| **Rohdaten**             | [unidata.gv.at](https://unidata.gv.at/Pages/auswertungen.aspx)                    |
| **Initialer Workshop**   | offen (11.02. oder 13.02.2026)                                                    |
| **Ausweichtermin**       | 23.02.2026, 15–17 Uhr                                                             |
| **Follow-Up**            | 22.04.2026, 10–13 Uhr                                                             |

## Projektbeschreibung

Dashboard und Berichtsgenerator zur Analyse von Wissensbilanz-Daten österreichischer Universitäten. Das System konvertiert heterogen strukturierte Excel-Dateien in standardisierte JSON-Dateien, visualisiert sie interaktiv und generiert LLM-gestützte Analyseberichte.

Das Projekt vereint zwei Funktionen in einem Repository. Das Dashboard ermöglicht explorative Analyse mit Filterung, Zeitreihen und Vergleichen. Die Berichterstellung nutzt LLM-APIs zur automatischen Generierung publikationsreifer Texte aus den Daten.

## Architektur

Das System besteht aus zwei getrennten Verarbeitungsstufen.

Die erste Stufe ist ein Python-Preprocessing, das lokal ausgeführt wird. Excel-Dateien von UniData Austria werden durch spezialisierte Parsing-Strategien in standardisierte JSON-Dateien konvertiert. Diese JSON-Dateien bilden die Datenbasis für das Frontend.

Die zweite Stufe ist das Browser-Frontend, das über GitHub Pages aus dem docs-Ordner bereitgestellt wird. Es lädt die JSON-Dateien, rendert interaktive Visualisierungen mit Chart.js und kommuniziert mit LLM-APIs für die Berichtsgenerierung. Die gesamte Anwendung läuft clientseitig ohne Backend-Server.

### Technologie-Stack

| Komponente       | Technologie                          | Begründung                                       |
|------------------|--------------------------------------|--------------------------------------------------|
| Preprocessing    | Python 3.x, pandas, openpyxl         | Excel-Parsing nicht im Browser möglich           |
| Frontend         | Vanilla JavaScript, HTML5, CSS3      | Kein Build-Step, direktes GitHub-Pages-Deployment|
| Visualisierung   | Chart.js 4.4.1                       | Einfache API, CDN-Delivery, responsive           |
| LLM-Integration  | Konfigurierbar für beliebige LLMs    | Standardempfehlung Claude 4.5 Haiku              |
| Deployment       | GitHub Pages (docs-Ordner)           | Statisch, kostenlos, keine Server-Infrastruktur  |

### Modulstruktur

| Modul              | Verantwortung                                    | Dokumentation           |
|--------------------|--------------------------------------------------|-------------------------|
| `dataLoader.js`    | Lazy Loading, Caching, Transformation            | `dataLoader.md`         |
| `metadata.js`      | Kennzahlen-Definitionen, Universitäts-Typologie  | `metadata.md`           |
| `ui.js`            | State Management, Event-Koordination, DOM        | `ui.md`                 |
| `statistics.js`    | Berechnungen (Mean, Trend, Aggregation)          | `statistics.md`         |
| `visualization.js` | Chart.js Wrapper, Farbcodierung                  | `visualization.md`      |
| `llmReports.js`    | Prompt-Templates, API-Handling                   | `llmReports.md`         |

| Script               | Verantwortung                                  | Dokumentation           |
|----------------------|------------------------------------------------|-------------------------|
| `excel_to_json.py`   | Haupt-Parser für Excel-Konvertierung           | `excel_to_json.md`      |
| `batch_convert.py`   | Batch-Konvertierung mehrerer Dateien           | `batch_convert.md`      |

## Repository-Struktur

```
vetmed-wissensbilanz/
├── knowledge/
│   ├── DESIGN.md                 # Design-System Referenz
│   ├── DATA-MODEL.md             # Datenmodell-Dokumentation
│   └── archive/                  # Historische Dokumente
├── data/
│   ├── excel/                    # Rohdaten von UniData
│   └── json/                     # Generierte JSON-Dateien
├── scripts/
│   ├── excel_to_json.py
│   ├── excel_to_json.md
│   ├── batch_convert.py
│   └── batch_convert.md
└── docs/
    ├── index.html                # Einstiegsseite (GitHub Pages)
    ├── css/
    │   ├── main.css              # Design Tokens, Komponenten
    │   └── responsive.css        # Mobile Breakpoints
    └── js/
        ├── dataLoader.js
        ├── dataLoader.md
        ├── metadata.js
        ├── metadata.md
        ├── ui.js
        ├── ui.md
        ├── statistics.js
        ├── statistics.md
        ├── visualization.js
        ├── visualization.md
        ├── llmReports.js
        └── llmReports.md
```

## Datenmodell

### Aktueller Stand

| Dimension       | Umfang                                                        |
|-----------------|---------------------------------------------------------------|
| Kennzahlen      | 21 (Personal, Studierende, Mobilität, Abschlüsse, Finanzen)   |
| Datenpunkte     | 3607                                                          |
| Universitäten   | 22 (alle österreichischen öffentlichen Universitäten)         |
| Zeitraum        | 2022–2024                                                     |
| JSON-Größe      | ca. 2 MB                                                      |

### Universitäts-Typologie

| Typ              | Farbcode | Beispiele                        |
|------------------|----------|----------------------------------|
| Volluniversität  | #1a5490  | Uni Wien, Uni Graz               |
| Technisch        | #28a745  | TU Wien, TU Graz                 |
| Medizinisch      | #dc3545  | Med Uni Wien, Med Uni Graz       |
| Kunst            | #6f42c1  | Akademie der bildenden Künste    |
| Weiterbildung    | #fd7e14  | Donau-Uni Krems                  |

### Null-Value-Handling

Das System unterscheidet drei Zustände für fehlende Werte.

| Zustand           | Bedeutung                                              | Darstellung           |
|-------------------|--------------------------------------------------------|-----------------------|
| `not_applicable`  | Strukturell nicht anwendbar (z.B. Krems ohne Doktorat) | grau, kursiv, Tooltip |
| `no_data`         | Keine Meldung erfolgt                                  | grau, kursiv, Tooltip |
| `invalid_format`  | Parser konnte Wert nicht extrahieren                   | grau, kursiv, Tooltip |

## Design-System

### Farbpalette

| Variable              | Wert    | Verwendung                              |
|-----------------------|---------|-----------------------------------------|
| `--color-primary`     | #1a5490 | Primäre Interaktionselemente            |
| `--color-bg`          | #ffffff | Hintergrund                             |
| `--color-text`        | #212529 | Fließtext                               |
| `--color-text-muted`  | #5a6268 | Sekundärtext (6.21:1 Kontrast)          |
| `--color-border`      | #dee2e6 | Dekorative Rahmen                       |
| `--color-keyline`     | #8e959c | UI-Borders (3.03:1, WCAG 1.4.11)        |

### Accessibility

| Anforderung              | Status | Implementierung                          |
|--------------------------|--------|------------------------------------------|
| WCAG 2.1 AA Kontrast     | erfüllt | Text-Varianten mit 5.49:1 – 8.56:1      |
| Keyboard-Navigation      | erfüllt | Tab, Enter, Space, Esc                  |
| Skip-Link                | erfüllt | "Zum Inhalt springen"                   |
| Focus-Visible            | erfüllt | 2px Outline in Primary Color            |
| Screen Reader            | erfüllt | ARIA Labels, Live-Region                |
| Reduced Motion           | erfüllt | `prefers-reduced-motion` respektiert    |

## LLM-Integration

### Modellkonfiguration

Das System ist für beliebige LLM-APIs konfigurierbar. Die Standardempfehlung ist Claude 4.5 Haiku. Die Konfiguration erfolgt über ein Settings-Objekt, das Modell-Endpoint, API-Key-Handling und Parameter wie max_tokens und temperature definiert.

| Parameter     | Standardwert | Beschreibung                                      |
|---------------|--------------|---------------------------------------------------|
| model         | konfigurierbar | Claude 4.5 Haiku empfohlen                      |
| max_tokens    | 1024         | Maximale Ausgabelänge                             |
| temperature   | 0.3          | Balance zwischen Konsistenz und Variabilität      |

### Report-Templates

| Template             | Länge              | Verwendung                     |
|----------------------|--------------------|--------------------------------|
| Detaillierte Analyse | 1–2 Absätze        | Deep-Dive in einzelne Kennzahl |
| Executive Summary    | 3–5 Aufzählungen   | Management-Überblick           |
| Trend-Fokus          | 1 Absatz           | Nur Jahresveränderungen        |
| Vergleich            | 2 Absätze          | Universität A vs. B            |

### Prompt-Struktur

Die Prompts enthalten strukturierte Daten als Markdown-Tabellen, Statistik-Kontext (Durchschnitt, Min, Max, Trend), Universitäts-Metadaten (Typ, Bundesland) und eine klare Aufgabenstellung pro Template.

## Bekannte Einschränkungen

### Technisch

| Problem                        | Auswirkung                           | Geplante Lösung           |
|--------------------------------|--------------------------------------|---------------------------|
| Keine Pagination               | Große Tabellen auf einmal geladen    | 25/50/100 pro Seite       |
| Max. 2 Kennzahlen gleichzeitig | UI-Beschränkung für Übersichtlichkeit| Primary/Secondary Pattern |
| API-Key im Browser             | Nutzer muss eigenen Key eingeben     | Backend-Proxy (optional)  |

### Daten

| Problem                        | Auswirkung                           | Status                    |
|--------------------------------|--------------------------------------|---------------------------|
| 53 Wissensbilanz-Files         | Andere Struktur als Kennzahl-Files   | Benötigt Custom-Parser    |
| Heterogene Excel-Formate       | XLCubed OLAP Multi-Level-Headers     | Parser adaptiert          |

## Nächste Schritte

### Vor dem Workshop (11.02. / 13.02.2026)

- [ ] Repository umbenennen auf `vetmed-wissensbilanz`
- [ ] Verzeichnisstruktur gemäß Spezifikation anlegen
- [ ] Dokumentations-Files für alle Scripts und JS-Module erstellen
- [ ] User Stories mit Michael Forster definieren
- [ ] Alle verfügbaren Daten aus UniData holen

### Nach dem Workshop

- [ ] Pagination implementieren
- [ ] Export-Funktionen (CSV, PNG)
- [ ] Pivot-Tabelle (Jahre als Spalten)
- [ ] LLM-Konfiguration flexibilisieren

## Learnings

### Bewährte Entscheidungen

| Entscheidung                   | Ergebnis                                                 |
|--------------------------------|----------------------------------------------------------|
| Vanilla JavaScript             | Kein Build-Step, schnelles Laden, einfaches Deployment   |
| CSS Custom Properties          | Design-Änderungen global in Sekunden                     |
| Lazy Loading                   | Ressourcenschonend, schnelle initiale Ladezeit           |
| Event-basierte Architektur     | Loose Coupling, einfache Erweiterbarkeit                 |
| Three-State Nulls              | Transparente Datenqualität für Nutzer                    |

### Empfehlungen für ähnliche Projekte

| Erfahrung                      | Empfehlung                                               |
|--------------------------------|----------------------------------------------------------|
| Pagination fehlte initial      | Von Anfang an bei mehr als 100 Zeilen einplanen          |
| TypeScript nicht verwendet     | Type-Safety reduziert Fehlerquellen                      |
| Unit Tests fehlten             | Statistik-Berechnungen automatisiert testen              |
| Design-System erst spät        | Vor der Implementierung definieren                       |
| Dokumentation parallel führen  | Jedes Modul sofort dokumentieren                         |

---

## Related

- [[VetMedAI Promptotyping und KI-Kompetenzaufbau]]

---

*Version 2.1 | Stand: Januar 2026*