/**
 * Logger - Zentrales Logging-System
 *
 * Kompaktes, präzises Logging mit Modul-Prefixen.
 * Kann via localStorage aktiviert/deaktiviert werden.
 *
 * Verwendung:
 *   import { log } from './logger.js';
 *   log.info('DataLoader', 'loaded', { count: 25 });
 *   log.error('Chart', 'render failed', error);
 *
 * Aktivierung in der Browser-Konsole:
 *   localStorage.setItem('debug', 'true');
 *   location.reload();
 */

const DEBUG = localStorage.getItem('debug') === 'true';

/**
 * Boot-Log: Kompakte Übersicht beim App-Start (immer sichtbar)
 */
export function logBoot(components, state) {
    const style = 'color: #1a5490; font-weight: bold;';
    const styleGreen = 'color: #28a745;';
    const styleGray = 'color: #6c757d;';

    console.log('%c┌─ Wissensbilanz Dashboard ─────────────────────────┐', style);
    console.log('%c│ Components:', style);

    Object.entries(components).forEach(([name, instance]) => {
        const status = instance ? '✓' : '✗';
        const statusStyle = instance ? styleGreen : 'color: #dc3545;';
        console.log(`%c│   ${status} ${name}`, statusStyle);
    });

    console.log('%c│', style);
    console.log('%c│ State:', style);
    console.log(`%c│   Universitäten: ${state.selectedUniversities?.length || 0} ausgewählt`, styleGray);
    console.log(`%c│   Kennzahl: ${state.selectedKennzahl || 'keine'}`, styleGray);
    console.log(`%c│   Zeitraum: ${state.yearRange?.start}-${state.yearRange?.end}`, styleGray);
    console.log(`%c│   VizType: ${state.vizType || 'line'}`, styleGray);
    console.log(`%c│   Page: ${state.activePage || 'dashboard'}`, styleGray);
    console.log(`%c│   Tab: ${state.activeTab || 'chart'}`, styleGray);

    console.log('%c│', style);
    console.log(`%c│ Debug: ${DEBUG ? 'ON (localStorage.debug=true)' : 'OFF (run log.enable())'}`, styleGray);
    console.log('%c└───────────────────────────────────────────────────┘', style);
}

export const log = {
    /**
     * Info-Level: Normale Operationen
     */
    info(module, message, data = null) {
        if (!DEBUG) return;
        const output = data ? `[${module}] ${message} ${JSON.stringify(data)}` : `[${module}] ${message}`;
        console.log(output);
    },

    /**
     * Warn-Level: Unerwartete aber handhabbare Situationen
     */
    warn(module, message, data = null) {
        const output = data ? `[${module}] ${message} ${JSON.stringify(data)}` : `[${module}] ${message}`;
        console.warn(output);
    },

    /**
     * Error-Level: Fehler die behandelt werden müssen
     */
    error(module, message, error = null) {
        const errorMsg = error?.message || error || '';
        console.error(`[${module}] ${message}${errorMsg ? ': ' + errorMsg : ''}`);
    },

    /**
     * Zeigt State-Objekt in kompakter Form
     */
    state(module, state) {
        if (!DEBUG) return;
        console.log(`[${module}] state:`, state);
    },

    /**
     * Gruppiertes Logging für zusammenhängende Operationen
     */
    group(module, label) {
        if (!DEBUG) return;
        console.group(`[${module}] ${label}`);
    },

    groupEnd() {
        if (!DEBUG) return;
        console.groupEnd();
    },

    /**
     * Aktiviert Debug-Modus
     */
    enable() {
        localStorage.setItem('debug', 'true');
        console.log('[Logger] Debug enabled. Reload page to see logs.');
    },

    /**
     * Deaktiviert Debug-Modus
     */
    disable() {
        localStorage.removeItem('debug');
        console.log('[Logger] Debug disabled.');
    }
};

// Für direkten Zugriff in der Browser-Konsole
if (typeof window !== 'undefined') {
    window.log = log;
}
