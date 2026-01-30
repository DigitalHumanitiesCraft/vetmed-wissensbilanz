---
created: 2026-01-30
status: offen
tags: [validierung/offen, workshop/vorbereitung]
---

# H3: Datenaktualisierung

## User Story

> Als Wissensbilanz-Verantwortlicher will ich neue Jahresdaten selbst einpflegen können, ohne auf externe Hilfe angewiesen zu sein.

---

## Annahme

Forster ist für die laufende Aktualisierung verantwortlich und will nicht bei jedem Update einen Entwickler fragen müssen.

**Konfidenz:** mittel

---

## Validierungsfragen

1. "Was passiert, wenn neue Daten von UniData kommen?"
2. "Wer pflegt die Daten aktuell ein?"
3. "Wie oft kommen neue Daten?"

---

## Implikation für das Dashboard

| Wenn validiert | Wenn falsifiziert |
|----------------|-------------------|
| Einfacher Import-Workflow kritisch | Einmalige Konvertierung reicht |
| Dokumentation für Selbst-Update | Entwickler-Doku reicht |
| Evtl. Excel-Upload im Browser | Nur JSON-basiert |

---

## Technische Abhängigkeit

Forsters technisches Skill-Level beeinflusst diese Hypothese stark:

| Skill | Update-Methode |
|-------|----------------|
| Command Line / Python | Skript-basiert |
| Nur GUI | Browser-basierter Excel-Upload nötig |

---

## Aktuelle Implementierung

```bash
python scripts/convert_excel_to_json.py --file "neue_daten.xlsx"
```

**Dokumentation:** [[Datenquellen]]

---

## Status nach Workshop

- [ ] Validiert
- [ ] Falsifiziert
- [ ] Modifiziert

**Notizen:** (nach Workshop ausfüllen)

---

*Verknüpft mit: [[03-Hypothesen/index]], [[Datenquellen]]*
