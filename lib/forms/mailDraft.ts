/** Builds a mailto: link with one "Label: value" line per row. */
export function buildMailDraft(to: string, subject: string, rows: [string, string][]): string {
  const body = rows
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n")
    .replace(/\r?\n/g, "\r\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Opens the draft in the visitor's own email app. */
export function openMailDraft(href: string) {
  const link = document.createElement("a");
  link.href = href;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
