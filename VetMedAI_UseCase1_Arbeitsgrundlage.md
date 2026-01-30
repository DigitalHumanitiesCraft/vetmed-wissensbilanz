# VetMedAI Use Case 1: Arbeitsgrundlage

## 1. PROJEKTZIEL

Aufbau von KI-Kompetenz an der Veterinärmedizinischen Universität Wien durch praxisnahe Promptotyping-Workshops. Fachverantwortliche lernen, KI-Tools für ihre täglichen Aufgaben einzusetzen und entwickeln gemeinsam funktionale Prototypen.

---

## 2. USE CASE 1: WISSENSBILANZ-DASHBOARD

| Aspekt | Details |
|--------|---------|
| **Fachverantwortlicher** | Michael Forster |
| **Ziel** | Dashboard zur Analyse von Wissensbilanz-Daten mit LLM-gestützter Berichtsgenerierung |
| **Datenquelle** | 79 Excel-Dateien von UniData Austria (unidata.gv.at) |

### Erfolgskriterien

Der Fachverantwortliche kann am Ende:
- Wissensbilanz-Kennzahlen interaktiv filtern und visualisieren
- Vergleiche zwischen Universitäten und Zeiträumen durchführen
- LLM-gestützte Analyseberichte generieren
- Das System eigenständig mit neuen Daten aktualisieren

### Bekannte Constraints

- **Kein Backend-Server**: Rein clientseitige Lösung (GitHub Pages)
- **API-Key im Browser**: Nutzer muss eigenen LLM-Key eingeben
- **Heterogene Datenformate**: Excel-Dateien mit XLCubed OLAP-Struktur erfordern Custom-Parser
- **Max. 2 Kennzahlen gleichzeitig**: UI-Beschränkung für Übersichtlichkeit

---

## 3. TIMELINE USE CASE 1

| Datum | Meilenstein |
|-------|-------------|
| 22.01.2026 | Datenanalyse abgeschlossen, inputdata.md erstellt |
| **11.02. oder 13.02.2026** | **Initialer Workshop (NÄCHSTER MEILENSTEIN)** |
| 23.02.2026 | Ausweichtermin Workshop (15–17 Uhr) |
| 22.04.2026 | Follow-Up Workshop (10–13 Uhr) |

---

## 4. OFFENE ENTSCHEIDUNGEN

- [ ] Workshop-Datum: 11.02. oder 13.02.2026?
- [ ] User Stories mit Michael Forster definieren
- [ ] Welche Kennzahlen sind für VetMed besonders relevant?
- [ ] Welche Uni-Vergleiche sollen priorisiert werden?
- [ ] LLM-Auswahl: Claude Haiku oder Alternative?

---

## 5. PROMPTOTYPING-KONTEXT

### Definition

Promptotyping = Rapid Prototyping mit KI-Unterstützung. Funktionale Prototypen entstehen im Dialog mit LLMs, Fachverantwortliche lernen dabei KI-Kompetenzen.

### Im Scope

- Excel→JSON Konvertierung (Python)
- Interaktives Browser-Dashboard (Vanilla JS, Chart.js)
- LLM-Integration für Berichtsgenerierung
- GitHub Pages Deployment

### NICHT im Scope

- Backend-Server oder Datenbank
- Authentifizierung/Benutzerverwaltung
- Automatische Datenaktualisierung von UniData
- Mobile App

---

*Stand: 30. Januar 2026*
