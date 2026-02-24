import fs from "node:fs";
import path from "node:path";
import { expect } from "vitest";

function isExist(relativePath: string): boolean {
  return fs.existsSync(path.resolve(process.cwd(), relativePath));
}
export function isExistFile(relativePath: string): void {
  expect(isExist(relativePath)).toBeTruthy();
}
export function isNotExistFile(relativePath: string): void {
  expect(isExist(relativePath)).toBeFalsy();
}

export async function removeDir(dir: string): Promise<void> {
  await fs.promises.rm(path.resolve(process.cwd(), dir), {
    recursive: true,
    force: true,
  });
}
