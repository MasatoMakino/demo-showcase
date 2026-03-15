/**
 * Extract demo name from path and return URL-encoded demo name (e.g. "sub/demoSub.html" -> "sub%2FdemoSub")
 */
export function getDemoNameFromPath(path) {
  if (!path) return null;

  var demoPath = path;
  if (demoPath.endsWith(".html")) {
    demoPath = demoPath.substring(0, demoPath.length - ".html".length);
  } else {
    return null; // Only process .html files
  }

  return encodeURIComponent(demoPath);
}
