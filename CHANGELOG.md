## Changelog

### Unreleased

### 2.3.0 — 2026-10-16

#### Added

- Add Scrollbar `v-model:x` and `v-model:y` percentage progress (0–100), including independent observation events, programmatic seeking, RTL, resize/visibility recovery and model-echo suppression for native smooth scrolling.

#### Fixed

- Keep Popper z-index allocations local to each instance so opening one popup no longer restyles every mounted persistent popup. Apply the same isolation to Notification and Loading, remove globally reactive layer props from Table Find tooltips, and explicitly clean up outside-click listeners when an open popup unmounts.
- Keep interactive Popper content open with combined hover/click triggers and preserve focus when moving into popup content.
- Preserve Select's particle placeholder effect while giving popup painting priority; shorten Select particle playback and popup entry to improve responsiveness. Bound single-line placeholder filter rasterization to its text rather than the whole control width.
- Use a blue-violet night surface scale across the library and documentation shell, with the configured Sass night palette applied through the shared color-token generator.
- Improve dark-mode foregrounds and inactive surfaces for Button, Tag, Input Number, Switch, Textarea, Verification Code and List, while preserving explicit custom colors and the daytime palette. Make night-mode disabled buttons easier to read.
- Refine Table's night-mode selected rows, directional fixed-column shadows, grouped-header separators and matching tree arrows/guides. Preserve rounded viewport clipping, fixed-column states and native scroll ownership.
- Keep Table custom header padding within its allocated width and align the custom-editor example's Save/Cancel actions with responsive spacing.
- Replace Image's fixed pale-gray loading surface and bright white sweep with a theme-aware placeholder, bundled image mark and restrained CSS shimmer. Preserve custom slots, reduced-motion behavior and the image reveal; expose pending state through aria-busy.
- Remove clipped Menu demo brand glow and make Navbar example surfaces follow the active theme.

#### Documentation

- Replace the long navbar component dropdown with category navigation and a multi-column catalog, retaining inline sidebar navigation and keyboard support.
- Theme keyboard keycaps consistently instead of combining fixed light backgrounds with night-mode text.
- Adapt and localize Virtual List and Print examples, synchronize their complete Code/Playground sources, and keep printed invoices white with dark ink regardless of preview theme.
- Add bilingual Scrollbar progress-driven animation examples and synchronize custom Table editor source styles.

### 2.2.2 — 2026-10-16

- Leave Table range selection when a cell editor opens, preventing the first edited cell from retaining a stale selection highlight across consecutive edits.

### 2.2.1 — 2026-10-16

- Preserve native cell double-click editing when Table range selection is enabled by delaying pointer capture until a drag starts.
- Show the range-selection cross cursor only during an actual drag, keeping ordinary clicks and small pointer movements unchanged.

### 2.2.0 — 2026-10-15

- Use semantic visual enum names throughout the library: `solid` Button, `logo` loading, `basic` Card, `solid` Card texture, `none` effects, `static` Countdown, `filled` Tag, `neutral` verification state and `medium` control size. Keep `default` as a compatibility alias while canonical option lists and examples use explicit names.
- Make long Anchor navigation scroll as one list with an outside scrollbar and keep collapse controls inside its surface.
- Clip rounded Table corners consistently during horizontal scrolling and preserve Input/control attribute ownership.
- Defer Virtual List measurement key reads until parent updates and recycled refs settle.
- Default Button press feedback to `glow`; use `expand`, `reverse`, `cut`, `ring` or `glow` explicitly and configure these modes through ConfigProvider or install options.
- Synchronize localized API references, selector labels and complete Code/Playground sources with the named defaults.

- Add Button ripple="ring" expanding halos and ripple="glow" soft light pulses without transforming the button.
- Make Button press ripples visible on solid and light surfaces, with distinct expand, contract and split animations, keyboard/touch support, reduced-motion feedback and bounded cleanup.

- Add Tabs/STab label-extra slots for arbitrary content after the default label, with isolated interaction events and no built-in clear/close action.

- Add Select sortByOptionOrder with local and global defaults, keeping selection order by default and normalizing multi-select values to option appearance order when enabled.

- Apply consumer class/style to component layout surfaces rather than nested native controls in Input, Textarea, Checkbox, Radio, Switch, Slider, Verification Code and Image. Preserve native attribute forwarding and dynamic updates.
- Preserve outer layout attributes in Select, Cascader, Images, Upload and Tab panes when automatic inheritance is disabled.

### 2.1.7 — 2026-10-15

- Respect explicit Card hover effects across presets without inheriting preset translations.
- Prevent Virtual List spacers from expanding unresolved container heights; follow dynamic parent dimensions automatically with a 320px intrinsic fallback.
- Bound mounted Virtual List rows with maxRenderedItems (default 500), retain the current scroll anchor, and warn only for sustained visible oversizing in development.
- Add localized dynamic-container examples covering resizing, hiding and automatic recovery.

### 2.1.5 — 2026-10-15

- Keep floating-label Select and Cascader controls aligned with Input and their composed date/time controls without fixed-label top spacing.
- Align Table query actions with the actual control row across container-responsive label layouts, and restore automatic query-field columns.
- Preserve Card media edges without Image collection margins, clip frosted media to all outside corners, and place horizontal preset actions at the content footer.
- Avoid duplicate Virtual List range notifications when measurement resets leave the visible range unchanged.
- Include the Input Number interaction fixes and bilingual documentation from the unreleased 2.1.4 changes.

### 2.1.4 — 2026-10-14

- Preserve Input Number foreground and background colors during hover and focus, using borderless inset feedback.
- Make numeric stepping controls keyboard operable and reflect disabled bounds; allow null in public value and event types to match clearing behavior.
- Add complete English and Chinese Input Number documentation, five localized examples, navigation, and search entries.

### 2.1.3 — 2026-10-14

- Size Form fields proportionally to their containing row, deducting gaps only between rendered fields to prevent narrow-container overflow.
- Resolve responsive Form spans and label layouts against each form or nested row's width instead of the viewport.
- Add English and Chinese container-width examples demonstrating single-column and two-column layouts.

### 2.1.2 — 2026-10-13

- Include dark theme variables in the default stylesheet while retaining the standalone dark entry for compatibility.
- Align top-label Table query actions with the first control row and preserve CSS container queries in compressed theme bundles.
- Add regression coverage for default-entry dark surfaces and readable foreground colors.

### 2.1.1 — 2026-10-13

- Include dark theme variables in the default stylesheet so Table, Input, Select, and other controls switch correctly with `html.dark` without a separate dark CSS import.
- Retain the standalone dark stylesheet for compatibility and update the English/Chinese getting-started examples.
- Align top-label Table query actions with the first control row instead of the reserved validation message area; preserve compact stacked layouts.
- Preserve CSS container queries in compressed theme bundles so mobile query layouts no longer override desktop layouts.
- Add regression coverage for default-entry dark surfaces and readable foreground colors.

### 2.1.0 — 2026-10-12

#### Behavior changes and migration

- Agent is the canonical public name. Consumers of earlier unreleased editor builds must replace `SAiEditor` / `AiEditor*` with `SAgentEditor` / `AgentEditor*`, `ai-icon` with `agent-icon`, and global `aiIcon` with `agentIcon`. Component/style imports and documentation routes now use `agent-editor`; the old `ai-editor` paths are not retained as aliases. These Agent components were not part of the published 2.0.0 package.
- Agent-category components use rounded geometry and no longer expose `shape` or square variants. Their internal controls remain rounded even when the application's global shape is square. Other component shape APIs are unchanged.
- Avatar Group `max` now counts visible member avatars and appends a separate `+N` counter; it no longer covers the last visible photo with a count. An eight-member group with `max="6"` displays six photos and `+2`. Review limits if your layout relied on the previous total-slot count.
- Message defaults to actions for both user and assistant roles. Set `:actions="false"` to disable them. User messages offer copy/edit; assistant messages offer copy/like/dislike/regenerate. In Message Scroller, actions reveal on hover or keyboard focus; touch devices keep them visible.
- Chat Input model capabilities are application-supplied data, not a built-in provider catalog. Use `capabilities.fast` and `capabilities.reasoning.options/default` for each model; legacy `supportsFast`, `reasoningEfforts`, and `defaultReasoning` remain deprecated compatibility fields.

#### New Agent components

- Added the Agent documentation category and public components: `SAgentEditor`, `SReasoningSteps`, `SChatHistory`, `SFileDiff`, `SImageGeneration`, `SStreamingText`, `SInlineCitations`, `SCodeBlock`, `STaskList`, `SChatInput`, `SPlanCard`, `SQuestionCard`, `SMessage`, and `SMessageScroller`. These are composable presentation and interaction primitives; model requests, tool execution, and persistence remain application responsibilities.
- Agent Editor supports editable text, independent formatting marks, selection-based floating controls, cancellable Promise/async-iterable requests, streaming answers, progress and source feedback, and replace/insert/copy actions. Fixed selection-toolbar disappearance and pointer interaction, enabled configured inline assistance, and added realistic report examples, readonly/disabled behavior, and scoped customization.
- Added one shared Agent SVG icon for editor controls and assistant messages. Configure `agentIcon` once through `SConfigProvider` or the install options; local URLs and slots can override it, including custom PNG/SVG assets. User message avatars sit to the right of their bubbles; examples reuse `SAvatar`.
- Reasoning Steps presents progressive process states, sources, expansion, and completion with the default project loading indicator. Completion waits for the loading exit/restoration animation instead of immediately removing it.
- Chat History opens a user's previous messages, navigates to the chosen message, and briefly highlights its bubble. Added composed examples with human and Agent turns.
- File Diff, Code Block, Inline Citations, and Task List provide reusable change, code, source, and task presentation with their own controls and scoped customization. Citation navigation and progressive task/reasoning presentation share the Agent interaction styling.
- Image Generation includes an active dot-matrix progress field using flowing brand colors. Color waves cover the entire grid; unrelated decorative curve strokes were removed. Includes progress, completion, and cancellation presentation.
- Streaming Text supports incremental content, pause/resume, replay, and immediate completion. Completion retains the status/content footprint; new text resolves through transient colored reveal rather than permanently rainbow-colored text. Added terminal/code-block content to the examples.
- Chat Input adds model selection, a compact settings panel with a separate model picker, Fast switching, and model-specific reasoning levels on the existing bubble-textured progress/slider controls. Unsupported capabilities disappear/reset appropriately, and model labels size to their content.
- Chat Input uses the native Promise file picker, controlled attachments, image previews, removal, and corrected attachment layout/close-button clipping. Added dictated text through supported browser speech recognition or a consumer `transcribe` callback, microphone permission/error feedback, and live audio-level waveform movement. The right action switches between voice and send as text or attachments are added; IME composition and multiline input are handled.
- Plan Card adds opt-in automatic approval countdown, cancellation, unified task expansion through View/Hide Plan and the remaining-task control, SVG ellipsis, inset task surfaces, and animated approved-state feedback. Question Card supports required questions, option/custom answers, navigation/submission, and a full-width custom-answer input.
- Message adds controlled timestamps and feedback, copy status/error events, regenerate/edit requests, role-specific hover actions, accessible labels, and teleported tooltips. Only voting controls expose pressed state.
- Message Scroller adds built-in dynamic-height virtualization through `items`, stable-key viewport anchoring, overscan/height estimates, continued measurement of streamed/wrapped content, and lazy older-history loading. History requests merge and deduplicate against the latest items, preserve the reading position, support abort/retry, and stop at exhausted history. Reading history pauses bottom following; new content marks unread messages instead of pulling the reader down.
- Message Scroller keeps one circular return-to-latest arrow with unread feedback and reduced-motion-aware transitions. Default data messages emit `message-action` with the item, index, action, and optional feedback/error; feedback survives virtual row remounts. Added bilingual basic and 200-message virtual examples with editing, votes, regenerated responses, three history pages, and streaming height changes.

#### Skeleton, Avatar, and Carousel

- Added `SSkeleton` with a default title/text layout and concise declarative rows. Compose circle, square, rectangle, and line placeholders from strings or objects; configure dimensions, relative flex growth, spacing, alignment, nested row groups, and repeated layouts. Supports custom placeholders, loading-to-content reveal, localized accessible status, shimmer/pulse/static animation, theme colors, and reduced motion. Leaving content becomes inert, and interrupted reveals restore interaction.
- Avatar Group adds configurable `overlap`, shared `size` with per-avatar overrides, reactive member/limit updates, and an `overflow({ count })` slot for the independent counter. Added circular-photo stacking and side-by-side examples with localized avatar names.
- Added Carousel `effect="arc"` with a curved portrait-card fan, bounded looping windows, progressive side-card emphasis, shared navigation/drag/autoplay support, and an active `caption` slot. Rendered loop windows remain bounded independently of the data size, and embedded text controls retain keyboard editing.

#### Other component enhancements

- Made Context Menu openings mutually exclusive per document, including nested regions, sibling component trees, imperative calls and controlled visibility. Replaced menus close without restoring old focus; session ownership is released on closing, unmounting and deactivation.
- Added paired Context Menu examples demonstrating three nested trigger regions, innermost pointer/keyboard priority and disabled-child fallback, with localized Code and Playground sources.
- Made Tooltip and Popper choose a viewport-aware direction when placement is omitted, preferring top before bottom and horizontal alternatives. Fixed default collision middleware activation and reactive positioning options; retained explicit placement preferences, custom fallback options and flip/shift opt-outs.
- Redesigned Result with layered semantic SVG illustrations and one-time confirmation entrances. Added shared sizing, responsive horizontal layout, structured details and scoped customization slots, plus eight localized English/Chinese examples with synchronized Code and Playground sources.
- Slowed the Progress indeterminate segment from a 1.2-second to a 3-second cycle while retaining independent texture animation timing.
- Added Progress SVG fill textures: dense microbubbles, continuously breaking sea waves with alternating crests, and phased sparkle. Added proportional height scaling, animation timing/opacity controls, visibility-aware playback and reduced-motion support; preserved the plain default, with paired examples, proper CSS height/color handling and accessible progress values.
- Refined Notification icon examples with consistent outline icons, labeled controls, responsive spacing and localized English/Chinese Code and Playground sources.
- Added Notice Bar Promise-based beforeClose approval with merged requests, pending state and rejection events, plus localized examples choosing temporary or persistent dismissal.
- Added Notification particle close animation with configurable timing and opt-out, shared lazy surface-filter lifecycle, and synchronized manual/automatic/programmatic dismissal. Fixed duplicate close callbacks and disposal of imperative notification instances.
- Expanded Notice Bar with multiple-notice navigation and autoplay, overflow-aware scrolling, pause controls, wrapping, links, fixed action slots, controlled visibility, semantic colors, sizes and shape variants. Added ten paired documentation examples and corrected counter glyph alignment and the documented scrolling duration unit.
- Fixed Brand Loading color tips collapsing and expanding during final logo restoration; each returning strand now smoothly restores its original sampling length.
- Redesigned Empty with an animated inline SVG of a completely empty open box with shared perspective geometry and synchronized one-time hinge opening, brief glowing star accents, soft paper surfaces and a replayable documentation example, theme-aware colors, an animation toggle, offscreen/hidden-page pausing and reduced-motion support. Preserved custom image URLs, image-size and illustration slots, with paired documentation examples.
- Expanded Drawer with Promise/callback close approval, delayed opening/closing, content caching and destruction, container mounting, focus management, nested push behavior, loading, and controlled pointer/keyboard resizing.
- Added scoped Drawer header, title, extra, footer, close-icon, loading, mask, and resizer slots, region styles/classes, compatibility aliases, and ten paired English/Chinese documentation examples.
- Enabled public locale imports in documentation Code/Playground previews and fixed Drawer default body mounting when no container is specified.

#### Control fixes, documentation, and development

- Documentation search now supports `Ctrl+K` / `Cmd+K`, keyboard result navigation, Escape dismissal/focus restoration, and lazy indexes of component titles, section headings, prose, and API descriptions. Ranked localized results include excerpts and direct section links. The header uses a search button rather than an inline input; clicking it opens the same complete modal as the shortcut. Grouped results highlight matching text. The shared Dialog provides focus containment, scroll locking, Escape dismissal, and focus restoration.

- Input preserves consumer combobox ARIA attributes when its built-in autocomplete is not configured, enabling accessible composed search dialogs.
- Shared particle placeholder dissolve/reassembly across input-like controls, kept picker placeholders visible while their panels are open, and reduced unnecessary picker rendering. Corrected Switch label alignment and centralized Tag-owned avatar spacing.
- Preserved compact loading exit/restoration animations before returning to normal content. Modularized temporary SVG filter lifecycle so animated filters remain instance-scoped and are disposed after playback.
- Expanded paired English/Chinese examples and synchronized complete SFC sources for Code and Playground across the changed components. Added clickable inline public API types backed by the same recursive type-detail registry as API tables, including model capabilities and Skeleton declarations.
- Improved documentation startup through persistent data caching and focused component development; aligned shared Playground toolbar controls. Public locale imports work in preview sources.
- Companion package remains `sax-design-vue-iconify@1.0.1`.

### 2.0.0 — 2026-09-30

#### Breaking changes and migration

- Removed `SPrompt`, `SPromptBox`, and `$prompt`. Use `SDialog` for declarative content and `SDialogBox` / `$dialog` for imperative messages and confirmations. Dialog supports `beforeConfirm` validation, custom footer callbacks, and asynchronous close approval.
- `beforeClose` now takes no arguments and must return `Promise<void>`. Resolve to approve closing; reject with a string or `Error` to retain the dialog and show the reason. Replace callback-based `done()` guards with Promise fulfillment/rejection.
- When `beforeClose` is configured, overlay clicks no longer request closing by default. Explicitly set `:mask-closable="true"` on the instance (or `maskClosable: true` in imperative options) to enable this entry; inherited defaults do not opt in.
- Dialog closes with a surface-only particle dissolve by default. Set `:close-animation="false"` to disable it, or `close-animation-duration` to customize the default 220ms duration. Imperative/global options use `closeAnimation` and `closeAnimationDuration`.

#### Features

- Added Dialog minimization, restorable dock bubbles, and optional `global` lifetime beyond owner teardown. Closing waits for validation, loading completion, and dissolution before disposal; the overlay stays unchanged during dissolution and is removed with the surface.
- Added Input-managed autocomplete suggestions, disabled native browser autocomplete by default, and introduced instance-scoped SVG placeholder dissolve/reassembly. Static SVG filter definitions can be shared through the common filter registry; animated graphs remain local to their instances.
- Added Select item renderers with search context and warm matching highlights, placeholder fallback for floating labels, and options-first documentation. Unified virtual scrolling around the height-delta index, batched dynamic row measurements, and added data-driven virtual List rendering.
- Added TableSelect multiple selection for flat and tree data, parent/child check strategies, independent checking, and selected-value tags.
- Unified loading feedback across Input, Select, Cascader, TableSelect, DatePicker, TimePicker, TimeSelect, and Textarea. Added compact four-point loading exits for Radio and Dialog close controls, with complete animation handoff before normal content returns.

#### Fixes and documentation

- Corrected fractional Rate star clipping and alignment; preserved Slider disabled behavior; fixed TimePicker loading/text overlap, Textarea surfaces, renderer button wrapping, and selected tree-row labels/structure.
- Stabilized Input text insets, hover targets and close controls; improved Switch loading outlines/exits, List presentation, example spacing, and scrollbar-track interaction feedback.
- Expanded paired documentation for flat/tree single/multiple selection, dynamic-height virtual lists, loading controls, Dialog footer/close behavior, and imperative use. Clarified dismissal labels and explicitly enumerated color/state choices in API tables; Code and Playground sources stay synchronized.
- Companion package remains `sax-design-vue-iconify@1.0.1`.

### 1.1.1

- Added shared week-start and week-number rules for DatePicker, DatePanel, and Calendar, whole-week selection, current-period styling, and date-range hover previews.
- Added native email, URL, required, and pattern validation with Input/Form integration and localized messages.
- Added directional Radio dot motion, synchronized button backgrounds, and SVG contour/fill animation.
- Refined Checkbox mixed states and square logo loading, unified close artwork, clear-icon sizing, and loading cursors.
- Improved multiple-date tags, Input surfaces, breadcrumb overflow, Tabs rendering, Table workflows, and component alignment.
- Unified documentation API structure and scoped-slot types; supplied known icons automatically to Playground.
- Compatibility: DatePicker defaults to Monday as the first weekday. Set `start-day="0"` or global `firstDayOfWeek: 0` to retain Sunday-first calendars. The standalone Sidebar component has been removed. Prefer Tabs `render-mode` over its compatibility rendering flags.
- Companion package: `sax-design-vue-iconify@1.0.1` preserves the built-in `sax:close` icon during strict Vite transforms.

### 1.0.1

- Expanded Table editing, validation, selection, grouping, and renderer workflows.
- Added shared motion tokens, reduced-motion protection, and refined component transitions.
- Improved localized documentation, examples, built-in icons, and deployment behavior.

### 1.0.0

- First stable release of Sax Design Vue.
- Includes the Vue 3 component library, theme styles, TypeScript declarations, and Iconify integration.

### 0.0.1
