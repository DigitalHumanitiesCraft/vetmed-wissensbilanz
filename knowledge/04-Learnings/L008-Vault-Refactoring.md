---
created: 2026-01-30
tags: [learning, dokumentation]
---

# L008: Wissensstrukturierung als Obsidian Vault

**Datum:** 2026-01-30
**Kontext:** Refactoring der Wissensdokumente in strukturierten Vault

---

## Learning

Wenn ein Projekt wächst, werden flache Markdown-Dateien zu unübersichtlich. Die Umstrukturierung in einen Obsidian Vault bringt:

1. **Verknüpfungen** zwischen Konzepten durch Wikilinks
2. **Auffindbarkeit** durch Tags und Graph View
3. **Modularität** durch atomare Notes
4. **Nachvollziehbarkeit** durch explizite Beziehungen

---

## Vorher vs. Nachher

| Vorher | Nachher |
|--------|---------|
| 7 flache Dateien | 30+ verknüpfte Notes |
| Lange Dokumente | Atomare Konzepte |
| Implizite Verbindungen | Explizite Wikilinks |
| Lineare Lesereihenfolge | Netzwerk-Navigation |

---

## Struktur-Prinzipien

```
00-Meta/          # Projekt-Übersicht
01-Domaene/       # Fachwissen (stabil)
02-Design/        # Entscheidungen (semi-stabil)
03-Hypothesen/    # User Stories (temporaer)
04-Learnings/     # Destillierte Erkenntnisse (wachsend)
05-Journal/       # Chronologisches Log (append-only)
```

---

## Obsidian-Features nutzen

| Feature | Verwendung |
|---------|------------|
| `[[Wikilinks]]` | Interne Verknüpfungen |
| Frontmatter | Status, Tags, Aliases |
| Tags | Querverbindungen (#status/active) |
| Graph View | Wissensvisualisierung |
| Backlinks | Automatische Referenzen |

---

## Regel

> Strukturiere Wissen so, dass es wachsen kann. Atomare Notes mit expliziten Verbindungen skalieren besser als monolithische Dokumente.

---

## Meta-Aspekt

Dieses Learning dokumentiert seine eigene Entstehung - das Vault-Refactoring selbst ist Teil der [[Promptotyping-Methode]].

---

*Verknüpft mit: [[L004-Lehrbeispiel-Struktur]], [[Promptotyping-Methode]]*
