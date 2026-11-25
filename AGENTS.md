# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

A CLI tool that generates demo HTML pages from JavaScript/TypeScript source files using Vite.

## Development Environment

**IMPORTANT**: This project uses DevContainer to isolate pnpm execution from the host OS for security purposes. All pnpm commands must be executed inside the DevContainer.

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

- Security: an iptables firewall allows outbound traffic only to the npm registry. `.git`, `.devcontainer`, `.github`, `.claude`, `.vscode`, `CLAUDE.md`, and `AGENTS.md` are mounted read-only. `node_modules` is a named volume. See `.devcontainer/DESIGN.md`

## Development Commands

**All commands must be run inside the DevContainer** using the `devcontainer exec` wrapper.

Each worktree has its own DevContainer. In a new worktree, run `devcontainer up --workspace-folder .` once before the other commands.

### Build and Test

- `devcontainer exec --workspace-folder . pnpm run build` - Build TypeScript to JavaScript (uses `tsc`)
- `devcontainer exec --workspace-folder . pnpm run watch` - Watch TypeScript files and build continuously
- `devcontainer exec --workspace-folder . pnpm test` - Run full test suite (vitest + build + testRun)
- `devcontainer exec --workspace-folder . pnpm run test:watch` - Run tests in watch mode
- `devcontainer exec --workspace-folder . pnpm run coverage` - Generate test coverage report

### Dev Server

- `devcontainer exec --workspace-folder . pnpm run dev` - Start dev server (port 3456, host 0.0.0.0)
- See `dev-server-lifecycle` skill for the host port lookup and stop procedure

### CLI Testing

- `devcontainer exec --workspace-folder . pnpm run testRun` - Test the built CLI tool with default options

## Git Hooks

Git runs on the host. The `pre-commit` hook in `.git/hooks/` passes the staged files to `pnpm run pre-commit` in the DevContainer of the working tree, and re-stages them. It finds the container by its `devcontainer.local_folder` label and starts the container when it is stopped. CI runs the tests and the lint on each PR, so there is no `pre-push` hook.

## Architecture

See the `architecture-design` skill for the build and dev flows and the design rationale.

## Task Completion Verification

After code changes:

1. Run `devcontainer exec --workspace-folder . pnpm test` - verify unit tests, build, and demo page build succeed
2. Open `docs/demo/index.html` in browser and verify sidebar navigation and demo pages work
