import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getStyleTask } from "../src/Style.js";

const testDir = "test_for_style";

describe("Style", () => {
  afterEach(async () => {
    await fsPromises
      .rm(path.resolve(process.cwd(), testDir), {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  });

  it("should return an async function", () => {
    const task = getStyleTask(path.resolve(process.cwd(), testDir));
    expect(typeof task).toBe("function");
  });

  it("should copy CSS, PNG, and ICO files", async () => {
    const distDir = path.resolve(process.cwd(), testDir);
    await fsPromises.mkdir(distDir, { recursive: true });

    const task = getStyleTask(distDir);
    await task();

    expect(fs.existsSync(path.join(distDir, "styles.css"))).toBe(true);
    expect(
      fs.existsSync(path.join(distDir, "GitHub-Mark-Light-64px.png")),
    ).toBe(true);
    expect(fs.existsSync(path.join(distDir, "favicon.ico"))).toBe(true);
  });
});
