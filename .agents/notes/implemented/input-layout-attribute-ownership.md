# Input layout attribute ownership

Consumer class and style belong to SInput's root surface. They must never be blindly forwarded to its native input, where margin or width can separate the gray input surface from its wrapper shadow. Root class/style merge with existing generated classes and wrapClasses/wrapStyles.

The shared useAttrs hook excludes class/style from native attribute forwarding. Native and accessibility attributes, component-owned native props and input event behavior retain their previous ownership. Dynamic attribute updates must reach their intended element after mount.

Regression coverage mounts a parent that changes class, margin, name and data attributes, confirming root layout styles and native data/ARIA remain separate. Input, Input Number shape and date-trigger suites: 26 tests passed; web typecheck passed.
