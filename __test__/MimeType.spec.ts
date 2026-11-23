import { describe, expect, it } from "vite-plus/test";
import { lookupMimeType } from "../src/MimeType.js";

describe("lookupMimeType", () => {
  it("should return the MIME type of each template asset type the dev server serves", () => {
    expect(lookupMimeType("css")).toBe("text/css");
    expect(lookupMimeType("js")).toBe("text/javascript");
    expect(lookupMimeType("png")).toBe("image/png");
    expect(lookupMimeType("ico")).toBe("image/x-icon");
  });

  it("should handle dot-prefixed extensions", () => {
    expect(lookupMimeType(".png")).toBe("image/png");
    expect(lookupMimeType(".css")).toBe("text/css");
  });

  it("should fall back to application/octet-stream for unknown extensions", () => {
    expect(lookupMimeType("xyz123unknown")).toBe("application/octet-stream");
  });
});
