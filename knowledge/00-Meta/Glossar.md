# Glossar: KI-Begriffe für Promptotyping

Dieses Glossar erklärt Begriffe, die im Kontext von LLMs und Promptotyping verwendet werden. Zielgruppe: Fachpersonen, die mit KI-Tools arbeiten wollen, aber keinen technischen Hintergrund haben.

**Quelle:** Definitionen basieren auf Pollin (2025): "Promptotyping: Zwischen Vibe Coding, Vibe Research und Context Engineering".

---

## Promptotyping-Methode

### Promptotyping

**Definition:** Eine iterative Context-Engineering-Arbeitstechnik in vier Phasen, um datengetrieben und gemeinsam mit Frontier-LLMs Forschungsartefakte wie Interfaces, Tools oder Workflows zu entwickeln.

**Abgrenzung zu Vibe Coding:** Der Unterschied liegt im strukturierten Vorgehen und in der aktiven Anforderungsanalyse. Die Promptotyping-Documents sind destilliertes Wissen, das den Kontext explizit hält und Weiterarbeit ermöglicht.

**Die vier Phasen:**

| Phase | Beschreibung |
|-------|--------------|
| 1. Preparation | Rohmaterialien sammeln: Daten, Dokumentation, Forschungsfragen, Domänenwissen |
| 2. Exploration & Mapping | Systematische Sondierung: Lässt sich die Forschungsfrage auf diese Datenstruktur abbilden? |
| 3. Destillation | Context Compression: Maximale Information mit minimalen Tokens in Promptotyping-Documents verdichten |
| 4. Implementation | Iterative Entwicklung: LLM generiert, Expert validiert, neues Wissen fließt zurück |

**Relevanz für dieses Projekt:** Das Wissensbilanz-Dashboard entsteht durch Promptotyping. Das [Journal.md](Journal.md) dokumentiert die Phasen.

---

### Promptotype

**Definition:** Das Ergebnis einer Promptotyping-Iteration – ein funktionierender Prototyp. Nicht produktionsreif, aber demonstrationsfähig.

**Abgrenzung:** Ein Promptotype ist kein fertiges Produkt, sondern ein Werkzeug zum Lernen und Explorieren. Es können mehrere Iterationen nötig sein.

**Relevanz für dieses Projekt:** Das Dashboard ist ein Promptotype – es zeigt, was möglich ist, und dient als Grundlage für Weiterentwicklung.

---

### Promptotyping-Documents

**Definition:** Strukturierte, LLM-optimierte Markdown-Dokumente, die den Kontext so verdichten und destillieren, dass ein Frontier-Modell damit arbeiten kann. Sie sind das eigentliche Artefakt des Context-Engineerings.

**Typische Dokumente:**

| Dokument | Inhalt |
|----------|--------|
| knowledge.md | Domänenwissen, Datenstrukturen, Standards |
| requirements.md | User Stories, Anforderungen |
| design.md | Visualisierungs- und Interaktionsentscheidungen |
| implementation.md | Technische Lösungen |
| journal.md | Chronologisches Entwicklungsprotokoll |

**Relevanz für dieses Projekt:** Die Dateien im `knowledge/`-Ordner sind Promptotyping-Documents.

---

### Critical Expert in the Loop

**Definition:** Die Rolle, die Domänenwissen und AI Literacy kombiniert, um LLM-Outputs kritisch zu validieren. Nur wer beides versteht – die Fachdomäne und die Eigenheiten der Modelle – kann beurteilen, ob ein Ergebnis nicht nur technisch funktioniert, sondern fachlich angemessen ist.

**Aufgaben:**
- Outputs auf fachliche Korrektheit prüfen
- Eigene Interaktion mit dem Modell reflektieren
- Nicht explorierte Optionen identifizieren
- Blinde Flecken aufdecken

**Abgrenzung zu "Human in the Loop":** Der Critical Expert prüft nicht nur Outputs, sondern reflektiert auch die eigene Interaktion – welche Fragen wurden nicht gestellt?

**Relevanz für dieses Projekt:** Michael Forster soll diese Rolle für das Wissensbilanz-Dashboard einnehmen können.

---

### Vibe Coding

**Definition:** Eine Praxis, bei der man Code durch natürlichsprachliche Anweisungen generiert und den Output akzeptiert, ohne ihn wirklich zu prüfen. (Begriff geprägt von Andrej Karpathy, Februar 2025)

**Wann sinnvoll:** Für Wegwerf-Projekte, schnelles Explorieren, Lernen über eine Problemstellung.

**Wann problematisch:** Für Forschungswerkzeuge, weil fehlende Struktur zu schwer wartbaren Lösungen führt.

**Abgrenzung zu Promptotyping:** Vibe Coding = unreflektiert akzeptieren. Promptotyping = strukturiert validieren.

---

### Context Engineering

**Definition:** Das aktive Management des Context Windows – die Kunst, dem LLM genau die richtige Menge an Information zu geben: genug für gute Ergebnisse, aber nicht so viel, dass die Qualität sinkt.

**Kernprinzip:** Maximale Information mit minimalen Tokens (Context Compression).

**Relevanz für dieses Projekt:** Wir laden nicht alle 79 Excel-Dateien gleichzeitig, sondern nur die relevanten Daten pro Anfrage.

---

### Context Rot

**Definition:** Das Phänomen, dass die Leistung eines LLM mit wachsender Kontextlänge abnimmt. Mehr Tokens führen nicht automatisch zu besseren Ergebnissen.

**Faustregel:** Bei ca. 50% Auslastung des Context Windows beginnt die Qualität zu sinken.

**Relevanz für dieses Projekt:** Deshalb verdichten wir Informationen in Promptotyping-Documents, statt rohe Daten zu übergeben.

---

### Co-Intelligence

**Definition:** Die Zusammenarbeit zwischen Mensch und LLM, bei der das Modell menschliche Fähigkeiten verstärkt (nicht ersetzt). (Begriff von Ethan Mollick)

**Kernidee:** Es geht nicht um Automatisierung, sondern um Amplifikation. Das LLM verstärkt die Fähigkeiten von Expert:innen.

**Relevanz für dieses Projekt:** Forster + LLM = bessere Wissensbilanz-Analysen als Forster allein oder LLM allein.

---

## Requirements Engineering

### User Story

**Definition:** Eine kurze Beschreibung einer Funktionalität aus Sicht des Nutzers im Format: "Als [Rolle] möchte ich [Ziel], um [Nutzen]."

**Beispiel:** "Als Wissensbilanz-Verantwortlicher möchte ich Kennzahlen nach Universität filtern, um schnell Vergleiche anstellen zu können."

**Relevanz für Promptotyping:** Je mehr Requirements Engineering in die Arbeit mit einem LLM eingebaut wird, desto besser sind die Ergebnisse. User Stories liefern dem Modell den Forschungskontext.

---

### Requirements Engineering

**Definition:** Der systematische Prozess, Anforderungen an ein System zu erheben, zu dokumentieren und zu validieren.

**Elemente:**
- User Stories (was soll das System können?)
- Personas (wer nutzt das System?)
- Constraints (was sind die Einschränkungen?)
- Erfolgskriterien (woran messen wir den Erfolg?)

**Relevanz für Promptotyping:** "Je mehr von diesem Requirements Engineering ich in die Arbeit mit einem LLM einbaue, desto besser sind die Ergebnisse." (Pollin 2025)

---

### Persona

**Definition:** Eine fiktive, aber realistische Beschreibung eines typischen Nutzers, basierend auf Recherche und Annahmen.

**Beispiel:** "Michael, 45, Wissensbilanz-Verantwortlicher an der VetMed. Arbeitet hauptsächlich mit Excel, hat keinen Programmier-Hintergrund, beantwortet regelmäßig Ad-hoc-Anfragen der Uni-Leitung."

**Relevanz für dieses Projekt:** Siehe [HYPOTHESES.md](HYPOTHESES.md) für Annahmen über Forsters Arbeitssituation.

---

## LLM-Grundlagen

### Prompt

**Definition:** Die Eingabe (Text), die du einem LLM gibst, um eine Antwort zu erhalten.

**Beispiel:** "Fasse diese Excel-Tabelle zusammen" ist ein Prompt.

**Relevanz für dieses Projekt:** Die Qualität des Prompts bestimmt die Qualität der Antwort. Ein vager Prompt ("Analysiere die Daten") liefert vage Ergebnisse. Ein präziser Prompt ("Liste alle Universitäten mit mehr als 1000 Studierenden im Jahr 2024") liefert präzise Ergebnisse.

---

### LLM (Large Language Model)

**Definition:** Ein KI-Modell, das auf großen Textmengen trainiert wurde und natürliche Sprache versteht und generiert. Beispiele: Claude, GPT-4, Llama.

**Relevanz für dieses Projekt:** Das Dashboard nutzt ein LLM (empfohlen: Claude Haiku), um aus Zahlen verständliche Berichte zu generieren.

---

### Frontier-Modell

**Definition:** Die leistungsstärksten, aktuellsten LLMs der großen Anbieter. Stand 2025/26: Claude Opus 4.5, GPT-5.2-Codex, Gemini 3 Pro.

**Abgrenzung:** Kleinere Open-Source-Modelle sind für klassische NLP-Aufgaben (z.B. Named Entity Recognition) oft ausreichend. Für komplexe, agentische Aufgaben wie Promptotyping braucht es Frontier-Modelle.

**Relevanz für dieses Projekt:** Promptotyping setzt Frontier-Modelle voraus – die Methode funktioniert nicht mit schwächeren Modellen.

---

### Token

**Definition:** Die kleinste Verarbeitungseinheit eines LLM. Bei den meisten Modellen entspricht ein Token etwa 4 Zeichen oder ¾ eines Wortes im Englischen. Deutsche Wörter benötigen typischerweise mehr Tokens (Komposita, längere Durchschnittswortlänge).

**Faustregel:** 1000 Tokens ≈ 750 Wörter (Englisch) oder ≈ 600 Wörter (Deutsch).

**Beispiele:**
- "University" = 1 Token
- "Veterinärmedizinische" = 4-5 Tokens (wird in Subwörter zerlegt)

**Relevanz für dieses Projekt:** LLMs haben ein Token-Limit. Deshalb verarbeiten wir Kennzahlen einzeln, nicht alle 79 Dateien gleichzeitig.

---

### Context Window (Kontextfenster)

**Definition:** Die maximale Textmenge (in Tokens), die ein LLM in einer einzelnen Anfrage verarbeiten kann.

| Modell | Context Window |
|--------|----------------|
| Claude Haiku | 200.000 Tokens |
| Claude Sonnet/Opus | 200.000 Tokens |
| GPT-4 Turbo | 128.000 Tokens |

**Relevanz für dieses Projekt:** Claude Haiku kann theoretisch die gesamte Wissensbilanz-JSON verarbeiten, aber bei zu viel Kontext sinkt die Qualität (siehe Context Rot).

---

### System Prompt

**Definition:** Eine versteckte Anweisung, die dem LLM sagt, wie es sich verhalten soll. Der Nutzer sieht den System Prompt nicht, aber er beeinflusst alle Antworten.

**Beispiel:** "Du bist ein Experte für österreichische Universitätsdaten. Antworte sachlich und präzise."

**Relevanz für dieses Projekt:** Die Berichtsgenerierung nutzt System Prompts, um konsistente, fachlich korrekte Texte zu erzeugen.

---

### Temperature

**Definition:** Ein Parameter, der steuert, wie "kreativ" vs. "vorhersehbar" die Antworten sind. Wert zwischen 0 und 1.

| Temperature | Verhalten |
|-------------|-----------|
| 0.0 | Immer dieselbe Antwort, sehr deterministisch |
| 0.3 | Leicht variabel, aber konsistent |
| 0.7 | Kreativer, mehr Variation |
| 1.0 | Sehr kreativ, manchmal unvorhersehbar |

**Relevanz für dieses Projekt:** Für Datenberichte nutzen wir Temperature 0.3 – konsistent genug für Fakten, aber nicht roboterhaft.

---

## LLM-Probleme

### Halluzination / Konfabulation

**Definition:** Wenn ein LLM faktisch falsche Informationen generiert, die plausibel klingen.

**Warum passiert das?** LLMs generieren Text basierend auf statistischen Wahrscheinlichkeiten, nicht auf Faktenwissen. Sie "erfinden" plausible Fortsetzungen, auch wenn keine Fakten vorliegen.

**Gegenmaßnahmen:**
1. Immer konkrete Datenpunkte mitliefern (Grounding)
2. Ausgabe auf Plausibilität prüfen
3. Bei Zahlen: Stichproben manuell verifizieren

**Relevanz für dieses Projekt:** Ein Hauptrisiko bei der Berichtsgenerierung. Deshalb geben wir dem LLM immer die konkreten Zahlen mit.

---

### Sycophancy

**Definition:** Die Tendenz eines LLM, den Annahmen und Präferenzen der Nutzer:innen zuzustimmen, statt sie zu hinterfragen.

**Beispiel:** Wer eine bestimmte Visualisierung anfragt, bekommt eine Lösung für genau diese Anfrage. Das Modell schlägt selten von sich aus vor, dass eine andere Darstellungsform besser wäre.

**Gegenmaßnahme:** Explizit kritische Bewertung einfordern ("Welche Alternativen gäbe es? Was sind die Nachteile meines Ansatzes?").

**Relevanz für dieses Projekt:** Der Critical Expert muss aktiv nach Alternativen fragen – das LLM tut es nicht von selbst.

---

### Grounding

**Definition:** Die Verankerung von LLM-Ausgaben in verifizierbaren Fakten.

**Ungrounded:** "Die VetMed ist die beste Universität Österreichs." (Wertung ohne Faktengrundlage)

**Grounded:** "Die VetMed hat laut Wissensbilanz 2024 genau 2341 Studierende." (Faktum aus Datenquelle)

**Relevanz für dieses Projekt:** Die Berichtsgenerierung ist designed, um grounded zu sein – alle Aussagen müssen auf den mitgelieferten JSON-Daten basieren.

---

## Weitere Promptotyping-Konzepte

### Iterative Synthese

**Definition:** Dieselbe Aufgabe mehrfach durchführen (mit verschiedenen Ansätzen oder zu verschiedenen Zeiten) und die Ergebnisse vergleichen, um Fehler zu finden.

**Beispiel aus diesem Projekt:** Die Universitäts-Codes wurden zweimal analysiert – einmal aus einer älteren Dokumentation, einmal direkt aus Excel. Der Vergleich deckte Fehler auf.

**Relevanz:** Erhöht die Datenqualität, weil Diskrepanzen zur Verifikation an der Primärquelle zwingen.

---

### Agentic Coding

**Definition:** Eine Arbeitsweise, bei der das LLM nicht nur antwortet, sondern aktiv Aufgaben ausführt: Dateien lesen, Code schreiben, Befehle ausführen, Ergebnisse prüfen.

**Beispiel:** "Analysiere alle Excel-Dateien im data/-Ordner und erstelle eine Übersicht" – das LLM liest selbstständig die Dateien und generiert die Dokumentation.

**Relevanz für dieses Projekt:** Die Datenanalyse wurde agentic durchgeführt. Das LLM hat Code ausgeführt und die Ergebnisse geprüft.

---

### CLAUDE.md

**Definition:** Eine Datei im Repository-Root, die dem LLM projektspezifischen Kontext gibt. Sie wird automatisch geladen, wenn Claude Code das Repository öffnet.

**Typischer Inhalt:**
- Projektbeschreibung
- Coding-Konventionen
- Wichtige Dateipfade
- Bekannte Einschränkungen

**Relevanz für dieses Projekt:** Noch nicht erstellt, aber empfohlen für konsistente KI-Unterstützung.

---

## Technische Begriffe

### API (Application Programming Interface)

**Definition:** Eine Schnittstelle, über die Software mit anderer Software kommuniziert. Das Dashboard kommuniziert über eine API mit dem LLM.

**Relevanz für dieses Projekt:** Nutzer müssen einen API-Key eingeben, um die Berichtsgenerierung zu nutzen.

---

### API-Key

**Definition:** Ein geheimer Schlüssel, der dich gegenüber einem Dienst identifiziert. Wie ein Passwort für maschinelle Zugriffe.

**Wichtig:** API-Keys niemals teilen oder in öffentlichen Code einchecken.

**Relevanz für dieses Projekt:** Das Dashboard läuft im Browser, deshalb muss der Nutzer seinen eigenen API-Key eingeben.

---

### JSON (JavaScript Object Notation)

**Definition:** Ein Datenformat, das Menschen lesen und Maschinen verarbeiten können.

**Beispiel:**
```json
{
  "universität": "VetMed Wien",
  "code": "UI",
  "studierende_2024": 2341
}
```

**Relevanz für dieses Projekt:** Die Excel-Dateien werden in JSON konvertiert, weil Browser JSON direkt verarbeiten können.

---

### GitHub Pages

**Definition:** Ein kostenloser Hosting-Service von GitHub. Statische Websites werden direkt aus einem Repository bereitgestellt.

**Relevanz für dieses Projekt:** Das Dashboard wird über GitHub Pages gehostet – kein eigener Server nötig.

---

### Vanilla JavaScript

**Definition:** JavaScript ohne zusätzliche Frameworks (wie React, Vue, Angular). "Pur" und direkt.

**Relevanz für dieses Projekt:** Das Dashboard nutzt Vanilla JS, weil es keinen Build-Step braucht und einfacher zu verstehen ist.

---

## Datenqualitäts-Begriffe

### Null-Value / Fehlender Wert

**Definition:** Ein Datenpunkt, der nicht vorhanden ist.

**Relevanz für dieses Projekt:** Wir unterscheiden drei Arten:
- `not_applicable`: Strukturell nicht möglich (Krems hat kein Doktorat)
- `no_data`: Keine Meldung erfolgt
- `invalid_format`: Parser konnte Wert nicht lesen

---

### Primärquelle

**Definition:** Die ursprüngliche Datenquelle, nicht eine Kopie oder Zusammenfassung.

**Beispiel:** Die Excel-Datei von UniData ist die Primärquelle. Eine Tabelle in einem Bericht ist eine Sekundärquelle.

**Relevanz für dieses Projekt:** Bei Unstimmigkeiten immer die Primärquelle prüfen. Siehe [Promptotyping-Learnings.md](Promptotyping-Learnings.md), L001.

---

### Stichtag

**Definition:** Das Datum, zu dem die Daten erhoben wurden.

**Beispiele aus diesem Projekt:**
- 31.12.YYYY – Personal (Wintersemester)
- 28.02.YYYY – Studierende (endgültig)
- 03.01.YYYY – Studierende (vorläufig)

**Relevanz:** Daten mit unterschiedlichen Stichtagen sind nicht direkt vergleichbar.

---

## Referenzen

- Pollin, Christopher. "Promptotyping: Zwischen Vibe Coding, Vibe Research und Context Engineering". Digitale Geschichte(n), 2025.
- Mollick, Ethan. *Co-Intelligence: Living and Working with AI*. Portfolio/Penguin, 2024.
- Hong, K., Troynikov, A., & Huber, J. "Context rot: How increasing input tokens impacts LLM performance". Chroma, 2025.

---

*Dieses Glossar wird erweitert, wenn neue Begriffe im Projekt relevant werden.*
