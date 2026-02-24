# Vite HTML Attribute Escaping

Vite's HTML parser (parse5) strictly validates HTML attributes. JSON strings inside `data-*` attributes must use `&quot;` instead of `"`.

## Pattern

```typescript
// Wrong: parse5 error "missing-whitespace-between-attributes"
data-demo-paths="["a.html","b.html"]"

// Correct: HTML entity escaped
data-demo-paths="[&quot;a.html&quot;,&quot;b.html&quot;]"
```

## Implementation

```typescript
function escapeHtmlAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

template.replace("{{PLACEHOLDER}}", escapeHtmlAttr(JSON.stringify(data)));
```
