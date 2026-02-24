import { promises as fsPromises } from "node:fs";
import type { InitializedOption } from "./Option.js";

export function getCleanTask(option: InitializedOption) {
  return async () => {
    await fsPromises.rm(option.distDir, { recursive: true, force: true });
  };
}
