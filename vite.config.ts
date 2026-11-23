import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [
      // The DevContainer mounts these paths read-only.
      ".devcontainer/**",
      ".github/**",
      ".claude/**",
      ".vscode/**",
      "CLAUDE.md",
      "AGENTS.md",
    ],
  },
  lint: {
    // Demo sources import images, which have no type declarations here.
    ignorePatterns: ["demoSrc/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
