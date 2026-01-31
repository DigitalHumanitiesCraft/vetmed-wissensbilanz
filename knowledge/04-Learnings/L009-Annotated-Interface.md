---
created: 2026-01-30
status: active
tags: [learning, phase/meta-learning, didaktik]
---

# L009: Annotated Interface macht Methoden erlebbar

**Datum:** 2026-01-30
**Kontext:** Das Dashboard dokumentierte Promptotyping umfassend (35 Markdown-Dateien), aber Nutzer lasen passiv statt aktiv zu lernen. Die Verbindung zwischen UI-Elementen und ihrer Entstehungsgeschichte fehlte.

---

## Learning

**Ein "Annotated Interface" verbindet UI-Elemente mit ihrer Design-Entstehungsgeschichte und macht abstrakte Methoden konkret erlebbar.**

Statt Dokumentation zu lesen, klicken Nutzer auf Badges direkt am UI-Element und erfahren:
- Welche Hypothese zur Entscheidung führte
- Welche Erkenntnis dahinter steckt
- In welcher Promptotyping-Phase sie entstand

---

## Beispiel

Das Filter-Panel zeigt einen grünen Badge "F1":

```
[F1] UNIVERSITÄTEN
    ☑ Volluniversitäten (0/8)
    ☑ Technische Unis (0/3)
    ...
```

Klick auf F1 öffnet Modal:
- **F1: Progressive Offenlegung**
- Phase: Destillation
- Hypothese: H1 - Ad-hoc Anfragen
- Erkenntnis: "Führungskräfte brauchen schnelle Antworten, nicht alle Optionen gleichzeitig"

---

## Architektur

Drei-Schichten-Modell für Progressive Disclosure:

```
Layer 3: Promptotyping-Tab (vollständige Dokumentation)
    ↑ "Dokumentation lesen" Link
Layer 2: Annotation-Modal (Entstehungsgeschichte)
    ↑ Klick auf Badge
Layer 1: Tutorial-Badges (visueller Hinweis am UI)
```

---

## Wissenschaftliche Grundlagen

| Lerntheorie | Anwendung |
|-------------|-----------|
| Situated Learning (Lave & Wenger) | Badges im Kontext der UI-Elemente |
| Cognitive Apprenticeship (Collins) | Progressive Disclosure via Levels |
| Just-in-Time Learning | Click-to-reveal statt frontloaded |
| Narrative Learning | Entstehungsgeschichte mit Hypothese → Insight |

---

## Regel

> **Wenn du eine Methode lehrbar machen willst, annotiere das Ergebnis mit seiner Entstehungsgeschichte.** Abstrakte Prinzipien werden konkret, wenn Lernende sie an echten Artefakten erleben können.

---

## Implementierung

**Dateien:**
- `docs/js/tutorial/TutorialBadgeSystem.js` - DESIGN_ANNOTATIONS
- `docs/js/tutorial/TutorialBadge.js` - Badge-Komponente
- `docs/js/tutorial/AnnotationModal.js` - Modal
- `docs/css/tutorial-badges.css` - Styles

**Learning Paths:**
1. Basics (F1, F3, F4, V1) - sofort sichtbar
2. Intermediate (F2, V2-V4, R1, R3) - nach 3 Basics
3. Advanced (R5, L001, L006) - nach 3 Intermediate

---

*Verknüpft mit: [[UI-Prinzipien]], [[L004-Lehrbeispiel-Struktur]], [[Promptotyping-Methode]]*
