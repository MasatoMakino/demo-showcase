#!/usr/bin/env node

import { Command } from "commander";
import { buildDemo } from "./build.js";
import { devDemo } from "./dev.js";
import { initOptions, type Option } from "./Option.js";

export async function runCommand() {
  const program = new Command();

  program
    .name("demo-showcase")
    .description("Generate demo HTML pages from JS/TS source files using Vite")
    .version("0.1.0");

  // Shared options helper
  function addSharedOptions(cmd: Command): Command {
    return cmd
      .option("--prefix <string>", "Filename prefix for demo pages", "demo")
      .option("--srcDir <path>", "Demo source directory", "./demoSrc")
      .option("--distDir <path>", "Output directory", "./docs/demo")
      .option("--body <string>", "HTML body content")
      .option("--style <string>", "Custom CSS styles")
      .option(
        "--copyTargets [extensions...]",
        'File extensions to copy (e.g., "png", "jpg")',
      )
      .option("--config <path>", "Path to custom vite.config.ts for merging");
  }

  // Build subcommand
  const buildCmd = program
    .command("build")
    .description("Build static demo site");
  addSharedOptions(buildCmd);
  buildCmd.action(async (args) => {
    await runBuild(args);
  });

  // Dev subcommand
  const devCmd = program
    .command("dev")
    .description("Start dev server with HMR");
  addSharedOptions(devCmd);
  devCmd
    .option("--port <number>", "Dev server port", "3456")
    .option("--open", "Open browser on start")
    .option("--host <string>", "Dev server host", "localhost");
  devCmd.action(async (args) => {
    await runDev(args);
  });

  await program.parseAsync(process.argv);
}

export async function runBuild(args: Option): Promise<void> {
  const option = initOptions(args);
  await buildDemo(option);
}

export async function runDev(args: Option): Promise<void> {
  const option = initOptions(args);
  if (typeof args.port === "string") {
    option.port = Number.parseInt(args.port as string, 10);
  }
  await devDemo(option);
}
