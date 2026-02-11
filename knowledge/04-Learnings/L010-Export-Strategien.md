---
created: 2026-02-11
status: active
aliases: [Export-Utilities, Multi-Format-Export]
tags: [status/active, phase/implementation]
---

# L010: Zentrale Export-Utilities für Multi-Format-Export

**Datum:** 2026-02-11
**Kontext:** Erweiterung der Export-Funktionalität um mehrere Formate (PNG, CSV, Excel, JSON)

---

## Learning

**Zentrale Export-Utilities mit formatspezifischen Funktionen ermöglichen konsistente Exports über alle Visualisierungstypen hinweg.**

Statt Einzelimplementierungen in jeder Visualisierung zu duplizieren, sollten Export-Funktionen in einer zentralen Utility-Datei gebündelt werden. Dies bietet:

1. **Konsistenz**: Alle Exporte nutzen dieselbe Dateinamen-Konvention
2. **Wiederverwendbarkeit**: Code-Duplikation wird vermieden
3. **Erweiterbarkeit**: Neue Formate können zentral hinzugefügt werden
4. **Wartbarkeit**: Änderungen müssen nur an einer Stelle erfolgen

---

## Beispiel aus diesem Projekt

### Vorher (dupliziertCode in jeder Visualisierung)

```javascript
// In LineChart.js
exportAsPng() {
    const kennzahl = state.get('selectedKennzahl') || 'chart';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `wissensbilanz_${kennzahl}_${timestamp}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = this.chart.toBase64Image('image/png', 1);
    link.click();
}

// In DualAxisChart.js - fast identischer Code
exportAsPng() {
    const primary = state.get('selectedKennzahl') || 'chart';
    const secondary = state.get('secondaryKennzahl') || '';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `wissensbilanz_${primary}_vs_${secondary}_${timestamp}.png`;
    // ... identischer Download-Code
}
```

**Problem:** Code-Duplikation über 7 Visualisierungstypen.

### Nachher (zentrale Export-Utilities)

```javascript
// utils/exportUtils.js
export function generateFilename(extension, vizType = 'chart') {
    const kennzahl = state.get('selectedKennzahl') || 'export';
    const timestamp = new Date().toISOString().split('T')[0];
    return `wissensbilanz_${kennzahl}_${vizType}_${timestamp}.${extension}`;
}

export function exportChartAsPng(chart, vizType = 'chart') {
    if (!chart) return;
    const filename = generateFilename('png', vizType);
    const link = document.createElement('a');
    link.download = filename;
    link.href = chart.toBase64Image('image/png', 1);
    link.click();
}

export async function exportElementAsPng(element, vizType, options = {}) {
    const canvas = await html2canvas(element, options);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    triggerDownload(blob, generateFilename('png', vizType));
}

// In jeder Visualisierung jetzt nur noch:
exportAsPng() {
    exportChartAsPng(this.chart, 'line');
}
```

**Vorteile:**
- ✅ Eine Zeile statt 8 Zeilen pro Visualisierung
- ✅ Konsistente Dateinamen über alle Charts
- ✅ Einfach neue Formate hinzuzufügen (Excel, JSON)

---

## Implementierte Export-Formate

| Format | Funktion | Use Case | Library |
|--------|----------|----------|---------|
| **PNG** | `exportChartAsPng()` | Chart.js-basierte Charts | Chart.js native |
| **PNG** | `exportElementAsPng()` | Custom-Charts (Heatmap, Ranking) | html2canvas |
| **CSV** | `exportDataAsCsv()` | Tabellendaten | Native (Blob) |
| **Excel** | `exportDataAsExcel()` | Tabellendaten mit Formatierung | ExcelJS |
| **JSON** | `exportDataAsJson()` | Rohdaten für Weiterverarbeitung | Native (JSON) |

---

## Architektur-Entscheidungen

### 1. Zwei PNG-Export-Strategien

**Grund:** Chart.js hat native PNG-Export-Funktion (`toBase64Image()`), Custom-Charts benötigen html2canvas.

```javascript
// Strategie A: Chart.js-native (LineChart, DualAxis, Scatter)
export function exportChartAsPng(chart, vizType) {
    link.href = chart.toBase64Image('image/png', 1);
}

// Strategie B: html2canvas (Heatmap, Ranking, SmallMultiples)
export async function exportElementAsPng(element, vizType, options) {
    const canvas = await html2canvas(element, options);
}
```

### 2. Metadaten in Excel-Export

**Grund:** Excel-Exporte sollten selbsterklärend sein - Nutzer wissen später noch, welche Filter aktiv waren.

```javascript
// Sheet 1: Daten
// Sheet 2: Metadaten (Kennzahl, Zeitraum, Filter)
const metaSheet = workbook.addWorksheet('Metadaten');
metaSheet.addRow({ param: 'Kennzahl', value: kennzahl?.name });
metaSheet.addRow({ param: 'Export-Datum', value: new Date().toLocaleString('de-AT') });
```

### 3. BOM für CSV (UTF-8 Excel-Kompatibilität)

**Grund:** Excel benötigt BOM (`\ufeff`) um UTF-8 CSVs korrekt zu erkennen.

```javascript
const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
```

### 4. JSON mit Metadaten

**Grund:** JSON-Exporte sollten Filter-Kontext enthalten für spätere Reproduzierbarkeit.

```javascript
const exportData = {
    metadata: {
        kennzahl: state.get('selectedKennzahl'),
        exportDatum: new Date().toISOString(),
        filter: { universitaeten, zeitraum }
    },
    daten: data
};
```

---

## Dateinamen-Konvention

**Format:** `wissensbilanz_[kennzahl]_[visualisierungstyp]_[YYYY-MM-DD].[ext]`

**Beispiele:**
- `wissensbilanz_1-A-1_line_2026-02-11.png`
- `wissensbilanz_2-A-5_heatmap_2026-02-11.png`
- `wissensbilanz_1-A-1_datatable_2026-02-11.csv`
- `wissensbilanz_1-A-1_datatable_2026-02-11.xlsx`

**Vorteile:**
- Alphabetische Sortierung nach Datum
- Kennzahl im Dateinamen erkennbar
- Visualisierungstyp identifizierbar

---

## Integration: CDN vs. Build-Step

**Entscheidung:** CDN-basierte Libraries (html2canvas, ExcelJS) statt npm + Build.

**Grund:**
1. **Vanilla JS Ansatz** - kein Build-Step nötig (siehe [[L006-Vanilla-JS-Lernbarkeit]])
2. **GitHub Pages kompatibel** - funktioniert ohne Server-Side Build
3. **Einfachere Wartung** - Libraries können via CDN-URL aktualisiert werden

```html
<!-- in index.html -->
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js"></script>
```

**Trade-Off:** ~300KB zusätzliche Library-Größe, aber keine Build-Komplexität.

---

## Implementierte Visualisierungen

| Visualisierung | PNG | CSV | Excel | JSON |
|----------------|-----|-----|-------|------|
| LineChart | ✅ (Chart.js) | - | - | - |
| DualAxisChart | ✅ (Chart.js) | - | - | - |
| ScatterChart | ✅ (Chart.js) | - | - | - |
| Heatmap | ✅ (html2canvas) | - | - | - |
| RankingChart | ✅ (html2canvas) | - | - | - |
| SmallMultiples | ✅ (html2canvas) | - | - | - |
| DataTable | - | ✅ | ✅ | ✅ |

**Hinweis:** CSV/Excel/JSON für DataTable, da nur dort tabellarische Rohdaten verfügbar sind.

---

## Nächste Schritte (Backlog)

- [ ] **Batch-Export**: Alle Charts einer Session gleichzeitig exportieren
- [ ] **PDF-Export**: Multi-Page PDF mit allen Visualisierungen (pdfkit)
- [ ] **Auflösungs-Optionen**: HD/4K PNG-Export (scale: 2/3/4)
- [ ] **Export-Dropdown-Menü**: Statt einzelner Buttons ein Dropdown mit allen Formaten
- [ ] **Clipboard-API**: Direktes Kopieren von Charts in Zwischenablage

---

## Regel

> Zentralisiere Export-Logik in wiederverwendbaren Utilities, um Code-Duplikation zu vermeiden und konsistente Dateinamen-Konventionen durchzusetzen. Nutze formatspezifische Funktionen (PNG vs. Excel) und dokumentiere Trade-Offs (CDN vs. Build-Step).

---

## Siehe auch

- [[L006-Vanilla-JS-Lernbarkeit]] - Warum CDN statt npm
- [[L007-Demo-Daten-Fallback]] - Robustheit bei fehlenden Libraries
- [[UI-Prinzipien]] - Export-Buttons im UI-Design

---

**Verknüpft mit:** [[Promptotyping-Methode]], [[05-Journal/2026-02-11]]
