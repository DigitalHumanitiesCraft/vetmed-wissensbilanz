---
created: 2026-01-30
status: active
aliases: [Barrierefreiheit, WCAG]
tags: [status/active, phase/implementation]
---

# Accessibility

Barrierefreiheits-Anforderungen für das Wissensbilanz-Dashboard.

---

## WCAG 2.1 AA Konformität

| Anforderung | Status | Implementierung |
|-------------|--------|-----------------|
| Farbkontrast (1.4.3) | erfüllt | Text-Varianten mit 5.49:1 - 8.56:1 |
| Non-Text-Kontrast (1.4.11) | erfüllt | UI-Borders mit 3.03:1 |
| Keyboard-Navigation (2.1.1) | erfüllt | Tab, Enter, Space, Esc |
| Skip-Link (2.4.1) | erfüllt | "Zum Inhalt springen" |
| Focus-Visible (2.4.7) | erfüllt | 2px Outline in Primary Color |
| Reduced Motion (2.3.3) | erfüllt | `prefers-reduced-motion` respektiert |

---

## Keyboard-Navigation

| Taste | Aktion |
|-------|--------|
| Tab | Nächstes interaktives Element |
| Shift+Tab | Vorheriges Element |
| Enter | Aktivieren |
| Space | Toggle (Checkboxen) |
| Esc | Schließen (Dropdown, Modal) |
| Pfeiltasten | Navigation in Listen |

---

## Screen Reader Support

### ARIA Labels

```html
<button aria-label="Filter zurücksetzen">Reset</button>
<div role="region" aria-label="Zeitreihendiagramm">...</div>
<table aria-describedby="table-caption">...</table>
```

### Live Regions

```html
<div aria-live="polite" aria-atomic="true">
  127 Datenpunkte gefunden
</div>
```

---

## Farbsehschwäche

Informationen werden nie nur durch Farbe vermittelt:

| Unterscheidung | Zusätzlicher Marker |
|----------------|---------------------|
| Universitätstypen | Linienstil, Symbol |
| Trend (positiv/negativ) | Pfeil-Icon |
| Fehler/Erfolg | Icon + Text |

Siehe auch: [[Farbpalette]]

---

## Offene Punkte

- [ ] Erweiterte Screen Reader Tests
- [ ] High-Contrast Mode
- [ ] Vergrößerung bis 200% testen

---

*Verknüpft mit: [[Farbpalette]], [[UI-Prinzipien]]*
