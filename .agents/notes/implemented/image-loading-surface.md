---
status: implemented
kind: project-specification
updated_at: 2026-10-16
completed_at: 2026-10-16
modules:
  - packages/components/images
  - packages/theme-chalk/src/images.scss
---

# Theme-aware Image loading surface

- SImage retains its semantic native image, reserved dimensions, native load/error events and customizable placeholder/error slots.
- Its default loading surface uses theme gray and subtle primary radial tints, a decorative bundled `cb:image` mark and a small static rail. A low-opacity diagonal light band animates only its transform; do not restore the fixed pale gray / bright white sweep in night mode or add SVG filters to loading grids.
- Reduced-motion preference removes the moving band. Load completion removes the placeholder and retains the existing image opacity reveal. The item's aria-busy reflects actual pending state, clearing on load or failure.
- Wrapper and failed-image backgrounds use theme surfaces as well so transitions do not expose a daytime rectangle in night mode.
- Verification: Image, Image Preview and color-token checks passed (3 files, 15 tests); Image's final five tests were rerun, including pending/load/new-source/error busy-state lifecycle and custom placeholder slots. Component web typecheck passed.
- In-app browser: held real image requests to inspect both themes, verified reduced-motion band removal, then resumed requests and confirmed all 19 images loaded with no remaining placeholders. Temporary request interception and cache settings were restored and the verification tab was closed.
