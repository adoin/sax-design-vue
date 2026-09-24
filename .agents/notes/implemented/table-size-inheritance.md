---
status: implemented
kind: project-specification
updated_at: 2026-09-22
completed_at: 2026-09-21
modules:
  - packages/components/config-provider
  - packages/components/form
  - packages/components/table
  - packages/components/button/src/renderer-buttons.vue
  - packages/components/control-group
  - packages/components/input
  - packages/components/select
  - packages/components/textarea
  - packages/components/cascader
  - packages/components/table-select
  - packages/components/checkbox
  - packages/components/radio
  - packages/components/slider
  - packages/components/switch
  - packages/components/rate
  - packages/components/verification-code
  - packages/components/pagination
  - packages/theme-chalk/src/common/var.scss
  - docs/components/form.md
  - docs/components/renderer.md
  - docs/components/table.md
  - docs/zh/components/form.md
  - docs/zh/components/renderer.md
  - docs/zh/components/table.md
---

# Table size inheritance

## Contract

Table control density follows one override chain: root `SConfigProvider.size`, `SConfigProvider.table.size`, local `STable.size`, region-level `queryConfig.size` or `toolbarConfig.size`, then an individual component or renderer `props.size`. Empty or omitted region values inherit rather than introducing a separate density.

Shared controls expose `small`, `default`, and `large` at the common 32px, 36px, and 40px control heights. Input, Select, Textarea, date/time controls, Cascader, TableSelect, Checkbox, Radio, Rate, Slider, Switch, VerificationCode, Pagination, Form, and Table must render materially distinct geometry for those three values rather than only accepting the prop. Button keeps its five-value compatibility scale, but its overlapping `small`, `default`, and `large` values must match the common heights; only `mini` and `xl` extend below and above that shared scale.

Every public component that exposes `size` must provide a dedicated Size / 尺寸 documentation card in both locales. The rendered example, Code source, and Playground source must compare all supported size values and remain localized. `ComponentSize` stays a resolvable named API type so readers can click through to its declaration; Values may summarize the concrete values but cannot replace the type interaction.

The Table size is provided to body slots and cell controls. Query and toolbar regions provide their resolved regional size to custom slots as well as built-ins. Query fixed actions, refresh, button groups, find controls, and column settings all use the same inherited value. Column settings use `SButton` and must not maintain a second hand-written height or padding scale.

An active cell editor fills the cell's actual width and height instead of keeping the renderer's nominal control height. The row preserves its pre-edit rendered minimum height for the edit session, so text wrapping or application-owned row growth does not collapse when display content is replaced by an editor. Built-in input-like renderers stretch to the editor surface; compact controls such as Switch remain naturally centered inside it.

Every shared renderer method receives the current inherited layer as `params.size`. Renderer options merge that value before the renderer's own `props`, so `props.size` remains the final explicit override for `renderDefault`, `renderEdit`, `renderFormItem`, `renderFilter`, and `renderToolbar`.

The default Button content padding token is `8px 12px`; named Button sizes continue to own their established size-specific padding and height.

`SControlGroup.size` is an authoritative group boundary. It overwrites size on every direct component control and normalizes the joined surface height, even when a child declared a conflicting local size. Native HTML children are not given a synthetic `size` attribute.

## Verification

- Focused Form, Table business, column manager, find, Button, Input, Select, and ControlGroup coverage passed, including a 15-control renderer-size contract and the authoritative group override.
- Renderer coverage verifies Table body, edit, filter, Form item, and toolbar inherited size plus per-renderer overrides.
- `pnpm run test:docs-examples`: 4 files and 14 tests passed.
- Theme compilation and the 201-page production documentation build passed.
- Web TypeScript validation passed. The aggregate typecheck still reports existing Vitest-project errors in Table find, range interaction, and row-drag test fixtures unrelated to this contract.
- Browser verification on the Chinese query/proxy example measured query, toolbar, refresh, overflow, and column-setting buttons at the same 36px default height with `8px 12px` content padding. The overflow panel measured 96px wide with readable dark text and 32px action rows.
- Browser verification measured Input at 32px / 36px / 40px for small / default / large. Button content uses centered flex alignment, a 6px icon/text gap, and matching content/icon vertical centers.
