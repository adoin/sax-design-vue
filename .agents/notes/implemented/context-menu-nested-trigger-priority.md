---
status: implemented
recorded_at: 2026-10-09
scope:
  - packages/components/context-menu
---

# Nested Context Menu trigger priority

- A trigger event belongs to the nearest enabled Context Menu wrapper in its bubbling path.
- Successful `show()` calls prevent the native context menu and stop propagation before opening, so enclosing Context Menus do not also open for that event.
- Right-click, the context-menu key, and Shift+F10 share this rule. Right-clicking an enclosing region outside its nested wrapper still opens that region's menu.
- Disabled wrappers do not claim the event; the nearest enabled ancestor may handle it. An already default-prevented event is not claimed by any wrapper.
- A document owns at most one active Context Menu session. A new pointer, keyboard, imperative or model-driven opening replaces the previous session, even across component roots.
- Replaced surfaces become visually hidden immediately while the shared Popper completes its teardown. Replacement closes without restoring focus to the old origin; ordinary closing retains its normal animation and focus behavior.
- Ownership is scoped by a weak Document key and released on closing, unmounting and deactivation. No second positioning layer or document event listener is introduced.

## Verification

The existing implementation was confirmed without runtime changes. All nine Context Menu tests passed, including three-level nested pointer/keyboard opening, enclosing regions, disabled-child fallback, prevented events, and existing focus/outside-close behavior. Test TypeScript and targeted ESLint checks passed.

## Documentation example

Added on 2026-10-10: English and Chinese `nested` examples show three visible nested regions, distinct menu actions, a disabled-inner switch, and last-opened/selected feedback. Source slots reconstruct complete localized SFCs. Both rendered locales and their Code/Playground surfaces were verified in the browser, including inner priority and disabled fallback. All 21 documentation checks and targeted ESLint passed.

## Consecutive-opening verification

The initial tests covered event bubbling, but not menus retained from separate opening events. The session contract now covers outer → middle → inner → outer without manually closing between triggers. Thirteen component tests verify pointer/keyboard replacement, old-focus suppression, cross-root and slotless imperative/model opening and owner cleanup alongside the existing nesting behavior. Browser verification confirmed one visible panel after each consecutive right-click, including replacement without a visible exit overlap. Paired documentation states the per-document mutual-exclusion policy.

## Cascading item submenus (2026-10-21)

- ContextMenuItem.children represents a submenu within the current session, distinct from independently nested trigger wrappers. Only enabled leaf items emit select; opening a parent does not execute an action.
- Each submenu uses shared SPopper positioning and Teleport with right-start placement, viewport flipping and inherited shape. No separate positioning engine or document event listener is added.
- Hover/click opens a branch; Right enters it, Up/Down/Home/End navigate enabled siblings, and Left/Escape return to its parent. Escape at the root and Tab dismiss the session. Leaf selection returns focus through parent triggers before the root restores the origin.
- Pointer transit has a short close delay, descendant activity cancels ancestor closing, and keyboard focus inside a submenu prevents premature hover closing. Teardown clears timers and removes child layers.
- File Manager uses a single Sort parent in its blank-content menu, with configured criteria and ascending/descending leaf items separated into groups.
- Verification: 39 tests pass across Context Menu and File Manager, including disabled-item navigation, keyboard entry/back, leaf-only selection, focus retention during mouseleave and custom comparator/direction selection. Source typing, scoped ESLint, 22 documentation checks, full library build, style entry verification and strict declaration consumer checks pass. Browser validation confirms the two visible levels and a successful descending-order selection. Public declarations remain 2,489,622 bytes in total.
