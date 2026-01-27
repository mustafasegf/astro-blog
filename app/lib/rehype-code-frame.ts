/**
 * Post-process HTML to wrap code blocks in expressive-code-like frames
 *
 * Transforms:
 *   <pre class="shiki" data-language="bash"><code>...</code></pre>
 *
 * Into:
 *   <div class="code-frame is-terminal">
 *     <div class="code-header">
 *       <div class="window-buttons">
 *         <span class="dot red"></span>
 *         <span class="dot yellow"></span>
 *         <span class="dot green"></span>
 *       </div>
 *       <span class="code-title">filename.ext</span>
 *     </div>
 *     <div class="code-content">
 *       <pre class="shiki"><code>...</code></pre>
 *       <button class="copy-button" data-code="...">Copy</button>
 *     </div>
 *   </div>
 */

const TERMINAL_LANGUAGES = [
  "bash",
  "sh",
  "shell",
  "zsh",
  "fish",
  "powershell",
  "cmd",
  "terminal",
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function extractTextFromHtml(html: string): string {
  // Remove HTML tags to get plain text
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function wrapCodeBlocks(html: string): string {
  // Match pre.shiki blocks with their attributes and content
  const preRegex = /<pre([^>]*class="[^"]*shiki[^"]*"[^>]*)>([\s\S]*?)<\/pre>/g;

  return html.replace(preRegex, (match, attributes, content) => {
    // Extract language from data-language attribute
    const langMatch = attributes.match(/data-language="([^"]*)"/);
    const language = langMatch ? langMatch[1] : "";
    const isTerminal = TERMINAL_LANGUAGES.includes(language.toLowerCase());

    // Extract title from data-meta if present (e.g., title="filename.ext")
    const metaMatch = attributes.match(/data-meta="([^"]*)"/);
    const meta = metaMatch ? metaMatch[1] : "";
    const titleMatch = meta.match(/title=["']?([^"'\s]+)["']?/);
    const title = titleMatch ? titleMatch[1] : "";

    // Get plain text content for copy button
    const plainCode = extractTextFromHtml(content);
    const escapedCode = escapeHtml(plainCode);

    // Build classes
    const frameClasses = ["code-frame"];
    if (isTerminal) frameClasses.push("is-terminal");
    if (title) frameClasses.push("has-title");

    // Build header content
    let headerContent = "";
    if (isTerminal || title) {
      headerContent = `
        <div class="window-buttons">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="code-title">${title || (isTerminal ? "Terminal" : "")}</span>
      `;
    } else if (language) {
      headerContent = `<span class="code-language">${language}</span>`;
    }

    return `
      <div class="${frameClasses.join(" ")}">
        <div class="code-header">
          ${headerContent}
        </div>
        <div class="code-content">
          <pre${attributes}>${content}</pre>
          <button class="copy-button" type="button" title="Copy to clipboard" data-code="${escapedCode}">
            <span class="copy-icon"></span>
            <span class="copy-text">Copy</span>
          </button>
        </div>
      </div>
    `;
  });
}
