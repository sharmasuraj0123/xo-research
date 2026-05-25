---
name: add-icon
description: >-
  Adds icons to the xo-docs project. Handles two icon types:
  1. AI/LLM model brand icons from @lobehub/icons (downloaded as SVG to public/icons/, registered in BRAND_ICONS in src/lib/source.ts)
  2. General UI icons from Iconify icon sets (registered in ICON_CLASSES in src/lib/source.ts)

  Use when the user wants to add a sidebar/navigation icon for a new docs section,
  brand logo for an AI model/tool, or any iconify-based UI icon.

  TRIGGER when: user asks to "add icon", "add [brand] icon", "use [icon] icon", or
  references an icon name in meta.json that isn't resolving.
---

# Add Icon Skill

This project has two icon systems. Choose based on what the icon is for.

## Icon Type Decision

| Use case | Icon type | Where |
|----------|-----------|-------|
| AI model / LLM brand (Claude, GPT, Gemini, Mistral, etc.) | AI/LLM brand icon via @lobehub/icons | Download SVG → `public/icons/` |
| Any tool/platform brand already in `public/icons/` | Brand icon | Already done |
| Generic UI icon (archive, settings, terminal, etc.) | Iconify | `ICON_CLASSES` in `src/lib/source.ts` |
| Non-AI brand needing a custom SVG | Brand icon | Download SVG → `public/icons/` |

---

## Type 1: AI / LLM Brand Icons (@lobehub/icons)

### Step 1 — Find the icon

Visit **https://lobehub.com/icons** to browse available AI/LLM model brand icons.

The skill.md at https://lobehub.com/icons/skill.md contains the full list of available components. Read it to find the correct icon name and SVG URL.

Each icon is available as a React component AND as a raw SVG. The SVG URLs follow this pattern:
```
https://registry.npmmirror.com/@lobehub/icons/latest/files/src/components/<IconName>/<IconName>.svg
```

Or fetch from the unpkg CDN:
```
https://unpkg.com/@lobehub/icons/src/components/<IconName>/<IconName>.svg
```

Examples of available icons: `Claude`, `OpenAI`, `Gemini`, `Mistral`, `Llama`, `Grok`, `DeepSeek`, `Qwen`, `Cohere`, `Huggingface`, `Ollama`, `Perplexity`, `Groq`, `Together`, `Replicate`, etc.

### Step 2 — Download the SVG

Download the SVG to `public/icons/` using a lowercase-hyphenated filename:

```bash
# Example: adding Gemini icon
curl -o "public/icons/gemini.svg" "https://unpkg.com/@lobehub/icons/src/components/Gemini/Gemini.svg"

# Example: adding Mistral icon  
curl -o "public/icons/mistral.svg" "https://unpkg.com/@lobehub/icons/src/components/Mistral/Mistral.svg"
```

**IMPORTANT**: Verify the downloaded SVG is valid (not an HTML error page) before proceeding:
```bash
head -1 public/icons/<name>.svg
# Should start with <svg, not <!DOCTYPE
```

If the SVG has hardcoded fill colors (not `currentColor`), the icon will NOT respect the theme color. You may need to replace fill values:
```bash
# Check for hardcoded colors
grep -i "fill=" public/icons/<name>.svg | head -5
```

The `BrandIcon` component uses CSS `maskImage` with `backgroundColor: currentColor`, so the SVG only needs to define the shape — not colors. If the SVG has complex gradients or multi-color fills, consider simplifying it.

### Step 3 — Register in source.ts

Open `src/lib/source.ts` and add the new brand to the `BRAND_ICONS` map:

```typescript
// Before
const BRAND_ICONS: Record<string, string> = {
  ClaudeCode: "claude-code",
  OpenAI: "openai",
  // ...
};

// After — add your new entry
const BRAND_ICONS: Record<string, string> = {
  ClaudeCode: "claude-code",
  OpenAI: "openai",
  Gemini: "gemini",      // ← new entry: key is PascalCase, value matches filename in public/icons/
  Mistral: "mistral",    // ← new entry
  // ...
};
```

**Convention**: Key is `PascalCase` (used in `meta.json`). Value is the filename slug in `public/icons/` (without `.svg`).

### Step 4 — Use the icon in navigation

In the relevant `content/docs/*/meta.json`:
```json
{
  "title": "Gemini",
  "icon": "Gemini",
  "pages": ["setup", "usage"]
}
```

The key in `meta.json` must exactly match the key in `BRAND_ICONS`.

---

## Type 2: Iconify UI Icons

For general UI icons (not brand logos). This project uses two icon sets:
- **Phosphor** (`ph`) — e.g. `icon-[ph--archive-fill]`
- **MingCute** (`mingcute`) — e.g. `icon-[mingcute--chat-2-ai-fill]`

### Step 1 — Find the icon name

Browse icons at:
- Phosphor: https://phosphoricons.com — click an icon to get its name (e.g. `archive` → `icon-[ph--archive-fill]`)
- MingCute: https://www.mingcute.com — click icon to get name
- Any Iconify set: https://icon-sets.iconify.design

Iconify class format: `icon-[<set>--<icon-name>]`

Examples:
```
icon-[ph--archive-fill]
icon-[ph--gear-fill]
icon-[ph--terminal-window-fill]
icon-[mingcute--chat-2-ai-fill]
```

### Step 2 — Register in source.ts

Open `src/lib/source.ts` and add to the `ICON_CLASSES` map:

```typescript
// Before
const ICON_CLASSES: Record<string, string> = {
  Archive: "icon-[ph--archive-fill]",
  Settings: "icon-[ph--gear-fill]",
  // ...
};

// After
const ICON_CLASSES: Record<string, string> = {
  Archive: "icon-[ph--archive-fill]",
  Settings: "icon-[ph--gear-fill]",
  Database: "icon-[ph--database-fill]",     // ← new entry
  Globe: "icon-[ph--globe-hemisphere-west-fill]",  // ← new entry
  // ...
};
```

**Convention**: Key is a semantic `PascalCase` name. Value is the full Iconify Tailwind class string.

### Step 3 — (If using a new icon set) Install the icon set package

The project already has `@iconify-json/ph` and `@iconify-json/mingcute` installed. If you need a different set (e.g. `lucide`, `mdi`, `tabler`):

```bash
pnpm add -D @iconify-json/<set-name>
```

Check https://icon-sets.iconify.design to find the set prefix.

### Step 4 — Use in navigation meta.json

```json
{
  "title": "Database",
  "icon": "Database",
  "pages": [...]
}
```

### Using iconify icons directly in components

For icons used directly in `.tsx` files (not sidebar navigation), use the class directly without registering in `ICON_CLASSES`:

```tsx
<span className="icon-[ph--database-fill] size-4" />
```

---

## How the icon system works (context)

- `src/lib/source.ts` exports `iconifyIconsPlugin()` — a fumadocs plugin that transforms the page tree
- When fumadocs encounters a string `icon` value in `meta.json`, this plugin converts it to a React element
- `BRAND_ICONS` → renders `<BrandIcon name={slug} size={16} />` (CSS mask-image SVG)
- `ICON_CLASSES` → renders `<span className="icon-[...]" />` (Iconify Tailwind)
- `src/components/brand-icon.tsx` handles brand icon rendering with `maskImage` + `currentColor`

## ARGUMENTS

The icon name or description to add. Examples:
- `Gemini` — adds the Gemini AI brand icon
- `Database` — adds a database UI icon  
- `Mistral` — adds Mistral AI brand icon
- `Globe icon for international docs section`
