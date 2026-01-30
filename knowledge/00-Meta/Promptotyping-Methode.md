---
created: 2026-01-30
status: active
aliases: [Methodik, Promptotyping]
tags: [status/active, phase/destillation]
---

# Promptotyping-Methode

Eine iterative Context-Engineering-Arbeitstechnik in vier Phasen, um datengetrieben und gemeinsam mit Frontier-LLMs Forschungsartefakte wie Interfaces, Tools oder Workflows zu entwickeln.

---

## Die vier Phasen

```
┌─────────────────────────────────────────────────────────────┐
│  1. PREPARATION                                             │
│     Rohmaterialien sammeln: Daten, Dokumentation,           │
│     Forschungsfragen, Domänenwissen                         │
├─────────────────────────────────────────────────────────────┤
│  2. EXPLORATION & MAPPING                                   │
│     Systematische Sondierung: Lässt sich die Frage          │
│     auf diese Datenstruktur abbilden?                       │
├─────────────────────────────────────────────────────────────┤
│  3. DESTILLATION                                            │
│     Context Compression: Maximale Information mit           │
│     minimalen Tokens in Promptotyping-Documents             │
├─────────────────────────────────────────────────────────────┤
│  4. IMPLEMENTATION                                          │
│     Iterative Entwicklung: LLM generiert,                   │
│     Expert validiert, neues Wissen fliesst zurück           │
└─────────────────────────────────────────────────────────────┘
```

---

## Kernkonzepte

### Promptotype

Das Ergebnis einer Promptotyping-Iteration - ein funktionierender Prototyp. Nicht produktionsreif, aber demonstrationsfähig.

**Abgrenzung:** Ein Promptotype ist kein fertiges Produkt, sondern ein Werkzeug zum Lernen und Explorieren.

### Promptotyping-Documents

Strukturierte, LLM-optimierte Markdown-Dokumente, die den Kontext so verdichten, dass ein Frontier-Modell damit arbeiten kann.

| Dokument | Inhalt |
|----------|--------|
| knowledge.md | Domänenwissen, Datenstrukturen |
| requirements.md | User Stories, Anforderungen |
| design.md | Visualisierungs- und Interaktionsentscheidungen |
| journal.md | Chronologisches Entwicklungsprotokoll |

### Critical Expert in the Loop

Die Rolle, die Domänenwissen und AI Literacy kombiniert, um LLM-Outputs kritisch zu validieren.

**Aufgaben:**
- Outputs auf fachliche Korrektheit prüfen
- Eigene Interaktion mit dem Modell reflektieren
- Nicht explorierte Optionen identifizieren

---

## Abgrenzung zu Vibe Coding

| Aspekt | Vibe Coding | Promptotyping |
|--------|-------------|---------------|
| Vorgehen | Unreflektiert akzeptieren | Strukturiert validieren |
| Dokumentation | Keine | Promptotyping-Documents |
| Wartbarkeit | Gering | Hoch (Kontext bleibt explizit) |
| Einsatzgebiet | Wegwerf-Projekte | Forschungswerkzeuge |

---

## Anwendung in diesem Projekt

| Phase | Status | Ergebnis |
|-------|--------|----------|
| Preparation | abgeschlossen | [[Datenquellen]], Excel-Dateien |
| Exploration | abgeschlossen | [[Excel-Struktur]], Skripte |
| Destillation | abgeschlossen | [[UI-Prinzipien]], [[Glossar]] |
| Implementation | aktiv | Dashboard in `docs/` |

---

## Referenz

Pollin, Christopher. "Promptotyping: Zwischen Vibe Coding, Vibe Research und Context Engineering". Digitale Geschichte(n), 2025.

---

*Siehe auch: [[Glossar]], [[04-Learnings/index]]*
