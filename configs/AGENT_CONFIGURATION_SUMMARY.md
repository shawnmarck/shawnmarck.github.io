# Agent Configuration Summary

## Configuration Locations

Your OpenCode and oh-my-opencode configurations are stored at:
- **User-level**: `~/.config/opencode/`
  - `opencode.json` - OpenCode base configuration
  - `oh-my-opencode.json` - Oh-my-opencode agent overrides
  - `config.json` - Legacy/simple config (just sets default model to GLM-4.7)
  - `MODEL_ESCALATION_STRATEGY.md` - Your documented escalation strategy

**No project-level configurations** were found (no `.opencode/` directory in projects).

## Current Agent Configuration

### Tier 1: Primary Coding Agents (GLM-4.7)
**Model**: `zai-coding-plan/glm-4.7`
**Cost**: $0.40 input / $1.50 output per M tokens
**Context**: 200K tokens

| Agent | Purpose | Configuration |
|-------|---------|---------------|
| **build** | Building and code implementation | Configured in `opencode.json` |
| **plan** | Planning and task breakdown | Configured in `opencode.json` |
| **sisyphus** (main) | Primary orchestrator | Uses GLM-4.7 by default |

### Tier 2: Fast & Specialized Agents

| Agent | Model | Cost | Context | Purpose |
|-------|-------|------|---------|---------|
| **explore** | `opencode/grok-code` (Grok Code Fast 1) | $0.20/$1.50 per M | 256K | Code search, pattern matching |
| **librarian** | `google/gemini-3-flash` | $0.50/$3.00 per M | 1M | Research, documentation reading |
| **document-writer** | `google/gemini-3-flash` | $0.50/$3.00 per M | 1M | Documentation generation |
| **multimodal-looker** | `google/gemini-3-flash` | $0.50/$3.00 per M | 1M | PDF/image analysis |
| **frontend-ui-ux-engineer** | `google/gemini-3-pro-high` | $2.00/$12.00 per M | 1M | UI/UX design and implementation |

### Tier 3: Oracle-Lite (Medium Escalation)

| Agent | Model | Cost | Context | Purpose |
|-------|-------|------|---------|---------|
| **oracle-lite** | `google/gemini-3-pro-medium` | ~$1-2/$8-10 per M | 1M | Architecture guidance, debugging help |

### Tier 4: Premium Escalation

| Agent | Model | Cost | Context | Purpose |
|-------|-------|------|---------|---------|
| **oracle** | `anthropic/claude-opus-4-5` | $5.00/$25.00 per M | 200K | Complex decisions, deep reasoning |

## Plugins Enabled

1. **oh-my-opencode** - Adds Sisyphus orchestration and specialized agents
2. **opencode-antigravity-auth@1.3.0** - Authentication for Antigravity models

## Custom Providers

### Google (Antigravity)
Custom Gemini 3 models via Antigravity:
- `gemini-3-pro-high` (1M context, thinking enabled, multimodal)
- `gemini-3-pro-medium` (1M context, thinking enabled, multimodal)
- `gemini-3-pro-low` (1M context, thinking enabled, multimodal)
- `gemini-3-flash` (1M context, multimodal)
- `gemini-3-flash-lite` (1M context, multimodal)

All support PDF, image, and text inputs.

### Ollama (Local)
Local models for offline/private work:
- `qwen3-coder:30b` (65K context)
- `danielsheep/Qwen3-Coder-30B-A3B-Instruct-1M-Unsloth:UD-Q4_K_XL` (1M context)

## Escalation Strategy

Your documented 4-tier escalation approach:

1. **Start with GLM-4.7** (90% of work)
   - All standard coding, planning, documentation
   - Only escalate after 2+ failures on same task

2. **Use Grok Code Fast 1** for speed
   - Code searches, pattern matching
   - Simple refactorings

3. **Escalate to Oracle-Lite** for guidance
   - When GLM-4.7 produces functional but suboptimal code
   - Architecture questions not needing full Opus reasoning

4. **Reserve Opus 4.5** for premium cases only
   - 2+ GLM-4.7 failures
   - Complex multi-system architecture decisions
   - Deep debugging after multiple attempts

**Target cost reduction**: 70-80% vs. Opus-heavy usage
**Target rate limit reduction**: 80-90%

## Key Design Decisions

### Cost Optimization
- GLM-4.7 as workhorse (cheapest capable model)
- Gemini 3 Flash for high-volume tasks (research, docs, multimodal)
- Grok Code Fast 1 for code search (cheapest overall)
- Opus 4.5 reserved for 5-10% of work only

### Context Window Strategy
- 1M context for research and documentation tasks (librarian, document-writer, multimodal-looker, frontend-ui-ux-engineer)
- 200K-256K for coding tasks (sufficient for most code files)

### Specialization
- Each agent paired with model optimized for its domain
- Grok Code Fast 1 specifically for agentic coding/search
- Gemini 3 Pro High for visual/UI reasoning
- Opus 4.5 for complex reasoning only

## Instructions Reference

You have a custom shell strategy loaded from:
`~/.config/opencode/plugin/shell-strategy/shell_strategy.md`

This provides additional instructions to agents about shell command usage.

## Configuration Sync

The configurations in this repository match your active system configuration at `~/.config/opencode/` as of 2026-01-20.
