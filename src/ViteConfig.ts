import path from "node:path";
import { type InlineConfig, mergeConfig } from "vite";
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
export function createDevConfig(root: string, port: number): InlineConfig {
  return {
    root,
    base: "/",
    appType: "mpa",
    logLevel: "info",
    server: {
      port,
    },
  };
}

/**
 * Merge user's vite.config with base config.
 */
export async function mergeUserConfig(
  baseConfig: InlineConfig,
  configPath: string,
): Promise<InlineConfig> {
  const absolutePath = path.resolve(process.cwd(), configPath);
  const userModule = await import(absolutePath);
  const userConfig = userModule.default ?? userModule;
  return mergeConfig(baseConfig, userConfig);
}
