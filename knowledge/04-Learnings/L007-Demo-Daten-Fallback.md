---
created: 2026-01-30
tags: [learning, robustheit]
---

# L007: Demo-Daten als Fallback-Strategie

**Datum:** 2026-01-30
**Kontext:** Dashboard-Entwicklung ohne sofort verfügbare JSON-Daten

---

## Learning

Wenn die echten Daten noch nicht konvertiert sind, sollte das Dashboard trotzdem funktionieren. Ein Demo-Daten-Generator ermöglicht:

1. Fruehes Testen der UI ohne Datenabhaengigkeit
2. Demonstration auch ohne finale Daten
3. Schnelleres Iterieren waehrend der Entwicklung

---

## Implementierung

```javascript
// dataLoader.js
async loadKennzahl(kennzahlCode) {
    try {
        const response = await fetch(`${this.basePath}${filename}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.cache.set(kennzahlCode, data);
        return data;
    } catch (error) {
        // Fallback: Demo-Daten generieren
        const demoData = this.generateDemoData(kennzahlCode);
        this.cache.set(kennzahlCode, demoData);
        return demoData;
    }
}
```

---

## Demo-Daten-Eigenschaften

| Eigenschaft | Wert |
|-------------|------|
| Universitäten | UI, UN, UO, UE, UA (5 Stück) |
| Jahre | 2021-2024 |
| Werte | Zufällig, aber plausibel (500-1500) |
| Trend | Leichte jährliche Variation (±5%) |

---

## Regel

> Baue Robustheit ein: Das System sollte auch mit fehlenden Daten sinnvoll reagieren, nicht abstürzen.

---

*Verknüpft mit: [[Datenquellen]], [[L006-Vanilla-JS-Lernbarkeit]]*
