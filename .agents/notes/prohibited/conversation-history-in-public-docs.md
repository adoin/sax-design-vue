---
status: prohibited
kind: prohibited-approach
recorded_at: 2026-09-07
scope:
  - docs
reopen_only_if: The user explicitly requests a separate public migration guide or postmortem with a defined audience and scope.
---

# Conversation and correction history in public documentation

## Attempted approach

Use documentation copy to repeat task prompts, implementation instructions, correction history, earlier mistakes, design-review commentary, or verification reports.

## Evidence

The user identified this content in the rendered Table documentation and explicitly required public documentation to address developers and AI using the library, without exposing the working conversation or its corrections.

## Why it is prohibited

Internal process text obscures the current API contract, makes examples read like a review transcript, and leaves stale explanations after implementation changes.

## Required alternative

Describe only the current API, behavior, usage choices, limitations, and developer-facing rationale. Keep task history, implementation constraints, and validation evidence in repository-owned specifications, tests, commits, or other internal records.
