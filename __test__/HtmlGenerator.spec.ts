import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateDemoHtml, generateIndexHtml } from "../src/HtmlGenerator.js";
import { initOptions } from "../src/Option.js";

const testDir = "buildTest/htmlgen";

describe("HtmlGenerator", () => {
  afterEach(async () => {
    await fsPromises
      .rm(path.resolve(process.cwd(), testDir), {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  });

  describe("generateDemoHtml", () => {
    it("should generate HTML file from template", async () => {
      const distDir = path.resolve(process.cwd(), testDir);
      const option = initOptions({ style: "canvas { background: #000; }" });

      const result = await generateDemoHtml("demoTest.js", distDir, option);

      expect(result).toBe("demoTest.html");
      const htmlPath = path.join(distDir, "demoTest.html");
      expect(fs.existsSync(htmlPath)).toBe(true);

      const content = await fsPromises.readFile(htmlPath, "utf8");
      expect(content).toContain("<title>demoTest.js</title>");
      expect(content).toContain('type="module"');
      expect(content).toContain('src="demoTest.js"');
      expect(content).toContain("canvas { background: #000; }");
    });

    it("should handle subdirectory entries", async () => {
      const distDir = path.resolve(process.cwd(), testDir);
      const option = initOptions();

      const result = await generateDemoHtml("sub/demoSub.js", distDir, option);

      expect(result).toBe(path.join("sub", "demoSub.html"));
      const htmlPath = path.join(distDir, "sub", "demoSub.html");
      expect(fs.existsSync(htmlPath)).toBe(true);
    });
  });

  describe("generateIndexHtml", () => {
    it("should generate index.html with demo paths", async () => {
      const distDir = path.resolve(process.cwd(), testDir);

      await generateIndexHtml(["demoA.html", "demoB.html"], distDir);

      const indexPath = path.join(distDir, "index.html");
      expect(fs.existsSync(indexPath)).toBe(true);

      const content = await fsPromises.readFile(indexPath, "utf8");
      expect(content).toContain("demoA.html");
      expect(content).toContain("demoB.html");
      expect(content).toContain("pure-menu-item");
    });

    it("should copy indexScript.js", async () => {
      const distDir = path.resolve(process.cwd(), testDir);

      await generateIndexHtml(["demo.html"], distDir);

      const scriptPath = path.join(distDir, "indexScript.js");
      expect(fs.existsSync(scriptPath)).toBe(true);
    });
  });
});
