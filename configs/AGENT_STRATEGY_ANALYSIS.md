# Agent Strategy Analysis: OMO Defaults vs. Current Config

## Executive Summary

After reviewing all OMO documentation, here's the strategic picture:

**OMO's Philosophy:**
- Categories > hardcoded agents (semantic delegation)
- Delegation > direct execution (orchestration-first)
- Cost tiers with parallel execution
- "Human in the loop = bottleneck" (autonomous completion)

**Your Current Approach:**
- Cost-optimized with 4-tier escalation
- Agent-specific configurations
- GLM-4.7 as workhorse (90% of tasks)
- Opus 4.5 reserved for 5-10% of work

## Detailed Comparison

### 1. Orchestration Layer

| Agent | OMO Default | Your Config | Gap |
|-------|-------------|-------------|-----|
| **Sisyphus** (main) | `claude-opus-4-5` | Not configured (uses system default) | ⚠️ Using expensive Opus by default |
| **Prometheus** (planner) | `claude-opus-4-5` (enabled by default) | Not explicitly configured | ⚠️ Using expensive Opus for all planning |
| **Metis** (pre-planner) | `claude-sonnet-4-5` | Not configured | ❌ Missing - no pre-planning analysis |
| **Momus** (plan validator) | `claude-sonnet-4-5` | Not configured | ❌ Missing - no plan validation |

**Cost Impact:** Your planning is using Opus 4.5 when it could use cheaper models for initial phases.

### 2. Worker Agents

| Agent | OMO Default | Your Config | Assessment |
|-------|-------------|-------------|------------|
| **oracle** | `gpt-5.2` | `claude-opus-4-5` | ✓ Valid choice - Opus excellent for coding |
| **oracle-lite** | N/A (not in OMO) | `gemini-3-pro-medium` | ✓ Smart addition for medium escalation |
| **librarian** | `glm-4.7-free` or `claude-sonnet-4-5` | `gemini-3-flash` | ✓ More cost-effective (1M context) |
| **explore** | `grok-code` | `grok-code` | ✅ Perfect match |
| **frontend-ui-ux** | `gemini-3-pro` | `gemini-3-pro-high` | ✓ Higher quality for visual work |
| **document-writer** | `gemini-3-flash` | `gemini-3-flash` | ✅ Perfect match |
| **multimodal-looker** | `gemini-3-flash` | `gemini-3-flash` | ✅ Perfect match |

### 3. Categories (Not Yet Configured)

OMO's recommended semantic categories:

| Category | OMO Model | Temp | Use Case |
|----------|-----------|------|----------|
| **ultrabrain** | `gpt-5.2` | 0.1 | Complex architecture, business logic |
| **visual-engineering** | `gemini-3-pro` | 0.7 | Frontend, UI/UX, animations |
| **quick** | `claude-haiku-4-5` | 0.3 | Simple tasks, refactoring |
| **artistry** | `gemini-3-pro` | 0.9 | Creative design, ideation |
| **writing** | `gemini-3-flash` | 0.5 | Documentation, blogs |
| **most-capable** | `claude-opus-4-5` | 0.1 | Extremely difficult tasks |

**You don't have categories configured** - this limits flexibility in delegation.

## Critical Analysis: What Should We Change?

### Option A: Pure Cost Optimization (Your Current Strategy)

**Keep your current escalation approach, but add missing pieces:**

```jsonc
{
  "sisyphus": {
    "disabled": false,
    "planner_enabled": true,
    "replace_plan": true
  },
  "agents": {
    // ORCHESTRATION LAYER - Use cheaper models
    "prometheus": {
      "model": "zai-coding-plan/glm-4.7",  // Instead of Opus 4.5
      "prompt_append": "Focus on creating clear, actionable plans."
    },
    "metis": {
      "model": "google/gemini-3-pro-medium",  // Pre-planning analysis
      "prompt_append": "Identify ambiguities and hidden requirements."
    },
    "momus": {
      "model": "google/gemini-3-pro-medium",  // Plan validation
      "prompt_append": "Validate plan clarity and completeness."
    },
    "sisyphus": {
      "model": "zai-coding-plan/glm-4.7"  // Main orchestrator uses GLM-4.7
    },

    // WORKER AGENTS - Keep your current config
    "oracle": {
      "model": "anthropic/claude-opus-4-5"  // Premium reasoning
    },
    "oracle-lite": {
      "model": "google/gemini-3-pro-medium"  // Medium escalation
    },
    "librarian": {
      "model": "google/gemini-3-flash"  // Research
    },
    "explore": {
      "model": "opencode/grok-code"  // Code search
    },
    "frontend-ui-ux-engineer": {
      "model": "google/gemini-3-pro-high"  // UI/UX
    },
    "document-writer": {
      "model": "google/gemini-3-flash"  // Docs
    },
    "multimodal-looker": {
      "model": "google/gemini-3-flash"  // PDF/images
    }
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3,
      "prompt_append": "Fast, simple, focused execution."
    },
    "ultrabrain": {
      "model": "anthropic/claude-opus-4-5",  // Or gpt-5.2
      "temperature": 0.1,
      "prompt_append": "Maximum reasoning for complex architecture."
    },
    "visual-engineering": {
      "model": "google/gemini-3-pro-high",
      "temperature": 0.7,
      "prompt_append": "Focus on aesthetics and user experience."
    }
  }
}
```

**Pros:**
- Maintains cost control (GLM-4.7 as workhorse)
- Adds missing planning validators (Metis, Momus)
- Adds "quick" tier with Haiku for cheap tasks
- Categories provide semantic flexibility

**Cons:**
- GLM-4.7 for orchestration might not be as robust as Opus
- Planning with GLM-4.7 might miss nuances

**Estimated cost reduction:** 85-90% vs. Opus-heavy

---

### Option B: Balanced Quality/Cost (OMO Philosophy)

**Follow OMO's intent but optimize where possible:**

```jsonc
{
  "sisyphus": {
    "disabled": false,
    "planner_enabled": true,
    "replace_plan": true
  },
  "agents": {
    // ORCHESTRATION LAYER - Use Opus for orchestration, Sonnet for validation
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"  // OMO default - robust orchestration
    },
    "prometheus": {
      "model": "anthropic/claude-opus-4-5"  // OMO default - strategic planning
    },
    "metis": {
      "model": "anthropic/claude-sonnet-4-5"  // OMO default - pre-analysis
    },
    "momus": {
      "model": "anthropic/claude-sonnet-4-5"  // OMO default - validation
    },

    // WORKER AGENTS - Optimize with your choices
    "oracle": {
      "model": "openai/gpt-5.2"  // OMO choice for logical reasoning
    },
    "librarian": {
      "model": "google/gemini-3-flash"  // Your optimization
    },
    "explore": {
      "model": "opencode/grok-code"
    },
    "frontend-ui-ux-engineer": {
      "model": "google/gemini-3-pro-high"
    },
    "document-writer": {
      "model": "google/gemini-3-flash"
    },
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3
    },
    "ultrabrain": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },
    "visual-engineering": {
      "model": "google/gemini-3-pro-high",
      "temperature": 0.7
    },
    "most-capable": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1
    }
  }
}
```

**Pros:**
- Robust orchestration with Opus 4.5
- High-quality planning (fewer errors)
- GPT-5.2 for pure logical reasoning (architecture)
- Still cost-optimized for workers

**Cons:**
- More expensive orchestration layer
- Will hit Opus limits faster

**Estimated cost reduction:** 60-70% vs. all-Opus

---

### Option C: Hybrid Adaptive (My Recommendation)

**Smart defaults that adapt based on task complexity:**

```jsonc
{
  "sisyphus": {
    "disabled": false,
    "planner_enabled": true,
    "replace_plan": true
  },
  "agents": {
    // ORCHESTRATION - Start cheap, escalate if needed
    "sisyphus": {
      "model": "google/gemini-3-pro-medium"  // Balanced orchestration
    },
    "prometheus": {
      "model": "google/gemini-3-pro-medium"  // Initial planning
    },
    "metis": {
      "model": "google/gemini-3-flash"  // Fast pre-analysis
    },
    "momus": {
      "model": "anthropic/claude-sonnet-4-5"  // Quality validation
    },

    // WORKER AGENTS - Multi-tier approach
    "oracle": {
      "model": "anthropic/claude-opus-4-5"  // Premium (tier 4)
    },
    "oracle-lite": {
      "model": "google/gemini-3-pro-medium"  // Medium (tier 3)
    },
    "librarian": {
      "model": "google/gemini-3-flash"  // Fast research (tier 2)
    },
    "explore": {
      "model": "opencode/grok-code"  // Cheapest (tier 1)
    },
    "frontend-ui-ux-engineer": {
      "model": "google/gemini-3-pro-high"  // Visual specialist
    },
    "document-writer": {
      "model": "google/gemini-3-flash"  // Fast docs
    },
    "multimodal-looker": {
      "model": "google/gemini-3-flash"  // Fast multimodal
    }
  },
  "categories": {
    // Quick tier for simple tasks
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3,
      "prompt_append": "Fast, focused execution. No over-engineering."
    },
    // Standard tier for most work
    "general": {
      "model": "zai-coding-plan/glm-4.7",
      "temperature": 0.2,
      "prompt_append": "Balanced coding with cost-effectiveness."
    },
    // Complex logic tier
    "ultrabrain": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "prompt_append": "Maximum reasoning for architecture decisions."
    },
    // Visual tier
    "visual-engineering": {
      "model": "google/gemini-3-pro-high",
      "temperature": 0.7,
      "prompt_append": "Focus on aesthetics, UX, and design fidelity."
    },
    // Premium tier
    "most-capable": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "prompt_append": "Highest quality output, no shortcuts."
    }
  },
  "background_tasks": {
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,  // Limit expensive Opus
      "openai/gpt-5.2": 3
    },
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    }
  }
}
```

**Pros:**
- Balanced orchestration (Gemini 3 Pro Medium)
- Multiple escalation tiers (Haiku → GLM-4.7 → Gemini Pro → Opus)
- Categories enable semantic task routing
- Concurrency limits prevent cost explosions
- Keeps your cost-optimization strategy
- Adds OMO's orchestration power

**Cons:**
- More complex configuration
- Need to learn when to use categories vs. agents

**Estimated cost reduction:** 75-85% vs. Opus-heavy

---

## My Recommendation: Option C (Hybrid Adaptive)

**Why:**
1. **Maintains your cost discipline** - GLM-4.7 and Gemini models for most work
2. **Adds OMO's orchestration power** - Sisyphus with cheaper model
3. **Enables semantic delegation** - Categories for flexible task routing
4. **Preserves your escalation tiers** - Haiku → GLM → Gemini → Opus
5. **Adds missing validators** - Metis and Momus catch planning errors
6. **Concurrency controls** - Prevents runaway Opus usage

**Workflow:**
- Simple tasks → `delegate_task(category='quick')` → Haiku
- Standard coding → `delegate_task(category='general')` → GLM-4.7
- UI/UX work → `delegate_task(category='visual-engineering')` → Gemini 3 Pro High
- Architecture → `delegate_task(category='ultrabrain')` → Opus 4.5
- Research → @librarian → Gemini 3 Flash
- Code search → @explore → Grok Code
- Premium → @oracle → Opus 4.5

## Key Questions to Decide

1. **How much do you value planning quality?**
   - High → Use Opus for Prometheus (Option B)
   - Medium → Use Gemini Pro Medium (Option C)
   - Low → Use GLM-4.7 (Option A)

2. **Do you want GPT-5.2 for oracle?**
   - OMO chose it for "stellar logical reasoning"
   - But Opus 4.5 is better for coding
   - Could have both: oracle (Opus) + ultrabrain category (GPT-5.2)

3. **How important is autonomous orchestration?**
   - Very → Use Opus for Sisyphus (Option B)
   - Somewhat → Use Gemini Pro Medium (Option C)
   - Not much → Keep current agent-only approach (Option A)

4. **Should we use the build/plan agents?**
   - Your current config uses GLM-4.7 for build/plan
   - OMO replaces plan with Prometheus
   - You could keep both for flexibility

## Action Items

1. Review the three options
2. Decide on planning model (Opus, Gemini Pro Medium, or GLM-4.7)
3. Decide on oracle model (Opus 4.5, GPT-5.2, or both)
4. Configure categories for semantic delegation
5. Set concurrency limits to prevent cost overruns
6. Test with a complex task to validate the setup

What do you think? Which option aligns best with your goals?
