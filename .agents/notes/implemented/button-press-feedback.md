# Button press feedback

- Button ripple modes preserve the button's own geometry: expand expands, reverse contracts, cut separates two light bands, ring expands a halo, and glow pulses a feathered light. Omitted ripple uses glow.
- Pointer activation starts immediately; keyboard activation starts at the center, including native click events whose button is -1. Disabled/loading buttons suppress feedback.
- Use contrast ink on solid surfaces and currentColor on light treatments. Keep the decoration beneath content, clipped to the root radius, and non-interactive.
- Animate transform/opacity on internal decoration only. Reduced-motion uses a short tint without spatial movement.
- Dispose on animation completion, timeout or unmount; cap concurrent effects at four. Use currentTarget for nested icon presses and cover the farthest corner.
- Verified utility geometry/lifecycle and Button input tests, bilingual example source checks, web/test types and theme build. Rendered document and Code/Playground include all five modes in both locales.
