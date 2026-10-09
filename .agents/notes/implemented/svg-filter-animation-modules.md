---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Transient SVG filter animation modules

## Contract

- `defineSvgFilterAnimation` declares immutable filter nodes, binding paths/attributes/channels, a pure progress-to-frame mapper, timing/easing and optional region bounds. `svgFilterAnimations.add/get` registers declarations without DOM. Duplicate names with different definitions and invalid bindings are rejected.
- The `dissolve` module owns the existing particle graph and parameter mapping. `useSvgFilterAnimation` owns frame timing, interruption/reversal, reduced motion, page visibility, KeepAlive and cleanup. `useSvgDissolve` remains a compatibility adapter; neither consumers nor the timeline duplicate the particle graph.
- `SSvgFilterAnimation` is available by named import and global installation. It creates its graph only during a playback and destroys it after completion, cancellation, deactivation or unmount. Module changes require remounting. `settled` reports progress; callers establish a normal CSS terminal state before graph removal.
- Idle placeholder controls and idle/open dialogs allocate no animation filter DOM or per-filter listeners. Placeholder focus/blur creates the graph from its previous state; quick reversal retains the active graph/progress. Occupied fields, reduced motion and inactive content do not allocate a graph.
- Dialog creation occurs only after close approval and loading completion. Zero-duration/reduced-motion/hidden-page exits skip allocation. Completion holds the target transparent with CSS while restoring its original filter and releasing the graph; cancellation restores opacity/filter/inert state and invalidates pending graph creation. The mask never receives the filter.
- Animation definitions may be shared; mutable nodes/playback state remain independent. Static filter sharing continues through the existing `svgFilter` manager.
- Consumers already owning a lazy playback lifecycle may mount the shared internal graph directly. Placeholder uses this path and the dissolve module's `padded-text` region; the public controller and dialog adapters retain their existing lifecycle and regions.

## Verification

- Nine focused lifecycle/module/dialog/static-filter/installer test files: 77 tests passed. Seven existing control test files: 100 tests passed. The final public lazy-controller subset additionally passed 32 tests.
- Resource tests: 500 idle placeholders and 100 idle dialogs have zero particle graphs; waiting close approval has zero, approved close has one, completion returns to zero. Tests cover reversal, repeat assembly, owner destruction, listener removal, KeepAlive, SSR hydration, hidden pages and reduced motion.
- A custom blur declaration plays through the common engine independently of another instance, proving the engine is not coupled to particle-specific selectors or attributes.
- Component and Node typechecks plus targeted ESLint passed. Documentation source/API audit: 21 tests passed. Full documentation builds rendered 201 pages successfully.
- Browser on the Dialog page: idle/open particle filter counts 0; during close count 1, applied only to `.s-dialog-original`; after close count 0 and dialog removed. Textarea: idle 0, focused dissolve 1, completion 0 with opacity 0; after reassembly 0 with ordinary text. Code/Playground remained usable.
- Active large-area turbulence/filter rendering still incurs painting cost; this change removes idle resources, not active rasterization cost. Region bounds, durations and concurrent playbacks remain the relevant controls.
