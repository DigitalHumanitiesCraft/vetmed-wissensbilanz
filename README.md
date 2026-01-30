# vetmed-wissensbilanz

Ein Wissensbilanz-Dashboard für die Veterinärmedizinische Universität Wien – entwickelt als **Promptotyping-Lehrbeispiel** im Rahmen des VetMedAI-Projekts.

## Worum geht's?

Dieses Projekt ist beides: ein funktionales Tool zur Analyse von Universitäts-Kennzahlen **und** ein dokumentiertes Beispiel dafür, wie man mit KI-Unterstützung schnell von der Idee zum Prototyp kommt. Das Dashboard visualisiert Wissensbilanz-Daten österreichischer Universitäten und generiert LLM-gestützte Analyseberichte. Die gesamte Entstehung – jede Entscheidung, jeder Fehler, jede Korrektur – ist im Repository nachvollziehbar dokumentiert.

## Für wen ist dieses Repository?

- **Michael Forster** (Fachverantwortlicher): Lernt am Beispiel, wie Promptotyping funktioniert
- **VetMedAI-Team**: Referenzprojekt für weitere Use Cases
- **Interessierte**: Nachvollziehbares Beispiel für KI-gestützte Softwareentwicklung

## Wie lese ich dieses Repository?

Empfohlene Reihenfolge für Nicht-Entwickler:

| Schritt | Dokument | Was du lernst |
|---------|----------|---------------|
| 1 | [GLOSSAR.md](knowledge/GLOSSAR.md) | Begriffe verstehen (Prompt, Token, etc.) |
| 2 | [Promptotyping-Learnings.md](knowledge/Promptotyping-Learnings.md) | Die Methodik kennenlernen |
| 3 | [Journal.md](knowledge/Journal.md) | Den Entstehungsprozess nachvollziehen |
| 4 | [inputdata.md](knowledge/inputdata.md) | Die Datengrundlage verstehen |
| 5 | [HYPOTHESES.md](knowledge/HYPOTHESES.md) | User Stories und Annahmen |
| 6 | [Use Case 1 Wissensbilanz Dashboard.md](knowledge/Use%20Case%201%20Wissensbilanz%20Dashboard.md) | Technische Architektur (optional) |

## Was ist Promptotyping?

**Promptotyping = Rapid Prototyping mit KI-Unterstützung.**

Statt wochenlang Anforderungen zu sammeln und dann zu entwickeln, entsteht ein funktionaler Prototyp im Dialog mit einem LLM. Der Prozess ist iterativ:

```
Idee → Prompt → Ergebnis → Korrektur → besseres Ergebnis → ...
```

Das Besondere: Die KI hilft nicht nur beim Coden, sondern auch beim Verstehen der Daten, beim Finden von Fehlern und beim Dokumentieren. Mehr dazu in [Promptotyping-Learnings.md](knowledge/Promptotyping-Learnings.md).

## Projektstatus

| Komponente | Status |
|------------|--------|
| Datenanalyse | ✅ Abgeschlossen |
| Dokumentation | ✅ Abgeschlossen |
| Verifikations-Skripte | ✅ Abgeschlossen |
| Frontend/Dashboard | ⏳ In Planung |
| LLM-Integration | ⏳ In Planung |

**Demo:** *Noch nicht verfügbar – wird nach Workshop deployed*

## Repository-Struktur

```
vetmed-wissensbilanz/
├── README.md                 ← Du bist hier
├── knowledge/                ← Dokumentation & Lernmaterial
│   ├── GLOSSAR.md            ← Begriffserklärungen
│   ├── HYPOTHESES.md         ← User Story Hypothesen
│   ├── Journal.md            ← Arbeitstagebuch
│   ├── inputdata.md          ← Datenkatalog
│   ├── Promptotyping-Learnings.md
│   └── Use Case 1...md       ← Technische Spezifikation
├── data/                     ← Excel-Rohdaten (79 Dateien)
├── scripts/                  ← Python-Analyse-Skripte
│   └── exploration/
└── docs/                     ← Dashboard (in Entwicklung)
```

## Wie ist das Projekt entstanden?

Das [Journal.md](knowledge/Journal.md) dokumentiert den gesamten Prozess chronologisch:

1. **22.01.2026**: Projektstart, systematische Analyse aller 79 Excel-Dateien
2. **22.01.2026**: Fehler aus früherer Iteration entdeckt und korrigiert (UI ≠ UV)
3. **22.01.2026**: Verifikations-Skripte erstellt für reproduzierbare Analysen
4. **30.01.2026**: Dokumentationsstruktur für Lernzwecke überarbeitet

Jeder Eintrag zeigt: Was war das Ziel? Was wurde entschieden? Was wurde gelernt?

## Nächste Schritte

- [ ] Workshop-Termin fixieren (11.02. oder 13.02.2026)
- [ ] Hypothesen mit Michael Forster validieren
- [ ] Minimales Dashboard live im Workshop bauen
- [ ] GitHub Pages Deployment

## Kontakt

- **Repository**: [chpollin/vetmed-wissensbilanz](https://github.com/chpollin/vetmed-wissensbilanz)
- **Fachverantwortlicher**: Michael Forster
- **Projekt**: VetMedAI Promptotyping und KI-Kompetenzaufbau

---

*Dieses Repository ist ein Lehrbeispiel. Die Dokumentation ist absichtlich ausführlicher als in einem typischen Softwareprojekt, damit der Entstehungsprozess nachvollziehbar bleibt.*
