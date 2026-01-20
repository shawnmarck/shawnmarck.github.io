# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a GitHub Pages repository (shawnmarck.github.io) that hosts:
- `index.html`: A redirect page to the GitHub profile (https://github.com/shawnmarck)
- `agent-model-map.html`: A comprehensive documentation page detailing OpenCode AI Agent configuration and model selection rationale
- `images/`: Contains screenshots and assets

## Architecture

### Static Site Structure
- **No build process required**: This is a pure static HTML site. Changes to HTML files are immediately reflected when pushed to GitHub.
- **GitHub Pages deployment**: The site is automatically deployed from the `main` branch when changes are pushed.
- **No dependencies**: No package.json, no build tools, no CSS frameworks. All styling is inline.

### Key Files

#### index.html
Simple redirect page with meta refresh to GitHub profile. Structure:
- Meta refresh tag for automatic redirect
- Fallback link for manual navigation

#### agent-model-map.html
Self-contained documentation page with:
- Inline CSS using CSS custom properties (design system in `:root`)
- Dark theme UI matching modern development tool aesthetics
- Agent-model mapping table with pricing and context window information
- Configuration rationale cards explaining model selection
- Design principles and cost analysis sections
- No external dependencies (completely standalone)

The agent-model-map.html contains important reference information about:
- 8 specialized AI agents (build, plan, librarian, explore, oracle, frontend-ui-ux-engineer, document-writer, multimodal-looker)
- Model assignments and their rationale (GLM-4.7, Gemini 3 Flash/Pro High, Grok Code Fast 1, Claude Opus 4.5)
- Cost optimization strategy (ranging from $0.20/M to $25.00/M)
- Context window strategy (200K-1M tokens)
- Design principles: cost optimization, speed vs. quality tradeoffs, specialization, context window strategy

## Relationship to Oh-My-OpenCode

This repository documents agent-model configurations that can be implemented in **oh-my-opencode** (https://github.com/code-yeongyu/oh-my-opencode), an orchestration layer for OpenCode.

### OMO Default Agents

**Important**: Oh-my-opencode only enables **Planner-Sisyphus** (using Claude Opus 4.5) by default. All other agents are opt-in via configuration.

Default OMO agent models when enabled:
- **Sisyphus** (main orchestrator): `anthropic/claude-opus-4-5`
- **Prometheus** (planner): `anthropic/claude-opus-4-5` (enabled by default)
- **oracle**: `openai/gpt-5.2` (architecture, debugging)
- **librarian**: `anthropic/claude-sonnet-4-5` or `glm-4.7-free` (research)
- **explore**: `opencode/grok-code` (code search)
- **frontend-ui-ux-engineer**: `google/gemini-3-pro-high` (UI/UX)
- **document-writer**: `google/gemini-3-flash` (docs)
- **multimodal-looker**: `google/gemini-3-flash` (PDF/images)

See `configs/OMO_DEFAULT_AGENTS.md` for complete default configuration details.

### Configuration Implementation

The agent-model mappings in `agent-model-map.html` can be configured in oh-my-opencode via:
- **Project-level**: `.opencode/oh-my-opencode.json` (takes priority)
- **User-level**: `~/.config/opencode/oh-my-opencode.json` (macOS/Linux)

### Multi-Configuration Setup (Current Implementation)

**Active Configuration:** Option A (Pure Cost Optimization)

Three configuration variants are available for easy switching:

#### Option A: Pure Cost Optimization (ACTIVE)
**Location:** `~/.config/opencode/oh-my-opencode-option-a.json`

- **Orchestration**: GLM-4.7 for Sisyphus and Prometheus (main orchestrators)
- **Validation**: Gemini 3 Pro Medium for Metis and Momus
- **Oracle**: GPT-5.2 (architecture and complex reasoning)
- **Categories**: quick (Haiku), general (GLM-4.7), ultrabrain (GPT-5.2), visual-engineering (Gemini Pro High), writing (Gemini Flash)
- **Cost Reduction**: 85-90% vs. Opus-heavy config
- **Prerequisites**: OpenAI API key (GPT-5.2), Google API/Antigravity auth

#### Option B: Balanced Quality/Cost (STANDBY)
**Location:** `~/.config/opencode/oh-my-opencode-option-b.json`

- **Orchestration**: Claude Opus 4.5 for Sisyphus and Prometheus
- **Validation**: Claude Sonnet 4.5 for Metis and Momus
- **Oracle**: GPT-5.2 (OMO default for logical reasoning)
- **Categories**: quick (Haiku), ultrabrain (GPT-5.2), visual-engineering (Gemini Pro High), most-capable (Opus)
- **Cost Reduction**: 60-70% vs. all-Opus config
- **Prerequisites**: Anthropic API key REQUIRED, OpenAI API key, Google API/Antigravity auth

#### Option C: Hybrid Adaptive (STANDBY)
**Location:** `~/.config/opencode/oh-my-opencode-option-c.json`

- **Orchestration**: Gemini 3 Pro Medium for Sisyphus and Prometheus
- **Validation**: Gemini 3 Flash for Metis, Claude Sonnet 4.5 for Momus
- **Oracle**: Claude Opus 4.5 (best for coding)
- **Categories**: Multi-tier (quick → general → medium → ultrabrain), 7 total categories
- **Cost Reduction**: 75-85% vs. all-Opus config
- **Prerequisites**: Anthropic API key REQUIRED, Google API/Antigravity auth

#### Switching Between Configurations

The active configuration is controlled by symlink at `~/.config/opencode/oh-my-opencode.json`.

**Check current config:**
```bash
readlink ~/.config/opencode/oh-my-opencode.json
```

**Switch to Option A:**
```bash
cd ~/.config/opencode && ln -sf oh-my-opencode-option-a.json oh-my-opencode.json
```

**Switch to Option B:**
```bash
cd ~/.config/opencode && ln -sf oh-my-opencode-option-b.json oh-my-opencode.json
```

**Switch to Option C:**
```bash
cd ~/.config/opencode && ln -sf oh-my-opencode-option-c.json oh-my-opencode.json
```

**Detailed switching guide:** See `configs/CONFIG_SWITCHING_GUIDE.md` for complete instructions, cost comparisons, and troubleshooting.

### Agent Configuration Properties

When translating the documented agents to oh-my-opencode config, use these properties:
- `model`: Model identifier (e.g., "zai-coding-plan/glm-4.7", "google/gemini-3-flash")
- `temperature`: Controls randomness (typically 0.1-0.7 depending on task)
- `top_p`: Nucleus sampling parameter
- `prompt_append`: Add custom instructions without replacing defaults
- `tools`: Specify which tools the agent can use
- `disable`: Set to true to disable an agent
- `permission`: Fine-grained control (edit, bash, webfetch, doom_loop, external_directory)

### Agent Mapping Reference

The documented agents map to oh-my-opencode's system:
- **build/plan** → Custom agents using GLM-4.7 for cost-effective coding
- **librarian** → Research agent with Gemini 3 Flash (1M context)
- **explore** → Built-in oh-my-opencode agent, can override with Grok Code Fast 1
- **oracle** → High-stakes decisions using Claude Opus 4.5
- **frontend-ui-ux-engineer** → Visual tasks via categories config with Gemini 3 Pro High
- **document-writer** → Documentation generation with Gemini 3 Flash
- **multimodal-looker** → Built-in oh-my-opencode agent for PDF/image analysis

### Sisyphus Orchestration

Oh-my-opencode uses Sisyphus (Claude Opus 4.5) as the primary orchestrator with sub-agents:
- **Prometheus (Planner)**: Enabled by default for work-planning methodology
- **Metis (Plan Consultant)**: Pre-planning analysis to identify hidden requirements
- **OpenCode-Builder**: Disabled by default, can be enabled via `default_builder_enabled`

### Task Categories

Use categories in oh-my-opencode to apply runtime presets matching the documented agents:
```jsonc
{
  "categories": {
    "visual": {
      "model": "google/gemini-3-pro-high",
      "temperature": 0.7,
      "prompt_append": "Focus on UI/UX best practices and visual design."
    },
    "business-logic": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    }
  }
}
```

### Background Task Concurrency

Limit concurrent tasks by model or provider to manage costs:
- `modelConcurrency`: Per-model limits (e.g., limit expensive Claude Opus 4.5)
- `providerConcurrency`: Per-provider limits (respect rate limits)
- `defaultConcurrency`: Fallback limit

### MCPs Available

Oh-my-opencode enables these by default:
- `websearch`: Real-time web search via Exa AI
- `context7`: Official library documentation access
- `grep_app`: Code search across GitHub repositories

## Development Workflow

### Making Changes
1. Edit HTML files directly (no build step)
2. Test locally by opening HTML files in a browser
3. Commit and push to `main` branch
4. GitHub Pages will automatically deploy changes

### Git Workflow
- Main branch: `main`
- Clean working tree with meaningful commit messages
- Recent commits show a pattern of adding features incrementally

### Visual Design System
If modifying `agent-model-map.html`, maintain consistency with the existing design system:
- Colors defined as HSL values in CSS custom properties
- Dark theme (background: hsl(240 10% 3.9%), foreground: hsl(0 0% 98%))
- Border radius: 0.5rem
- Consistent spacing using rem units
- Typography: System font stack (-apple-system, BlinkMacSystemFont, etc.)
- Color-coded pricing indicators (green=low, orange=medium, red=high)
- Tag system for categorization (blue, green, purple, orange, red variants)

### Content Updates
When updating agent-model-map.html:
- Update the table data in the `<tbody>` section for agent configurations
- Update corresponding rationale cards in the "Configuration Rationale" section
- Ensure pricing classes (price-low, price-medium, price-high) match actual costs
- Keep tags consistent with agent capabilities
- Update the date script at the bottom (auto-generates on page load)
