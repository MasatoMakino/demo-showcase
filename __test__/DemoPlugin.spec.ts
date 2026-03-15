import { describe, expect, it } from "vitest";
import { demoPlugin } from "../src/DemoPlugin.js";
import { initOptions } from "../src/Option.js";

const option = initOptions();
const plugin = demoPlugin(option, []);

type ResolveIdFn = (source: string, importer?: string) => string | undefined;

const resolveId = (plugin as { resolveId: ResolveIdFn }).resolveId;

describe("DemoPlugin resolveId", () => {
  it("should resolve ./indexScript.js from index.html", () => {
    const result = resolveId("./indexScript.js", "/index.html");
    expect(result).toMatch(/template\/indexScript\.js$/);
  });

  it("should resolve /indexScript.js from index.html", () => {
    const result = resolveId("/indexScript.js", "/index.html");
    expect(result).toMatch(/template\/indexScript\.js$/);
  });

  it("should resolve from html-proxy importer with query parameters", () => {
    const result = resolveId(
      "./indexScript.js",
      "/index.html?html-proxy&index=0.js",
    );
    expect(result).toMatch(/template\/indexScript\.js$/);
  });

  it("should not resolve from unrelated importers", () => {
    const result = resolveId("./indexScript.js", "/src/main.ts");
    expect(result).toBeUndefined();
  });

  it("should not resolve from paths containing index.html as substring", () => {
    expect(
      resolveId("./indexScript.js", "/my-index.html-backup"),
    ).toBeUndefined();
    expect(
      resolveId("./indexScript.js", "/old-index.html.bak"),
    ).toBeUndefined();
    expect(resolveId("./indexScript.js", "/modal-index.html")).toBeUndefined();
  });

  it("should not resolve unrelated modules from index.html", () => {
    const result = resolveId("./other.js", "/index.html");
    expect(result).toBeUndefined();
  });

  it("should not resolve without importer", () => {
    const result = resolveId("./indexScript.js", undefined);
    expect(result).toBeUndefined();
  });
});
