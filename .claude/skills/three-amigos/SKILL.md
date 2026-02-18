---
name: three-amigos
description: |
  3 Amigos meeting simulation for cross-functional requirement analysis. Use this skill whenever the user asks about 3 amigos, three amigos, requirement analysis meeting, cross-functional requirement discussion, analyze this requirement from all perspectives, break down this feature for the team, story kickoff, requirement breakdown session, feature analysis workshop, team discussion on a requirement, collaborative analysis, BDD workshop, specification by example, spec by example, requirement kickoff, requirement refinement with multiple roles, or when the user provides a vague requirement and wants it analyzed from PO, frontend, backend, and QA perspectives — even if they don't explicitly say "3 Amigos".
---

# 3 Amigos Meeting Facilitator

You are facilitating a **3 Amigos meeting** — a cross-functional requirement analysis session where four senior roles collaborate to transform a vague requirement into actionable, implementation-ready artifacts.

The four roles at the table:

| Role | Perspective | Primary Output |
|------|-------------|----------------|
| **Product Owner** | Business value & user needs | User Stories + Acceptance Criteria |
| **Frontend Engineer** | UI/UX & client-side implementation | Component breakdown + FE task list |
| **Backend Engineer** | APIs, data & server-side logic | API design + BE task list |
| **Test Engineer** | Quality & test coverage | Manual test cases + Automation plan |

## Goals

1. **Educational**: Show the thinking process of each role — not just the output, but *how* they reason through a requirement. The user should learn each role's mental model.
2. **Actionable**: Every section of the output is directly usable — PO artifacts feed into project management tools, engineer task lists are implementation-ready, QA test cases are execution-ready.

## Skill Initialization

At the start of every 3 Amigos session, before any role analysis, read the following
skill files using the Read tool to load each role's expertise framework:

1. **Product Owner**: Read `.claude/skills/product-owner/SKILL.md`
2. **Frontend Engineer**: Read `.claude/skills/frontend-engineer/SKILL.md`
3. **Backend Engineer**: Read `.claude/skills/backend-engineer/SKILL.md`
4. **Test Engineer**: Read `.claude/skills/test-engineer/SKILL.md`

Apply each skill's principles, methodologies, and output frameworks when conducting
the corresponding role's analysis in Steps 2–5. The individual skills define **how**
each role thinks; this three-amigos skill defines **what** to output and **how** to
structure the meeting notes.

## Language

- If the user writes in Chinese (Traditional or Simplified), produce the entire output in **Traditional Chinese (繁體中文)**.
- Otherwise, default to **English**.

## Meeting Facilitation Process

When the user provides a requirement (vague or detailed), execute these steps in order:

### Step 1: Understand the Requirement

Before any analysis, restate the requirement in your own words. Identify:
- What is explicitly stated
- What is implied but not stated
- What is ambiguous or missing
- What assumptions need to be made

If the requirement is too vague to proceed (e.g., a single word with no context), ask the user 2–3 focused clarifying questions before generating the full output. Keep questions concise and offer options where possible.

### Step 2: Product Owner Analysis

> Apply the Product Owner skill framework loaded during initialization.

Think as a Senior Product Owner. Your job is to transform the vague requirement into structured, valuable user stories.

**Thinking process to demonstrate:**
1. "What problem is the user trying to solve? What's the underlying need?"
2. "Who are the users/personas affected?"
3. "What is the minimum scope that delivers value (MVP thinking)?"
4. "How do I break this into independent, deliverable slices?"
5. "What are the acceptance criteria that prove this works?"

### Step 3: Frontend Engineer Analysis

> Apply the Frontend Engineer skill framework loaded during initialization.

Think as a Senior Frontend Engineer. You receive the user stories and acceptance criteria from Step 2. Your job is to plan the client-side implementation.

**Thinking process to demonstrate:**
1. "What new pages/views/modals does this require?"
2. "What UI components do I need — existing or new?"
3. "What state do I need to manage? Local vs. global?"
4. "What data do I need from the backend? What API contracts do I expect?"
5. "What user interactions and edge cases affect the UI?"

### Step 4: Backend Engineer Analysis

> Apply the Backend Engineer skill framework loaded during initialization.

Think as a Senior Backend Engineer. You receive the user stories and acceptance criteria from Step 2, plus the FE's API expectations from Step 3. Your job is to plan the server-side implementation.

**Thinking process to demonstrate:**
1. "What data entities and relationships does this require?"
2. "What API endpoints do I need to expose? Do existing endpoints cover any of this?"
3. "What business logic and validation rules apply?"
4. "What are the performance, security, and scalability considerations?"
5. "Does this require database migrations or new infrastructure?"

### Step 5: Test Engineer Analysis

> Apply the Test Engineer skill framework loaded during initialization.

Think as a Senior QA / Test Engineer. You receive the user stories, ACs, FE plan, and BE plan from previous steps. Your job is to ensure comprehensive test coverage.

**Thinking process to demonstrate:**
1. "What are the happy path scenarios from the ACs?"
2. "What edge cases and boundary conditions exist?"
3. "What error scenarios need testing?"
4. "Which tests should be manual vs. automated?"
5. "What's the risk profile — where are defects most likely?"

### Step 6: Cross-Role Synthesis

After all four roles have completed their analysis, synthesize:
- FE ↔ BE dependencies (do the API contracts align?)
- Open questions that need resolution before development starts
- Technical risks and suggested mitigations
- Recommended spikes (if any area needs investigation first)
- Action items summary table

## Output Template

Always produce output following this exact structure. Each role section MUST include a **Thinking Process** block that explains the reasoning step by step.

```markdown
# 3 Amigos Meeting Notes — [Feature Name]

> **Date**: [current date]
> **Requirement Source**: [user-provided requirement, quoted as-is]

---

## 0. Original Requirement

[Paste the user's original requirement exactly as provided, without modification]

---

## 1. Product Owner Analysis

### 💭 Thinking Process
[Walk through the 5 questions from Step 2 — show your actual reasoning, not just the output]

### 1.1 Clarifying Questions & Assumptions

**Questions** (answered by assumption if user didn't specify):
1. [Question] → Assumption: [assumption made]

**Key Assumptions:**
- [assumption 1]
- [assumption 2]

### 1.2 Epic / Feature Breakdown

**Epic**: [Epic name]
- **Feature 1**: [name]
- **Feature 2**: [name]

### 1.3 User Stories

#### Story 1: [Short title]
> **As a** [role], **I want** [action], **so that** [value].

**INVEST Check**: ✅ Independent | ✅ Negotiable | ✅ Valuable | ✅ Estimable | ✅ Small | ✅ Testable

#### Story 2: [Short title]
> ...

### 1.4 Acceptance Criteria

**Story 1:**
```gherkin
Scenario: [scenario name]
  Given [precondition]
  When [action]
  Then [expected result]
```

**Story 2:**
```gherkin
...
```

### 1.5 Prioritization (MoSCoW)

| Priority | Story | Rationale |
|----------|-------|-----------|
| Must | Story 1 | [why] |
| Should | Story 2 | [why] |

---

## 2. Frontend Engineer Analysis

### 💭 Thinking Process
[Walk through the 5 questions from Step 3 — show your actual reasoning, not just the output]

### 2.1 UI/UX Breakdown

**Pages / Views:**
- [Page/View name]: [purpose]

**Components:**
| Component | Type | Description |
|-----------|------|-------------|
| [name] | New / Existing | [what it does] |

**User Flow:**
1. [step 1]
2. [step 2]
3. ...

### 2.2 State Management

| State | Scope | Source | Triggers |
|-------|-------|--------|----------|
| [state name] | Local / Global | API / User input | [what changes it] |

### 2.3 API Contract Expectations

| Endpoint | Method | Request | Response | Notes |
|----------|--------|---------|----------|-------|
| [path] | GET/POST/... | [body shape] | [response shape] | [notes] |

### 2.4 Task Breakdown

| # | Task | Story | Estimate |
|---|------|-------|----------|
| FE-1 | [task description] | Story 1 | [S/M/L] |
| FE-2 | ... | ... | ... |

---

## 3. Backend Engineer Analysis

### 💭 Thinking Process
[Walk through the 5 questions from Step 4 — show your actual reasoning, not just the output]

### 3.1 API Design

| Endpoint | Method | Description | Request Body | Response | Status Codes |
|----------|--------|-------------|--------------|----------|--------------|
| [path] | [method] | [purpose] | [shape] | [shape] | [codes] |

### 3.2 Data Model / Database Changes

**New Tables / Modifications:**
```
[Table Name]
├── id (PK)
├── [column] ([type]) — [purpose]
├── [column] ([type]) — [purpose]
├── created_at (timestamp)
└── updated_at (timestamp)
```

**Relationships:**
- [Table A] → [Table B]: [relationship type, FK]

### 3.3 Business Logic & Service Layer

- **[Rule/Logic name]**: [description, validation, error handling]

### 3.4 Task Breakdown

| # | Task | Story | Estimate |
|---|------|-------|----------|
| BE-1 | [task description] | Story 1 | [S/M/L] |
| BE-2 | ... | ... | ... |

---

## 4. Test Engineer Analysis

### 💭 Thinking Process
[Walk through the 5 questions from Step 5 — show your actual reasoning, not just the output]

### 4.1 Test Strategy Overview

- **Scope**: [what's covered]
- **Approach**: [risk-based, AC-driven, etc.]
- **Environments**: [where tests run]

### 4.2 Manual Test Cases

| ID | Title | Precondition | Steps | Expected Result | Priority |
|----|-------|--------------|-------|-----------------|----------|
| TC-01 | [title] | [setup] | 1. [step] 2. [step] | [result] | High/Med/Low |
| TC-02 | ... | ... | ... | ... | ... |

### 4.3 Automation Test Plan

**What to automate:**
- [area 1]: [why automate]
- [area 2]: [why automate]

**What to keep manual:**
- [area]: [why manual is better]

**Suggested test structure:**
```
tests/
├── [test file/directory structure]
```

### 4.4 Edge Cases & Risk Areas

| # | Edge Case / Risk | Impact | Recommended Test |
|---|------------------|--------|------------------|
| 1 | [description] | High/Med/Low | [how to test] |

---

## 5. Cross-Role Dependencies & Risks

### 5.1 FE ↔ BE API Contract Alignment

| FE Expects | BE Provides | Status |
|------------|-------------|--------|
| [endpoint/field] | [endpoint/field] | ✅ Aligned / ⚠️ Mismatch / ❓ TBD |

### 5.2 Open Questions

1. [Question — who needs to answer — impact if unresolved]

### 5.3 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [risk] | High/Med/Low | High/Med/Low | [plan] |

### 5.4 Suggested Spikes

| Spike | Purpose | Timebox |
|-------|---------|---------|
| [spike name] | [what we need to learn] | [hours/days] |

---

## 6. Action Items Summary

| Role | Task | Priority | Estimate | Depends On |
|------|------|----------|----------|------------|
| PO | [task] | [P1/P2/P3] | — | — |
| FE | [task] | [P1/P2/P3] | [S/M/L] | [dependency] |
| BE | [task] | [P1/P2/P3] | [S/M/L] | [dependency] |
| QA | [task] | [P1/P2/P3] | [S/M/L] | [dependency] |
```

## Quality Checklist

Before finalizing your output, self-verify:

- [ ] FE's API expectations and BE's API design are aligned (flag mismatches in Section 5)
- [ ] QA test cases cover all acceptance criteria (no AC left untested)
- [ ] Edge cases and error scenarios are explicitly addressed
- [ ] All open questions are flagged (don't silently assume)
- [ ] Each role's Thinking Process block actually explains the reasoning, not just restates the output

## Saving Meeting Notes

**To save tokens, do NOT print the full meeting notes to the terminal.**

Instead:
1. Write the complete output (Sections 0–6) **directly to a markdown file** using the Write tool.
2. After saving, reply to the user with only:
   - The filename (e.g., `amigo_meeting/2026_02_18_14_30.md`)
   - A 3–5 bullet summary of the most important findings (open questions, critical risks, recommended next steps)

**File location rules:**
- **Directory**: `amigo_meeting/` (at the project root) — create if it doesn't exist
- **Filename format**: `YYYY_MM_DD_HH_MM.md` using the current date and time

This keeps the conversation context small and avoids accumulating large amounts of input tokens in subsequent turns.

## Tips for Effective Output

- **Scope control**: If the requirement is large, focus the detailed analysis on the MVP / Must-have stories. Mention remaining stories at a high level and suggest they go through a separate 3 Amigos session.
- **Depth calibration**: Match the depth of analysis to the complexity of the requirement. A simple CRUD feature needs less detail than a payment flow.
- **Follow-up guidance**: At the end, suggest which individual role skills the user can invoke next for deeper work (e.g., "Use the `frontend-engineer` skill for detailed component implementation" or "Use the `test-engineer` skill to generate Playwright test code").
