# Hypothesen: Synthetische User Stories

*Hypothesenbasierte Vorbereitung für den Workshop mit Michael Forster*

---

## Kontext

Diese User Stories sind **Hypothesen**, nicht validierte Anforderungen. Sie basieren auf Annahmen über Forsters Arbeitssituation und müssen im Workshop überprüft werden.

**Warum Hypothesen statt Anforderungen?**
- Wir wissen noch nicht, welche Probleme Forster tatsächlich hat
- "Was brauchen Sie?" führt zu Wunschlisten, nicht zu Lösungen
- Rekonstruktive Fragen ("Was tun Sie konkret?") liefern bessere Erkenntnisse

---

## Annahmen über Forsters Arbeitssituation

| Annahme | Konfidenz | Validierungsfrage |
|---------|-----------|-------------------|
| Erstellt Berichte für Uni-Leitung | hoch | "Für wen erstellen Sie Berichte?" |
| Beantwortet Ad-hoc-Anfragen zu Kennzahlen | hoch | "Wer fragt Sie nach Zahlen?" |
| Vergleicht VetMed mit anderen Unis (v.a. Med Unis) | mittel | "Mit wem vergleichen Sie sich?" |
| Arbeitet aktuell primär mit Excel | mittel | "Welche Tools nutzen Sie?" |
| Jährliche Datenaktualisierung ist Teil des Workflows | hoch | "Was passiert bei neuen Daten?" |
| Hat keinen Programmier-Hintergrund | hoch | "Haben Sie Erfahrung mit Code?" |

---

## Hypothese H1: Ad-hoc-Anfragen

### User Story

> Als Wissensbilanz-Verantwortlicher will ich schnell auf Fragen der Vizerektorin antworten können ("Wie stehen wir bei X im Vergleich zu Med Uni Wien?"), ohne jedes Mal Excel-Dateien durchsuchen zu müssen.

### Annahme

Forster erhält regelmäßig kurzfristige Anfragen zu spezifischen Kennzahlen und verbringt Zeit damit, die richtigen Daten in Excel zu finden.

### Validierungsfragen

1. "Was war die letzte Ad-hoc-Anfrage, die Sie zur Wissensbilanz bekommen haben?"
2. "Wie lange haben Sie gebraucht, um die Antwort zu finden?"
3. "Von wem kommen solche Anfragen typischerweise?"

### Implikation für das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| Schnelle Filterung priorisieren | Einfachere UI möglich |
| Vergleichsansicht (Uni A vs. B) wichtig | Vergleiche optional |
| Suchfunktion für Kennzahlen | Dropdown reicht |

---

## Hypothese H2: Jahresbericht / LLM-Generierung

### User Story

> Als Wissensbilanz-Verantwortlicher will ich den narrativen Teil des Jahresberichts effizienter erstellen, weil das Formulieren repetitiv ist und viel Zeit kostet.

### Annahme

Forster schreibt regelmäßig Texte, die Kennzahlen interpretieren. Diese Texte folgen einem ähnlichen Muster und könnten teilweise automatisiert werden.

### Validierungsfragen

1. "Beschreiben Sie, wie Sie einen Wissensbilanz-Bericht erstellen."
2. "Welcher Teil dauert am längsten?"
3. "Gibt es Textbausteine, die Sie wiederverwenden?"

### Implikation für das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| LLM-Berichtsgenerierung ist Kernfeature | LLM-Integration optional |
| Verschiedene Report-Templates anbieten | Nur Export (CSV/PNG) |
| Prompt-Vorlagen für verschiedene Zwecke | Keine Prompts nötig |

---

## Hypothese H3: Datenaktualisierung

### User Story

> Als Wissensbilanz-Verantwortlicher will ich neue Jahresdaten selbst einpflegen können, ohne auf externe Hilfe angewiesen zu sein.

### Annahme

Forster ist für die laufende Aktualisierung verantwortlich und will nicht bei jedem Update einen Entwickler fragen müssen.

### Validierungsfragen

1. "Was passiert, wenn neue Daten von UniData kommen?"
2. "Wer pflegt die Daten aktuell ein?"
3. "Wie oft kommen neue Daten?"

### Implikation für das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| Einfacher Import-Workflow kritisch | Einmalige Konvertierung reicht |
| Dokumentation für Selbst-Update | Entwickler-Doku reicht |
| Evtl. Excel-Upload im Browser | Nur JSON-basiert |

### Technische Abhängigkeit

Forsters technisches Skill-Level beeinflusst diese Hypothese stark:
- Kann er mit Command Line / Python umgehen? → Skript-basierter Update
- Nur GUI? → Browser-basierter Excel-Upload nötig

---

## Hypothese H4: Plausibilitätsprüfung

### User Story

> Als Wissensbilanz-Verantwortlicher will ich Auffälligkeiten in den Daten schnell erkennen, um Fehler oder interessante Entwicklungen zu identifizieren.

### Annahme

Forster prüft Daten auf Plausibilität, bevor er sie weiterverwendet. Große Abweichungen könnten auf Fehler oder relevante Entwicklungen hinweisen.

### Validierungsfragen

1. "Wie prüfen Sie, ob die Daten korrekt sind?"
2. "Gab es schon Fälle, wo Daten falsch waren?"
3. "Was würde Ihnen helfen, Auffälligkeiten schneller zu finden?"

### Implikation für das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| Anomalie-Erkennung einbauen | Nur Visualisierung |
| Alerts bei großen Abweichungen | Keine automatischen Hinweise |
| Trend-Analyse mit Ausreißer-Markierung | Einfache Liniendiagramme |

---

## Erfolgskriterien (kompetenzorientiert)

Das Projektziel ist **KI-Kompetenzaufbau**, nicht nur Software-Delivery. Deshalb messen wir Erfolg an Forsters Fähigkeiten:

| Kriterium | Validierungsfrage | Warum wichtig |
|-----------|-------------------|---------------|
| Versteht den Datenfluss | "Können Sie erklären, woher ein Wert im Dashboard kommt?" | Vertrauen in die Daten |
| Kann Nutzen einschätzen | "Welche Ihrer Aufgaben erleichtert das Tool?" | Realistische Erwartungen |
| Kann Grenzen benennen | "Was kann das Tool nicht?" | Vermeidet Fehlnutzung |
| Kann Weiterentwicklung beauftragen | "Wie würden Sie einen Änderungswunsch formulieren?" | Nachhaltigkeit |
| Versteht Promptotyping | "Könnten Sie einen ähnlichen Prozess für ein anderes Problem starten?" | Methodentransfer |

---

## Workshop-Fragestrategie

**Prinzip:** Rekonstruktiv vorgehen, nicht "Was brauchen Sie?" fragen.

### Einstiegsfragen (Arbeitspraxis verstehen)

1. "Beschreiben Sie einen typischen Ablauf, wenn Sie einen Wissensbilanz-Bericht erstellen."
2. "Was war die letzte Ad-hoc-Anfrage, die Sie zur Wissensbilanz bekommen haben?"
3. "Wo verbringen Sie dabei die meiste Zeit?"

### Vertiefungsfragen (Pain Points identifizieren)

4. "Was passiert, wenn neue Jahresdaten von UniData kommen?"
5. "Mit welchen anderen Universitäten vergleichen Sie sich am häufigsten?"
6. "Wie prüfen Sie, ob die Daten plausibel sind?"

### Abschlussfragen (Priorisierung)

7. "Wenn Sie nur eine Sache verbessern könnten – was wäre das?"
8. "Was dürfte das Tool auf keinen Fall falsch machen?"

---

## Nächste Schritte

- [ ] Workshop-Termin fixieren (11.02. oder 13.02.2026)
- [ ] Hypothesen im Workshop validieren oder verwerfen
- [ ] Echte User Stories aus Forsters Antworten extrahieren
- [ ] Priorisierung gemeinsam mit Forster vornehmen
- [ ] Dieses Dokument nach Workshop aktualisieren

---

*Status: Hypothesen, nicht validiert | Stand: 30. Januar 2026*
