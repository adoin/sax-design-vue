# Tabs label-extra slot

STab label-extra appends arbitrary content after the default label/icon/badge and before the editable pane close button. The equivalent shared STabs slot receives pane, active and value and overrides pane-local content. The existing label slot remains a full-label replacement.

The slot renders in a sibling span beside the role=tab button, never inside that button. Tabs supplies no X, clear, selection-count, or other business action. Common bubbling click, pointer, mouse, keyboard, input/change, focus, touch, drag/drop and wheel events stop at the suffix boundary; native defaults are not prevented. The caller's own handlers and controls retain their behavior.

Overflow sizing uses live suffix widths plus cached widths for hidden panes. It must not mount duplicate interactive slot content in the hidden measurement rail. The public TabLabelExtraSlotParams type is exported and STab slots are typed.

Verified with 24 Tabs tests including independent child handling, no ancestor callback and defaultPrevented=false. Web and Vitest types passed. Both localized examples, complete Code sources and Playground previews were inspected; full documentation build rendered 233 pages. The example closable Tag is caller-provided content, not a Tabs feature.

Not published as a new package version.
