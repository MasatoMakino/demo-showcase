# Vite Non-Module Script Handling

`<script src="...">` without `type="module"` is NOT bundled by Vite. It emits a warning and leaves the reference as-is, but does not copy the file to the output directory.

## Affected File

`template/indexScript.js` - loaded by `index.html` as a non-module script for browser compatibility.

## Solution

Manually copy the script to distDir after `vite.build()` completes. See `build.ts` `copyIndexScriptToDist()`.
