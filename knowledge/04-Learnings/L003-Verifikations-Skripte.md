---
created: 2026-01-22
tags: [learning, automatisierung]
---

# L003: Skripte zur Verifikation

**Datum:** 2026-01-22
**Kontext:** Manuelle Excel-Analyse vs. automatisierte Extraktion

---

## Learning

Verifikations-Skripte machen Analysen reproduzierbar und transparent. Sie dienen als "Beweis" für dokumentierte Fakten.

---

## Beispiel

Statt manuell Excel-Zellen abzulesen:

```python
# scripts/convert_excel_to_json.py
# Verifiziert Uni-Codes automatisch aus Spalte "Codex"

VALID_UNI_CODES = {
    "UA": "Universität Wien",
    "UI": "Veterinärmedizinische Universität Wien",
    # ...
}
```

Das Skript ist:
- Reproduzierbar (jeder kann es ausführen)
- Dokumentiert (Code als Spezifikation)
- Versioniert (Änderungen nachvollziehbar)

---

## Regel

> Erstelle Skripte für wiederholbare Analysen, nicht nur für einmalige Exploration.

---

*Verknüpft mit: [[Excel-Struktur]], [[Datenquellen]]*
