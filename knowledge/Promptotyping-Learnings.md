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

*Neue Learnings werden hier ergänzt.*
