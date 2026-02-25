import { lookup } from "mrmime";

const FALLBACK = "application/octet-stream";

// Extensions not covered by mrmime
const EXTRA_TYPES: Record<string, string> = {
  ico: "image/x-icon",
};

/**
 * Look up the MIME type for a file extension.
 * Accepts both ".png" and "png" forms.
 */
export function lookupMimeType(ext: string): string {
  const normalized = ext.startsWith(".") ? ext.slice(1) : ext;
  return lookup(normalized) ?? EXTRA_TYPES[normalized] ?? FALLBACK;
}
