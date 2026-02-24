import { describe, expect, it } from "vitest";
import { initOptions } from "../src/Option.js";

describe("initOptions", () => {
  it("should return default values", () => {
    const option = initOptions();
    expect(option.prefix).toBe("demo");
    expect(option.srcDir).toBe("./demoSrc");
    expect(option.distDir).toBe("./docs/demo");
    expect(option.body).toBe("");
    expect(option.style).toBe("");
    expect(option.copyTargets).toEqual(["png", "jpg", "jpeg"]);
  });

  it("should merge custom options with defaults", () => {
    const option = initOptions({
      prefix: "test",
      srcDir: "./src",
      distDir: "./dist",
      body: "<div></div>",
      style: "body { color: red; }",
      copyTargets: ["gif", "png"],
    });
    expect(option.prefix).toBe("test");
    expect(option.srcDir).toBe("./src");
    expect(option.distDir).toBe("./dist");
    expect(option.body).toBe("<div></div>");
    expect(option.style).toBe("body { color: red; }");
    expect(option.copyTargets).toContain("png");
    expect(option.copyTargets).toContain("jpg");
    expect(option.copyTargets).toContain("jpeg");
    expect(option.copyTargets).toContain("gif");
  });
});
