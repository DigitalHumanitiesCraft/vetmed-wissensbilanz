# vetmed-wissensbilanz

Ein Wissensbilanz-Dashboard für die Veterinärmedizinische Universität Wien – entwickelt als **Promptotyping-Lehrbeispiel** im Rahmen des VetMedAI-Projekts.

## Worum geht's?

Dieses Projekt ist beides: ein funktionales Tool zur Analyse von Universitäts-Kennzahlen **und** ein dokumentiertes Beispiel dafür, wie man mit KI-Unterstützung schnell von der Idee zum Prototyp kommt. Das Dashboard visualisiert Wissensbilanz-Daten österreichischer Universitäten und generiert LLM-gestützte Analyseberichte. Die gesamte Entstehung – jede Entscheidung, jeder Fehler, jede Korrektur – ist im Repository nachvollziehbar dokumentiert.

## Live Demo

**Das Dashboard ist hier verfügbar:** `docs/index.html` (lokal öffnen mit Live Server)

Features:
- Vergleich aller 22 österreichischen Universitäten
- 19 Kennzahlen (Personal, Studierende, Forschung)
- 4 Visualisierungstypen (Zeitreihe, Small Multiples, Heatmap, Ranking)
- LLM-gestützte Berichtsgenerierung (Claude API)
- Teilbare URLs für Filter-Zustände
- **Tutorial-Badge-System**: Interaktives Lernen der Promptotyping-Methode direkt im UI

## Für wen ist dieses Repository?

- **Michael Forster** (Fachverantwortlicher): Lernt am Beispiel, wie Promptotyping funktioniert
- **VetMedAI-Team**: Referenzprojekt für weitere Use Cases
- **Interessierte**: Nachvollziehbares Beispiel für KI-gestützte Softwareentwicklung

## Wie lese ich dieses Repository?

Empfohlene Reihenfolge für Nicht-Entwickler:

| Schritt | Dokument | Was du lernst |
|---------|----------|---------------|
| 1 | [Glossar](knowledge/00-Meta/Glossar.md) | Begriffe verstehen (Prompt, Token, etc.) |
| 2 | [Promptotyping-Methode](knowledge/00-Meta/Promptotyping-Methode.md) | Die Methodik kennenlernen |
| 3 | [Journal](knowledge/05-Journal/) | Den Entstehungsprozess nachvollziehen |
| 4 | [Datenquellen](knowledge/01-Domaene/Datenquellen.md) | Die Datengrundlage verstehen |
| 5 | [Hypothesen](knowledge/03-Hypothesen/) | User Stories und Annahmen |
| 6 | [Learnings](knowledge/04-Learnings/) | Destillierte Erkenntnisse |

## Was ist Promptotyping?

**Promptotyping = Rapid Prototyping mit KI-Unterstützung.**

Statt wochenlang Anforderungen zu sammeln und dann zu entwickeln, entsteht ein funktionaler Prototyp im Dialog mit einem LLM. Der Prozess ist iterativ:

```
Idee -> Prompt -> Ergebnis -> Korrektur -> besseres Ergebnis -> ...
```

Das Besondere: Die KI hilft nicht nur beim Coden, sondern auch beim Verstehen der Daten, beim Finden von Fehlern und beim Dokumentieren. Mehr dazu in [Promptotyping-Learnings.md](knowledge/Promptotyping-Learnings.md).

## Projektstatus

| Komponente | Status |
|------------|--------|
| Datenanalyse | DONE |
| Excel-zu-JSON Konvertierung | DONE - 19 Dateien konvertiert |
| Frontend/Dashboard | DONE |
| Filter-System (F1-F4) | DONE - Universitaeten, Zeitraum, Kennzahlen |
| Visualisierung (Chart.js) | DONE - 4 Typen: Line, Small Multiples, Heatmap, Ranking |
| Datentabelle mit Sparklines | DONE - Sortierbar, CSV-Export, Mini-Zeitreihen |
| LLM-Berichtsgenerierung | DONE - 4 Templates, editierbar |
| URL-State Sync | DONE - Teilbare Links |
| Promptotyping-Tutorial | DONE - Vault-Integration |
| **Annotated Interface** | DONE - Tutorial-Badges mit Entstehungsgeschichte |
| Dokumentation (Obsidian Vault) | DONE - 9 Learnings dokumentiert |

## Repository-Struktur

```
vetmed-wissensbilanz/
+-- README.md                    # Du bist hier
+-- knowledge/                   # Obsidian Vault mit Wissen
|   +-- 00-Meta/                 # Glossar, Methodik
|   +-- 01-Domaene/              # Unis, Kennzahlen, Daten
|   +-- 02-Design/               # UI-Prinzipien, Farben
|   +-- 03-Hypothesen/           # H1-H4 User Stories
|   +-- 04-Learnings/            # L001-L009 Erkenntnisse
|   +-- 05-Journal/              # Chronologisches Log
+-- data/                        # Excel-Rohdaten (79 Dateien)
+-- scripts/                     # Python-Skripte
|   +-- convert_excel_to_json.py
+-- docs/                        # Dashboard (produktionsreif)
    +-- index.html               # SPA-Einstiegspunkt
    +-- css/                     # Design-System
    +-- js/                      # Vanilla JS + ES6 Modules
    +-- data/json/               # Konvertierte Kennzahlen
```

## Wie ist das Projekt entstanden?

Das [Journal](knowledge/05-Journal/) dokumentiert den gesamten Prozess chronologisch:

1. **22.01.2026**: Projektstart, systematische Analyse aller 79 Excel-Dateien
2. **22.01.2026**: Fehler aus früherer Iteration entdeckt und korrigiert (UI ≠ UV)
3. **22.01.2026**: Verifikations-Skripte erstellt für reproduzierbare Analysen
4. **30.01.2026**: Komplettes Dashboard implementiert (Phase 0-5)
5. **30.01.2026**: 19 Kennzahlen konvertiert, Obsidian Vault strukturiert
6. **30.01.2026**: URL-Router für teilbare Links, Accordion-Sidebar
7. **30.01.2026**: 4 Visualisierungstypen (Zeitreihe, Small Multiples, Heatmap, Ranking)
8. **30.01.2026**: Promptotyping-Tutorial mit Vault-Navigation
9. **30.01.2026**: **Annotated Interface** – Tutorial-Badges zeigen Entstehungsgeschichte

Jeder Eintrag zeigt: Was war das Ziel? Was wurde entschieden? Was wurde gelernt?

## Nächste Schritte

- [ ] GitHub Pages Deployment
- [ ] Extended Views (Kennzahl-Kombinationen)
- [ ] Hypothesen H1-H4 validieren

## Kontakt

- **Repository**: [chpollin/vetmed-wissensbilanz](https://github.com/chpollin/vetmed-wissensbilanz)
- **Fachverantwortlicher**: Michael Forster
- **Projekt**: VetMedAI Promptotyping und KI-Kompetenzaufbau

---

*Dieses Repository ist ein Lehrbeispiel. Die Dokumentation ist absichtlich ausführlicher als in einem typischen Softwareprojekt, damit der Entstehungsprozess nachvollziehbar bleibt.*
