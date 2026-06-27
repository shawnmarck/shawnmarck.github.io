# CLAUDE.md

Guidance for AI assistants working in this repository.

## Repository Overview

Public GitHub Pages site (`shawnmarck.github.io`) — static HTML only, no build step.

### Published sections

| Path | Description |
|------|-------------|
| `index.html` | Site landing page |
| `holon-wiki/` | Holon project documentation wiki |
| `holon-graph/` | Dependency graph viewer (`graph.html`) |
| `holon-algebra-of-trading/` | Trading algebra video asset |
| `agent-model-map.html` | Oh My OpenAgent model roster and category reference |
| `ofs-abstract.html` | OpenFairStack academic abstract |
| `images/` | Shared image assets |

Deployment: push to `main`; GitHub Pages serves from the repo root.

## Development

1. Edit HTML/CSS/JS directly — no bundler or package manager.
2. Preview by opening files locally in a browser.
3. Match existing design tokens when editing styled pages (dark theme, inline CSS).

### agent-model-map.html

Self-contained reference page for OpenAgent configuration:

- Agent roster table with models, pricing tiers, and context windows
- Category presets and runtime fallback examples
- Managed via [omo-config-manager](https://github.com/shawnmarck/omo-config-manager)

Upstream orchestration layer: [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode).

### holon-wiki/

Large static wiki generated from project sources. Pages share a common sidebar, Tailwind CDN styling, and `holon-search.js`. Do not hand-edit `search-index.json` unless regenerating the full index.

## What not to commit

- API keys, tokens, or local config snapshots
- Machine-specific paths or personal credentials
- Tool caches (see `.gitignore`)
