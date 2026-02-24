import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { copyAssets } from "../src/Copy.js";
import { initOptions } from "../src/Option.js";

const testSrcDir = "test_for_copy";
const testDistDir = "test_for_copy_img";

describe("Copy", () => {
  beforeEach(async () => {
    const srcDir = path.resolve(process.cwd(), testSrcDir);
    await fsPromises.mkdir(srcDir, { recursive: true });
    // Create a test PNG file
    await fsPromises.writeFile(path.join(srcDir, "test.png"), "fake png");
    // Create a test JS file (should not be copied)
    await fsPromises.writeFile(path.join(srcDir, "test.js"), "console.log()");
  });

  afterEach(async () => {
    await fsPromises
      .rm(path.resolve(process.cwd(), testSrcDir), {
        recursive: true,
        force: true,
      })
      .catch(() => {});
    await fsPromises
      .rm(path.resolve(process.cwd(), testDistDir), {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  });

  it("should copy target file types", async () => {
    const option = initOptions({
      srcDir: testSrcDir,
      distDir: testDistDir,
    });

    await copyAssets(option);

    const distDir = path.resolve(process.cwd(), testDistDir);
    expect(fs.existsSync(path.join(distDir, "test.png"))).toBe(true);
    expect(fs.existsSync(path.join(distDir, "test.js"))).toBe(false);
  });

  it("should not throw when srcDir does not exist", async () => {
    const option = initOptions({
      srcDir: "nonexistent_dir",
      distDir: testDistDir,
    });

    await expect(copyAssets(option)).resolves.toBeUndefined();
  });
});
