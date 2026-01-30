---
created: 2026-01-30
tags: [learning, technologie]
---

# L006: Vanilla JS + ES6 Modules für Lernbarkeit

**Datum:** 2026-01-30
**Kontext:** Technologieentscheidung bei Dashboard-Implementierung

---

## Learning

Bei Projekten mit Schulungszweck ist die Wahl der Technologie nicht nur eine technische, sondern eine didaktische Entscheidung. Frameworks wie React oder Vue abstrahieren zu viel - der Lernende sieht nicht mehr, was wirklich passiert.

---

## Entscheidung

| Gewählt | Vermieden |
|---------|-----------|
| Vanilla JavaScript | React, Vue, Angular |
| ES6 Modules | CommonJS, AMD |
| Chart.js via CDN | npm install |
| Keine Build-Tools | Webpack, Vite |
| Kein TypeScript | TypeScript |

---

## Vorteile

- Jede Zeile Code ist im Browser direkt lesbar
- Keine "Magie" durch Compiler oder Bundler
- Forster kann den Code in DevTools Schritt für Schritt nachvollziehen
- Keine Installation notwendig (nur Browser)

---

## Trade-offs

| Vorteil Framework | Workaround |
|-------------------|------------|
| Type Safety | Gute Kommentare, klare Strukturen |
| State Management | Einfache state.js mit Subscribers |
| Hot Reload | Browser-Refresh |

---

## Regel

> Bei Lehrprojekten: Weniger Abstraktion = mehr Verständnis. Wähle die einfachste Technologie, die das Problem löst.

---

*Verknüpft mit: [[Use Case Wissensbilanz]], [[L004-Lehrbeispiel-Struktur]]*
