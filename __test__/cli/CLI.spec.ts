import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/build.js", () => ({
  buildDemo: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("../../src/dev.js", () => ({
  devDemo: vi.fn().mockResolvedValue(undefined),
}));

describe("CLI", () => {
  it("should import runCommand without error", async () => {
    const mod = await import("../../src/runCommand.js");
    expect(typeof mod.runCommand).toBe("function");
  });
});
