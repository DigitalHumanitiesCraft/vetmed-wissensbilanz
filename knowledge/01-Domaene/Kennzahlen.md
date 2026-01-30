---
created: 2026-01-22
status: validated
aliases: [Wissensbilanz-Kennzahlen, WB-Kennzahlen]
tags: [status/validated, phase/preparation]
---

# Kennzahlen

Offizielle Kennzahlen gemäß Wissensbilanz-Verordnung.

---

## Nummerierungsschema

```
[Bereich]-[Kategorie]-[Nummer]
    │         │          │
    │         │          └── Laufende Nummer
    │         └──────────── A = Pflicht, B = Optional
    └────────────────────── 1 = Personal, 2 = Studium, 3 = Abschlüsse, 4 = Finanzen
```

---

## Bereich 1: Personal & Gleichstellung

| Code | Name | Einheit | JSON |
|------|------|---------|------|
| 1-A-1 | Personal - Köpfe | Köpfe | `1-A-1.json` |
| 1-A-1-VZA | Personal - VZÄ | VZÄ | `1-A-1-VZA.json` |
| 1-A-2 | Berufungen an die Universität | Anzahl | `1-A-2.json` |
| 1-A-3 | Frauenquote in Kollegialorganen | % | `1-A-3.json` |
| 1-A-4 | Gender Pay Gap | % | `1-A-4.json` |
| 1-A-5 | Repräsentanz von Frauen in Berufungsverfahren | % | `1-A-5.json` |

---

## Bereich 2: Studium & Lehre

| Code | Name | Einheit | JSON |
|------|------|---------|------|
| 2-A-1 | ProfessorInnen und Äquivalente | Köpfe | `2-A-1.json` |
| 2-A-2 | Eingerichtete Studien | Anzahl | `2-A-2.json` |
| 2-A-3 | Studienabschlussquote | % | `2-A-3.json` |
| 2-A-4 | Besondere Zulassungsbedingungen | Anzahl | `2-A-4.json` |
| 2-A-5 | Anzahl Studierender | Köpfe | `2-A-5.json` |
| 2-A-6 | Anzahl Prüfungsaktive | Köpfe | `2-A-6.json` |
| 2-A-7 | Belegte ordentliche Studien | Anzahl | `2-A-7.json` |
| 2-A-8 | Ordentliche Studierende (Outgoing) | Köpfe | `2-A-8.json` |
| 2-A-9 | Ordentliche Studierende (Incoming) | Köpfe | `2-A-9.json` |
| 2-B-1 | Doktoratsstudierende mit Betreuungsverhältnis | Köpfe | `2-B-1.json` |

---

## Bereich 3: Studienabschlüsse

| Code | Name | Einheit | JSON |
|------|------|---------|------|
| 3-A-1 | Ordentliche Studienabschlüsse | Anzahl | - |
| 3-A-2 | Studienabschlüsse in Toleranzstudiendauer | % | `3-A-2.json` |
| 3-A-3 | Studienabschlüsse mit Auslandsaufenthalt | Anzahl | - |

---

## Bereich 4: Finanzen

| Code | Name | Einheit | JSON |
|------|------|---------|------|
| 4-A-1 | Drittmittel | EUR | - |

---

## Konvertierungsstatus

| Status | Anzahl | Details |
|--------|--------|---------|
| Konvertiert | 17 | JSON in `docs/data/json/` |
| Fehlend | 2 | 3-A-1, 3-A-3 (andere Struktur) |
| Nicht verfügbar | 2 | 4-A-x (keine Quelldaten) |

---

## Dimensionen pro Kennzahl

Die meisten Kennzahlen haben folgende Dimensionen:
- **Universität** (22 Werte, siehe [[Universitaeten]])
- **Jahr** (2021-2024)
- **Geschlecht** (Frauen, Männer, Gesamt)

Einige haben zusätzliche Dimensionen:
- Verwendungskategorie (Personal)
- Studienart (Bachelor, Master, Doktorat)
- ISCED-Klassifikation

---

*Verknüpft mit: [[Datenquellen]], [[Universitaeten]], [[Excel-Struktur]]*
