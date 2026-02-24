import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import type { InitializedOption } from "./Option.js";

/**
 * Custom Vite plugin that bridges demo page generation with Vite's pipeline.
 *
 * Dev mode: Adds middleware to serve dynamically generated HTML pages.
 * Build mode: Not used directly - build orchestration handled by build.ts.
 */
export function demoPlugin(
  option: InitializedOption,
  demoEntries: string[],
): Plugin {
  return {
    name: "demo-showcase",
    configureServer(server: ViteDevServer) {
      // Watch srcDir for new/removed demo files
      const srcDir = path.resolve(server.config.root, option.srcDir);

      server.watcher.add(srcDir);
      server.watcher.on("add", (filePath) => {
        if (isDemoFile(filePath, srcDir, option.prefix)) {
          server.restart();
        }
      });
      server.watcher.on("unlink", (filePath) => {
        if (isDemoFile(filePath, srcDir, option.prefix)) {
          server.restart();
        }
      });

      // Serve generated HTML pages via middleware
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "/";
        const cleanUrl = url.split("?")[0];

        if (cleanUrl === "/" || cleanUrl === "/index.html") {
          try {
            const html = await buildIndexHtml(demoEntries);
            const transformed = await server.transformIndexHtml(
              "/index.html",
              html,
            );
            res.setHeader("Content-Type", "text/html");
            res.end(transformed);
            return;
          } catch (e) {
            next(e);
            return;
          }
        }

        // Serve demo pages
        if (cleanUrl.endsWith(".html")) {
          const demoName = cleanUrl.slice(1); // remove leading /
          const entry = findDemoEntry(demoName, demoEntries);
          if (entry) {
            try {
              const html = buildDemoHtml(entry, option);
              const transformed = await server.transformIndexHtml(
                cleanUrl,
                html,
              );
              res.setHeader("Content-Type", "text/html");
              res.end(transformed);
              return;
            } catch (e) {
              next(e);
              return;
            }
          }
        }

        // Serve static assets from template dir
        const templateDir = path.resolve(
          path.dirname(new URL(import.meta.url).pathname),
          "../template/",
        );
        const assetPath = path.join(templateDir, cleanUrl);
        if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
          const ext = path.extname(assetPath);
          const mimeTypes: Record<string, string> = {
            ".css": "text/css",
            ".js": "application/javascript",
            ".png": "image/png",
            ".ico": "image/x-icon",
          };
          res.setHeader(
            "Content-Type",
            mimeTypes[ext] ?? "application/octet-stream",
          );
          fs.createReadStream(assetPath).pipe(res);
          return;
        }

        next();
      });
    },
  };
}

function isDemoFile(filePath: string, srcDir: string, prefix: string): boolean {
  const relative = path.relative(srcDir, filePath);
  if (relative.startsWith("..")) return false;
  const basename = path.basename(filePath, path.extname(filePath));
  return basename.startsWith(prefix);
}

/**
 * Build index HTML string for dev mode.
 */
async function buildIndexHtml(entries: string[]): Promise<string> {
  const templatePath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "../template/index.html",
  );
  const template = await fsPromises.readFile(templatePath, "utf8");

  const demoPaths = entries.map((entry) => replaceExtension(entry, ".html"));

  let packageName = "";
  let repository = "";
  try {
    const jsonPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    packageName = pkg.name ?? "";
    const repoUrl =
      typeof pkg.repository === "object" ? pkg.repository.url : pkg.repository;
    if (repoUrl) {
      const match = repoUrl.match(/^git\+(.*)/);
      repository = match ? match[1] : repoUrl;
    }
  } catch {
    // package.json not found or invalid
  }

  const menuItems = demoPaths
    .map(
      (p) =>
        `<li class="pure-menu-item"><a class="pure-menu-link" href="${p}" target="demo-frame">${p}</a></li>`,
    )
    .join("\n                ");

  return template
    .replaceAll("{{PACKAGE_NAME}}", packageName)
    .replaceAll("{{REPOSITORY}}", repository)
    .replace("{{DEMO_PATHS}}", escapeHtmlAttr(JSON.stringify(demoPaths)))
    .replace("{{DEMO_MENU_ITEMS}}", menuItems);
}

function escapeHtmlAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * Build demo HTML string for dev mode.
 * Points script src to the original source file for Vite's native HMR.
 */
function buildDemoHtml(entry: string, option: InitializedOption): string {
  const scriptSrc = `/${option.srcDir}/${entry}`;
  return `<!DOCTYPE html>
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
    <script type="module" src="${scriptSrc}"></script>
</head>
<body>${option.body}</body>
</html>`;
}

function findDemoEntry(
  htmlName: string,
  entries: string[],
): string | undefined {
  for (const entry of entries) {
    const htmlVersion = replaceExtension(entry, ".html");
    if (htmlName === htmlVersion) {
      return entry;
    }
  }
  return undefined;
}

function replaceExtension(filePath: string, newExt: string): string {
  const ext = path.extname(filePath);
  return filePath.slice(0, -ext.length) + newExt;
}
