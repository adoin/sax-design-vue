# Semantic visual enum defaults

The 2026-10-15 user instruction supersedes earlier public canonical `default` style names. Omitted props resolve to concrete names; labels annotate the actual option as “Name (default)” / “名称（默认）”. Do not add a separate Default option or new generic default enum member.

Canonical names:
- Button: type solid, loadingType logo, size medium, ripple glow (other ripple modes expand/reverse/cut/ring).
- Card: type basic, texture solid, effect none. Named presets and numeric aliases retain their layouts.
- Avatar/Tooltip geometry: rounded. Shared control sizes: small/medium/large.
- Countdown effect static; Images hover none; Loading type logo; Link underlineEffect plain.
- Navbar density comfortable; Progress texture none; RadioGroup type radio.
- Tag variant/tagStyle filled; Text effect none; VerificationCode status neutral; Divider color neutral.
- Tabs, Steps and Tag sizes use medium; Drawer accepts medium for the existing 360px preset; DatePicker icon trigger field names its normal trigger.

Old default literals are compatibility aliases. Public exported canonical option lists omit them. The visual enum adapter maps concrete names to existing private CSS/animation keys, preserving appearance and old selectors; it must leave undefined and inherited object properties intact. Shared size resolution keeps local/global precedence.

Update runtime declarations, public types, localized metadata, examples and Code/Playground sources together. Default slot names and ordinary JS default keys are unrelated to visual enum values.

Verification: 198 package test files / 1817 tests passed; web and test type checks; Table type project; 233-page documentation build; localized source audit. Library build completed. During release checks, virtual measurement key reads were deferred until parent updates settle; bounded source-read assertions are relative to the mounted viewport. Repeated regression includes source shrink without stale key access.
