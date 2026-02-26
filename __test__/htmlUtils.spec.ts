import { describe, expect, it } from "vitest";
import { escapeHtmlAttr, replaceExtension } from "../src/htmlUtils.js";

describe("escapeHtmlAttr", () => {
  it("should escape ampersands", () => {
    expect(escapeHtmlAttr("a&b")).toBe("a&amp;b");
  });

  it("should escape double quotes", () => {
    expect(escapeHtmlAttr('"hello"')).toBe("&quot;hello&quot;");
  });

  it("should escape both ampersands and quotes", () => {
    expect(escapeHtmlAttr('a&"b"')).toBe("a&amp;&quot;b&quot;");
  });

  it("should pass through clean strings", () => {
    expect(escapeHtmlAttr("hello world")).toBe("hello world");
  });
});

describe("replaceExtension", () => {
  it("should replace .ts with .html", () => {
    expect(replaceExtension("demo_file.ts", ".html")).toBe("demo_file.html");
  });

  it("should replace .js with .html", () => {
    expect(replaceExtension("demo_file.js", ".html")).toBe("demo_file.html");
  });

  it("should handle subdirectory paths", () => {
    expect(replaceExtension("sub/demo_file.ts", ".html")).toBe(
      "sub/demo_file.html",
    );
  });
});
