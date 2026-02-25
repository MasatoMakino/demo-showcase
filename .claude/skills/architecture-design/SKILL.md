---
name: architecture-design
description: Design philosophy and architectural decisions for demo-showcase. Use when modifying core behavior, adding features, or understanding design rationale.
---

# Architecture Design Philosophy

## Core Concept

demo-showcase solves a single problem: **"Write only demo scripts, get a complete demo site automatically."**

Library developers need demo pages to verify and showcase behavior. This tool eliminates HTML boilerplate by generating everything from JS/TS source files.

## Design Principles

### 1. Convention Over Configuration

- Demo files are discovered by filename prefix convention (`demo_*.{js,ts}`)
- Sensible defaults for all options (srcDir, distDir, prefix, copyTargets)
- Zero-config TypeScript support (delegated to Vite/esbuild)
- Works out-of-the-box with no configuration files required

### 2. Vite as the Foundation

Successor to webpack-based `@masatomakino/gulptask-demo-page`. Vite was chosen for:

- **Native TypeScript**: esbuild handles TS without separate config
- **Dev server with HMR**: Instant feedback during development
- **Standard build pipeline**: Rollup-based production builds
- **Extensibility**: Plugin API for custom middleware (DemoPlugin)

### 3. Template Simplicity

Templates use plain HTML with `{{PLACEHOLDER}}` string replacement. No template engine dependency (no EJS, Handlebars, etc.).

Rationale: The replacement targets are fixed and few (TITLE, STYLE, SCRIPT, BODY, PACKAGE_NAME, REPOSITORY, DEMO_PATHS, DEMO_MENU_ITEMS). A template engine adds complexity without benefit for this use case.

### 4. Two-Mode Architecture

| Mode | Purpose | HTML Strategy |
|------|---------|---------------|
| dev | Live preview | Dynamic generation via Vite plugin middleware |
| build | Static output | Staging directory → Vite build → cleanup |

Both modes share the same entry discovery and HTML generation logic but differ in execution strategy. Dev mode avoids filesystem writes by serving HTML from memory; build mode uses a staging directory because Vite's build API requires physical files.

### 5. Dev Mode: Reload Strategy

Two independent mechanisms handle file changes:

| Mechanism | Scope | Trigger |
|-----------|-------|---------|
| Vite module graph | All files reachable via import chain from root | Any file in the dependency graph changes |
| `vite-plugin-full-reload` | `srcDir/**/*.{js,ts}` only | File change in srcDir |
| DemoPlugin watcher | `srcDir` directory | Demo file added/removed → server restart |

**Why full reload instead of HMR**: Demo scripts are plain JS/TS modules without HMR API (`import.meta.hot`). Vite falls back to full page reload for these. The `vite-plugin-full-reload` plugin ensures explicit reload rather than relying on Vite's fallback behavior.

**External module changes**: Files imported by demo scripts but located outside srcDir (e.g., library source in `src/`) are tracked by Vite's module graph. Changes trigger full page reload through Vite's built-in fallback. Files outside project root or in `node_modules` are not watched.

### 6. Build Mode: Staging Directory Pattern

Build mode creates a temporary directory (`os.tmpdir()`) rather than writing to the project tree because:

- Generated HTML files are build artifacts, not source files
- Avoids polluting the working directory or requiring gitignore entries
- Cleanup is guaranteed via `try/finally`
- Vite's build API requires physical HTML files as rollup inputs

### 7. Index Page as Navigation Shell

The index page is a sidebar + iframe layout (Pure.css), not a single-page application.

- Each demo runs in an isolated iframe (no global state leakage between demos)
- URL query parameter (`?demo=name`) enables deep linking to specific demos
- `indexScript.js` is deliberately not bundled by Vite (no `type="module"`) to keep it simple and self-contained

### 8. User Config Merging

Users can provide a custom `vite.config.ts` via `--config`. It is merged with the base config using Vite's `mergeConfig()`, not replaced. This allows users to add plugins or adjust settings without losing demo-showcase's required configuration.

### 9. Dev Server Host: Secure Default

The `--host` CLI default is `localhost`, not `0.0.0.0`.

- **`localhost`** binds to loopback only — no LAN exposure. Safe for users running without container isolation.
- **`0.0.0.0`** binds to all interfaces — required for Docker port forwarding, but exposes the server to the local network.

Users who need container-external access (e.g., DevContainer with `-p 0:3456`) explicitly pass `--host 0.0.0.0`. This project's `npm run dev` includes it because development uses DevContainer isolation.

### 10. Static Asset Strategy

- Images in srcDir are copied to distDir (not processed by Vite)
- Default copy targets (png, jpg, jpeg) are always included; user additions are merged, not replaced
- `base: './'` enables deployment to any subdirectory (e.g., GitHub Pages `docs/demo/`)
