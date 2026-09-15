# Motion system audit

Status: implemented

Date: 2026-09-15

## Scope

The theme and Vue component sources were audited against the installed
`transitions-dev` guidance. The audit covered CSS transitions, keyframes,
hard-coded timing and easing values, reduced-motion behavior, animation frame
cleanup, and JavaScript timers that coordinate with CSS motion.

## Contract

- Public motion primitives remain namespaced as `--sax-motion-*`. Do not add
  unnamespaced `--duration-*`, `--ease-*`, or similar global variables to the
  component library.
- Choose timings by interaction purpose. The shared scale exposes stagger,
  micro, quick, standard, medium, slow, emphasis, loop, and long durations,
  along with smooth-out, in-out, out, linear, and bounce easings.
- Never use `transition: all`. Enumerate only the properties that visually
  change. The legacy `--sax-transition-all` and `--sax-transition-ease` names
  remain for compatibility, but their values expand to an explicit safe set of
  paint/composite properties.
- Modal and prompt surfaces open over 250ms from `scale(0.96)` and close over
  150ms. Tooltip entry is quick, exit is micro, and its travel distance is 4px.
  Notification/toast entry uses the medium clock and a smooth-out easing.
- Loading loops, progress motion, countdown variants, and carousel travel may
  retain component-specific durations when no shared usage token matches.
  Never replace those values merely because a token has a nearby number.
- The base theme provides a global `prefers-reduced-motion: reduce` fallback for
  every `s-*` component and its pseudo-elements. Non-namespaced legacy motion
  hooks require their own local guard.
- JavaScript that waits for a CSS transition must read the corresponding CSS
  custom property and convert seconds or milliseconds correctly. Repeating
  timers and animation frames must be cancelled on scope disposal; one-shot
  frame settlement is allowed without a retained cancellation handle.
- Unreferenced keyframes are not retained.

## Regression protection

`packages/theme-chalk/__tests__/motion-contract.test.ts` rejects implicit
all-property transitions, suspicious multi-second interaction transitions,
missing global reduced-motion coverage, and missing usage-based motion tokens.

## Verification

- `pnpm run build:theme`
- `pnpm run typecheck:web`
- `pnpm run typecheck:vitest`
- `pnpm exec vitest run packages/theme-chalk/__tests__/motion-contract.test.ts packages/components/checkbox/__tests__/checkbox.test.ts packages/components/checkbox/__tests__/checkbox-group.test.ts packages/components/notification/__tests__/notification-loading.test.ts packages/components/select/__tests__/select-enhancements.test.ts packages/components/select/__tests__/select-pinning.test.ts packages/components/select/__tests__/tag-overflow.test.ts`
- Full component suite: 122 files / 1058 tests passed. The sole remaining
  failure is the pre-existing TableSelect named-slot forwarding case in
  `packages/components/table-select/__tests__/table-select.test.ts`.
