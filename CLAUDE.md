# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A CLI tool that generates demo HTML pages from JavaScript/TypeScript source files using Vite. Successor to `@masatomakino/gulptask-demo-page`, replacing webpack with Vite for native TS support and HMR dev server.

## Development Environment

**IMPORTANT**: This project uses DevContainer to isolate npm execution from the host OS for security purposes. All npm commands must be executed inside the DevContainer.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [DevContainer CLI](https://github.com/devcontainers/cli): `npm install -g @devcontainers/cli`

### DevContainer Setup

```bash
devcontainer build --workspace-folder .
devcontainer up --workspace-folder .
devcontainer stop --workspace-folder .
```

### Architecture

- Base image: `node:22-bookworm-slim`
- Security: `--cap-drop=ALL` (removes all Linux capabilities)
- Non-root user: `node` (UID:1000, GID:1000)

## Development Commands

**All commands must be run inside the DevContainer** using the `devcontainer exec` wrapper:

### Build and Test

- `devcontainer exec --workspace-folder . npm run build` - Build TypeScript to JavaScript (uses `tsc`)
- `devcontainer exec --workspace-folder . npm run watch` - Watch TypeScript files and build continuously
- `devcontainer exec --workspace-folder . npm test` - Run full test suite (vitest + build + testRun)
- `devcontainer exec --workspace-folder . npm run test:watch` - Run tests in watch mode
- `devcontainer exec --workspace-folder . npm run coverage` - Generate test coverage report

### Dev Server

- `devcontainer exec --workspace-folder . npm run dev` - Start dev server (port 3456, host 0.0.0.0)
- Use `docker port demo-showcase-npm-runner 3456` to find the host port
- See `dev-server-lifecycle` skill for stop procedure

### CLI Testing

- `devcontainer exec --workspace-folder . npm run testRun` - Test the built CLI tool with default options

### Code Quality

- Uses Biome for formatting and linting
- Template HTML files (`template/*.html`) are excluded from Biome checks (placeholder markers cause parse errors)

## Git Hooks Setup (Optional)

See `.devcontainer/git-hooks/README.md` for setup instructions.

## Architecture

### CLI Interface

Two subcommands via Commander.js:

```
npx @masatomakino/demo-showcase dev [options]    # Live preview with HMR
npx @masatomakino/demo-showcase build [options]   # Static site output
```

### Core Components

- **CLI Entry Point**: `src/CLI.ts` - Thin CLI wrapper
- **Command Runner**: `src/runCommand.ts` - Commander.js argument parsing (dev/build subcommands)
- **Build Mode**: `src/build.ts` - Static site build orchestration via Vite
- **Dev Mode**: `src/dev.ts` - Vite dev server with custom plugin
- **Vite Config**: `src/ViteConfig.ts` - Vite config builder
- **Demo Plugin**: `src/DemoPlugin.ts` - Custom Vite plugin (dev server middleware)
- **HTML Generator**: `src/HtmlGenerator.ts` - HTML generation from templates (string replacement)
- **Entry Discovery**: `src/entries.ts` - Demo source file discovery
- **File Operations**: `src/Clean.ts`, `src/Style.ts` - Asset management
- **Options**: `src/Option.ts` - Option types and defaults

### Build Flow

1. Discover demo source files matching prefix pattern
2. Create staging directory with generated HTML entry points
3. Run `vite.build()` with MPA rollup inputs (assets referenced via `import` are bundled by Vite)
4. Copy `indexScript.js` to dist (not bundled by Vite)
5. Clean up staging directory

### Dev Flow

1. Discover demo source files
2. Create Vite dev server with custom plugin middleware
3. Plugin serves dynamically generated HTML pages
4. Vite handles TS compilation (esbuild) and HMR natively
5. File watcher detects new/removed demo files and restarts server

### File Structure Conventions

- Demo source files: `demoSrc/demo_*.ts` or `demoSrc/demo_*.js`
- Templates: `template/` directory with plain HTML (placeholder markers `{{...}}`)
- Output: `docs/demo/` directory (configurable)
- Built CLI: `bin/` directory

### Template Strategy

Templates use plain HTML with `{{PLACEHOLDER}}` markers replaced by `HtmlGenerator.ts` via string replacement. No EJS dependency.

### Testing

- Uses Vitest for testing
- Test files in `__test__/` directory
- Tests include CLI functionality, HTML generation, file operations
- `template/indexScript.js` tested via Node.js `vm` module (see `__test__/indexScript.spec.js`)

## CLI Options Reference

### Shared Options

| Option | Default | Description |
|--------|---------|-------------|
| `--prefix <string>` | `"demo"` | Filename prefix for demo pages |
| `--srcDir <path>` | `"./demoSrc"` | Demo source directory |
| `--distDir <path>` | `"./docs/demo"` | Output directory (build mode) |
| `--body <string>` | `""` | HTML body content |
| `--style <string>` | `""` | Custom CSS styles |

### Dev-only Options

| Option | Default | Description |
|--------|---------|-------------|
| `--port <number>` | `3456` | Dev server port |
| `--open` | `false` | Open browser on start |
| `--host <string>` | `"localhost"` | Dev server host |

## Key Configuration

- TypeScript configuration: `tsconfig.json` (for CLI source compilation only)
- Package exports: ES modules only (`"type": "module"`)
- Build output uses relative paths (`base: './'`) for flexible deployment

## Task Completion Verification

After code changes:

1. Run `devcontainer exec --workspace-folder . npm test` - verify unit tests, build, and demo page build succeed
2. Open `docs/demo/index.html` in browser and verify sidebar navigation and demo pages work
