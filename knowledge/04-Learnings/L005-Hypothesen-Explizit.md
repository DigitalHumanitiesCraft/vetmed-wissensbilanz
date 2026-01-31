---
created: 2026-01-30
tags: [learning, requirements]
---

# L005: Hypothesen explizit machen

**Datum:** 2026-01-30
**Kontext:** Vorbereitung von User Stories

---

## Learning

User Stories vor dem Stakeholder-Gespraech sind Hypothesen, keine Anforderungen. Sie explizit als Hypothesen zu kennzeichnen (mit Validierungsfragen) verhindert zwei Fehler:

1. Features bauen, die niemand braucht (Over-Engineering)
2. Annahmen nie ueberpruefen (Under-Validation)

---

## Struktur pro Hypothese

| Element | Beschreibung |
|---------|--------------|
| Annahme | Was glauben wir? |
| Konfidenz | Wie sicher sind wir? |
| Validierungsfrage | Wie pruefen wir das? |
| Implikation | Was bedeutet das fuer das Produkt? |

---

## Beispiel

**H1: Ad-hoc-Anfragen**

- **Annahme:** Fachverantwortlicher beantwortet regelmaessig kurzfristige Anfragen
- **Konfidenz:** hoch
- **Validierungsfrage:** "Was war die letzte Ad-hoc-Anfrage?"
- **Implikation:** Schnelle Filterung priorisieren

---

## Regel

> Schreibe keine User Stories, schreibe Hypothesen mit Validierungsplan.

---

*Verknuepft mit: [[03-Hypothesen/index]], [[Promptotyping-Methode]]*
