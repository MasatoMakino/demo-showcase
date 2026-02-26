import path from "node:path";

export function escapeHtmlAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export function replaceExtension(filePath: string, newExt: string): string {
  const ext = path.extname(filePath);
  return filePath.slice(0, -ext.length) + newExt;
}
