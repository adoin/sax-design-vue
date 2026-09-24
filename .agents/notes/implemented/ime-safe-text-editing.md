---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/components/input
  - packages/components/textarea
  - packages/components/table/src/table-cell-editor.vue
supersedes: []
---

# IME-safe controlled text editing

## Contract

`SInput` and `STextarea` preserve the native DOM draft during an active IME composition without emitting `update:modelValue`. A parent or Table re-render during composition must not replace the visible draft with the last committed prop value. `compositionend` normalizes and publishes the completed text through the established immediate or lazy model contract.

Raw `input` events remain observable during composition, but model updates are composition-safe. Consumers that listen to raw `input` must not treat provisional composition text as committed application data.

Table cell editors observe composition events at their root in capture phase so built-in and custom text controls receive the same keyboard protection. `isComposing` and legacy key code 229 continue to block editor shortcuts. The first Enter arriving within 80ms after `compositionend` is treated as the candidate-confirmation keystroke and is consumed; a later independent Enter retains the established commit behavior.

Replacing the Table `data` reference still ends an edit according to the existing controlled-data contract. Applications should not rebuild Table data from provisional raw input events.

## Verification

- Input, Textarea, Table editing, and Table keyboard suites — 4 files and 50 tests passed.
- Input and Textarea tests force a controlled prop update during composition and confirm that the visible Chinese draft survives until `compositionend`.
- Table editing tests force a complete Table re-render during composition, reject the trailing unmarked Enter, then accept a later independent Enter with the completed Chinese value.
- Targeted ESLint for all changed implementation and test files — passed.
- `pnpm run typecheck:web` reached only the pre-existing `packages/components/table/src/table-find-panel.vue:633` callback mismatch from unrelated unstaged work.
