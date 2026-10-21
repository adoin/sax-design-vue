---
status: implemented
kind: project-specification
updated_at: 2026-10-21
completed_at: 2026-10-21
modules:
  - packages/components/file-manager
  - docs/components/file-manager.md
  - docs/zh/components/file-manager.md
---

# File Manager Explorer interaction contract

- Public component: SFileManager. Flat FileManagerEntry[] with stable string/number IDs, parentId null at root, folder/file kinds. User data is controlled; mutation planners never edit incoming records.
- A shared full-width top navigation puts back/forward/up above the left tree; the existing SBreadcrumb follows on the right. Below it, a virtualized folder tree and file content share the available height.
- SVirtualList virtualizes rows in icon and list modes. Grid columns derive from observed viewport width and tile size; a stable entry anchors zoom/reflow. Selection is independent of mounted rows.
- Shared operation planner validates renaming, subtree deletion, move/copy, new folders, destination names, permissions and cycles. Async beforeOperation can cancel or persist changes; concurrent/stale mutations never overwrite replacement data.
- Internal drag sources can move to folder tiles, the tree, content backgrounds or breadcrumbs. Hover expands tree destinations. Cross-instance/OS uploads are application integrations, not silent filesystem mutations.
- Folder covers use a scoped slot. Arbitrary file extensions/MIME/predicates use ordered VNode renderers; do not add per-extension slots or embed candidate icon catalogs.
- Data-driven context menus, selection modifiers, rename/delete, clipboard, navigation, wheel zoom and grid/list view have documented contracts. Local behavior merges over fileManager global configuration; shape uses the shared hook and propagates to controls/menus.
- Public documentation stays developer-facing and paired in English/Chinese. Each rendered example has complete Code and Playground sources.

## Verification

- [x] 43 tests pass across File Manager (18), Virtual List and Context Menu; covers all three drop targets, async rejection/staleness, clipboard, keyboard input isolation, range selection across unmounted rows and 100,000-file mounting.
- [x] Web typing, scoped ESLint and all 22 documentation checks pass. A temporary consumer compiled against the actual generated package verifies props, events, slots, instance methods and rejection of invalid view values.
- [x] Full documentation build renders 239 pages. All three examples in both locales were checked through Code and Playground. Browser: a 10,000-file directory initially mounts 18 entries; End reveals item 10,000, and switching to list retains location. F2 renaming and context menus were also verified.
- [x] Library build passes, including 214 ESM/CJS style entries and 486 file references. File Manager uses its complete named public declaration rather than serializing internal child component inference; its inferred public declaration now follows the standard shared declaration pipeline (see compact-public-declarations.md). Public global component typing and both style entry modes are included.

## Toolbar, graphics and visibility refinement (2026-10-21)

- The default toolbar is name search plus one changing grid/list icon. No Select, sort-direction control or create/info buttons appear there. Search matches current-directory file and folder names only.
- The toolbar scoped slot replaces the entire row and exposes search/view state and setters/toggle, selection, directory, pending state, sorting and hidden visibility hooks.
- Blank-content context menus expose one Sort parent item; its submenu contains configured sort criteria and ascending/descending order. Custom comparators use stable name tie-breaking; foldersFirst remains independent. Custom menu factories can compose context.defaultItems.
- Home replaces visible root text; rootLabel remains an accessible label/tooltip. Folder closed/open graphics share the content folder color. Icons accept registered SIcon names or image sources.
- treeShowFiles optionally includes files. Entry thumbnail, normalized extension thumbnail, wildcard mapping and generic file glyph form the shared tree/content fallback order. Extension values may be SVG/PNG URLs or icon configurations.
- Files/folders support hidden metadata, dot-name compatibility and explicit false overrides. The eye in the history area controls both panes. Hide/unhide uses the shared operation planner, permissions.hide and async guard. Local options override global fileManager configuration.
- Verification: 25 File Manager tests pass including custom comparators, complete toolbar replacement, hidden operations, SVG/PNG thumbnail fallback and global/local precedence. All 22 documentation checks, source typing, scoped lint, full library build and 239-page documentation build pass. Both changed examples in both languages were checked through Code and Playground. Declarations total 2,488,377 bytes, largest 74,394 bytes; strict consumer fixtures also validate toolbar hooks and invalid sort directions.

## Short-extension fallback glyphs (2026-10-21)

- When no entry/extension/wildcard thumbnail or custom file icon is used, the default SVG includes a text node for a normalized extension of one or two Unicode code points. Longer extensions and extensionless names retain the plain file glyph. No raw SVG string interpolation is used.
- Tree, grid and list share the same glyph implementation. Existing custom preview renderers and graphic overrides retain priority; name/extension updates refresh the label.
- Verification: 26 File Manager tests cover both short Latin and Chinese extensions, long/absent extensions, tree/list parity, thumbnail precedence and renaming updates.
