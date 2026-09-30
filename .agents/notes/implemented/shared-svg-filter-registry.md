---
status: implemented
kind: project-specification
completed_at: 2026-09-30
modules:
  - packages/utils/svg-filter
  - packages/hooks/use-svg-filter
  - packages/components/card
  - packages/components/tag
  - docs/guide/configuration.md
  - docs/zh/guide/configuration.md
---

# Shared SVG filter registry

## User request

> 他们都是固定的还是动态的，是否可能重复创建，我感觉需要全局有一个svgFilter生成管理工具，用到的组件都会唤起这个工具，当发现已经有需要用到的svgFilter的时候就直接应用，没有再创建

## Contract

- `defineSvgFilter` creates an immutable descriptor snapshot. `svgFilter.acquire` and `useSvgFilter` share one graph for the same key, attributes, primitive tree, and scope. Attribute insertion order and numeric/string representations do not create duplicate definitions.
- The registry lives on its owning Document under a versioned Symbol.for key so multiple Vue applications and imported copies share one pool. Each HTML document, including iframes, remains independent. Definitions live in a zero-size, noninteractive SVG outside component roots.
- Card liquid-glass, Card liquid-glass-2, and Tag mark/arrow/flag use the same three existing graphs. Their parameters and graph wiring are preserved. Static built-ins stay cached across consumer unmounts; repeat consumers reuse the same native nodes.
- A shared definition is evaluated separately for each target's graphic and bounds. Sharing definitions does not cache rendered pixels or join independent animation timelines. Instance animation requires a document-unique scope; changing instance definitions should not be cached.
- Acquisition is reference-counted and release is idempotent. Noncached definitions disappear after their final release. `svgFilter.clearUnused(document?)` removes idle cached definitions while preserving those used by any application. External host detachment is repaired on the next acquisition.
- `useSvgFilter` updates its URL only after the graph exists, retains the previous lease until Vue patches consumers, and releases current and retired leases on unmount. Its public binding exposes id, url, ready, and element refs.
- SSR creates no browser registry and outputs CSS material/shadow fallback. Hydration starts with the same fallback and mounts SVG definitions afterward. Card's previous per-instance SSR IDs are superseded by deterministic definition IDs and progressive SVG enhancement.
- Public developer usage is documented in both Configuration guides. The manager and composable require no added application provider.

## Verification

- 60 manager, composable, Card, and Tag tests passed, including cache identity, parameters, independent scopes, multiple module imports, document isolation, DOM restoration, release, and SSR hydration.
- 21 documentation example tests, web and Vitest type checks, and complete library build passed.
- Browser: six shaped Tags shared one definition with six active references. Navigating to Card and back retained the same document, one pool, and three cached definitions; the two Card definitions became idle while the Tag graph had six consumers. Component roots contain no duplicate filter nodes.
- Declaration emission now reports its diagnostics explicitly. Three existing composite SFCs that exceeded TypeScript's serialization limit follow the build's established bounded declaration path, while their module API types remain exported.
