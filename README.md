<div align="center">

<a href="https://xo.builders">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/xo-logo.svg">
    <source media="(prefers-color-scheme: light)" srcset="brand/xo-logo-light.svg">
    <img src="brand/xo-logo-light.svg" alt="XO" width="96" height="96">
  </picture>
</a>

# xo-research

**The research behind XO.**
Briefs, syntheses, and primary-source notes. The work that informs how we design agent workspaces, what we build, and what we don't.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Fumadocs](https://img.shields.io/badge/Fumadocs-16.8-83d63a?style=flat-square)](https://fumadocs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-A0A0A0?style=flat-square)](#license)

</div>

---

## What this is

`xo-research` is the public-leaning research site for [XO](https://xo.builders): the place where the primary-source reading, synthesis, and decision evidence behind the product gets written down once and stays citable forever.

It is a [Next.js](https://nextjs.org/) and [Fumadocs](https://fumadocs.dev/) app, deliberately a fork of [`xo-docs`](https://docs.xo.builders) so that styling, search, AI chat, OG images, and the MDX pipeline behave identically. The difference is what fills the pages: not "how do I create a workspace" help content, but the research that shapes how we design the workspace in the first place.

If `xo-docs` answers *how do I use XO*, `xo-research` answers *why is XO designed this way*.

```
                  ┌───────────────────────────────────────────────┐
                  │                  xo.builders                  │
                  │           (marketing & product entry)         │
                  └───────────────────────────────────────────────┘
                              │                       │
                              ▼                       ▼
            ┌──────────────────────────┐   ┌────────────────────────────┐
            │  docs.xo.builders        │   │  research.xo.builders      │
            │  (xo-docs)               │   │  (xo-research) ← this repo │
            │                          │   │                            │
            │  How do I use XO?        │   │  Why is XO designed this   │
            │  • Getting started       │   │  way? What evidence?       │
            │  • Agents                │   │  • Agent harness research  │
            │  • Setup                 │   │  • Context engineering     │
            │  • Troubleshooting       │   │  • Competitive analyses    │
            │  • API reference         │   │  • Customer interviews     │
            └──────────────────────────┘   └────────────────────────────┘
```

## What's inside today

| Research area | What's there |
|---|---|
| **Agent harness** | [Effective harnesses for long-running agents](content/docs/agent-harness/long-running-agents.mdx): synthesis of Anthropic's harness post, context-engineering post, multi-agent research, Cognition's "Don't Build Multi-Agents," and METR's time-horizon data, with concrete implications for `xo-cowork-api`, `xo-coworker`, and OpenClaw. |

Future areas the scaffolding already anticipates: context engineering deep-dives, multi-agent vs single-threaded patterns by workload, tool design and agent-computer interfaces, production reliability for stateful agents, the long-horizon benchmark landscape, competitive briefs, customer interview synthesis, market sizing.

## Quick start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

The first time you run, `fumadocs-mdx` will generate the `.source/` collection from `content/docs/`. If you add or rename pages and hot reload doesn't pick them up, `pnpm postinstall` regenerates the collection.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start Next.js dev server on port 3000 |
| `pnpm build` | Production build (Fumadocs MDX + Next compile) |
| `pnpm start` | Run the production build |
| `pnpm types:check` | Generate Fumadocs types, run `tsc --noEmit` |
| `pnpm lint` | Biome check |
| `pnpm format` | Biome format on write |

## Environment variables

The site only needs one variable, and only when the AI chat endpoint (`/api/chat`) is exercised:

```env
ANTHROPIC_API_KEY=
```

Everything else is content. A missing key turns off chat; search and reading work without it.

## Repository structure

```
.
├── brand/                              # XO logo and brand assets
├── content/
│   └── docs/                           # All research content (Fumadocs convention name)
│       ├── meta.json                   # Top-level section order
│       ├── index.mdx                   # Site landing page
│       └── agent-harness/              # One folder per research area
│           ├── meta.json
│           ├── index.mdx               # Section landing page
│           └── long-running-agents.mdx # A brief
├── public/
│   ├── icons/                          # Service & brand icons used in sidebar
│   └── images/                         # Diagrams, charts, screenshots referenced from MDX
├── src/
│   ├── app/
│   │   ├── (docs)/                     # Research layout and dynamic page route
│   │   ├── api/
│   │   │   ├── chat/route.ts           # AI chat (Anthropic via AI SDK)
│   │   │   └── search/route.ts         # Flexsearch index
│   │   ├── og/docs/[...slug]/          # Per-page OG image generation
│   │   ├── llms.txt/                   # LLM-friendly index
│   │   ├── llms-full.txt/              # Full corpus dump for LLM ingestion
│   │   ├── layout.tsx                  # Root layout, metadata, font
│   │   ├── global.css                  # Tailwind + theme tokens
│   │   ├── robots.ts                   # Robots config
│   │   └── sitemap.ts                  # Sitemap generation
│   ├── components/
│   │   ├── ai/search.tsx               # "Ask AI" search panel
│   │   ├── card.tsx                    # Section cards (used on landings)
│   │   ├── brand-icon.tsx              # Loads /public/icons brand SVGs
│   │   ├── html-embed.tsx              # HtmlEmbed, HtmlInline, IframeEmbed
│   │   ├── data-viz.tsx                # SVG charts (MetrDoublingChart, StatBlock)
│   │   ├── mdx.tsx, markdown.tsx       # MDX component overrides
│   │   └── ui/                         # Shared primitives (button, etc.)
│   └── lib/
│       ├── source.ts                   # Fumadocs source loader + icon registry
│       ├── layout.shared.tsx           # Nav config, external links
│       └── shared.ts                   # appName, siteUrl, gitConfig (edit to rebrand)
├── source.config.ts                    # Fumadocs MDX config
├── next.config.mjs                     # Next.js config (Turbopack root)
├── biome.json                          # Lint + format
├── postcss.config.mjs                  # PostCSS (Tailwind 4)
├── tsconfig.json                       # TS config
└── package.json
```

## Adding a research area

Pick a folder name that reads cleanly as a URL slug.

```bash
mkdir content/docs/competitive-landscape
```

Add `meta.json` to declare the page order and (optionally) a sidebar icon. Icon names map to Phosphor classes in `src/lib/source.ts`:

```json
{
  "title": "Competitive landscape",
  "icon": "Network",
  "pages": ["index", "devin", "cursor", "openhands"]
}
```

Add `index.mdx` as the landing page with a frontmatter `title` and `description`. Then list each page (`devin.mdx`, etc.). Finally, register the new area in the top-level `content/docs/meta.json`:

```json
{
  "title": "XO Research",
  "pages": ["index", "agent-harness", "competitive-landscape"]
}
```

## Adding a brief

A brief is one MDX file inside a research area. Frontmatter is required.

```mdx
---
title: Effective harnesses for long-running agents
description: Synthesis of Anthropic, Cognition, and METR research on multi-context agents, with implications for XO.
---

Compiled May 2026.

## Why this matters now

...
```

Conventions, applied uniformly:

- **One brief per topic.** Don't split a coherent argument across multiple pages just because it's long. Use headings.
- **Sources at the bottom.** Inline markdown links for verifiable claims, then a final "Sources" section that lists primary references in order of load-bearing weight.
- **Quotes verbatim.** Verify against the source before publishing. Numeric claims (benchmarks, percentages) must trace back to a cited source.
- **Implications for XO at the end.** When the research has product or architectural consequences, name them concretely (named services, files, decisions), not abstractly.

## Interactive content (charts, raw HTML, iframes)

Markdown is the default, but research often needs more. Briefs can use five components without any `import` statement (registered globally in `src/components/mdx.tsx`):

| Component | Purpose |
|---|---|
| `<MetrDoublingChart />` | Server-rendered SVG chart of METR's 7-month doubling. Template for other inline SVG charts. |
| `<StatBlock stats=[{value, label, source}] />` | Compact grid of load-bearing numbers at the top of a brief. |
| `<HtmlEmbed src="content/docs/.../viz.html" caption="..." />` | Inline a local `.html` file (Chart.js, D3, Plotly, anything). Read at render time from the project root, then injected into the page. |
| `<HtmlInline html="..." caption="..." />` | Inline a short HTML string written directly in the MDX file. |
| `<IframeEmbed url="https://..." height={480} caption="..." />` | Sandboxed iframe for external pages. `sandbox="allow-scripts allow-same-origin"` by default. |

### Where HTML files live

Place `.html` files alongside the `.mdx` files that consume them, inside the research area:

```
content/docs/agent-harness/
  meta.json
  index.mdx
  long-running-agents.mdx
  interactive-showcase.mdx
  charts/                              # standalone HTML viz, embedded via <HtmlEmbed>
    agent-failure-modes.html
```

Fumadocs ignores non-MDX files in the content tree, so the HTML files don't generate sidebar entries on their own. They become page content only when an `.mdx` file embeds them.

### Adding a new viz

1. Build the HTML file. Self-contained (inline `<style>`, no external deps unless you load them yourself). Drop it next to the brief in a `charts/` folder.
2. Reference it from the brief with `<HtmlEmbed src="content/docs/<area>/charts/<name>.html" />`. The `src` is always relative to the project root.
3. If the HTML needs JavaScript, include `<script>` tags inline. `HtmlEmbed` uses `dangerouslySetInnerHTML`, so scripts in the embedded HTML will execute when the page hydrates.

### Trust boundary

`<HtmlEmbed>` and `<HtmlInline>` use `dangerouslySetInnerHTML`. Only use them with HTML that ships from this repo (you wrote it, or a teammate did). For HTML from a customer, a connector, or an unknown source, use `<IframeEmbed url="..." />` so the content runs in a sandboxed frame.

See the [Interactive content showcase](content/docs/agent-harness/interactive-showcase.mdx) for a working example of every component.

## Style

Mirror the conventions in the workspace `CLAUDE.md`:

- No em dashes or en dashes (U+2014, U+2013). Use commas, colons, parentheses, or sentence breaks instead.
- Brief by default. Skip preamble, recap, and victory laps.
- One focused clarifying question over guessing.
- Server-side anything that touches an API key. No `NEXT_PUBLIC_` prefix on secrets.

## How this site relates to XO

XO is workspaces for AI agents: containerized workspaces that bridge context windows, broker multiple agent runtimes (Claude Code, Codex, OpenClaw), and run anywhere from a laptop to Coder to Vercel Sandbox. The product surface is the harness around the model, and *every harness choice is a research question*. This site is where those research questions get answered durably, instead of getting lost in chat scrollback.

The paired product surfaces:

| Layer | Frontend | Backend |
|---|---|---|
| **Workspace (the unit)** | [`xo-coworker`](https://github.com/sharmasuraj0123/xo-coworker) | [`xo-cowork-api`](https://github.com/sharmasuraj0123/xo-cowork-api) |
| **Platform (the fleet)** | [`xo-swarm`](https://github.com/sharmasuraj0123/xo-swarm) | [`xo-swarm-api`](https://github.com/sharmasuraj0123/xo-swarm-api) |

The research here informs all four.

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router and Turbopack
- **Content:** [Fumadocs MDX 14](https://fumadocs.dev/), `pageSchema` + `metaSchema` from `fumadocs-core`
- **UI:** [Fumadocs UI 16](https://fumadocs.dev/), [Tailwind 4](https://tailwindcss.com/), [Iconify](https://iconify.design/) (Phosphor + brand sets), Raleway via `next/font/google`
- **Search:** [Flexsearch](https://github.com/nextapps-de/flexsearch) + Fumadocs search
- **AI chat:** [AI SDK 6](https://ai-sdk.dev/) with Anthropic and OpenRouter providers
- **Lint/format:** [Biome 2](https://biomejs.dev/)
- **Types:** TypeScript 6, strict mode

## Origin

Forked from [`xo-docs`](https://github.com/sharmasuraj0123/xo-docs) on May 24, 2026 to share its Fumadocs scaffolding, MDX pipeline, theme tokens, AI search, OG generation, and `llms.txt` routes. The `content/docs/` directory name is kept because it is the Fumadocs convention; the surface presented to readers is research throughout.

To rebrand or rehost, edit `src/lib/shared.ts`:

```ts
export const appName = "XO Research";
export const siteUrl = "https://research.xo.builders";
export const gitConfig = {
  user: "sharmasuraj0123",
  repo: "xo-research",
  branch: "main",
};
```

## License

MIT.

---

<div align="center">
  <sub>Built for <a href="https://xo.builders">XO</a>. Powered by <a href="https://fumadocs.dev">Fumadocs</a>.</sub>
</div>
