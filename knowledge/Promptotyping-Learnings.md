# Promptotyping Learnings

Gesammelte Erkenntnisse aus dem Promptotyping-Prozess.

---

## L001: Iterative Synthese erhöht Datenqualität

**Datum:** 2026-01-22
**Kontext:** Vergleich von `inputdata.md` (neu) mit `data.md` (frühere Iteration)

**Learning:**
Wenn dieselbe Aufgabe in mehreren Iterationen durchgeführt wird, sollten die Ergebnisse verglichen werden. Diskrepanzen zwischen Iterationen zwingen zur Verifikation an der Primärquelle.

**Beispiel:**
- Iteration 1 hatte falsche Universitäts-Codes (UV = VetMed)
- Iteration 2 analysierte Excel direkt und fand UI = VetMed
- Vergleich deckte den Fehler auf

**Regel:**
> Bei kritischen Daten immer direkt aus der Primärquelle verifizieren, nicht aus Sekundärdokumentation übernehmen.

---

## L002: Dokumentation mit Quellenangabe

**Datum:** 2026-01-22
**Kontext:** Erstellung von `inputdata.md`

**Learning:**
Jede kritische Information sollte mit ihrer Quelle versehen werden, damit sie später verifizierbar bleibt.

**Beispiel:**
```markdown
**Verifiziert aus:** `1-A-1 Personal - Köpfe.xlsx`, Zeilen 21-395
```

**Regel:**
> Dokumentiere nicht nur WAS, sondern auch WOHER.

---

## L003: Skripte zur Verifikation

**Datum:** 2026-01-22
**Kontext:** Manuelle Excel-Analyse vs. automatisierte Extraktion

**Learning:**
Verifikations-Skripte machen Analysen reproduzierbar und transparent. Sie dienen als "Beweis" für dokumentierte Fakten.

**Regel:**
> Erstelle Skripte für wiederholbare Analysen, nicht nur für einmalige Exploration.

---

## L004: Repository als Lehrbeispiel strukturieren

**Datum:** 2026-01-30
**Kontext:** Vorbereitung des Repositories für Workshop mit Michael Forster

**Learning:**
Wenn ein Projekt auch Lernzwecken dient, ist die Dokumentationsstruktur selbst Teil des Produkts. Die Frage ist nicht "Was muss dokumentiert werden?", sondern "Wie lernt der Leser am besten?".

**Umsetzung:**
- README.md als Einstiegspunkt mit Lesereihenfolge
- Glossar für Begriffe, die Nicht-Techniker nicht kennen
- Hypothesen explizit machen, statt versteckte Annahmen
- Jeden Schritt im Journal dokumentieren

**Regel:**
> Bei Projekten mit Schulungszweck: Zeige den Prozess, nicht nur das Ergebnis.

---

## L005: Hypothesen vor dem Workshop explizit machen

**Datum:** 2026-01-30
**Kontext:** Vorbereitung von User Stories für Workshop

**Learning:**
User Stories vor dem Stakeholder-Gespräch sind Hypothesen, keine Anforderungen. Sie explizit als Hypothesen zu kennzeichnen (mit Validierungsfragen) verhindert zwei Fehler:
1. Features bauen, die niemand braucht (Over-Engineering)
2. Annahmen nie überprüfen (Under-Validation)

**Struktur pro Hypothese:**
- Annahme: Was glauben wir?
- Konfidenz: Wie sicher sind wir?
- Validierungsfrage: Wie prüfen wir das?
- Implikation: Was bedeutet das für das Produkt?

**Regel:**
> Schreibe keine User Stories, schreibe Hypothesen mit Validierungsplan.

→ Siehe: [HYPOTHESES.md](HYPOTHESES.md)

---

## L006: Vanilla JS + ES6 Modules fuer Lernbarkeit

**Datum:** 2026-01-30
**Kontext:** Technologieentscheidung bei Dashboard-Implementierung

**Learning:**
Bei Projekten mit Schulungszweck ist die Wahl der Technologie nicht nur eine technische, sondern eine didaktische Entscheidung. Frameworks wie React oder Vue abstrahieren zu viel - der Lernende sieht nicht mehr, was wirklich passiert.

**Entscheidung:**
- Vanilla JavaScript statt Framework
- ES6 Modules fuer klare Struktur
- Chart.js via CDN (keine Build-Tools)
- Kein npm, kein Webpack, kein TypeScript

**Vorteile:**
- Jede Zeile Code ist im Browser direkt lesbar
- Keine "Magie" durch Compiler oder Bundler
- Forster kann den Code in DevTools Schritt fuer Schritt nachvollziehen
- Keine Installation notwendig (nur Browser)

**Regel:**
> Bei Lehrprojekten: Weniger Abstraktion = mehr Verstaendnis. Waehle die einfachste Technologie, die das Problem loest.

---

## L007: Demo-Daten als Fallback-Strategie

**Datum:** 2026-01-30
**Kontext:** Dashboard-Entwicklung ohne sofort verfuegbare JSON-Daten

**Learning:**
Wenn die echten Daten noch nicht konvertiert sind, sollte das Dashboard trotzdem funktionieren. Ein Demo-Daten-Generator ermoeglicht:
1. Fruehes Testen der UI ohne Datenabhaengigkeit
2. Demonstration im Workshop auch ohne finale Daten
3. Schnelleres Iterieren waehrend der Entwicklung

**Implementierung:**
```javascript
// Wenn JSON fehlt, generiere plausible Demo-Daten
const demoData = this.generateDemoData(kennzahlCode);
this.cache.set(kennzahlCode, demoData); // Cache auch Demo-Daten
```

**Regel:**
> Baue Robustheit ein: Das System sollte auch mit fehlenden Daten sinnvoll reagieren, nicht abstuerzen.

---

*Neue Learnings werden hier ergaenzt.*
