import path from "node:path";
import { globSync } from "glob";
import type { InitializedOption } from "./Option.js";

/**
 * Discover demo source files matching the prefix pattern.
 * Returns relative paths from srcDir.
 */
export function discoverDemoEntries(option: InitializedOption): string[] {
  const srcDir = path.resolve(process.cwd(), option.srcDir);
  return globSync(`**/${option.prefix}*.{js,ts}`, {
    cwd: srcDir,
  }).sort();
}
