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

## Verification

The existing implementation was confirmed without runtime changes. All nine Context Menu tests passed, including three-level nested pointer/keyboard opening, enclosing regions, disabled-child fallback, prevented events, and existing focus/outside-close behavior. Test TypeScript and targeted ESLint checks passed.
