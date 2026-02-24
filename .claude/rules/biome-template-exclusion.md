# Biome Template HTML Exclusion

Template HTML files with `{{PLACEHOLDER}}` markers cause Biome parse errors ("Text expressions aren't supported"). These files are excluded in `biome.json`:

```json
"files": {
  "includes": ["**", "!demoSrc", "!template/*.html"]
}
```

When adding new template HTML files with placeholders, ensure they match this exclusion pattern.
