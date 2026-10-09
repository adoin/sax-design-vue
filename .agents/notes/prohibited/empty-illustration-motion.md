---
status: prohibited
kind: prohibited-approach
recorded_at: 2026-10-09
scope:
  - packages/components/empty
reopen_only_if: The user explicitly requests a flat nonphysical illustration, independently looping flap motion, or typographic surprise symbols for a separate design.
---

# Empty flap motion and surprise symbols

## Evidence

- The user found the initial screen-space rotations/scaling inconsistent with rectangular planes in 3D and the movement too small to notice.
- After accepting the corrected geometry, the user rejected independent periodic flap phases as looking like random wind movement. They requested the three flaps opening together from a partly open pose and revealing an empty interior.
- The user rejected exclamation marks for surprise and requested luminous stars instead.

## Required alternative

- Project rigid 3D rectangles through the same camera as the box. Keep both hinge vertices fixed while edge lengths and right angles remain constant in world space. Paper thickness, creases and highlights follow the same geometry.
- Share one monotone opening progress across all flaps. Play once, then hold the fully open pose; never reset into a continuous flap loop.
- Use brief star glints with soft light after the box opens, then remove the animation nodes. Keep file/search content and typographic surprise bubbles out of the default illustration.
- Preserve image/image-size overrides, reduced motion and visibility/lifecycle pausing.
