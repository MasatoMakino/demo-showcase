import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import type { InitializedOption } from "./Option.js";

/**
 * Copy target file types from srcDir to distDir.
 */
export async function copyAssets(option: InitializedOption): Promise<void> {
  const srcDir = path.resolve(process.cwd(), option.srcDir);
  const distDir = path.resolve(process.cwd(), option.distDir);

  if (!fs.existsSync(srcDir)) return;

  const filter = async (source: string): Promise<boolean> => {
    const stat = await fsPromises.lstat(source);
    if (stat.isDirectory()) return true;
    return isTargetFileType(source, option.copyTargets);
  };

  await fsPromises.mkdir(distDir, { recursive: true });
  await fsPromises.cp(srcDir, distDir, {
    recursive: true,
    filter,
  });
}

function isTargetFileType(filePath: string, copyTargets: string[]): boolean {
  const ext = path.extname(filePath);
  return copyTargets.some((targetExt) => {
    return ext === `.${targetExt}` || ext === targetExt;
  });
}
