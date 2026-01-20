# Oh-My-OpenCode Agent Test Plan

This document provides a comprehensive test plan to validate each agent in oh-my-opencode (OMO). Each test case is designed to trigger specific agent behaviors.

## Prerequisites

1. OMO installed and configured with the desired config variant (A/B/C)
2. Active git repository for testing
3. Verify current config:
   ```bash
   readlink ~/.config/opencode/oh-my-opencode.json
   ```

---

## Test Cases

### 1. Sisyphus (Main Orchestrator)
**Purpose**: Verify the main agent handles coordination and tool usage

**Test Task**:
```
Create a simple Python script that reads a file and prints line count. Save it as line_counter.py.
```

**Expected Behavior**:
- Sisyphus receives the request
- Uses Write tool to create the file
- Completes without delegating to other agents

**Success Criteria**:
- File `line_counter.py` exists with working code
- No errors in execution
- Single agent used (Sisyphus only)

---

### 2. Prometheus (Planner Agent)
**Purpose**: Verify planning workflow breaks down complex tasks

**Test Task**:
```
Plan the implementation of a REST API with endpoints for CRUD operations on a "Todo" resource.
```

**Expected Behavior**:
- Prometheus is invoked to create a structured plan
- Returns a todo list with multiple steps
- Does not immediately implement the plan

**Success Criteria**:
- Todo list created with 5+ atomic steps
- Plan includes: project structure, dependencies, API design, implementation order
- Prompt asks if you want to proceed with implementation

---

### 3. Metis (Plan Consultant - Pre-planning)
**Purpose**: Verify pre-planning analysis identifies hidden requirements

**Test Task**:
```
I want to implement a blog system. Start the planning process.
```

**Expected Behavior**:
- Metis analyzes the request before full planning
- Identifies dependencies, potential issues, missing requirements
- Provides recommendations

**Success Criteria**:
- Metis reports on 3+ aspects (e.g., tech stack choices, data models, deployment)
- Raises at least one question or concern about the initial request
- Recommendations are practical and actionable

---

### 4. Momus (Validation Agent)
**Purpose**: Verify code validation catches issues before deployment

**Test Task**:
```
Create a TypeScript function that adds two numbers and returns the sum. Save it as math.ts.
```

**Expected Behavior**:
- Implementation completes
- Momus validates the code
- Checks for type safety, potential issues

**Success Criteria**:
- File `math.ts` created
- Momus runs diagnostics
- Reports on code quality, type correctness, any issues found

---

### 5. Oracle (Architecture & Complex Reasoning)
**Purpose**: Verify oracle handles complex architectural decisions

**Test Task**:
```
I'm building a microservices architecture. Should I use gRPC or REST for service-to-service communication?
```

**Expected Behavior**:
- Oracle is consulted (this may trigger automatically or via explicit request)
- Provides detailed analysis of tradeoffs
- Makes a recommendation with reasoning

**Success Criteria**:
- Detailed comparison of gRPC vs REST
- Analysis covers: performance, interoperability, ease of use, tooling
- Clear recommendation with context for when to choose each
- No code generated (pure advisory output)

---

### 6. Librarian (Research & External References)
**Purpose**: Verify librarian searches external docs and open source

**Test Task**:
```
How do I implement JWT authentication in a Node.js Express application? Find examples from production apps.
```

**Expected Behavior**:
- Librarian agent is triggered
- Searches official documentation (Context7)
- Searches GitHub for real-world implementations
- Provides code examples with explanations

**Success Criteria**:
- References official Express.js documentation
- Includes 2+ code examples from public repositories
- Explains best practices and common patterns
- Cites sources (repo links or doc URLs)

---

### 7. Explore (Code Search - Internal)
**Purpose**: Verify explore searches within the current codebase

**Test Task**:
```
Find all error handling patterns in this codebase. Show me examples.
```

**Expected Behavior**:
- Explore agent searches codebase
- Identifies patterns (try-catch, error callbacks, etc.)
- Returns code snippets with file locations

**Success Criteria**:
- Returns 3+ distinct error handling patterns
- Each example includes file path and line numbers
- Patterns are relevant and accurately extracted

---

### 8. Frontend-UI/UX-Engineer (Visual Work)
**Purpose**: Verify visual/styling work is delegated appropriately

**Test Task**:
```
Create a React button component with a modern design. It should have a hover effect, gradient background, and smooth transition. Save it as Button.tsx.
```

**Expected Behavior**:
- Sisyphus detects visual/styling requirements
- Delegates to frontend-ui-ux-engineer
- Agent creates styled component

**Success Criteria**:
- File `Button.tsx` exists
- Has modern visual design (gradient, hover, transitions)
- Uses a CSS approach (Tailwind, styled-components, or inline styles)
- Visual quality is production-ready (colors, spacing, proportions)

---

### 9. Document-Writer (Documentation)
**Purpose**: Verify documentation agent creates clear docs

**Test Task**:
```
Create a README.md for this project. Include: project description, installation instructions, usage examples, and contribution guidelines.
```

**Expected Behavior**:
- Document-writer agent is triggered
- Creates comprehensive documentation
- Follows documentation best practices

**Success Criteria**:
- `README.md` created with all 4 sections
- Clear, professional writing style
- Includes code blocks for commands/examples
- Sections are properly formatted with headers

---

### 10. Multimodal-Looker (PDF/Image Analysis)
**Purpose**: Verify PDF/image analysis capabilities

**Test Task** (requires a sample file):
```
Analyze the screenshot at /path/to/screenshot.png. Extract the text content and describe what's visible in the image.
```

**Expected Behavior**:
- Multimodal-looker agent processes the image
- Extracts text content using OCR
- Provides visual description

**Success Criteria**:
- Accurate text extraction (if text is present)
- Describes visual elements (UI components, layout, colors)
- Identifies key objects or features in the image

---

### 11. Task Categories Testing
**Purpose**: Verify categories apply correct model presets

**Test 11a: Visual Category**
```
[CATEGORY: visual] Design a responsive card layout with shadow, rounded corners, and hover elevation. Create it as a React component.
```
**Expected**: Uses visual-engineering model (Gemini Pro High in Option A/C, Opus in Option B)

**Test 11b: Writing Category**
```
[CATEGORY: writing] Write a blog post about the benefits of async/await in JavaScript.
```
**Expected**: Uses writing model (Gemini Flash)

**Test 11c: Ultrabrain Category**
```
[CATEGORY: ultrabrain] Analyze the tradeoffs between monorepo and multi-repo architectures for a 50-person team.
```
**Expected**: Uses ultrabrain model (GPT-5.2)

---

### 12. Multi-Agent Workflow
**Purpose**: Verify agents collaborate correctly on complex tasks

**Test Task**:
```
Build a simple web app with:
- Frontend: React with a form to add tasks
- Backend: Express API to save tasks
- Documentation: README with setup instructions
```

**Expected Behavior**:
- Prometheus creates plan with todo list
- Sisyphus orchestrates execution
- Frontend-ui-ux-engineer handles form styling
- Librarian may be consulted for Express patterns
- Document-writer creates README
- Momus validates code

**Success Criteria**:
- Multiple agents involved
- Each agent works on appropriate subtask
- Final result: working app with documentation
- Smooth handoffs between agents

---

## Running the Tests

### Sequential Testing
Run tests one at a time, observing which agents are triggered:

```bash
# Clear working directory before each test
git clean -fd

# Run test by sending the exact test task to your OMO environment
```

### Agent Observation
Watch for agent activation in logs:
- Agent names mentioned in output
- Task delegation messages
- Model usage (indicates which agent/model was used)

### Verification Checklist
For each test:
- [ ] Correct agent(s) were triggered
- [ ] Task completed successfully
- [ ] Output matches expected behavior
- [ ] No unnecessary agent usage (no over-delegation)

---

## Expected Agent Behavior Summary

| Agent | Trigger | Output Type |
|-------|---------|-------------|
| Sisyphus | All requests (default) | Code, analysis, direct action |
| Prometheus | `/plan` or "plan X" command | Structured todo list |
| Metis | Pre-planning phase | Analysis, questions, recommendations |
| Momus | Post-implementation | Validation, diagnostics, review |
| Oracle | Architecture, complex decisions | Advisory, analysis, no code |
| Librarian | External references, docs search | Docs, examples, citations |
| Explore | Codebase search | Code patterns, file locations |
| Frontend-UI/UX-Engineer | Visual/styling work | Styled components, UI code |
| Document-Writer | Documentation tasks | READMEs, guides, docs |
| Multimodal-Looker | PDF/image files | Extracted content, descriptions |

---

## Troubleshooting

### Agent Not Triggering?
- Check if agent is enabled in config
- Verify request matches agent's trigger pattern
- Check logs for errors

### Wrong Agent Used?
- Verify category mapping in config
- Check if prompt is ambiguous (try more specific keywords)
- Review config for model assignments

### Over-Delegation?
- Simple task → multiple agents triggered
- Check if prompt includes keywords for other agents
- May be working as designed (OMO favors thoroughness)

### Under-Delegation?
- Complex task → only Sisyphus used
- Verify subagents are not disabled in config
- Try more explicit prompt ("design this UI" → triggers frontend-ui-ux-engineer)

---

## Configuration-Specific Notes

### Option A (Pure Cost Optimization)
- Sisyphus uses GLM-4.7 (faster, cheaper)
- Oracle uses GPT-5.2 (full quality for architecture)
- Expect speed improvements but possible quality variance

### Option B (Balanced)
- Sisyphus uses Opus 4.5 (full quality)
- Oracle uses GPT-5.2
- Best quality, higher cost than Option A

### Option C (Hybrid Adaptive)
- Sisyphus uses Gemini Pro Medium
- Multi-tier categories (7 levels)
- Adaptive quality based on task complexity

---

## Test Results Template

| Test # | Agent(s) Used | Success | Notes |
|-------|---------------|---------|-------|
| 1 | Sisyphus | ☐ | |
| 2 | Prometheus | ☐ | |
| 3 | Metis | ☐ | |
| 4 | Momus | ☐ | |
| 5 | Oracle | ☐ | |
| 6 | Librarian | ☐ | |
| 7 | Explore | ☐ | |
| 8 | Frontend-UI/UX-Engineer | ☐ | |
| 9 | Document-Writer | ☐ | |
| 10 | Multimodal-Looker | ☐ | |
| 11a | Visual Category | ☐ | |
| 11b | Writing Category | ☐ | |
| 11c | Ultrabrain Category | ☐ | |
| 12 | Multi-Agent | ☐ | |
