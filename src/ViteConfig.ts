import path from "node:path";
import type { InlineConfig } from "vite";
import type { InitializedOption } from "./Option.js";

/**
 * Build the base Vite configuration for build mode.
 */
export function createBuildConfig(
  option: InitializedOption,
  inputs: Record<string, string>,
  root: string,
): InlineConfig {
  return {
    root,
    base: "./",
    appType: "mpa",
    logLevel: "info",
    build: {
      outDir: path.resolve(process.cwd(), option.distDir),
      emptyOutDir: true,
      rollupOptions: {
        input: inputs,
      },
    },
  };
}

/**
 * Build the base Vite configuration for dev mode.
 */
export function createDevConfig(
  root: string,
  port: number,
  host: string,
): InlineConfig {
  return {
    root,
    base: "/",
    appType: "mpa",
    logLevel: "info",
    server: {
      port,
      host,
    },
  };
}
