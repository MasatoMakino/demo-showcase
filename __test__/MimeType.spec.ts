import { describe, expect, it } from "vitest";
import { lookupMimeType } from "../src/MimeType.js";

describe("lookupMimeType", () => {
  it("should return correct MIME types for common image extensions", () => {
    expect(lookupMimeType("png")).toBe("image/png");
    expect(lookupMimeType("jpg")).toBe("image/jpeg");
    expect(lookupMimeType("jpeg")).toBe("image/jpeg");
    expect(lookupMimeType("gif")).toBe("image/gif");
    expect(lookupMimeType("svg")).toBe("image/svg+xml");
    expect(lookupMimeType("webp")).toBe("image/webp");
    expect(lookupMimeType("ico")).toBe("image/x-icon");
  });

  it("should return correct MIME types for template asset types", () => {
    expect(lookupMimeType("css")).toBe("text/css");
    expect(lookupMimeType("js")).toBe("text/javascript");
  });

  it("should handle dot-prefixed extensions", () => {
    expect(lookupMimeType(".png")).toBe("image/png");
    expect(lookupMimeType(".css")).toBe("text/css");
  });

  it("should return correct MIME types for custom copyTargets extensions", () => {
    expect(lookupMimeType("webm")).toBe("video/webm");
    expect(lookupMimeType("mp4")).toBe("video/mp4");
    expect(lookupMimeType("glb")).toBe("model/gltf-binary");
  });

  it("should fall back to application/octet-stream for unknown extensions", () => {
    expect(lookupMimeType("xyz123unknown")).toBe("application/octet-stream");
  });
});
