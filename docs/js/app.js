/**
 * App - Bootstrap und Initialisierung
 *
 * Einstiegspunkt der Single-Page Application.
 * Initialisiert alle Komponenten und verbindet sie.
 */

import { state } from './core/state.js';
import { eventBus, EVENTS } from './core/eventBus.js';
import { log, logBoot } from './core/logger.js';
import { router } from './core/router.js';
import { initFilterPanel } from './components/FilterPanel.js';
import { initChartContainer } from './components/ChartContainer.js';
import { initDataTable } from './components/DataTable.js';
import { initReportPanel } from './components/ReportPanel.js';
// VizSelector ist jetzt in der Toolbar integriert (index.html)
import { initPromptotypingPage } from './tutorial/PromptotypingPage.js';
import { initTutorialBadgeSystem, tutorialBadgeSystem } from './tutorial/TutorialBadgeSystem.js';
import { initAnnotationModal } from './tutorial/AnnotationModal.js';

class App {
    constructor() {
        this.components = {};
    }

    async init() {
        log.info('App', 'init');

        // DOM ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        // Komponenten initialisieren
        this.initComponents();

        // Top-Navigation (Dashboard / Promptotyping / About)
        this.initTopNav();

        // Tab-Navigation (Chart / Tabelle / Bericht)
        this.initTabs();

        // Sidebar Toggle (Mobile)
        this.initSidebarToggle();

        // Router initialisieren (F2: URL-Parameter Sync)
        router.init();

        // Boot-Log mit Übersicht
        logBoot(this.components, state.getFilterState());
    }

    initComponents() {
        // Filter Panel
        const sidebarEl = document.querySelector('.sidebar');
        if (sidebarEl) {
            this.components.filterPanel = initFilterPanel(sidebarEl);
        }

        // Chart Container (VizSelector ist jetzt in der Toolbar integriert)
        const chartEl = document.querySelector('#chartPanel');
        if (chartEl) {
            this.components.chart = initChartContainer(chartEl);
        }

        // Data Table
        const tableEl = document.querySelector('#tablePanel');
        if (tableEl) {
            this.components.table = initDataTable(tableEl);
        }

        // Report Panel
        const reportEl = document.querySelector('#reportPanel');
        if (reportEl) {
            this.components.report = initReportPanel(reportEl);
        }

        // Promptotyping Page (Tutorial)
        const promptotypingEl = document.querySelector('#promptotypingPanel');
        if (promptotypingEl) {
            this.components.promptotyping = initPromptotypingPage(promptotypingEl);
        }

        // Tutorial Badge System (Annotated Interface)
        this.components.tutorialBadges = initTutorialBadgeSystem();
        this.components.annotationModal = initAnnotationModal();

        // Level-Up Notification Handler
        eventBus.on(EVENTS.TUTORIAL_LEVEL_UP, ({ level, name }) => {
            this.showLevelUpNotification(level, name);
        });

        // Header Tutorial Toggle
        this.initTutorialToggle();
    }

    /**
     * Initialisiert den Tutorial-Toggle im Header
     */
    initTutorialToggle() {
        const toggle = document.querySelector('#tutorialToggle');
        if (!toggle) return;

        // Initial-Zustand aus State
        toggle.checked = state.get('tutorialMode') || false;

        // Bei Änderung
        toggle.addEventListener('change', () => {
            tutorialBadgeSystem.toggle();
        });

        // State-Änderungen synchronisieren (von anderen Toggles)
        eventBus.on(EVENTS.TUTORIAL_MODE_CHANGE, (isActive) => {
            toggle.checked = isActive;
        });
    }

    /**
     * Zeigt Level-Up Toast Notification
     */
    showLevelUpNotification(level, name) {
        const toast = document.createElement('div');
        toast.className = 'level-up-toast';
        toast.innerHTML = `
            <span class="level-up-toast__icon">+</span>
            <div class="level-up-toast__text">
                Level <span class="level-up-toast__level">${level}</span> freigeschaltet: ${name}!
            </div>
        `;
        document.body.appendChild(toast);

        // Nach 4.5 Sekunden entfernen
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4500);
    }

    initTopNav() {
        const navButtons = document.querySelectorAll('.top-nav__item');
        const pages = document.querySelectorAll('.page');
        const sidebar = document.querySelector('.sidebar');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const pageId = btn.dataset.page;

                // Nav-Buttons aktualisieren
                navButtons.forEach(b => b.classList.remove('top-nav__item--active'));
                btn.classList.add('top-nav__item--active');

                // Seiten aktualisieren
                pages.forEach(page => {
                    page.classList.toggle('page--active', page.id === `${pageId}Page`);
                });

                // Sidebar nur auf Dashboard-Seite anzeigen
                if (sidebar) {
                    sidebar.style.display = pageId === 'dashboard' ? '' : 'none';
                }

                // State aktualisieren
                state.set('activePage', pageId);
                eventBus.emit(EVENTS.PAGE_CHANGE, pageId);
            });
        });
    }

    initTabs() {
        // Tab-Logik ist jetzt in der Toolbar (index.html)
        // Diese Methode bleibt für Kompatibilität, macht aber nichts mehr
    }

    initSidebarToggle() {
        const toggleBtn = document.querySelector('#sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('is-open');
                backdrop?.classList.toggle('is-visible');
            });

            backdrop?.addEventListener('click', () => {
                sidebar.classList.remove('is-open');
                backdrop.classList.remove('is-visible');
            });
        }
    }

}

// App starten
const app = new App();
app.init().catch(console.error);

// Für Debugging im Browser
window.wissensbilanz = {
    state,
    eventBus,
    router,
    app,
    log,
    tutorialBadgeSystem
};
