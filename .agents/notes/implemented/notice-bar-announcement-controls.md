# Notice Bar announcement controls

Status: implemented

## Contracts

- Preserve legacy content, closable, scrollable and duration APIs. Duration remains seconds, default 12; interval is milliseconds, default 3000.
- Multiple notices accept strings or NoticeBarItem objects. Visibility and active index support controlled and internal state. Navigation respects loop boundaries; automatic switching allows long content to finish a complete scrolling cycle.
- Scroll only actual overflow. Pause on hover, focus, manual pause, hidden documents, offscreen placement and deactivated owners. Reduced motion disables automatic motion and displays full text.
- Keep icon, prefix, suffix, actions, navigation and close controls fixed outside the text track. Links and clickable content retain native keyboard semantics.
- Clone only rendered DOM for the decorative marquee copy. Do not mount scoped Vue slot content twice. Copies are inert, hidden from assistive technology, have remapped SVG identifiers and do not join native forms.
- Timer, animation measurement, observers and document listeners are cleaned up with component lifetime.
- Counter alignment trims font metric whitespace when supported, with an optical fallback; navigation and content use centered flex layout.
- All ten examples are localized in English and Chinese, with complete synchronized Code and Playground sources and canonical English hashes.

## Verification

- Notice Bar component suite: 12 tests covering controlled state, timing, reading duration, pause/lifecycle, links, slots, overflow, reduced motion, SSR, safe DOM copies and instance preservation.
- Documentation audit: 21 tests passed. Full 201-page documentation build passed.
- Web and Vitest type checks and component ESLint passed.
- Browser verified navigation, pausing, actions, controlled visibility, localized Code/Playground and counter glyph trimming.
