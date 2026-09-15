# Grouped column settings design QA

## Comparison target

- Source visual truth: `D:\\codex_home\\generated_images\\01a06660-cacc-7d40-adf1-9439dacb2017\\exec-52fd2c60-f68a-4a51-bb3c-a23fc7f87d62.png`
- Source dimensions: 1549 × 1015 px.
- Implementation route: `http://localhost:8080/zh/components/table.html#grouped-headers`
- Implementation screenshot evidence: `C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\codex-clipboard-de31d3d1-3065-4547-b378-6d52258c7a34.png` records the first rendered iteration. The final implementation was inspected live in the Codex in-app Browser; its capture API did not provide a usable local filesystem path.
- Browser viewport: 1678 × 1240 CSS px at device pixel ratio 0.75.
- Focused component size: 440 × 387.58 CSS px.
- State: Chinese grouped-header example, column settings open, all groups visible, light theme.
- Density normalization: the source is a presentation-scale concept and the implementation uses the component's production 440 px panel width. Comparison therefore uses normalized component proportions, hierarchy, alignment, color treatment, and interaction state rather than raw pixel equality.

## Full-view comparison evidence

- The source establishes one independent root leaf, a pale grouped container, a nested inset group, aligned fixed-position controls, and drag handles.
- The implementation preserves the existing product shell and control density while adopting the same container hierarchy. Browser inspection found two group containers: `成员资料` at a 0 px branch offset and `组织信息` at a 14 px branch offset.
- The source includes disclosure chevrons. Their omission is intentional and required: all grouped column settings stay expanded and expose no additional collapse state.

## Focused region comparison evidence

- The first implementation screenshot showed the parent accent rail interrupted by opaque child-row backgrounds.
- After correction, live computed styles report child rows as transparent, the parent surface as `rgba(25, 91, 255, 0.043)`, and its continuous inline-start accent as `rgba(25, 91, 255, 0.22)` at 2.67 CSS px.
- Root, child, nested-group, and grandchild rows all remain 400 CSS px wide. Their fixed-position selects share the same x coordinate, while labels step inward by 14 px per hierarchy level.
- The open panel contains two grouped branches, eight setting rows, and zero group disclosure controls.

## Findings and iteration history

### Iteration 1

- [P1] Interrupted hierarchy rail.
  - Location: grouped branch child rows.
  - Evidence: the user-provided implementation crop showed white row surfaces covering sections of the darker parent accent.
  - Impact: the most important visual cue for parent-child containment appeared broken.
  - Fix: removed opaque child-row surfaces and made nested row hover/focus backgrounds transparent so the parent surface and rail remain continuous.

### Final review

- Fonts and typography: existing project font, sizes, and control weights remain unchanged. Group names use the established semibold treatment; direct-child counts use an 11 px secondary treatment.
- Spacing and layout rhythm: group headers are 44 px high, leaf rows are 56 px, nested groups step inward by 14 px, and right-side selects remain column-aligned.
- Colors and visual tokens: all new surfaces and accents derive from the existing primary and background tokens. No raw product colors were introduced.
- Image quality and asset fidelity: the component contains no raster imagery, logos, or custom visual assets. Existing component icons remain unchanged.
- Copy and content: each group displays its localized direct-child count (`{count} 列` / `{count} columns`). No collapse labels or affordances are present.
- Interaction: before/after drops retain the insertion line; inside drops tint the complete target group container. Pointer and keyboard reparenting continue to use the existing manager actions.
- Responsiveness and scale: grouped root branches remain virtualized when the total settings count exceeds 20, preserving the nested container structure without flattening the visible hierarchy.
- Accessibility: no inert disclosure buttons were added. Existing checkbox, select, drag-handle, focus-trap, and live drag-status semantics remain intact.

No actionable P0, P1, or P2 findings remain.

## Implementation checklist

- [x] Render grouped columns as recursive containers.
- [x] Render nested groups as inset surfaces.
- [x] Keep every group permanently expanded.
- [x] Preserve aligned fixed-position controls and drag handles.
- [x] Keep parent rails continuous through transparent child rows.
- [x] Preserve grouped virtualization and reparenting behavior.

## Follow-up polish

- P3: the direct-child count can be hidden in an extra-compact density preset if a future panel-width option is introduced.

final result: passed

---

# Table validation overlay design QA

## Comparison target

- Source visual truth: `D:\codex_home\generated_images\01a08f4a-a937-7ae3-9086-1dcfb8e9ac04\exec-45f8319a-6ef5-4590-9003-4d4317b53a81.png`.
- Source dimensions: 2011 × 782 px; the concept requested a 1364 × 530 desktop component frame.
- Implementation route: `http://localhost:8080/zh/components/table/editing-validation-and-changes.html#data-validation`.
- Browser-rendered implementation screenshot: `D:\workspace\sax-design-vue\.agents\audits\table-validation-overlay-implementation.png` (1200 × 700 px).
- Combined comparison evidence: `D:\workspace\sax-design-vue\.agents\audits\table-validation-overlay-comparison.png` (2000 × 520 px).
- Browser viewport: 1364 × 768 CSS px, device pixel ratio 0.75 during the final browser pass.
- State: Chinese light-theme data-validation example after “校验全部”, three invalid fields, first error active, callout and horizontal navigator visible.
- Density normalization: the selected design was resized to 960 × 374 in the comparison board. The browser screenshot's focused 640 × 245 table region was resized to 960 × 368. The comparison judges component proportions and interaction hierarchy rather than surrounding documentation chrome.

## Full-view comparison evidence

- Both source and implementation keep the compact action row, pale primary header, three 44 px data rows, soft danger surfaces, anchored callout, and horizontal lower-right error navigator.
- The implementation deliberately omits the generated concept's inline seat error text because the user's hard constraint is zero validation contribution to document flow. The full message remains in the floating callout and accessible description.
- The navigator stays inside the Table clipping boundary rather than protruding outside the rounded table. This preserves overlay behavior without widening the documentation card or creating page overflow.

## Focused region comparison evidence

- Browser measurements found all three rows at exactly 44 px before validation, after validation, during row editing, and after failed commit.
- Invalid cells use `rgba(255, 71, 87, 0.48) 0 0 15px -6px inset` plus a weak outer danger shadow. They have no error border and retain `flex-direction: row`.
- Hidden descriptions measure 1 × 1 px with absolute positioning. The multi-error navigator uses absolute positioning and therefore contributes no layout height.
- Carbon `warning-alt-filled`, chevron, and close icons replace ambiguous color-only dots while preserving the selected visual hierarchy.

## Findings and iteration history

### Iteration 1

- [P2] Transparent navigator surface in dark mode.
  - Location: `.s-table__validation-navigator`.
  - Evidence: the first browser pass reported `background: rgba(0, 0, 0, 0)` in dark mode while the callout had an opaque dark surface.
  - Impact: table content could compete with navigator labels and controls, reducing contrast and making the overlay look unfinished.
  - Fix: changed the navigator surface to `var(--s-table-surface, ...)` and changed the danger-count foreground to the semantic white token.

### Final review

- Fonts and typography: the implementation keeps the project's Poppins-based scale and weights. Navigator text uses the existing compact component scale with tabular figures.
- Spacing and layout rhythm: 44 px row heights, aligned column tracks, compact 6 px navigator gaps, and the lower-right overlay match the selected density without shifting content.
- Colors and visual tokens: all danger, primary, surface, and text colors derive from theme tokens. The final dark-mode navigator reports an opaque `color(srgb 0.128656 0.149219 0.191266)` background with light text.
- Image quality and asset fidelity: no raster assets are required by this component. All visible icons use the existing Carbon icon pipeline; no emoji, CSS drawing, or handwritten SVG was introduced.
- Copy and content: messages remain application- or rule-owned; navigation and control labels are localized in Chinese and English.
- Interaction: validation closes active editors; entering an invalid row clears its old error presentation; a failed commit restores errors while retaining editors; previous/next wraps through errors; close hides navigation without clearing errors; markers reopen it.
- Responsiveness: the navigator caps its width to the table surface, the callout caps to the viewport, and neither creates document overflow.
- Accessibility: invalid cells retain `aria-invalid` and `aria-describedby`; hidden errors use a live alert; markers and navigation are native buttons with localized names; keyboard Left/Right navigation and visible focus states are present.
- Console: the final in-app Browser pass reported no error-level console messages.

No actionable P0, P1, or P2 findings remain.

## Implementation checklist

- [x] Replace inline error text with non-flow accessible descriptions.
- [x] Use danger shadow and tint without an error border.
- [x] Anchor the active message through the shared `SPopper` layer.
- [x] Add keyboard-operable multi-error navigation.
- [x] Preserve row height through validation and editing transitions.
- [x] Close editors before manual validation.
- [x] Clear old error presentation on edit and restore it after failed commit.
- [x] Verify light and dark themes in the in-app Browser.

## Follow-up polish

- P3: a future compact-density option could reduce navigator control size while retaining the existing focus hit area.

final result: passed
