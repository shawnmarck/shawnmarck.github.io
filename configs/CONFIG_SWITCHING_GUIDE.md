# OpenCode Configuration Switching Guide

## Overview

You have three oh-my-opencode configurations optimized for different scenarios:

- **Option A** (Active): Pure cost optimization - maximum savings, uses GLM-4.7 and GPT-5.2
- **Option B** (Standby): Balanced quality/cost - uses Claude Opus/Sonnet and GPT-5.2
- **Option C** (Standby): Hybrid adaptive - multi-tier escalation with balanced costs

The active configuration is controlled by a symlink at `~/.config/opencode/oh-my-opencode.json`.

## Current Active Configuration

To check which option is currently active:

```bash
readlink ~/.config/opencode/oh-my-opencode.json
```

This will output one of:
- `oh-my-opencode-option-a.json` (Option A - cost-optimized)
- `oh-my-opencode-option-b.json` (Option B - balanced)
- `oh-my-opencode-option-c.json` (Option C - hybrid)

## Configuration Details

### Option A: Pure Cost Optimization (ACTIVE)

**Orchestration:**
- Sisyphus: GLM-4.7 ($0.40/$1.50 per M)
- Prometheus: GLM-4.7 ($0.40/$1.50 per M)
- Metis: Gemini 3 Pro Medium (~$1-2/$8-10 per M)
- Momus: Gemini 3 Pro Medium (~$1-2/$8-10 per M)

**Premium Agent:**
- Oracle: GPT-5.2 (for architecture and complex reasoning)

**Categories:**
- quick: Haiku 4.5 (simple tasks)
- general: GLM-4.7 (90% of work)
- ultrabrain: GPT-5.2 (complex architecture)
- visual-engineering: Gemini 3 Pro High (UI/UX)
- writing: Gemini 3 Flash (docs)

**Prerequisites:**
- ✅ OpenAI API key (for GPT-5.2)
- ✅ Google API key or Antigravity auth (for Gemini models)
- ⚠️ Anthropic API key (for Haiku only, minimal usage)

**Cost Reduction:** 85-90% vs. Opus-heavy config

**When to Use:**
- Default daily work
- Cost-conscious development
- When Anthropic rate limits are a concern
- Learning/experimentation

---

### Option B: Balanced Quality/Cost (STANDBY)

**Orchestration:**
- Sisyphus: Claude Opus 4.5 ($5.00/$25.00 per M)
- Prometheus: Claude Opus 4.5 ($5.00/$25.00 per M)
- Metis: Claude Sonnet 4.5 (~$1.00/$5.00 per M)
- Momus: Claude Sonnet 4.5 (~$1.00/$5.00 per M)

**Premium Agent:**
- Oracle: GPT-5.2 (OMO's choice for logical reasoning)

**Categories:**
- quick: Haiku 4.5
- ultrabrain: GPT-5.2
- visual-engineering: Gemini 3 Pro High
- most-capable: Claude Opus 4.5

**Prerequisites:**
- ✅ OpenAI API key (for GPT-5.2)
- ✅ Google API key or Antigravity auth (for Gemini models)
- ⚠️ **Anthropic API key REQUIRED** (for Opus/Sonnet/Haiku)

**Cost Reduction:** 60-70% vs. all-Opus config

**When to Use:**
- Production work requiring high quality
- Complex projects with tight deadlines
- When planning quality is critical
- After adding Anthropic API key

---

### Option C: Hybrid Adaptive (STANDBY)

**Orchestration:**
- Sisyphus: Gemini 3 Pro Medium (~$1-2/$8-10 per M)
- Prometheus: Gemini 3 Pro Medium (~$1-2/$8-10 per M)
- Metis: Gemini 3 Flash ($0.50/$3.00 per M)
- Momus: Claude Sonnet 4.5 (~$1.00/$5.00 per M)

**Premium Agent:**
- Oracle: Claude Opus 4.5 ($5.00/$25.00 per M)

**Categories (Multi-tier):**
- quick: Haiku 4.5 (tier 1)
- general: GLM-4.7 (tier 2)
- medium: Gemini 3 Pro Medium (tier 3)
- ultrabrain: Claude Opus 4.5 (tier 4)
- visual-engineering: Gemini 3 Pro High
- writing: Gemini 3 Flash
- most-capable: Claude Opus 4.5

**Prerequisites:**
- ✅ OpenAI API key (optional, not used in this config)
- ✅ Google API key or Antigravity auth (for Gemini models)
- ⚠️ **Anthropic API key REQUIRED** (for Opus/Sonnet/Haiku)

**Cost Reduction:** 75-85% vs. all-Opus config

**When to Use:**
- After adding Anthropic API key
- Want balanced orchestration with cost controls
- Need multi-tier escalation (Haiku → GLM → Gemini → Opus)
- Best of both worlds approach

---

## How to Switch Configurations

### Switch to Option A (Cost-Optimized)

```bash
cd ~/.config/opencode
ln -sf oh-my-opencode-option-a.json oh-my-opencode.json
```

**Verify:**
```bash
readlink oh-my-opencode.json
# Output: oh-my-opencode-option-a.json
```

### Switch to Option B (Balanced Quality)

**Prerequisites:** Ensure Anthropic API key is set!

```bash
cd ~/.config/opencode
ln -sf oh-my-opencode-option-b.json oh-my-opencode.json
```

**Verify:**
```bash
readlink oh-my-opencode.json
# Output: oh-my-opencode-option-b.json
```

### Switch to Option C (Hybrid Adaptive)

**Prerequisites:** Ensure Anthropic API key is set!

```bash
cd ~/.config/opencode
ln -sf oh-my-opencode-option-c.json oh-my-opencode.json
```

**Verify:**
```bash
readlink oh-my-opencode.json
# Output: oh-my-opencode-option-c.json
```

---

## Testing After Switching

After switching configurations, verify with:

```bash
# Check configuration health
bunx oh-my-opencode doctor --category configuration

# View active configuration
cat ~/.config/opencode/oh-my-opencode.json | jq '.agents'

# Start a test session
bunx oh-my-opencode run "What configuration am I using?"
```

---

## API Key Setup

### Setting Anthropic API Key

Required for Options B and C.

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export ANTHROPIC_API_KEY="sk-ant-..."

# Or set temporarily
export ANTHROPIC_API_KEY="sk-ant-..."
```

### Setting OpenAI API Key

Required for Option A (GPT-5.2).

```bash
# Add to your shell profile
export OPENAI_API_KEY="sk-..."

# Or set temporarily
export OPENAI_API_KEY="sk-..."
```

### Google/Antigravity Auth

Already configured via `opencode-antigravity-auth@1.3.0` plugin.

To check auth status:
```bash
bunx oh-my-opencode auth status
```

---

## Cost Comparison Table

| Metric | Option A | Option B | Option C |
|--------|----------|----------|----------|
| **Orchestration** | GLM-4.7 | Opus 4.5 | Gemini Pro Medium |
| **Planning** | GLM-4.7 | Opus 4.5 | Gemini Pro Medium |
| **Validation** | Gemini Pro Medium | Sonnet 4.5 | Flash + Sonnet |
| **Oracle** | GPT-5.2 | GPT-5.2 | Opus 4.5 |
| **Cost Reduction** | 85-90% | 60-70% | 75-85% |
| **Anthropic Key** | Optional (Haiku) | Required | Required |
| **Best For** | Daily work, learning | Production, quality | Balanced, flexible |

---

## Workflow Recommendations

### Option A Workflow (Active)

```bash
# Simple tasks (cheap)
delegate_task(category='quick', ...)

# Standard coding (90% of work)
delegate_task(category='general', ...)

# Complex architecture
delegate_task(category='ultrabrain', ...)

# UI/UX work
delegate_task(category='visual-engineering', ...)

# Explicit oracle call
@oracle review this architecture
```

### Option B/C Workflow (When Anthropic Key Added)

Same categories, but with higher quality orchestration.

---

## Troubleshooting

### Symlink Not Working

If symlinks don't work on your system (e.g., Windows):

```bash
# Copy file instead of symlinking
cd ~/.config/opencode
cp oh-my-opencode-option-a.json oh-my-opencode.json
```

### Missing API Keys

```bash
# Check which keys are set
echo "Anthropic: ${ANTHROPIC_API_KEY:+SET}"
echo "OpenAI: ${OPENAI_API_KEY:+SET}"

# Run doctor to diagnose
bunx oh-my-opencode doctor --category authentication
```

### Configuration Not Loading

```bash
# Validate JSON syntax
cd ~/.config/opencode
jq empty oh-my-opencode.json

# If error, check symlink target exists
ls -la oh-my-opencode.json
```

---

## Backup and Restore

### Backup Current Configuration

```bash
cp ~/.config/opencode/oh-my-opencode.json ~/.config/opencode/oh-my-opencode.json.backup
```

### Restore from Backup

```bash
cp ~/.config/opencode/oh-my-opencode.json.backup ~/.config/opencode/oh-my-opencode.json
```

---

## Version Control

All three option files are also stored in:
```
~/projects/shawnmarck.github.io/configs/
```

This allows you to:
- Track changes over time
- Share configs across machines
- Roll back if needed

---

## Quick Reference

**Active config:** Option A (cost-optimized)

**Switch commands:**
```bash
# To Option A
cd ~/.config/opencode && ln -sf oh-my-opencode-option-a.json oh-my-opencode.json

# To Option B
cd ~/.config/opencode && ln -sf oh-my-opencode-option-b.json oh-my-opencode.json

# To Option C
cd ~/.config/opencode && ln -sf oh-my-opencode-option-c.json oh-my-opencode.json
```

**Check active:**
```bash
readlink ~/.config/opencode/oh-my-opencode.json
```
