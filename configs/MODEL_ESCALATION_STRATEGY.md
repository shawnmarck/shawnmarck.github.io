# Model Escalation Strategy for OpenCode

## Context

Problem: Claude Opus 4.5 usage limits hit in 30-60 minutes of work.

Solution: Tiered model selection with smart escalation.

---

## Model Hierarchy

```
Tier 1: GLM-4.7 (Primary)
  ↓
Tier 2: Grok Code Fast 1 (Speed)
  ↓
Tier 3: Gemini 3 Pro Medium (Oracle-Lite)
  ↓
Tier 4: Claude Opus 4.5 (Escalation)
```

---

## Tier Responsibilities

### Tier 1: GLM-4.7 (90% of work)
**Cost:** $0.40 input / $1.50 output per M tokens

**Use for:**
- ✅ All standard coding tasks (create, edit, refactor files)
- ✅ Multi-step planning and implementation
- ✅ Debugging with clear error messages
- ✅ Documentation generation
- ✅ Most daily work

**Don't escalate if:**
- First attempt produces reasonable but not perfect result
- Code is functional but could be cleaner
- Solution is 80-90% of optimal

**Do escalate if:**
- ❌ Fails to understand task after rephrasing
- ❌ Produces syntactically incorrect code repeatedly
- ❌ Misses critical requirements stated in prompt
- ❌ Can't complete task after 2 attempts with same error type

---

### Tier 2: Grok Code Fast 1 (Speed & Code Search)
**Cost:** $0.20 input / $1.50 output per M tokens

**Use for:**
- ✅ Quick code pattern searches (find function, locate implementation)
- ✅ Simple file edits and refactorings
- ✅ High-volume, low-complexity tasks
- ✅ When speed > precision

**Escalation criteria:**
- Switch to GLM-4.7 if task requires deep reasoning
- Switch to Oracle-Lite if guidance needed on approach

---

### Tier 3: Gemini 3 Pro Medium (Oracle-Lite)
**Cost:** ~$1-2 input / ~$8-10 output per M tokens (estimated)

**Use for:**
- ✅ Guidance on code structure and patterns
- ✅ Review of implementation approaches
- ✅ Debugging help after GLM-4.7 struggles
- ✅ Architecture questions that don't need full Opus reasoning

**Escalation criteria:**
- Switch to Opus 4.5 if:
  - Multiple approaches tried and all fail
  - Complex multi-system tradeoffs involved
  - Need deep reasoning beyond standard capabilities

---

### Tier 4: Claude Opus 4.5 (Premium Escalation)
**Cost:** $5 input / $25 output per M tokens

**Use for:**
- ✅ Architecture decisions involving multiple systems
- ✅ Complex debugging after 2+ GLM-4.7 failures
- ✅ Multi-system tradeoff analysis
- ✅ Review of significant implementation work
- ✅ "What am I missing?" moments

**Usage guidelines:**
- Reserve for high-stakes decisions
- Don't use for routine code changes
- Explicitly document why escalation was needed

---

## Escalation Workflow

### Manual Escalation Process

When GLM-4.7 (or lower tier) fails:

1. **Analyze the failure**
   - Is it a misunderstanding? → Rephrase prompt and retry same tier
   - Is it a capability gap? → Escalate to next tier
   - Is it unclear context? → Provide more information to current tier

2. **Try once more at current tier**
   - Rephrase prompt with more context
   - Add explicit requirements
   - Break down task into smaller pieces

3. **If still failing, escalate**
   - Explain previous attempts and failures
   - Describe what was tried
   - Ask for fresh perspective

4. **After successful resolution**
   - Document what worked
   - Note why previous attempts failed
   - Update mental model of when to escalate

### Automatic Escalation (Future Enhancement)

Possible automated rules:
- After 2 consecutive failures on same task → Auto-escalate
- When user says "try again with better model" → Escalate
- When task contains "architecture", "design", "tradeoffs" → Skip to Oracle-Lite or Opus
- When task mentions "debugging after multiple attempts" → Escalate to Opus

---

## Configuration Reference

### Current Agent Assignments

| Agent | Model | Tier |
|--------|--------|-------|
| sisyphus (main) | GLM-4.7 | 1 |
| plan | GLM-4.7 | 1 |
| build | GLM-4.7 | 1 |
| explore | Grok Code Fast 1 | 2 |
| librarian | Gemini 3 Flash | 1-2 |
| document-writer | Gemini 3 Flash | 1-2 |
| multimodal-looker | Gemini 3 Flash | 1-2 |
| oracle-lite | Gemini 3 Pro Medium | 3 |
| oracle | Claude Opus 4.5 | 4 |
| frontend-ui-ux-engineer | Gemini 3 Pro High | 2-3 |

---

## Cost Impact Analysis

### Before (Opus-heavy usage)
- Estimated 30-40% of work on Opus 4.5
- Cost: High, hits rate limits quickly

### After (Tiered approach)
- Estimated 5-10% of work on Opus 4.5
- 50-60% on GLM-4.7
- 20-30% on Grok Code Fast 1
- 10-15% on Gemini 3 Flash/Pro Medium
- **Cost reduction:** ~70-80%
- **Rate limit reduction:** ~80-90%

---

## Quick Reference Cheat Sheet

### Start with GLM-4.7 unless:
- Task is simple search → Grok Code Fast 1
- Need visual analysis → multimodal-looker (Gemini 3 Flash)
- Quick research → librarian (Gemini 3 Flash)

### Escalate to Oracle-Lite if:
- GLM-4.7 produces functional but suboptimal code
- Need guidance on approach
- Question about best practices

### Escalate to Opus 4.5 if:
- 2+ GLM-4.7 failures on same task
- Architecture decision required
- Multi-system tradeoffs
- Deep debugging after multiple attempts

---

## Monitoring and Adjustment

### Track these metrics:
- How often do you escalate to each tier?
- What types of tasks require Opus 4.5?
- Are there tasks where GLM-4.7 consistently fails?

### Adjust strategy based on patterns:
- If certain task types always need Opus → Consider starting with Oracle-Lite
- If GLM-4.7 rarely fails → Consider expanding its scope
- If Grok Code Fast 1 is often too limited → Consider GLM-4.7 for searches

---

## Example Scenarios

### Scenario 1: Refactoring a function
```
Start: GLM-4.7
Retry: Rephrase prompt if unclear
Escalate: Only if GLM-4.7 produces broken code twice
```

### Scenario 2: Finding where X is implemented
```
Start: Grok Code Fast 1 (explore agent)
Escalate: GLM-4.7 if pattern matching fails
```

### Scenario 3: Designing a new system architecture
```
Start: Oracle-Lite (skip GLM-4.7)
Escalate: Opus 4.5 if decision is complex or involves tradeoffs
```

### Scenario 4: Debugging after 3 attempts
```
Attempts 1-2: GLM-4.7
Attempt 3: Oracle-Lite (review approach)
Attempt 4: Opus 4.5 (fresh perspective, deep reasoning)
```

---

## Notes

- The oracle-lite agent has been added to oh-my-opencode.json
- Main agents (sisyphus, plan, build) already use GLM-4.7
- This strategy prioritizes cost-effectiveness while preserving access to premium models when needed
- Manual escalation gives you control; consider tracking escalation patterns to inform future automation
