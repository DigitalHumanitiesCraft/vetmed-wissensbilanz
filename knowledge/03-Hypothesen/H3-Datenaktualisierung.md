---
created: 2026-01-30
status: active
tags: [status/active, phase/destillation]
---

# H3: Datenaktualisierung

## User Story

> Als Wissensbilanz-Verantwortlicher will ich neue Jahresdaten selbst einpflegen koennen, ohne auf externe Hilfe angewiesen zu sein.

---

## Annahme

Der Fachverantwortliche ist fuer die laufende Aktualisierung verantwortlich und will nicht bei jedem Update einen Entwickler fragen muessen.

**Konfidenz:** mittel

---

## Implikation fuer das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| Einfacher Import-Workflow kritisch | Einmalige Konvertierung reicht |
| Dokumentation fuer Selbst-Update | Entwickler-Doku reicht |
| Evtl. Excel-Upload im Browser | Nur JSON-basiert |

---

## Technische Abhaengigkeit

Das technische Skill-Level beeinflusst diese Hypothese stark:

| Skill | Update-Methode |
|-------|----------------|
| Command Line / Python | Skript-basiert |
| Nur GUI | Browser-basierter Excel-Upload noetig |

---

## Aktuelle Implementierung

```bash
python scripts/convert_excel_to_json.py --file "neue_daten.xlsx"
```

**Dokumentation:** [[Datenquellen]]

---

*Verknuepft mit: [[03-Hypothesen/index]], [[Datenquellen]]*
