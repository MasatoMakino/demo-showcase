import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/build.js", () => ({
  buildDemo: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("../../src/dev.js", () => ({
  devDemo: vi.fn().mockResolvedValue(undefined),
}));

describe("CLI options", () => {
  it("should parse build command options", async () => {
    const { runBuild } = await import("../../src/runCommand.js");
    const { buildDemo } = await import("../../src/build.js");

    await runBuild({
      prefix: "test",
      srcDir: "./testSrc",
      distDir: "./testDist",
      body: "<div>test</div>",
      style: "body { color: red; }",
    });

    expect(buildDemo).toHaveBeenCalledWith(
      expect.objectContaining({
        prefix: "test",
        srcDir: "./testSrc",
        distDir: "./testDist",
        body: "<div>test</div>",
        style: "body { color: red; }",
      }),
    );
  });

  it("should parse dev command options", async () => {
    const { runDev } = await import("../../src/runCommand.js");
    const { devDemo } = await import("../../src/dev.js");

    await runDev({
      prefix: "sample",
      srcDir: "./sampleSrc",
      port: 4000,
      open: true,
      host: "0.0.0.0",
    });

    expect(devDemo).toHaveBeenCalledWith(
      expect.objectContaining({
        prefix: "sample",
        srcDir: "./sampleSrc",
        port: 4000,
        open: true,
        host: "0.0.0.0",
      }),
    );
  });
});
