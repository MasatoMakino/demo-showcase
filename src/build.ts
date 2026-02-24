import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as viteBuild } from "vite";
import { copyAssets } from "./Copy.js";
import { discoverDemoEntries } from "./entries.js";
import { generateIndexHtml } from "./HtmlGenerator.js";
import type { InitializedOption } from "./Option.js";
import { getStyleTask } from "./Style.js";
import { createBuildConfig, mergeUserConfig } from "./ViteConfig.js";

/**
 * Build static demo site.
 *
 * 1. Discover demo source files
 * 2. Create staging directory with generated HTML entry points
 * 3. Run Vite build with MPA rollup inputs
 * 4. Copy template assets (styles, favicon, etc.)
 * 5. Copy static assets from srcDir (images, etc.)
 * 6. Clean up staging directory
 */
export async function buildDemo(option: InitializedOption): Promise<void> {
  const entries = discoverDemoEntries(option);
  if (entries.length === 0) {
    console.error(
      `demo-showcase: No demo scripts found.\n` +
        `Check that ${option.srcDir} contains files with prefix "${option.prefix}" (.js or .ts).`,
    );
    return;
  }

  const stagingDir = await fsPromises.mkdtemp(
    path.join(os.tmpdir(), "demo-showcase-"),
  );

  try {
    // Generate HTML entry points in staging directory
    const inputs: Record<string, string> = {};
    const demoPaths: string[] = [];

    for (const entry of entries) {
      const htmlPath = await generateStagingHtml(entry, stagingDir, option);
      const name = path.basename(htmlPath, ".html");
      inputs[name] = htmlPath;

      demoPaths.push(replaceExtension(entry, ".html"));
    }

    // Generate index.html in staging directory
    await generateStagingIndexHtml(demoPaths, stagingDir);
    inputs.index = path.join(stagingDir, "index.html");

    // Copy template assets to staging for Vite to process
    await copyTemplateAssets(stagingDir);

    // Build with Vite
    let config = createBuildConfig(option, inputs, stagingDir);
    if (option.config) {
      config = await mergeUserConfig(config, option.config);
    }
    await viteBuild(config);

    // Copy indexScript.js to distDir (not bundled by Vite since it lacks type="module")
    await copyIndexScriptToDist(option);

    // Copy static assets from srcDir to distDir
    await copyAssets(option);
  } finally {
    // Clean up staging directory
    await fsPromises.rm(stagingDir, { recursive: true, force: true });
  }

  console.log("demo-showcase: Build complete.");
}

/**
 * Generate a demo HTML file in staging directory that references
 * the source file via absolute path for Vite to resolve.
 */
async function generateStagingHtml(
  entry: string,
  stagingDir: string,
  option: InitializedOption,
): Promise<string> {
  const srcAbsolute = path.resolve(process.cwd(), option.srcDir, entry);
  const htmlFileName = replaceExtension(entry, ".html");
  const htmlDir = path.join(stagingDir, path.dirname(entry));
  const htmlPath = path.join(htmlDir, path.basename(htmlFileName));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>${entry}</title>
    <style>
        html, body {
            margin: 0;
        }
        ${option.style}
    </style>
    <script type="module" src="${srcAbsolute}"></script>
</head>
<body>${option.body}</body>
</html>`;

  await fsPromises.mkdir(htmlDir, { recursive: true });
  await fsPromises.writeFile(htmlPath, html, "utf8");

  return htmlPath;
}

/**
 * Generate index.html in staging directory.
 */
async function generateStagingIndexHtml(
  demoPaths: string[],
  stagingDir: string,
): Promise<void> {
  await generateIndexHtml(demoPaths, stagingDir);
}

/**
 * Copy template assets (CSS, images) to staging directory.
 */
async function copyTemplateAssets(stagingDir: string): Promise<void> {
  const styleTask = getStyleTask(stagingDir);
  await styleTask();
}

async function copyIndexScriptToDist(option: InitializedOption): Promise<void> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const srcPath = path.resolve(__dirname, "../template/indexScript.js");
  const destPath = path.resolve(
    process.cwd(),
    option.distDir,
    "indexScript.js",
  );
  await fsPromises.copyFile(srcPath, destPath);
}

function replaceExtension(filePath: string, newExt: string): string {
  const ext = path.extname(filePath);
  return filePath.slice(0, -ext.length) + newExt;
}
