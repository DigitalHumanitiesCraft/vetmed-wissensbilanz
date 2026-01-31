# CLAUDE.md - AI Assistant Guide

> Comprehensive guide for AI assistants working with the vetmed-wissensbilanz codebase.

## Project Overview

**vetmed-wissensbilanz** is an interactive dashboard for analyzing Austrian university knowledge balance data ("Wissensbilanz"). It serves dual purposes:
1. **Functional Tool**: Visualize and compare data across 22 Austrian universities with 19 metrics (2021-2024)
2. **Teaching Example**: Demonstrate "Promptotyping" methodology - rapid prototyping with LLM support

**Key Stakeholder**: Michael Forster (VetMed Wien)
**Live Demo**: https://chpollin.github.io/vetmed-wissensbilanz/

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vanilla JavaScript (ES6 Modules) | No build tools, no npm |
| Charting | Chart.js 4.4.1 | Loaded via CDN |
| State Management | Custom EventBus + Reactive State | ~500 lines total |
| Styling | Vanilla CSS + Custom Properties | 8 modular CSS files |
| Data Processing | Python 3 (openpyxl) | Excel-to-JSON conversion |
| Hosting | GitHub Pages | Static site from `docs/` folder |

**Important**: This project intentionally avoids build complexity. There is no `package.json`, no webpack, no npm. All dependencies are loaded via CDN or are self-contained.

## Directory Structure

```
vetmed-wissensbilanz/
├── docs/                          # Production app (GitHub Pages root)
│   ├── index.html                 # SPA entry point (335 lines)
│   ├── css/                       # Modular CSS design system
│   │   ├── tokens.css             # Design tokens, CSS custom properties
│   │   ├── layout.css             # Grid/flexbox layouts
│   │   ├── components.css         # Reusable component styles
│   │   ├── toolbar.css            # Toolbar-specific styles
│   │   ├── dashboard.css          # Chart/dashboard styles
│   │   ├── visualizations.css     # Chart-specific styles
│   │   ├── tutorial.css           # Tutorial/learning page styles
│   │   └── tutorial-badges.css    # Annotated interface system
│   ├── js/                        # Application code (~10,900 lines)
│   │   ├── app.js                 # Bootstrap & initialization
│   │   ├── core/                  # Infrastructure
│   │   │   ├── state.js           # Reactive state with validators
│   │   │   ├── eventBus.js        # Pub/Sub event system
│   │   │   ├── router.js          # URL routing for shareable state
│   │   │   └── logger.js          # Structured logging
│   │   ├── data/                  # Data layer
│   │   │   ├── dataLoader.js      # Lazy loading with caching
│   │   │   └── metadata.js        # Universities & metrics definitions
│   │   ├── components/            # UI components
│   │   │   ├── FilterPanel.js     # Sidebar filters
│   │   │   ├── Toolbar.js         # Metric selector & viz controls
│   │   │   ├── ChartContainer.js  # Chart rendering orchestrator
│   │   │   ├── DataTable.js       # Sortable table with sparklines
│   │   │   ├── ReportPanel.js     # LLM report generation
│   │   │   └── VizSelector.js     # Visualization type picker
│   │   ├── visualizations/        # 7 visualization types
│   │   │   ├── VizFactory.js      # Factory pattern for viz creation
│   │   │   ├── LineChart.js       # Time series
│   │   │   ├── SmallMultiples.js  # Grid of mini-charts
│   │   │   ├── Heatmap.js         # University × Year matrix
│   │   │   ├── RankingChart.js    # Horizontal bar chart
│   │   │   ├── DualAxisChart.js   # Two metrics, left/right axes
│   │   │   ├── ScatterChart.js    # Correlation analysis
│   │   │   └── SparklineRenderer.js # Mini time series
│   │   ├── utils/                 # Shared utilities
│   │   │   ├── colorUtils.js      # Centralized color management
│   │   │   └── formatUtils.js     # Number/date formatting
│   │   └── tutorial/              # Educational system
│   │       ├── TutorialBadgeSystem.js # Annotated interface manager
│   │       ├── TutorialBadge.js       # Individual badge component
│   │       ├── PromptotypingPage.js   # Tutorial page
│   │       ├── VaultBrowser.js        # Markdown documentation viewer
│   │       └── AnnotationModal.js     # Modal for badge annotations
│   └── data/json/                 # Converted data (19 JSON files)
├── knowledge/                     # Obsidian Vault (35 Markdown docs)
│   ├── 00-Meta/                   # Glossary, methodology
│   ├── 01-Domaene/                # Domain knowledge (universities, metrics)
│   ├── 02-Design/                 # UI/UX decisions, color palette
│   ├── 03-Hypothesen/             # User stories (H1-H4)
│   ├── 04-Learnings/              # Distilled insights (L001-L009)
│   └── 05-Journal/                # Development chronology
├── scripts/                       # Python data processing
│   ├── convert.py                 # Main Excel-to-JSON converter
│   └── exploration/               # Data analysis scripts
├── data/                          # Excel source files (gitignored)
└── README.md                      # Project documentation (German)
```

## Key Files Reference

### Core Infrastructure

| File | Purpose | Key Exports |
|------|---------|-------------|
| `docs/js/core/state.js` | Centralized app state | `state` singleton |
| `docs/js/core/eventBus.js` | Component communication | `eventBus`, `EVENTS` |
| `docs/js/core/router.js` | URL parameter sync | `router` singleton |
| `docs/js/core/logger.js` | Structured logging | `log`, `logBoot` |

### Data Layer

| File | Purpose | Key Exports |
|------|---------|-------------|
| `docs/js/data/metadata.js` | Universities & metrics definitions | `UNIVERSITIES`, `KENNZAHLEN`, `UNI_TYPES` |
| `docs/js/data/dataLoader.js` | Fetch & cache JSON data | `dataLoader` |

### Entry Point Flow

```
index.html
  ↓
app.js (ES6 module)
  ├── state.init() (already done in constructor)
  ├── initComponents()
  │   ├── initToolbar()
  │   ├── initFilterPanel()
  │   ├── initChartContainer()
  │   ├── initDataTable()
  │   ├── initReportPanel()
  │   └── initTutorialBadgeSystem()
  ├── initTopNav()
  ├── initTabs()
  └── router.init() ← reads URL params, triggers initial load
```

## Architecture Patterns

### State Management

All state changes go through the centralized `state` singleton:

```javascript
import { state } from './core/state.js';

// Read
const unis = state.get('selectedUniversities');

// Write (triggers validators + events)
state.set('selectedUniversities', ['UI', 'UM']);

// Subscribe to changes
state.subscribe('selectedUniversities', (newValue, oldValue) => {
    // React to change
});

// Batch updates (single event at end)
state.batch({
    selectedUniversities: ['UI'],
    yearRange: { start: 2022, end: 2024 }
});
```

**Important State Keys**:
- `selectedUniversities`: Array of uni codes (e.g., `['UI', 'UM']`)
- `selectedKennzahl`: Metric code (e.g., `'1-A-1'`)
- `yearRange`: `{ start: number, end: number }`
- `vizType`: `'line' | 'smallMultiples' | 'heatmap' | 'ranking'`
- `dualMode`: boolean for dual-metric visualizations
- `secondaryKennzahl`: Second metric code for dual-mode
- `combinationType`: `'dualAxis' | 'ratio' | 'scatter' | null`

### Event Bus

Components communicate via the EventBus (Pub/Sub pattern):

```javascript
import { eventBus, EVENTS } from './core/eventBus.js';

// Listen
eventBus.on(EVENTS.FILTER_CHANGE, (filterState) => {
    // Handle filter change
});

// Emit
eventBus.emit(EVENTS.FILTER_CHANGE, state.getFilterState());

// Debounced emit (for frequent events)
eventBus.emitDebounced(EVENTS.FILTER_CHANGE, data, 100);
```

**Key Events**:
- `FILTER_CHANGE`: Filter state changed
- `DATA_LOADED`: New data loaded
- `VIZ_CHANGE`: Visualization type changed
- `TAB_CHANGE`: Active tab changed
- `TUTORIAL_BADGE_CLICK`: Tutorial badge clicked

### Factory Pattern (Visualizations)

```javascript
import { VizFactory } from './visualizations/VizFactory.js';

// Create visualization based on type
const chart = VizFactory.create(vizType, container, data, options);
```

## Coding Conventions

### JavaScript

1. **ES6 Modules**: Use `import`/`export`, no CommonJS
2. **No Build Tools**: Code runs directly in browser
3. **German Comments**: Code comments are in German (domain context)
4. **JSDoc**: Use JSDoc for function documentation
5. **Singleton Pattern**: Core services (`state`, `eventBus`, `router`, `log`) are singletons
6. **Event-Driven**: Components communicate via EventBus, not direct calls

### CSS

1. **CSS Custom Properties**: Use `--color-*`, `--spacing-*` tokens from `tokens.css`
2. **BEM-like Naming**: `.component__element--modifier`
3. **No Preprocessors**: Plain CSS only
4. **Modular Files**: Each concern in its own file

### File Naming

- JavaScript: `PascalCase.js` for components, `camelCase.js` for utilities
- CSS: `kebab-case.css`
- JSON data: Metric codes like `1-A-1.json`, `2-A-5.json`

## Common Tasks

### Running the Application Locally

```bash
# Option 1: Python simple server
cd docs
python -m http.server 8000
# Then open http://localhost:8000

# Option 2: Any static file server
npx serve docs
```

### Converting Excel Data to JSON

```bash
cd scripts
python convert.py
# Output goes to docs/data/json/
```

The converter reads from `data/*.xlsx` and outputs to `docs/data/json/`.

### Adding a New Metric

1. Add Excel file to `data/` folder
2. Update `scripts/convert.py` to handle the new file
3. Add metadata entry in `docs/js/data/metadata.js`:
   ```javascript
   {
       code: 'X-Y-Z',
       name: 'Metric Name',
       category: 'personal|studierende|forschung',
       unit: 'Köpfe|%|VZÄ|Anzahl|€',
       description: 'Description',
       filename: 'X-Y-Z.json'
   }
   ```
4. Run `python scripts/convert.py`

### Adding a New Visualization Type

1. Create new file in `docs/js/visualizations/` (follow `LineChart.js` pattern)
2. Register in `VizFactory.js`
3. Add to `vizType` validator in `state.js`
4. Add UI control in `Toolbar.js` or `VizSelector.js`

## Data Format

### University Codes

Universities use official Wissensbilanz codes:
- `UA` = Universität Wien
- `UI` = VetMed Wien (default selection)
- `UE` = TU Wien
- See `docs/js/data/metadata.js` for complete list

### JSON Data Structure

Each metric JSON file follows this structure:
```json
{
  "metadata": {
    "code": "1-A-1",
    "name": "Personal - Köpfe",
    "unit": "Köpfe",
    "years": [2021, 2022, 2023, 2024]
  },
  "data": [
    { "university": "UA", "year": 2021, "value": 1234 },
    { "university": "UA", "year": 2022, "value": 1256 },
    ...
  ]
}
```

## Testing

**Current Status**: No automated tests. Testing is manual/exploratory.

When implementing changes:
1. Test in browser with live demo
2. Check browser console for errors
3. Test filter combinations
4. Verify URL sharing works (router)
5. Test responsive behavior

## Documentation

### Knowledge Base (Obsidian Vault)

The `knowledge/` folder is an Obsidian vault with structured documentation:
- **00-Meta/**: Project methodology, glossary
- **01-Domaene/**: Domain knowledge (universities, metrics, data sources)
- **02-Design/**: UI/UX decisions, color palette, accessibility
- **03-Hypothesen/**: User stories (H1-H4)
- **04-Learnings/**: Documented insights (L001-L009)
- **05-Journal/**: Development log by date

### Learning IDs

Learnings are referenced by ID (e.g., `L006`) and linked throughout the codebase:
- `L001` - Iterative Synthesis
- `L006` - Vanilla JS Learnability
- `L009` - Annotated Interface Pattern

## Important Notes for AI Assistants

### DO

- Follow existing patterns (EventBus, State, VizFactory)
- Keep code in ES6 modules
- Use German for comments (matches existing codebase)
- Update `metadata.js` when adding universities/metrics
- Test changes in browser before committing
- Use CSS custom properties from `tokens.css`

### DON'T

- Add npm/package.json (project is intentionally build-free)
- Use CommonJS (`require`/`module.exports`)
- Create new state management patterns (use existing `state.js`)
- Add TypeScript (pure JS project)
- Modify data JSON files directly (regenerate via Python)

### Edge Cases to Watch

1. **Empty Data**: Some metrics have null values; handle gracefully
2. **Single University**: Charts should work with 1 or 22 universities
3. **Year Range**: Currently 2021-2024; validators allow 2019-2030
4. **Division by Zero**: Trend calculations handle zero denominators
5. **Donau-Uni Krems**: Special case for metric 3-A-1 (only university with data)

## Debugging

The app exposes a global debug object:

```javascript
// In browser console:
wissensbilanz.state.debug()      // Show current state
wissensbilanz.eventBus.debug()   // Show registered events
wissensbilanz.log.enable('*')    // Enable all logging
wissensbilanz.log.disable('*')   // Disable logging
```

## Git Workflow

- Main branch for production
- Feature branches for development
- Commit messages in English
- Push to GitHub triggers GitHub Pages deployment

## Links

- **Repository**: https://github.com/chpollin/vetmed-wissensbilanz
- **Live Demo**: https://chpollin.github.io/vetmed-wissensbilanz/
- **Data Source**: https://unidata.gv.at (Austrian university data portal)
