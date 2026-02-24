import { describe, expect, it } from "vitest";
import { initOptions } from "../src/Option.js";
import { createBuildConfig, createDevConfig } from "../src/ViteConfig.js";

describe("ViteConfig", () => {
  describe("createBuildConfig", () => {
    it("should create build config with relative base", () => {
      const option = initOptions();
      const inputs = { demoA: "/tmp/demoA.html" };
      const config = createBuildConfig(option, inputs, "/tmp/staging");

      expect(config.base).toBe("./");
      expect(config.root).toBe("/tmp/staging");
      expect(config.appType).toBe("mpa");
      expect(config.build?.rollupOptions?.input).toEqual(inputs);
    });

    it("should set outDir from option.distDir", () => {
      const option = initOptions({ distDir: "./output" });
      const config = createBuildConfig(option, {}, "/tmp");

      expect(config.build?.outDir).toContain("output");
    });
  });

  describe("createDevConfig", () => {
    it("should create dev config with absolute base", () => {
      const config = createDevConfig("/project", 3000);

      expect(config.base).toBe("/");
      expect(config.root).toBe("/project");
      expect(config.server?.port).toBe(3000);
    });

    it("should use specified port", () => {
      const config = createDevConfig("/project", 8080);
      expect(config.server?.port).toBe(8080);
    });
  });
});
