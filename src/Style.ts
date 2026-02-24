import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Returns an asynchronous task that copies style-related files and directories
 * from the template directory to the distribution directory.
 *
 * Only directories and files with `.css`, `.png`, or `.ico` extensions are included.
 */
export function getStyleTask(distDir: string): () => Promise<void> {
  return async () => {
    await fs.cp(getTemplateDir(), distDir, {
      recursive: true,
      filter: async (src, _dest) => {
        const stat = await fs.lstat(src);
        if (stat.isDirectory()) return true;

        const ext = path.extname(src);
        return ext === ".css" || ext === ".png" || ext === ".ico";
      },
    });
  };
}

function getTemplateDir(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "../template/");
}
