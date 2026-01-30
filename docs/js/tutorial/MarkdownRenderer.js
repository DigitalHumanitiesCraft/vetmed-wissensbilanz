/**
 * MarkdownRenderer - Konvertiert Markdown zu HTML
 *
 * Unterstützt:
 * - Headings, Paragraphs, Lists
 * - Code-Blöcke mit Syntax-Highlighting (CSS-basiert)
 * - Tabellen
 * - Obsidian-Links [[...]] → klickbare Vault-Links
 * - Blockquotes
 * - Inline-Styles (bold, italic, code, links)
 */

export class MarkdownRenderer {
    /**
     * Rendert Markdown zu HTML
     * @param {string} markdown - Markdown-Inhalt
     * @param {Object} options - Optionen
     * @param {Function} options.onLinkClick - Callback für Vault-Link-Klicks
     * @returns {string} HTML
     */
    static render(markdown, options = {}) {
        let html = markdown;

        // 1. Code-Blöcke schützen (vor anderen Transformationen)
        const codeBlocks = [];
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const index = codeBlocks.length;
            codeBlocks.push({ lang, code: this.escapeHtml(code.trim()) });
            return `__CODE_BLOCK_${index}__`;
        });

        // 2. Inline-Code schützen
        const inlineCodes = [];
        html = html.replace(/`([^`]+)`/g, (match, code) => {
            const index = inlineCodes.length;
            inlineCodes.push(this.escapeHtml(code));
            return `__INLINE_CODE_${index}__`;
        });

        // 3. Tabellen konvertieren
        html = this.renderTables(html);

        // 4. Headings
        html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
        html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
        html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

        // 5. Blockquotes
        html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');
        // Aufeinanderfolgende blockquotes zusammenfassen
        html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

        // 6. Horizontale Linien
        html = html.replace(/^---+$/gm, '<hr>');

        // 7. Listen
        html = this.renderLists(html);

        // 8. Obsidian-Links [[...]]
        html = html.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, label) => {
            const displayText = label || target;
            const cleanTarget = target.replace(/\//g, '-').replace(/\s+/g, '-');
            return `<a href="#" class="vault-link" data-target="${this.escapeHtml(target)}">${this.escapeHtml(displayText)}</a>`;
        });

        // 9. Standard Markdown-Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // 10. Inline-Styles
        html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // 11. Paragraphen (Zeilen ohne spezielle Markup)
        html = html.split('\n\n').map(block => {
            // Überspringe bereits getaggte Blöcke
            if (block.trim().startsWith('<') || block.trim().startsWith('__')) {
                return block;
            }
            // Leere Blöcke überspringen
            if (!block.trim()) return '';
            // In Paragraph wrappen
            return `<p>${block.trim().replace(/\n/g, '<br>')}</p>`;
        }).join('\n');

        // 12. Code-Blöcke wiederherstellen
        codeBlocks.forEach((block, index) => {
            const langClass = block.lang ? ` language-${block.lang}` : '';
            html = html.replace(
                `__CODE_BLOCK_${index}__`,
                `<pre><code class="code-block${langClass}">${block.code}</code></pre>`
            );
        });

        // 13. Inline-Code wiederherstellen
        inlineCodes.forEach((code, index) => {
            html = html.replace(
                `__INLINE_CODE_${index}__`,
                `<code class="inline-code">${code}</code>`
            );
        });

        return html;
    }

    /**
     * Konvertiert Markdown-Tabellen zu HTML
     */
    static renderTables(markdown) {
        const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;

        return markdown.replace(tableRegex, (match, headerRow, bodyRows) => {
            // Header parsen
            const headers = headerRow.split('|').filter(h => h.trim());
            const headerHtml = headers.map(h => `<th>${h.trim()}</th>`).join('');

            // Body parsen
            const rows = bodyRows.trim().split('\n');
            const bodyHtml = rows.map(row => {
                const cells = row.split('|').filter(c => c.trim() !== '');
                const cellsHtml = cells.map(c => `<td>${c.trim()}</td>`).join('');
                return `<tr>${cellsHtml}</tr>`;
            }).join('');

            return `
                <div class="table-wrapper">
                    <table class="md-table">
                        <thead><tr>${headerHtml}</tr></thead>
                        <tbody>${bodyHtml}</tbody>
                    </table>
                </div>
            `;
        });
    }

    /**
     * Konvertiert Listen (ul/ol)
     */
    static renderLists(markdown) {
        // Unordered Lists
        markdown = markdown.replace(/^(\s*)-\s+(.+)$/gm, (match, indent, content) => {
            const level = Math.floor(indent.length / 2);
            return `<li class="ul-item" data-level="${level}">${content}</li>`;
        });

        // Ordered Lists
        markdown = markdown.replace(/^(\s*)\d+\.\s+(.+)$/gm, (match, indent, content) => {
            const level = Math.floor(indent.length / 2);
            return `<li class="ol-item" data-level="${level}">${content}</li>`;
        });

        // Li-Elemente in ul/ol wrappen
        markdown = this.wrapListItems(markdown, 'ul-item', 'ul');
        markdown = this.wrapListItems(markdown, 'ol-item', 'ol');

        return markdown;
    }

    /**
     * Wrapped aufeinanderfolgende li-Elemente in eine Liste
     */
    static wrapListItems(html, itemClass, listTag) {
        const regex = new RegExp(`(<li class="${itemClass}"[^>]*>.*?<\\/li>\\n?)+`, 'g');

        return html.replace(regex, (match) => {
            return `<${listTag} class="md-list">\n${match}</${listTag}>`;
        });
    }

    /**
     * HTML-Escaping
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Generiert ein Inhaltsverzeichnis aus Headings
     * @param {string} markdown - Markdown-Inhalt
     * @returns {Array} Array von {level, text, id}
     */
    static extractToc(markdown) {
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const toc = [];
        let match;

        while ((match = headingRegex.exec(markdown)) !== null) {
            const level = match[1].length;
            const text = match[2];
            const id = text.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            toc.push({ level, text, id });
        }

        return toc;
    }
}
