---
name: migrate-from-gulptask-demo-page
description: Migration guide from @masatomakino/gulptask-demo-page (Gulp+Webpack) to @masatomakino/demo-showcase (Vite). Use when replacing the demo page builder in existing projects.
---

# Migration Guide: gulptask-demo-page → demo-showcase

## Overview

Replace `@masatomakino/gulptask-demo-page` (Gulp+Webpack) and `browser-sync` with `@masatomakino/demo-showcase` (Vite-based). Gains: HMR dev server, native TypeScript support, faster builds.

## Steps

### 1. Install / Uninstall

```bash
npm install --save-dev @masatomakino/demo-showcase
npm uninstall @masatomakino/gulptask-demo-page browser-sync
```

### 2. Update package.json scripts

| Script | Before | After |
|--------|--------|-------|
| `demo` | `npx @masatomakino/gulptask-demo-page ...` | `npx demo-showcase build` |
| `server` | `browser-sync ./docs/demo -w ...` | `npx demo-showcase dev` |
| `watch:demo` | `npm run demo -- -W` | **Delete** (dev server handles file watching) |

Notes:
- `--compileModule` is unnecessary (Vite handles natively)
- `--host 0.0.0.0` is required for DevContainer port forwarding
- If the project runs tsc and demo-showcase in parallel (e.g., `start:dev`), remove the `watch:demo` part and replace the server command

### 3. Update CI workflow (if applicable)

If CI invokes `demo-showcase build`, ensure Node version meets `engines.node >= 22.0.0`:

```yaml
node-version: "22"
```

Test-only CI that doesn't run the build does not need this change.

### 4. Clean output directory

Delete and regenerate `docs/demo/` (or custom `distDir`) to avoid stale files from the old builder:

```bash
rm -rf docs/demo/
npm run build
```

### 5. Demo source files

**No changes required.** Existing `demoSrc/demo_*.js` (or `.ts`) files work as-is in both build and dev modes.

### 6. Asset references (images, etc.)

demo-showcase uses Vite's native asset import mechanism. If demo scripts reference images or other assets via string literals, migrate to Vite import syntax:

```typescript
// Before: string literal (not processed by Vite)
const img = new Image();
img.src = "./images/photo.png";

// After: Vite import (bundled with content hash, small files inlined)
import photoUrl from "./images/photo.png";
const img = new Image();
img.src = photoUrl;
```

**TypeScript type errors**: TypeScript does not recognize asset imports by default. Add `vite/client` types to suppress errors:

Method 1 — tsconfig.json:
```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

Method 2 — Create `vite-env.d.ts` in the project root:
```typescript
/// <reference types="vite/client" />
```

`vite/client` provides type shims for asset imports (`.png`, `.svg`, etc.), `import.meta.env`, and `import.meta.hot`.

Reference: [Vite - Static Asset Handling](https://ja.vite.dev/guide/assets#importing-asset-as-url), [Vite - Client Types](https://ja.vite.dev/guide/features#client-types)

## Known Issues

### File casing mismatch (macOS + Linux container)

**Symptom:** Vite dev server in a Linux container serves stale module content despite file changes.

**Cause:** macOS filesystem is case-insensitive. If source files were renamed with casing changes (e.g., `Foo.ts` → `foo.ts`), compiled output may retain the old casing. Vite in a Linux container treats these as different modules.

**Fix:** Delete the compiled output directory entirely and rebuild.

## Verification Checklist

1. **Build**: `npm run build` → output directory contains `index.html`, `demo_*.html`, and asset files
2. **Dev server**: dev server starts and pages are accessible via browser
3. **HMR**: Edit a file in `demoSrc/` → browser reloads automatically
4. **Asset loading**: Images and other assets load without 404 in dev mode
5. **Tests**: `npm test` → all existing tests pass
