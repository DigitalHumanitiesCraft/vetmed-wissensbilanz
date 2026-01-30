---
created: 2026-01-30
status: validated
aliases: [Farben, Design-Tokens]
tags: [status/validated, phase/implementation]
---

# Farbpalette

Design-Tokens für das Wissensbilanz-Dashboard.

---

## Universitäts-Typ-Farben (V1)

| Typ | Hex | CSS-Variable | Verwendung |
|-----|-----|--------------|------------|
| Volluniversität | `#1a5490` | `--color-uni-voll` | Linien, Punkte, Badges |
| Technisch | `#28a745` | `--color-uni-tech` | |
| Medizinisch | `#dc3545` | `--color-uni-med` | VetMed! |
| Kunst | `#6f42c1` | `--color-uni-kunst` | |
| Weiterbildung | `#fd7e14` | `--color-uni-weiterb` | |

---

## Basis-Farben

| Verwendung | Hex | CSS-Variable |
|------------|-----|--------------|
| Primär | `#1a5490` | `--color-primary` |
| Hintergrund | `#ffffff` | `--color-bg` |
| Text | `#212529` | `--color-text` |
| Text (gedämpft) | `#5a6268` | `--color-text-muted` |
| Rahmen (dekorativ) | `#dee2e6` | `--color-border` |
| Rahmen (UI) | `#8e959c` | `--color-keyline` |

---

## Kontrast-Verhältnisse (WCAG 2.1 AA)

| Kombination | Verhältnis | Status |
|-------------|------------|--------|
| Text auf Hintergrund | 12.63:1 | erfüllt |
| Gedämpfter Text | 6.21:1 | erfüllt |
| Keyline auf Hintergrund | 3.03:1 | erfüllt (1.4.11) |
| Uni-Farben auf Weiß | 5.49-8.56:1 | erfüllt |

---

## CSS-Definition

```css
:root {
    /* Universitätstypen */
    --color-uni-voll: #1a5490;
    --color-uni-tech: #28a745;
    --color-uni-med: #dc3545;
    --color-uni-kunst: #6f42c1;
    --color-uni-weiterb: #fd7e14;

    /* Basis */
    --color-primary: #1a5490;
    --color-bg: #ffffff;
    --color-text: #212529;
    --color-text-muted: #5a6268;
    --color-border: #dee2e6;
    --color-keyline: #8e959c;
}
```

---

## Farbsehschwäche

Für Nutzer mit Farbsehschwäche werden zusätzliche visuelle Marker verwendet:
- Verschiedene Linienstile (durchgezogen, gestrichelt, gepunktet)
- Verschiedene Datenpunktsymbole (Kreis, Quadrat, Dreieck)

---

*Verknüpft mit: [[UI-Prinzipien]], [[Accessibility]], [[Universitaeten]]*
