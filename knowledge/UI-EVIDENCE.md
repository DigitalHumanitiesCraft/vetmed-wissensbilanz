# Evidenzbasierte UI-Gestaltung für das Wissensbilanz-Dashboard

Stand: Januar 2026 | Projekt: vetmed-wissensbilanz

---

## Zusammenfassung

Dieses Dokument konsolidiert Forschungsergebnisse zu Filterkomponenten, Zeitreihenvisualisierung, LLM-gestützter Berichtsgenerierung und Datenimport. Drei Kernbefunde leiten das Design:

1. **Progressive Offenlegung** reduziert kognitive Belastung signifikant (Effektstärke kontextabhängig, im Workshop validieren)
2. **LLM-generierte Berichte** erfordern explizite Quellenattribution und Human-in-the-Loop-Validierung
3. **Coordinated Views mit Brushing** verbessern explorative Analyse durch automatische Hervorhebung von Selektionen in allen Ansichten

---

## Theoretische Grundlagen

### Cognitive Load Theory (Sweller, 1988)

Die Theorie unterscheidet drei Belastungsformen mit unterschiedlichen Designimplikationen:

| Belastungstyp | Beschreibung | Designimplikation |
|---------------|--------------|-------------------|
| Intrinsisch | Inhärente Aufgabenkomplexität (21 Kennzahlen, 22 Universitäten, multiple Dimensionen) | Nicht reduzierbar durch Design |
| Extrinsisch | Entsteht durch Informationspräsentation | Minimieren durch gutes Design |
| German | Förderliche Last für Schemabildung | Maximieren bei minimierter extrinsischer Last |

Die Arbeitsgedächtniskapazität von 7±2 Einheiten (Miller, 1956) begrenzt konkret: maximal 7 sichtbare Filteroptionen, 5–7 Zeitreihen pro Diagramm, 5 Tabellenspalten ohne Scrollen.

**Erweiterung durch Burnay & Lega (2024):** Dashboard-spezifische Belastungstypen umfassen informational load, representational load und non-informational load. Jin et al. (2023) zeigen einen stückweise linearen Zusammenhang zwischen Informationslast und kognitiver Belastung mit kritischen Knickpunkten, allerdings ermittelt für die Baubranche und nicht direkt übertragbar.

### Visual Information Seeking Mantra (Shneiderman, 1996)

"Overview first, zoom and filter, then details on demand" definiert eine Sequenz für explorative Analyse:

- **Overview:** Initiale Ansicht mit allen 22 Universitäten in aggregierter Form
- **Zoom and Filter:** Filterkomponenten
- **Details on Demand:** Tooltips und LLM-Berichte

**Kritische Einordnung:** Craft & Cairns (2005) zeigen, dass das Mantra trotz weiter Verbreitung kaum empirisch validiert wurde und primär als Design-Rechtfertigung zitiert wird. Domänenexperten bevorzugen teilweise "Details first". Als bewährte Heuristik behandeln, nicht als wissenschaftlich bestätigtes Gesetz. Keim et al. (2008) ergänzen eine vorgelagerte Analysephase: "Analyze first, show the important, zoom and filter, then analyze further, details on demand."

### Weitere theoretische Grundlagen

**Task-Technology Fit (Goodhue & Thompson, 1995):** Technologie hat nur bei Passung zwischen Aufgabenanforderungen und Technologie-Fähigkeiten positive Effekte. Das Dashboard muss zwei Aufgabentypen unterstützen: explorative Analyse (flexible Filterung, multiple Ansichten, iteratives Hypothesentesten) und Berichterstattung (strukturierte Ausgabeformate, Export, reproduzierbare Analysepfade). Keine spezifischen TTF-Studien für Dashboard-Design im Hochschulkontext verfügbar.

**Dual Coding Theory (Paivio, 1971):** Verbale und visuelle Informationsverarbeitung über zwei Kanäle verbessert Verstehen und Erinnerung. Text und Visualisierung daher integriert präsentieren, nicht auf getrennten Seiten. LLM-Berichte direkt neben oder unter den zugehörigen Visualisierungen.

---

## Designprinzipien und Implementierung

### Filterkomponenten

#### Empirische Basis

Van Berkel et al. (2024, N=160, 80 Data Scientists, 80 Nicht-Experten) zeigen: Techniken, die irrelevante Information ausblenden (Filter, Abstract/Elaborate), führten zu besserer Antwortgenauigkeit als solche, die Information hinzufügen. Expertise beeinflusste Vertrauen, aber nicht Genauigkeit. He et al. (2022, N=11) fanden Präferenz für "Filter-Swipe" gegenüber Checkbox-Filtern, da Nutzer Auswirkungen vor Bestätigung sehen. Das Berrypicking-Modell (Bates, 1989) beschreibt Informationssuche als iterativen Prozess mit dynamischen Strategieänderungen basierend auf Zwischenergebnissen.

#### Prinzipien

**F1 Progressive Offenlegung:** Basisfilter (Universität, Zeit) standardmäßig sichtbar, Expertenfilter (Verwendungskategorien, ISCED) auf Anfrage. Empirisch konsistent belegt (Nielsen, 2006; Carroll & Rosson, 1987), quantitative Effektgrößen jedoch kontextabhängig.

**F2 Filter-Persistenz:** URL-Parameter kodieren Filter-Zustand für teilbare Analysen. Browser-History-Navigation. "Zurücksetzen"-Button für Standardzustand.

**F3 Kategorisierte Filtergruppen:**
- Institutionell: Universität, Universitätstyp, Bundesland
- Temporal: Jahr, Semester, Stichtag
- Inhaltlich: Kennzahl, Verwendungskategorie, Studienart, ISCED

**F4 Sofortiges Filterfeedback:** Resultierende Datenpunktanzahl bei jeder Änderung anzeigen ("127 Datenpunkte für 3 Universitäten über 3 Jahre"). Warnung vor leeren Ergebnismengen vor Filteranwendung.

#### Implementierung

**Universitätsfilter:** Zweistufige Hierarchie. Erste Ebene: fünf Universitätstypen als anklickbare Gruppen mit Farbcodierung (Klick selektiert alle zugehörigen). Zweite Ebene: einzelne Universitäten. VetMed als Fokusuniversität visuell hervorgehoben und standardmäßig selektiert.

**Zeitfilter:** Range-Slider mit vorselektiertem Gesamtzeitraum (2022–2024). Einzeljahrselektion möglich, aber nicht Standard, da Trends erst durch Mehrjahresvergleiche erkennbar.

**Kennzahlfilter:** Gruppierung nach Wissensbilanz-Bereichen (1-A-x Personal/Gleichstellung, 2-A-x Studium/Lehre, 3-A-x Abschlüsse, 4-A-x Finanzen). Beschränkung auf maximal zwei gleichzeitige Kennzahlen mit klarer Fehlermeldung.

---

### Zeitreihenvisualisierung

#### Empirische Basis

Tuftes Data-Ink-Ratio (1983) fordert Maximierung des Datenanteils. Gillan & Richman (1994) bestätigen schnellere Reaktionszeiten und höhere Genauigkeit bei hohem Ratio. Allerdings zeigt Inbar et al. (2007, N=87) Präferenz für nicht-minimalistische Diagramme ("langweilig"). Spätere Forschung (2013, 2015) relativiert: Moderate dekorative Elemente können Aufmerksamkeit und Erinnerung verbessern ohne signifikante Genauigkeitseinbußen. Data-Ink-Ratio daher als Richtlinie, nicht Dogma.

Bertins Sémiologie Graphique (1967) definiert sechs retinale Variablen (Form, Orientierung, Farbe, Textur, Tonwert, Größe). Für kategoriale Unterscheidung ist Farbe am effektivsten.

#### Prinzipien

**V1 Semantische Farbcodierung:** Konsistente Farbzuweisung für Universitätstypen in allen Ansichten:
- Volluniversität: #1a5490 (Blau)
- Technisch: #28a745 (Grün)
- Medizinisch: #dc3545 (Rot)
- Kunst: #6f42c1 (Violett)
- Weiterbildung: #fd7e14 (Orange)

Palette erfüllt WCAG 2.1 AA (5.49:1 bis 8.56:1 Kontrastverhältnisse). Für Farbsehschwäche zusätzliche visuelle Marker (Linienstile, Datenpunktsymbole).

**V2 Coordinated Views mit Brushing:** Selektion in einer Ansicht hebt automatisch entsprechende Datenpunkte in allen anderen Ansichten hervor. Empirisch validiert für explorative Analyse (Keim et al., 2008). Implementierung: 8–16 Stunden.

**V3 Referenzlinien:** Optionale gestrichelte Linie in neutralem Grau für Durchschnitt aller selektierten Universitäten oder des Universitätstyps. Empirisch belegt für verbesserte Vergleichsgenauigkeit. Chart.js-Implementierung mit `borderDash: [5, 5]`.

**V4 Kontextannotationen:** Anklickbare Marker für relevante Events (COVID-Anomalien, methodische Änderungen wie Verwendungskategorie 88 seit 2023, vorläufige Daten TU Wien seit WS 2019). Tooltip mit Erklärung bei Klick. Implementierung via chartjs-plugin-annotation. Erfordert Datenkuration, daher niedrige Priorität.

**V5 Small Multiples:** Bei mehr als fünf Universitäten Grid-Darstellung mit 4–5 Spalten anbieten. Jede Zelle enthält minimierte Zeitreihe (Sparkline-ähnlich) mit Titel und aktuellem Wert. Identische Skalierung aller Zeitreihen für Vergleichbarkeit.

**V6 Moderate Hilfslinien:** Horizontale Linien bei 25%, 50%, 75% der Y-Achse in hellem Grau. Verbessert Ablesegenauigkeit ohne signifikante Belastungserhöhung. Abschaltbar.

---

### LLM-gestützte Berichtsgenerierung

#### Empirische Basis

**TrustLLM (Huang et al., 2024, ICML, 70+ Ko-Autoren):** Acht Prinzipien für vertrauenswürdige LLMs (Truthfulness, Safety, Fairness, Robustness, Privacy, Machine Ethics, Transparency, Accountability). Benchmark umfasst sechs messbare Dimensionen. Für Analyseberichte ist Truthfulness kritischste Dimension.

**Messeri & Crockett (2024, Nature 627, 49–58):** "Illusions of Understanding" – Forschende vertrauen plausibel klingenden, aber fehlerhaften LLM-Outputs. Identifizierte Risiken: "illusion of explanatory depth" (Nutzer glauben mehr zu verstehen als sie tun) und "illusion of exploratory breadth" (Forschung verengt sich auf AI-testbare Fragen). Risiko steigt mit sprachlicher Qualität. Critical-Expert-in-the-Loop zwingend erforderlich.

**NL2Vis (Wu et al., 2024):** Erfolgsraten 60–90% je nach Aufgabenschwierigkeit. Chain-of-Thought-Prompting und strukturierte Templates verbessern Ergebnisse. LIDA-Framework (Dibia, 2023, Microsoft) erreicht unter 3,5% Fehlerrate bei 2200+ Visualisierungen durch iteratives Prompt-Tuning (Baseline über 10%).

#### Prinzipien

**R1 Explizite Quellenattribution:** Jede narrative Aussage mit nachvollziehbarer Datengrundlage. Beispiel: "Die VetMed verzeichnete einen Personalzuwachs von 5,6% (von 1.250 auf 1.320 Personen, Quelle: Kennzahl 1-A-1, 2022–2024)."

**R2 Confidence ≠ Correctness:** Keine prominenten Confidence Scores (irreführend). Stattdessen verifizierbare Fakten hervorheben, interpretative Passagen explizit kennzeichnen. Beispiel: "Faktum: Die Frauenquote stieg um 3 Prozentpunkte. Interpretation: Dies könnte auf gezielte Gleichstellungsmaßnahmen zurückzuführen sein."

**R3 Template-basierte Strukturierung:** Vordefinierte Formate reduzieren Halluzinationsrisiko:
- Executive Summary: max. 150 Wörter, 3–5 Kernaussagen
- Detaillierte Analyse: max. 400 Wörter, nach Kennzahlen strukturiert
- Trend-Fokus: max. 200 Wörter, nur Jahresveränderungen
- Vergleich: max. 300 Wörter, Universität A vs. B

Längenempfehlungen basieren auf Erfahrungswerten, nicht auf empirischen Studien für Hochschul-Stakeholder.

**R4 Niedrige Temperature:** 0.3 für Konsistenz und Faktentreue. Höhere Werte erhöhen sprachliche Variabilität und Halluzinationsrisiko.

**R5 Editierbare Zwischenergebnisse:** Generierter Bericht in editierbarem Textfeld, nicht als finale Ausgabe. Nutzer müssen vor Export anpassen können. Eine große RCT-Studie zu Learning Analytics Dashboards (Oktober 2025, N=8745) zeigt, dass Dashboards mit Feedback die Motivation signifikant verbessern, während solche ohne begleitendes Feedback die kognitive Belastung erhöhen können. LLM-Berichte können als "Feedback" zum Dashboard fungieren.

**R6 Transparente Limitationen:** Warnung bei komplexen Vergleichen (mehr als 5 Universitäten oder 2 Kennzahlen): "Die Analyse umfasst viele Vergleichsdimensionen. Der generierte Bericht bietet einen Überblick, ersetzt aber nicht die detaillierte Prüfung der Einzeldaten."

#### Implementierung

Prompt-Struktur:
1. Systemrolle: "Du bist ein Analyst für österreichische Hochschulkennzahlen."
2. Datentabelle: Markdown-formatiert mit gefilterten Daten
3. Statistischer Kontext: Durchschnitt, Min, Max, Trend pro Kennzahl
4. Metadaten: Universitätstyp, Bundesland, Stichtag
5. Aufgabenstellung: Template-spezifische Instruktion

Automatisch generierter Quellenblock:
```
Datengrundlage: [Kennzahlen], Zeitraum [Jahre], Universitäten [Liste]
Quelle: UniData Austria (unidata.gv.at), abgerufen am [Datum]
Generiert mit: [Modellname], Temperature 0.3
Hinweis: Automatisch generierter Text. Vor Verwendung prüfen.
```

**Offene Frage:** Keine standardisierten Metriken für "gute" Analyseberichte verfügbar. Evaluationskriterien mit Fachverantwortlichem definieren.

---

### Datenimport und -qualität

#### Prinzipien

**D1 Multiple Import-Pfade:**
- Primär: Vorverarbeitete JSON-Dateien in `/data/json/`
- Sekundär: Excel-Upload mit automatischer Konvertierung (für Fachverantwortliche)
- Demo: Vorgeladene Testdaten für neue Nutzer

**D2 Validierung mit Feedback:** Sofortige Fehlermeldung mit Lösungsvorschlag. Beispiel: "Die Datei enthält 15 unbekannte Universitätscodes. Bekannte Codes: UA, UB, UC... Möchten Sie eine Zuordnungstabelle erstellen?"

**D3 Progressive Loading:** Bestehende Lazy-Loading-Architektur beibehalten. Erweiterung: Bei Erstaufruf nur Fokusuniversität (VetMed) und Vergleichsgruppe (medizinische Universitäten) laden.

**D4 Three-State Null Handling:** Konsistente visuelle Unterscheidung und domänenspezifische Tooltips:
- `not_applicable` (–): Strukturell nicht anwendbar (z.B. Krems bietet keine Doktoratsstudien)
- `no_data` (?): Keine Meldung erfolgt (z.B. fehlende Datenlieferung)
- `invalid_format` (!): Parser konnte Wert nicht extrahieren

**D5 Datenqualitätsindikator:** Aggregierter Indikator pro Tabellenzeile zeigt Anteil verfügbarer Datenpunkte. Universitäten mit unter 80% visuell markieren.

---

## Implementierungspriorisierung

### Hohe Priorität (vor Workshop, 11./13. Februar 2026)

| Maßnahme | Aufwand | Prinzip |
|----------|---------|---------|
| Pagination in Tabellen (25/50/100 Zeilen) | 4–8h | Adressiert dokumentiertes Hauptproblem |
| Filterfeedback (Datenpunktanzahl) | 2–4h | F4 |
| Editierbares LLM-Textfeld | 2–4h | R5 |
| Quellenblock in Reports | 1–2h | R1 |

Optimale Schwellenwerte für Pagination nicht domänenspezifisch validiert, basieren auf allgemeinen Usability-Heuristiken.

### Mittlere Priorität (nach Workshop)

| Maßnahme | Aufwand | Prinzip |
|----------|---------|---------|
| Referenzlinien in Zeitreihen | 4–8h | V3 |
| Coordinated Views (Brushing) | 8–16h | V2 |
| Filter-Persistenz (URL-Parameter) | 4–8h | F2 |
| Präsentationsflexibilität (Tabs) | 4–8h | Task-Technology Fit |

### Niedrige Priorität (Backlog)

| Maßnahme | Aufwand | Prinzip |
|----------|---------|---------|
| Small Multiples | 8–16h | V5 |
| Sparklines in Tabellen | 4–8h | Ästhetische Verbesserung |
| Kontextannotationen | 8–16h | V4, erfordert Datenkuration |
| Erweiterte Accessibility (über WCAG AA hinaus) | 8–16h | – |

---

## Forschungslücken und offene Fragen

| Bereich | Lücke | Quelle | Projektimplikation |
|---------|-------|--------|-------------------|
| Shneiderman Mantra | Keine empirische Validierung trotz 25+ Jahren Nutzung | Craft & Cairns (2005) | Als Heuristik behandeln, Nutzerverhalten beobachten |
| Task-Technology Fit | Keine Dashboard-Studien im Hochschulkontext | – | Eigene qualitative Evaluation im Follow-Up planen |
| LLM-Report-Qualität | Keine standardisierten Metriken | – | Kriterien mit Fachverantwortlichem definieren |
| Dashboard-Actionability | Kausale Verbindung zu Entscheidungsqualität unklar | – | Entscheidungspfade dokumentieren, Langzeit-Feedback |
| Progressive Disclosure | Quantitative Effektgrößen kontextabhängig | – | Keine pauschalen Prozentzahlen, eigene Baseline messen |
| Informationslast-Knickpunkte | Für Baubranche ermittelt (Jin et al., 2023) | Jin et al. (2023) | Nicht direkt übertragbar |
| Human-AI Collaboration | Theory-driven Dashboards können paradoxerweise kognitive Belastung erhöhen | Chen et al. (2025) | Balance zwischen Informationsgehalt und Überforderung kalibrieren |

---

## Workshop-Validierung (11./13. Februar und 22. April 2026)

### Vor dem Workshop

- [ ] Pagination implementiert
- [ ] Filterfeedback zeigt Datenpunktanzahl
- [ ] LLM-Reports editierbar
- [ ] Quellenblock automatisch generiert
- [ ] Testdaten für alle vier Templates vorhanden

### Im Workshop validieren

- [ ] Primäre Vergleichsgruppe für VetMed
- [ ] Kennzahl-Priorisierung durch Fachverantwortlichen
- [ ] Feedback zu Report-Längen und -Strukturen
- [ ] Beobachtung des Filterverhaltens (Reihenfolge)
- [ ] Schwellenwerte für Pagination bestätigen
- [ ] Baseline für kognitive Belastung (qualitativ)

### Nach dem Workshop

- [ ] Validierte Schwellenwerte eintragen
- [ ] Priorisierungsänderungen in Backlog
- [ ] Neue Forschungsfragen für Follow-Up
- [ ] Effektstärken-Beobachtungen dokumentieren

---

## Quellenverzeichnis

### Klassische Referenzen

Bates (1989): Berrypicking-Modell, Online Review 13(5). | Bertin (1967): Sémiologie graphique, Mouton. | Brehmer & Munzner (2013): Visualization Task Typology, IEEE TVCG 19(12). | Carroll & Rosson (1987): Paradox of the active user, MIT Press. | Few (2006, 2013): Information Dashboard Design, O'Reilly/Analytics Press. | Gillan & Richman (1994): Minimalism graph syntax, Human Factors 36(4). | Goodhue & Thompson (1995): Task-Technology Fit, MIS Quarterly 19(2). | Keim et al. (2008): Visual Analytics, Springer. | Miller (1956): Magical Number Seven, Psych Review 63(2). | Nielsen (2006): Progressive Disclosure, NN/g. | Paivio (1971): Dual Coding Theory, Holt. | Shneiderman (1996): Eyes Have It, IEEE Visual Languages. | Sweller (1988): Cognitive Load, Cognitive Science 12(2). | Tufte (1983): Visual Display of Quantitative Information, Graphics Press.

### Aktuelle Forschung (2020–2025)

Burnay & Lega (2024): Dashboard cognitive loads, Data & Knowledge Engineering 151, 102295. | Chen et al. (2025): Human-AI Collaboration in writing learning, arXiv:2506.19364. | Craft & Cairns (2005): Beyond Guidelines, IV'05, 110–118. | Dibia (2023): LIDA visualization generation, ACL System Demos, arXiv:2303.02927. | He et al. (2022): Interactive Visual Facets, J Visualization 26(1). | Huang et al. (2024): TrustLLM, ICML, PMLR 235:20166-20270. | Inbar et al. (2007): Minimalism attitudes, ECCE. | Jin et al. (2023): Information load cognitive style, Automation in Construction 153, 104893. | Messeri & Crockett (2024): AI illusions of understanding, Nature 627, 49–58. | van Berkel et al. (2024): Interaction technique impact, IJHCS 192, 103359. | Wu et al. (2024): NL2Vis with LLMs, PACMMOD 2(3). | Yigitbasioglu & Velcu (2012): Dashboard review, IJAIS 13(1).

---

## Änderungshistorie

| Version | Datum | Änderung |
|---------|-------|----------|
| 1.0 | Januar 2026 | Initiale Version |
| 2.0 | Januar 2026 | Korrekturen: van Berkel et al. statt Shu et al.; Messeri & Crockett in Nature statt Nature Human Behaviour; TrustLLM 6 Dimensionen (8 Prinzipien); unbelegte 89%-Zahl entfernt; Burnay & Lega, Chen et al., RCT-Studie ergänzt |
| 3.0 | Januar 2026 | Redaktionelle Komprimierung: Redundanzen entfernt, Struktur konsolidiert |

---

*Aktualisierung nach Workshop am 11./13. Februar 2026*