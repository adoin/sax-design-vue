# Anchor navigation overflow

Vertical Anchor navigation owns a bounded SScrollbar with outside tracks in a transparent gutter. The automatic maximum follows the navigation top and viewport height; max-height accepts an explicit number or CSS size. Horizontal navigation retains its existing native horizontal layout.

Wheel and touch gestures in an overflowing directory remain owned by that nested scroll viewport, including its edges. They must not advance the page route-boundary intent. The draggable outside thumb provides manual access to every expanded entry without forcing the page's active heading into view.

The documentation outline passes its existing dynamically measured available height to Anchor and no longer creates a second native scroll region. Resize listeners and observer are cleaned up on unmount; window measurements retain a fallback when ResizeObserver is unavailable.

Verified: 21 Anchor tests; 21 documentation audits; web typecheck; theme build; 233-page docs build. Browser Button directory reached its bottom without moving the page and the outside thumb dragged it back to the top. Localized long-navigation examples include complete Code and Playground source.
