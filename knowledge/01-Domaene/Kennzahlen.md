---
created: 2026-01-22
updated: 2026-01-30
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
| 3-A-1 | Außerordentliche Studienabschlüsse | Anzahl | `3-A-1.json` |
| 3-A-2 | Studienabschlüsse in Toleranzstudiendauer | % | `3-A-2.json` |
| 3-A-3 | Studienabschlüsse mit Auslandsaufenthalt | Anzahl | `3-A-3.json` |

---

## Bereich 4: Finanzen

| Code | Name | Einheit | JSON |
|------|------|---------|------|
| 4-A-1 | Drittmittel | EUR | - |

---

## Konvertierungsstatus

| Status | Anzahl | Details |
|--------|--------|---------|
| ✓ Konvertiert | 19 | JSON in `docs/data/json/` |
| ○ Fehlend | 1 | 4-A-1 (keine Quelldatei) |

### Spezialkonverter

Einige Kennzahlen haben abweichende Excel-Strukturen und benötigen Spezialkonverter:

| Code | Konverter | Besonderheit |
|------|-----------|--------------|
| 3-A-1 | `scripts/convert_3a1.py` | Nur Donau-Uni Krems (UM), 3 Jahre |
| 3-A-3 | `scripts/convert_3a3.py` | Buchstaben-Codes (A-W), 21 Unis |

### Fehlende Kennzahlen

| Code | Name | Excel vorhanden | Status |
|------|------|-----------------|--------|
| 4-A-1 | Drittmittel | ✗ | Quelldatei bei UniData anfordern |

### Nächste Schritte

1. **4-A-1 Drittmittel:** Quelldatei bei UniData anfordern oder manuell erstellen

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

## Extended Views (Kennzahl-Kombinationen)

Sinnvolle Kombinationen von Kennzahlen für erweiterte Analysen.

### Personal-Intensität

| Kennzahl | Einheit | Berechnung |
|----------|---------|------------|
| 1-A-1 | Köpfe | Basis |
| 1-A-1-VZA | VZÄ | Basis |
| **Beschäftigungsgrad** | % | VZÄ / Köpfe × 100 |

### Gleichstellung

| Kennzahl | Einheit | Insight |
|----------|---------|---------|
| 1-A-3 | % | Frauenanteil Kollegialorgane |
| 1-A-4 | % | Gender Pay Gap |
| 1-A-5 | % | Frauen in Berufungsverfahren |
| **Korrelation** | - | 1-A-5 ↔ 1-A-4 zeitversetzt |

### Studienerfolg

| Kennzahl | Einheit | Insight |
|----------|---------|---------|
| 2-A-5 | Köpfe | Studierende gesamt |
| 2-A-6 | Köpfe | Prüfungsaktive |
| 3-A-2 | % | Abschlüsse in Toleranzzeit |
| **Aktivitätsquote** | % | 2-A-6 / 2-A-5 × 100 |

### Betreuungsrelation

| Kennzahl | Einheit | Insight |
|----------|---------|---------|
| 2-A-1 | Köpfe | ProfessorInnen |
| 2-A-5 | Köpfe | Studierende |
| **Betreuungsverhältnis** | Ratio | 2-A-5 / 2-A-1 |

### Mobilität

| Kennzahl | Einheit | Insight |
|----------|---------|---------|
| 2-A-8 | Köpfe | Outgoing |
| 2-A-9 | Köpfe | Incoming |
| **Netto-Mobilität** | Köpfe | 2-A-9 - 2-A-8 |
| **Mobilitätsquote** | % | (2-A-8 + 2-A-9) / 2-A-5 × 100 |

---

## Implementierungsstatus im Dashboard

| Funktion | Status |
|----------|--------|
| Einzelne Kennzahlen | ✓ implementiert |
| Extended Views | ○ geplant |
| Berechnete Kennzahlen | ○ geplant |
| Korrelationsanalyse | ○ Backlog |

---

*Verknüpft mit: [[Datenquellen]], [[Universitaeten]], [[Excel-Struktur]]*
