import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    name: "nodeTest",
    environment: "node",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
    },
  },
});
