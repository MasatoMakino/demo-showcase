import path from "node:path";
import { createServer } from "vite";
import FullReload from "vite-plugin-full-reload";
import { demoPlugin } from "./DemoPlugin.js";
import { discoverDemoEntries } from "./entries.js";
import type { InitializedOption } from "./Option.js";
import { createDevConfig, mergeUserConfig } from "./ViteConfig.js";

/**
 * Start Vite dev server with demo page middleware.
 */
export async function devDemo(option: InitializedOption): Promise<void> {
  const entries = discoverDemoEntries(option);
  if (entries.length === 0) {
    console.error(
      `demo-showcase: No demo scripts found.\n` +
        `Check that ${option.srcDir} contains files with prefix "${option.prefix}" (.js or .ts).`,
    );
    return;
  }

  const root = path.resolve(process.cwd());
  const port = option.port ?? 3456;
  const host = option.host ?? "localhost";

  let config = createDevConfig(root, port, host);

  // Add custom demo plugin + full reload on JS/TS changes
  const srcGlob = `${option.srcDir}/**/*.{js,ts}`;
  config.plugins = [demoPlugin(option, entries), FullReload([srcGlob])];

  if (option.config) {
    config = await mergeUserConfig(config, option.config);
  }

  const server = await createServer(config);
  await server.listen();

  const openUrl = `http://${host}:${server.config.server.port}`;
  console.log(`demo-showcase: Dev server running at ${openUrl}`);

  if (option.open) {
    server.openBrowser();
  }

  server.printUrls();
}
