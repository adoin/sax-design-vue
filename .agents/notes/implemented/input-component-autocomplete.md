---
status: implemented
kind: project-specification
completed_at: 2026-09-30
modules:
  - packages/components/input
  - packages/theme-chalk/src/input.scss
  - docs/components/input.md
  - docs/zh/components/input.md
---

# Component autocomplete and native completion defaults

## User request

> 关闭一下所有 input的自动完成，然后在input中增加autocomplete的入参，但是交互由我们自己来做，弄个好点的样式

## Contract

- Library input elements and documentation inputs default to native `autocomplete="off"`. Input always disables native completion, including legacy `autoComplete` and `autocomplete` browser tokens. VerificationCode defaults to `off`; applications may explicitly opt into its existing native one-time-code API.
- Input's canonical `autocomplete` prop accepts string suggestions or objects with `value`, optional `label`, `description`, and `disabled`. It matches these text fields without restricting free text. Legacy string browser tokens remain accepted but have no effect.
- `autocompleteLimit` defaults to 20. `autocompleteMinLength` defaults to 0; matching uses trimmed, case-insensitive text. Password, password-visibility, and number inputs do not offer suggestions. Loading, readonly, noneditable, disabled, and composing inputs cannot select suggestions.
- Arrow keys cycle through enabled suggestions, Enter fills an active suggestion, Escape dismisses without clearing, and Tab dismisses while retaining native focus traversal. No suggestion is active by default. Selecting explicitly commits even in deferred mode and emits input, change, and autocomplete-select. Chinese composition does not trigger selection, clearing, or search submission.
- Input owns the model and keyboard contract through useInputAutocomplete. The internal InputAutocomplete surface uses the shared SPopper with a virtual input anchor, default Teleport, viewport constraints, and outside-click handling. Do not implement a second positioning layer or document-level outside-click listener.
- The autocomplete-option slot receives InputAutocompleteScope. Default content uses escaped text, descriptive secondary lines, warm search highlights, and the control's semantic color for active rows. Shape and size follow Input; no border or focus ring is introduced.
- No popup surface is created for ordinary inputs. Both on-demand Input style entries include Popper styles.
- English and Chinese examples, Code, and Playground share complete localized SFC sources. Public API aliases resolve through the existing recursive type registry.

## Verification

- Input, Select, DatePicker, TimePicker, VerificationCode, Textarea, and Table find tests passed, including the six new autocomplete behavior tests.
- Web, Playground, and Vitest type checks passed; theme compilation and documentation example checks passed.
- Both localized demos and their Code and Playground surfaces were verified. Browser checks covered description matching, warm highlights, disabled-option skipping, keyboard and pointer selection, and Escape reopening.
