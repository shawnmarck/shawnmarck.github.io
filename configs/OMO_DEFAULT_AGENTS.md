# Oh-My-OpenCode Default Agents

## What's Enabled by Default

**Only one agent is enabled by default:**

### Planner-Sisyphus (Prometheus)
- **Model**: `anthropic/claude-opus-4-5`
- **Status**: Enabled by default (`enabled: true, replace_plan: true`)
- **Mode**: Synchronous (blocking)
- **Purpose**: Intelligent task decomposition and systematic execution
- **Cost**: High ($5.00 input / $25.00 output per M tokens)
- **Features**:
  - Extended thinking with 32,000 token budget
  - Task decomposition into manageable steps
  - Context preservation during planning
  - Error handling and recovery
  - Task continuation after interruptions

This is the **primary orchestrator** that replaces the standard OpenCode plan agent.

## Sisyphus Orchestrator System

When Sisyphus is enabled (the main orchestration layer), it coordinates multiple specialist sub-agents:

### Built-in Sub-Agents (Available but NOT Enabled by Default)

| Agent | Default Model | Cost Tier | Mode | Purpose |
|-------|--------------|-----------|------|---------|
| **Sisyphus** (main) | `anthropic/claude-opus-4-5` | High | Sync | Primary orchestrator, team lead |
| **Prometheus** | `anthropic/claude-opus-4-5` | High | Sync | Strategic planning via interview mode |
| **Metis** | `anthropic/claude-opus-4-5` | High | Sync | Pre-planning analysis, identifies hidden requirements |
| **oracle** | `openai/gpt-5.2` | Very High | Sync | Architecture decisions, debugging, code review |
| **librarian** | `anthropic/claude-sonnet-4-5` | Low | Async | Multi-repo research, doc lookup, implementation examples |
| **explore** | `opencode/grok-code` | Free | Async | Fast codebase exploration, pattern matching |
| **frontend-ui-ux-engineer** | `google/gemini-3-pro-high` | Medium | Sync | UI/UX generation and styling |
| **document-writer** | `google/gemini-3-flash` | Very Low | Sync | Technical documentation creation |
| **multimodal-looker** | `google/gemini-3-flash` | Very Low | Sync | PDF and image analysis |
| **OpenCode-Builder** | (model not specified) | - | Sync | Build agent (disabled by default) |

## Model Adaptation by Provider

The orchestrator **adapts models based on what's available**:

### Librarian
- **Preferred**: `opencode/glm-4.7-free` (when available)
- **With Antigravity auth**: `google/gemini-3-flash`
- **Fallback**: `anthropic/claude-sonnet-4-5`

### Explore
- **Preferred**: `opencode/grok-code`
- **With Antigravity auth**: `google/gemini-3-flash`
- **With Claude max20**: `anthropic/claude-haiku-4-5`

### Oracle
- **Default**: `openai/gpt-5.2`
- **Purpose**: Stellar logical reasoning and deep analysis

## Delegation Priority (Cost Optimization)

Sisyphus uses this hierarchy for task delegation:

1. **Skills** (highest priority if task matches)
2. **Direct tools** (free operations for clear scope)
3. **Background agents** (cheap/free parallel execution)
   - `explore`, `librarian` - always async
4. **Blocking agents** (expensive sequential reasoning)
   - `oracle`, `frontend-ui-ux-engineer`, `document-writer`

## Concurrency Limits (Background Tasks)

Default limits per provider:
- **Anthropic**: 3 concurrent tasks
- **OpenAI**: 5 concurrent tasks
- **Google**: 10 concurrent tasks

## Configuration Override

To enable/customize agents, add to your `.opencode/oh-my-opencode.json`:

```jsonc
{
  "sisyphus": {
    "disabled": false,           // Enable Sisyphus orchestration
    "default_builder_enabled": false,  // Keep builder disabled
    "planner_enabled": true      // Enable Prometheus planner
  },
  "agents": {
    "librarian": {
      "model": "google/gemini-3-flash"  // Override default model
    },
    "explore": {
      "model": "opencode/grok-code"
    },
    "oracle": {
      "model": "anthropic/claude-opus-4-5"  // Or keep GPT-5.2
    }
    // Add more agent overrides here
  }
}
```

## Your Current Configuration vs. OMO Defaults

### Differences from OMO Defaults:

| Agent | OMO Default | Your Config |
|-------|-------------|-------------|
| **oracle** | `openai/gpt-5.2` | `anthropic/claude-opus-4-5` |
| **librarian** | `anthropic/claude-sonnet-4-5` or `glm-4.7-free` | `google/gemini-3-flash` |
| **explore** | `opencode/grok-code` | `opencode/grok-code` ✓ |
| **frontend-ui-ux-engineer** | `google/gemini-3-pro-high` | `google/gemini-3-pro-high` ✓ |
| **document-writer** | `google/gemini-3-flash` | `google/gemini-3-flash` ✓ |
| **multimodal-looker** | `google/gemini-3-flash` | `google/gemini-3-flash` ✓ |

### Additional Agents You've Configured:

- **oracle-lite**: `google/gemini-3-pro-medium` (custom, not in OMO defaults)

## Key Takeaways

1. **Only Planner-Sisyphus enabled by default** - everything else is opt-in
2. **Sisyphus uses Claude Opus 4.5** by default for orchestration
3. **Cost-optimized delegation** - background agents run async in parallel
4. **Provider adaptation** - models change based on what's available/configured
5. **Your config is more cost-optimized** - using Gemini 3 Flash for librarian instead of Claude Sonnet 4.5

## Sources

- [Oh My OpenCode - Agents](https://ohmyopencode.com/agents/)
- [Sisyphus Orchestrator Documentation](https://deepwiki.com/code-yeongyu/oh-my-opencode/4.1-sisyphus-orchestrator)
- [Oh My OpenCode GitHub](https://github.com/code-yeongyu/oh-my-opencode)
