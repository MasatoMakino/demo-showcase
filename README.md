# @masatomakino/demo-showcase

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@masatomakino/demo-showcase.svg?style=flat)](https://www.npmjs.com/package/@masatomakino/demo-showcase)
[![CI](https://github.com/MasatoMakino/demo-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/MasatoMakino/demo-showcase/actions/workflows/ci.yml)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github&style=flat)](https://github.com/MasatoMakino/demo-showcase)

A CLI tool that generates demo HTML pages from JavaScript/TypeScript source files using Vite.

Place demo source files (e.g. `demo_*.ts`) in a directory, and this tool generates a browsable demo site with sidebar navigation — both as a dev server with HMR and as a static build.

## Install

```bash
npm install --save-dev @masatomakino/demo-showcase
```

Requires Node.js >= 22.

## Usage

### Dev server (live preview with HMR)

```bash
npx demo-showcase dev --srcDir ./demoSrc
```

### Static build

```bash
npx demo-showcase build --srcDir ./demoSrc
```

Output goes to `./docs/demo/` by default.

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--prefix <string>` | `"demo"` | Filename prefix for demo pages |
| `--srcDir <path>` | `"./demoSrc"` | Demo source directory |
| `--distDir <path>` | `"./docs/demo"` | Output directory (build only) |
| `--body <string>` | `""` | HTML body content |
| `--style <string>` | `""` | Custom CSS styles |
| `--port <number>` | `3456` | Dev server port (dev only) |
| `--open` | `false` | Open browser on start (dev only) |
| `--host <string>` | `"localhost"` | Dev server host (dev only) |

## How it works

1. Scans `srcDir` for files matching `{prefix}_*.ts` or `{prefix}_*.js`
2. Generates an HTML entry point for each demo file
3. Builds with Vite (static) or serves via Vite dev server (dev mode)
4. Produces an index page with sidebar navigation linking all demos

Assets referenced via `import` in demo files are bundled by Vite automatically.

## License

[MIT](LICENSE)
