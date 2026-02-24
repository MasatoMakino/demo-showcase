import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

// Read the script file content
const scriptPath = path.resolve(__dirname, "../template/indexScript.js");
const scriptContent = fs.readFileSync(scriptPath, "utf-8");

// Create a new context and run the script
const context = {};
vm.createContext(context);
vm.runInContext(scriptContent, context);

// Access the globally defined function from the context
const { getDemoNameFromPath } = context;

describe("getDemoNameFromPath", () => {
  it("should extract the demo name from a valid path", () => {
    const path = "demo/demoTypeScript.html";
    expect(getDemoNameFromPath(path)).toBe("demo%2FdemoTypeScript");
  });

  it("should return null for an invalid path", () => {
    const path = "invalid/path/to/file.txt";
    expect(getDemoNameFromPath(path)).toBeNull();
  });

  it("should return null for an empty path", () => {
    const path = "";
    expect(getDemoNameFromPath(path)).toBeNull();
  });

  it("should handle paths without directories", () => {
    const path = "demoOnly.html";
    expect(getDemoNameFromPath(path)).toBe("demoOnly");
  });

  it("should handle paths with multiple dots in the filename", () => {
    const path = "demo/my.test.demo.html";
    expect(getDemoNameFromPath(path)).toBe("demo%2Fmy.test.demo");
  });

  it('should extract "sub%2FdemoSub" from "sub/demoSub.html"', () => {
    const path = "sub/demoSub.html";
    expect(getDemoNameFromPath(path)).toBe("sub%2FdemoSub");
  });
});
