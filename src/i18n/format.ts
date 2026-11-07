/** Replaces `{name}` placeholders. Kept apart from utils.ts so client scripts can import it without the translation tables. */
export function format(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
