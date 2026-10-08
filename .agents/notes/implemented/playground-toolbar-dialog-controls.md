---
status: implemented
kind: project-specification
updated_at: 2026-10-08
---

# Playground dialog toolbar controls

- The Playground toolbar renders Copy, Minimize and Close in one flex row. The compact controls form a group, including in the mobile stacked toolbar.
- Minimize calls the existing `SDialog.minimize()` expose. The dialog retains its native minimization/dock/restore/lifecycle behavior; its separate absolute minimize button is hidden only inside the Playground-specific surface.
- Minimized bubble labels identify the Playground example. Its inner focus trap is released while minimized, restored on restore, and closed on dismissal. Edited source persists through minimization/restoration.
- The containing SDialog owns dialog semantics; the inner content section does not introduce a second dialog role.
- Both locales provide an accessible name for the toolbar's minimize action. Copy and Close continue their existing behavior.

## Verification

- Browser: Copy, Minimize and Close centers all measured at y=56px, with 6px gaps. No floating minimize action overlapped Copy.
- Browser: minimized Playground released body scroll locking and allowed focus in the documentation search; the dock restored it.
- Browser: an edited source marker survived minimize/restore; close and Code dialog remained usable.
- Documentation example/API audit: 21 tests passed. Production documentation build rendered all 201 pages successfully. Targeted ESLint passed.
