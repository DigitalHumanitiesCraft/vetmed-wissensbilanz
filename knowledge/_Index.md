# Wissensbilanz Dashboard - Vault Index

Dieser Ordner ist ein **Obsidian Vault** und dokumentiert das Promptotyping-Projekt zur Entwicklung eines Wissensbilanz-Dashboards für die VetMed Wien.

---

## Schnelleinstieg

| Ich will... | Dann lies... |
|-------------|--------------|
| Das Projekt verstehen | [[Use Case Wissensbilanz]] |
| LLM-Begriffe nachschlagen | [[Glossar]] |
| Die Datenquellen verstehen | [[Datenquellen]] |
| Design-Entscheidungen nachvollziehen | [[UI-Prinzipien]] |
| Den Entwicklungsprozess sehen | [[05-Journal/index]] |
| Aus dem Projekt lernen | [[04-Learnings/index]] |
| Das Tutorial-System verstehen | [[L009-Annotated-Interface]] |

---

## Vault-Struktur

```
knowledge/
├── 00-Meta/          # Projekt-Uebersicht und Methodik
├── 01-Domaene/       # Fachwissen (Unis, Kennzahlen, Daten)
├── 02-Design/        # UI/UX-Entscheidungen
├── 03-Hypothesen/    # User Stories und Annahmen
├── 04-Learnings/     # Destillierte Erkenntnisse
└── 05-Journal/       # Chronologisches Protokoll
```

---

## Promptotyping-Phasen

Das Projekt folgt der [[Promptotyping-Methode]]:

| Phase | Status | Dokumente |
|-------|--------|-----------|
| 1. Preparation | abgeschlossen | [[Datenquellen]], [[Universitaeten]], [[Kennzahlen]] |
| 2. Exploration | abgeschlossen | [[Excel-Struktur]], [[05-Journal/2026-01-22]] |
| 3. Destillation | abgeschlossen | [[UI-Prinzipien]], [[Glossar]] |
| 4. Implementation | abgeschlossen | Dashboard in `docs/` |
| 5. Meta-Learning | aktiv | [[L009-Annotated-Interface]], Tutorial-Badges |

---

## Wichtige Links

- **Live-Demo:** [chpollin.github.io/vetmed-wissensbilanz](https://chpollin.github.io/vetmed-wissensbilanz)
- **Repository:** [github.com/chpollin/vetmed-wissensbilanz](https://github.com/chpollin/vetmed-wissensbilanz)
- **Rohdaten:** [unidata.gv.at](https://unidata.gv.at/Pages/auswertungen.aspx)

---

## Tags

Dieser Vault verwendet folgende Tag-Konventionen:

- `#status/draft` | `#status/active` | `#status/validated`
- `#phase/preparation` | `#phase/exploration` | `#phase/destillation` | `#phase/implementation`

---

*Vault erstellt: 30. Januar 2026*
