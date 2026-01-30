---
created: 2026-01-22
tags: [learning, qualitaetssicherung]
---

# L001: Iterative Synthese erhöht Datenqualität

**Datum:** 2026-01-22
**Kontext:** Vergleich von `inputdata.md` (neu) mit `data.md` (frühere Iteration)

---

## Learning

Wenn dieselbe Aufgabe in mehreren Iterationen durchgeführt wird, sollten die Ergebnisse verglichen werden. Diskrepanzen zwischen Iterationen zwingen zur Verifikation an der Primärquelle.

---

## Beispiel

- Iteration 1 hatte falsche Universitäts-Codes (UV = VetMed)
- Iteration 2 analysierte Excel direkt und fand UI = VetMed
- Vergleich deckte den Fehler auf

**Korrekte Zuordnung:**
```
UI = Veterinärmedizinische Universität Wien (VetMed)
UV = Universität für Musik und darstellende Kunst Graz
```

---

## Regel

> Bei kritischen Daten immer direkt aus der Primärquelle verifizieren, nicht aus Sekundärdokumentation übernehmen.

---

*Verknüpft mit: [[Universitaeten]], [[05-Journal/2026-01-22]]*
