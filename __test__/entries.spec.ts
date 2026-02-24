import fsPromises from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { discoverDemoEntries } from "../src/entries.js";
import { initOptions } from "../src/Option.js";

const testSrcDir = "buildTest/entriesTest";

describe("discoverDemoEntries", () => {
  beforeEach(async () => {
    const srcDir = path.resolve(process.cwd(), testSrcDir);
    await fsPromises.mkdir(srcDir, { recursive: true });
    await fsPromises.writeFile(
      path.join(srcDir, "demoA.ts"),
      "console.log('A');",
    );
    await fsPromises.writeFile(
      path.join(srcDir, "demoB.js"),
      "console.log('B');",
    );
    await fsPromises.writeFile(
      path.join(srcDir, "helper.ts"),
      "export const x = 1;",
    );
  });

  afterEach(async () => {
    await fsPromises
      .rm(path.resolve(process.cwd(), testSrcDir), {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  });

  it("should find demo files matching prefix", () => {
    const option = initOptions({ srcDir: testSrcDir });
    const entries = discoverDemoEntries(option);

    expect(entries).toContain("demoA.ts");
    expect(entries).toContain("demoB.js");
    expect(entries).not.toContain("helper.ts");
  });

  it("should return sorted entries", () => {
    const option = initOptions({ srcDir: testSrcDir });
    const entries = discoverDemoEntries(option);

    expect(entries).toEqual([...entries].sort());
  });

  it("should return empty array when no matches", () => {
    const option = initOptions({
      srcDir: testSrcDir,
      prefix: "nonexistent",
    });
    const entries = discoverDemoEntries(option);

    expect(entries).toEqual([]);
  });
});
