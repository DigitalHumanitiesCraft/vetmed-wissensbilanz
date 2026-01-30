/**
 * PromptotypingPage - Tutorial-Tab mit Vault-Navigation
 *
 * Zeigt das Obsidian Vault als interaktives Tutorial:
 * - Navigation nach Promptotyping-Phasen
 * - Markdown-Rendering mit Vault-Link-Unterstützung
 * - Erklärung der Funktion jedes Dokuments
 */

import { vaultBrowser, VAULT_CATEGORIES, PROMPTOTYPING_PHASES } from './VaultBrowser.js';
import { MarkdownRenderer } from './MarkdownRenderer.js';
import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/eventBus.js';
import { log } from '../core/logger.js';
import { tutorialBadgeSystem } from './TutorialBadgeSystem.js';

class PromptotypingPage {
    constructor(container) {
        this.container = container;
        this.currentCategory = null;
        this.currentFile = null;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="promptotyping-page">
                <div class="promptotyping-sidebar">
                    <div class="promptotyping-intro">
                        <h2>Promptotyping Tutorial</h2>
                        <p>Dieses Dashboard dokumentiert seinen eigenen Entstehungsprozess.</p>
                        <p class="text-muted">Klicke auf eine Kategorie, um die zugehörigen Dokumente zu erkunden.</p>
                    </div>

                    <!-- Tutorial-Badge Toggle und Progress -->
                    <div class="tutorial-controls" id="tutorialControls">
                        <label class="toggle">
                            <input type="checkbox" id="tutorialModeToggle"
                                   ${state.get('tutorialMode') ? 'checked' : ''}>
                            <span class="toggle__slider"></span>
                            <span class="toggle__label">Badges anzeigen</span>
                        </label>
                        <div class="tutorial-progress" id="tutorialProgress">
                            ${this.renderProgress()}
                        </div>
                    </div>

                    <nav class="promptotyping-nav" id="promptotypingNav">
                        ${this.renderNavigation()}
                    </nav>
                </div>
                <div class="promptotyping-content">
                    <div class="promptotyping-welcome" id="promptotypingContent">
                        ${this.renderWelcome()}
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.attachTutorialListeners();
    }

    renderProgress() {
        const progress = tutorialBadgeSystem.getProgress();
        return `
            <div class="progress-bar">
                <div class="progress-bar__fill" style="width: ${progress.percentage}%"></div>
            </div>
            <span class="progress-text">
                ${progress.completed}/${progress.total}
                <span class="progress-level">(${progress.levelName})</span>
            </span>
        `;
    }

    updateProgress() {
        const progressEl = this.container.querySelector('#tutorialProgress');
        if (progressEl) {
            progressEl.innerHTML = this.renderProgress();
        }
    }

    attachTutorialListeners() {
        // Tutorial-Toggle
        const toggle = this.container.querySelector('#tutorialModeToggle');
        if (toggle) {
            toggle.addEventListener('change', () => {
                tutorialBadgeSystem.toggle();
            });

            // Synchronisiere mit globalem State
            eventBus.on(EVENTS.TUTORIAL_MODE_CHANGE, (isActive) => {
                toggle.checked = isActive;
            });
        }

        // Progress-Updates bei Annotation-Views
        eventBus.on(EVENTS.ANNOTATION_VIEWED, () => {
            this.updateProgress();
        });

        // Level-Up Updates
        eventBus.on(EVENTS.TUTORIAL_LEVEL_UP, () => {
            this.updateProgress();
        });

        // Document-Navigation von Modal
        window.addEventListener('tutorial:loadDocument', (e) => {
            const { category, filename } = e.detail;
            this.handleVaultLink(`${category}/${filename}`);
        });
    }

    renderNavigation() {
        const phases = vaultBrowser.getCategoriesByPhase();

        return phases.map(phase => `
            <div class="promptotyping-nav__phase">
                <div class="promptotyping-nav__phase-header">
                    <span class="promptotyping-nav__phase-order">${phase.order + 1}</span>
                    <span class="promptotyping-nav__phase-name">${phase.name}</span>
                </div>
                <p class="promptotyping-nav__phase-desc">${phase.description}</p>
                ${phase.categories.map(cat => `
                    <div class="promptotyping-nav__category" data-category="${cat.id}">
                        <div class="promptotyping-nav__category-header">
                            ${this.getIcon(cat.icon)}
                            <span>${cat.name}</span>
                        </div>
                        <div class="promptotyping-nav__files" data-category-files="${cat.id}">
                            ${cat.files.map(file => `
                                <a href="#" class="promptotyping-nav__file"
                                   data-category="${cat.id}"
                                   data-file="${file.name}"
                                   title="${file.purpose}">
                                    ${file.title}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    renderWelcome() {
        return `
            <div class="promptotyping-welcome__content">
                <h1>Lerne Promptotyping anhand dieses Dashboards</h1>

                <div class="promptotyping-welcome__intro">
                    <p>
                        <strong>Promptotyping</strong> ist eine Methode zur systematischen Entwicklung
                        von KI-gestützten Anwendungen. Dieses Dashboard demonstriert die Methode,
                        indem es seinen eigenen Entstehungsprozess dokumentiert.
                    </p>
                </div>

                <h2>Die 4 Phasen</h2>
                <div class="promptotyping-phases-grid">
                    ${Object.entries(PROMPTOTYPING_PHASES)
                        .filter(([id]) => ['preparation', 'exploration', 'destillation', 'meta'].includes(id))
                        .sort((a, b) => a[1].order - b[1].order)
                        .map(([id, phase]) => `
                            <div class="promptotyping-phase-card">
                                <div class="promptotyping-phase-card__number">${phase.order}</div>
                                <h3>${phase.name}</h3>
                                <p>${phase.description}</p>
                            </div>
                        `).join('')}
                </div>

                <h2>Dokumentenstruktur</h2>
                <p>
                    Die Dokumente in der linken Navigation zeigen, <strong>welches Dokument
                    welche Funktion</strong> im Promptotyping-Prozess hat:
                </p>

                <div class="promptotyping-doc-types">
                    ${Object.values(VAULT_CATEGORIES).map(cat => `
                        <div class="promptotyping-doc-type">
                            <div class="promptotyping-doc-type__header">
                                ${this.getIcon(cat.icon)}
                                <strong>${cat.name}</strong>
                            </div>
                            <p>${cat.description}</p>
                            <p class="text-muted"><em>Lernziel: ${cat.learningGoal}</em></p>
                        </div>
                    `).join('')}
                </div>

                <div class="promptotyping-cta">
                    <p>Wähle links eine Kategorie, um die Dokumente zu erkunden.</p>
                </div>
            </div>
        `;
    }

    async renderDocument(category, filename) {
        const contentEl = this.container.querySelector('#promptotypingContent');
        const categoryMeta = VAULT_CATEGORIES[category];
        const fileMeta = categoryMeta?.files.find(f => f.name === filename);

        // Loading-State
        contentEl.innerHTML = `
            <div class="promptotyping-loading">
                <div class="spinner"></div>
                <span>Dokument wird geladen...</span>
            </div>
        `;

        try {
            const { content, metadata } = await vaultBrowser.loadFile(category, filename);
            const html = MarkdownRenderer.render(content);

            contentEl.innerHTML = `
                <article class="promptotyping-article">
                    <header class="promptotyping-article__header">
                        <div class="promptotyping-article__breadcrumb">
                            <span class="promptotyping-article__category">
                                ${this.getIcon(categoryMeta.icon)}
                                ${categoryMeta.name}
                            </span>
                            <span class="promptotyping-article__phase-badge"
                                  data-phase="${categoryMeta.promptotypingPhase}">
                                Phase: ${PROMPTOTYPING_PHASES[categoryMeta.promptotypingPhase]?.name}
                            </span>
                        </div>
                        ${fileMeta ? `
                            <div class="promptotyping-article__purpose">
                                <strong>Funktion:</strong> ${fileMeta.purpose}
                            </div>
                        ` : ''}
                    </header>

                    <div class="promptotyping-article__content markdown-body">
                        ${html}
                    </div>

                    <footer class="promptotyping-article__footer">
                        <div class="promptotyping-article__meta">
                            ${metadata.created ? `<span>Erstellt: ${metadata.created}</span>` : ''}
                            ${metadata.status ? `<span>Status: ${metadata.status}</span>` : ''}
                        </div>
                        <div class="promptotyping-article__learning-goal">
                            <strong>Lernziel dieser Kategorie:</strong>
                            ${categoryMeta.learningGoal}
                        </div>
                    </footer>
                </article>
            `;

            // Vault-Links aktivieren
            this.activateVaultLinks(contentEl);

            // Navigation aktualisieren
            this.updateActiveNav(category, filename);

        } catch (error) {
            log.error('PromptotypingPage', `Failed to load document:`, error.message);
            contentEl.innerHTML = `
                <div class="promptotyping-error">
                    <h3>Dokument nicht gefunden</h3>
                    <p>Die Datei <code>${category}/${filename}</code> konnte nicht geladen werden.</p>
                    <button class="btn btn--primary" id="retryDocBtn">Erneut versuchen</button>
                </div>
            `;

            contentEl.querySelector('#retryDocBtn')?.addEventListener('click', () => {
                this.renderDocument(category, filename);
            });
        }
    }

    activateVaultLinks(container) {
        container.querySelectorAll('.vault-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.dataset.target;
                this.handleVaultLink(target);
            });
        });
    }

    handleVaultLink(target) {
        // Versuche, das Ziel in den Vault-Kategorien zu finden
        for (const [catId, cat] of Object.entries(VAULT_CATEGORIES)) {
            const file = cat.files.find(f =>
                f.name === target ||
                f.name === target + '.md' ||
                f.title === target ||
                target.includes(f.name.replace('.md', ''))
            );

            if (file) {
                this.renderDocument(catId, file.name);
                return;
            }
        }

        // Fallback: Suche nach Kategorie-Pfad
        if (target.includes('/')) {
            const [catPart, filePart] = target.split('/');
            const category = Object.keys(VAULT_CATEGORIES).find(k =>
                k.includes(catPart) || catPart.includes(k.replace(/^\d+-/, ''))
            );

            if (category) {
                const filename = filePart.endsWith('.md') ? filePart : filePart + '.md';
                this.renderDocument(category, filename);
                return;
            }
        }

        log.warn('PromptotypingPage', `Could not resolve vault link: ${target}`);
    }

    updateActiveNav(category, filename) {
        // Alle aktiven Klassen entfernen
        this.container.querySelectorAll('.promptotyping-nav__file--active').forEach(el => {
            el.classList.remove('promptotyping-nav__file--active');
        });
        this.container.querySelectorAll('.promptotyping-nav__category--expanded').forEach(el => {
            el.classList.remove('promptotyping-nav__category--expanded');
        });

        // Neue aktive Klassen setzen
        const activeFile = this.container.querySelector(
            `.promptotyping-nav__file[data-category="${category}"][data-file="${filename}"]`
        );
        if (activeFile) {
            activeFile.classList.add('promptotyping-nav__file--active');
        }

        const activeCategory = this.container.querySelector(
            `.promptotyping-nav__category[data-category="${category}"]`
        );
        if (activeCategory) {
            activeCategory.classList.add('promptotyping-nav__category--expanded');
        }
    }

    attachEventListeners() {
        // Kategorie-Header klicken = aufklappen
        this.container.querySelectorAll('.promptotyping-nav__category-header').forEach(header => {
            header.addEventListener('click', () => {
                const category = header.parentElement;
                category.classList.toggle('promptotyping-nav__category--expanded');
            });
        });

        // Datei klicken = laden
        this.container.querySelectorAll('.promptotyping-nav__file').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                const filename = link.dataset.file;
                this.currentCategory = category;
                this.currentFile = filename;
                this.renderDocument(category, filename);
            });
        });
    }

    getIcon(iconName) {
        const icons = {
            'book-open': `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>`,
            'database': `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>`,
            'palette': `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="13.5" cy="6.5" r=".5"></circle>
                <circle cx="17.5" cy="10.5" r=".5"></circle>
                <circle cx="8.5" cy="7.5" r=".5"></circle>
                <circle cx="6.5" cy="12.5" r=".5"></circle>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"></path>
            </svg>`,
            'lightbulb': `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
            </svg>`,
            'graduation-cap': `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>`,
            'calendar': `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>`
        };
        return icons[iconName] || '';
    }
}

export function initPromptotypingPage(container) {
    return new PromptotypingPage(container);
}
