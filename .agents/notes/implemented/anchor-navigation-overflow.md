# Anchor navigation overflow

Vertical Anchor navigation owns a bounded SScrollbar with outside tracks in a transparent gutter. The automatic maximum follows the navigation top and viewport height; max-height accepts an explicit number or CSS size. Horizontal navigation retains its existing native horizontal layout.

Wheel and touch gestures in an overflowing directory remain owned by that nested scroll viewport, including its edges. They must not advance the page route-boundary intent. The draggable outside thumb provides manual access to every expanded entry without forcing the page's active heading into view.

The documentation outline passes its existing dynamically measured available height to Anchor and no longer creates a second native scroll region. Resize listeners and observer are cleaned up on unmount; window measurements retain a fallback when ResizeObserver is unavailable.

Verified: 21 Anchor tests; 21 documentation audits; web typecheck; theme build; 233-page docs build. Browser Button directory reached its bottom without moving the page and the outside thumb dragged it back to the top. Localized long-navigation examples include complete Code and Playground source.


## Content-fit rounding regression

A real documentation viewport measured scrollHeight=920 and clientHeight=919 while the intrinsic content height was 919.354px. This fractional rounding produced a nearly full-length thumb and only a subpixel scroll range. Do not treat an overflow of at most one CSS pixel as a useful custom scrollbar range. Both axes suppress the false track and restore it when real overflow returns.

Anchor scrolling content retains max-content height and its groups cannot flex-shrink. The scrollbar root uses natural height instead of inheriting 100% from the Anchor surface.

Verified in the original user tab: one-pixel range and zero tracks. A shorter viewport produced a 211px scroll range, moved the first group by the same amount, exposed the final API entries and left the page scroll unchanged. Anchor and Scrollbar suites: 28 tests passed; theme build and web types passed.


The vertical scrollbar grid permanently reserves its 10px outside gutter even when content fits and no bar is rendered. Content has 8px of end padding inside the painted surface. Browser checks with the example group both expanded and collapsed confirm all collapse buttons remain 8px inside the surface edge; removing the track must never widen content underneath the gutter.
