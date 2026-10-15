# Component layout attribute audit

## Scope and findings

Reviewed explicit $attrs/attrs forwarding and inheritAttrs:false in public component SFCs, plus the normal fallthrough components and renderless exceptions. This is a focused attribute-ownership audit, not a guarantee about unrelated component behavior.

- Already fixed separately: Input root owns class/style while native attrs remain on input.
- Fixed the same native-element leak in Textarea, Checkbox, Radio, Switch, Slider, Verification Code and Image. They reuse the shared native-attrs filter and explicitly merge class/style into the public outer surface. Image keeps srcset/sizes and native image semantics; existing native event ownership is preserved.
- Restored discarded layout attrs on Select and Cascader visible triggers and on Images, Upload and Tab pane roots. Generated pane IDs and ARIA relationships keep precedence.
- Card, Table, Drawer, Dialog, Progress and Notice Bar already route attrs to their documented public surfaces. Icon/loading/visual-hidden use their actual root. Popper, Focus Trap and similar renderless/floating utilities have no ordinary layout surface and keep their dedicated configuration contracts.

## Verification

The new matrix mounts all 12 affected components, changes root class and inline margin after mount, and checks native data/ARIA remains separate for native-control wrappers. Tab pane identity is checked explicitly.

- Affected components and their existing interaction suites: 23 files, 208 tests passed.
- Date Picker, Time Picker, Time Select, Table Select and Input Number integration: 7 files, 68 tests passed.
- Full documentation audits: 4 files, 21 tests passed.
- Web and Vitest typechecks passed.

Total: 297 tests. No release or package version bump was made. CHANGELOG Unreleased records the class/style behavior correction; applications that deliberately styled an inner control through consumer class must account for the corrected root ownership.
