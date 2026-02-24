import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getCleanTask } from "../src/Clean.js";
import { initOptions } from "../src/Option.js";

const testDir = "cleanTest";

describe("Clean", () => {
  afterEach(async () => {
    await fsPromises
      .rm(path.resolve(process.cwd(), testDir), {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  });

  it("should remove distDir", async () => {
    const distDir = path.resolve(process.cwd(), testDir);
    await fsPromises.mkdir(distDir, { recursive: true });
    await fsPromises.writeFile(path.join(distDir, "test.txt"), "test");
    expect(fs.existsSync(distDir)).toBe(true);

    const option = initOptions({ distDir: testDir });
    const clean = getCleanTask(option);
    await clean();

    expect(fs.existsSync(distDir)).toBe(false);
  });

  it("should not throw when distDir does not exist", async () => {
    const option = initOptions({ distDir: testDir });
    const clean = getCleanTask(option);
    await expect(clean()).resolves.toBeUndefined();
  });
});
