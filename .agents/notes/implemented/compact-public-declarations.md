---
status: implemented
kind: project-specification
updated_at: 2026-10-21
completed_at: 2026-10-21
modules:
  - internal/build/src/tasks/types-definitions.ts
  - packages/utils/vue
  - packages/components
---

# Compact public component declarations

- Use vue-tsc declaration emission so SFC contracts contain public props, events, slots and defineExpose members. Do not synthesize public types from compiled setup returns, and do not weaken complex components to bare DefineComponent or any.
- Reuse imported component types through SFCWithInstall<Component, Extra>. Preserve static children through the Extra generic rather than expanding their constructors in every barrel. Existing explicit generic business contracts, especially SaxTableComponent, remain authoritative.
- Derive aliases such as FileManagerComponent from the actual SFC instead of maintaining a parallel Vue DefineComponent signature.
- Declaration path normalization operates only on module specifiers. Preserve public string literal values, comments, CSS paths and .vue references; rewrite workspace aliases and entry-source directories to the actual published ESM tree.
- Clean only the verified build-owned declaration directories before emission; fail on compiler errors, duplicate output paths or leaked workspace references.
- Consume the built package in type regression fixtures, including positive and negative props/events/slots, static child components, exposed instance methods and the existing Table generic tests. Prevent size regressions with a 5 MB ESM declaration budget and a 250 KB per-file limit.

## Verification

- [x] Full library build passes, including its new declaration verification stage, 214 ESM/CJS style entries and 486 file references. Source/Table-generic and Node type checks pass.
- [x] Built-package strict consumer checks pass with skipLibCheck disabled: typed props/events/slots, negative-use rejection, private-state isolation, exposed methods, static children, Upload picker overloads and the existing Table generic fixtures. ESM and CJS declarations are identical.
- [x] All 11 path-normalization regressions, scoped ESLint, all 22 documentation example/API tests and the 239-page documentation build pass. The fixture explicitly includes the already-used web-bluetooth browser environment types; the dependency lockfile passes frozen validation.
- [x] ESM declaration count stays at 1,113. Size drops from 42,729,255 to 2,477,739 bytes (94.20%, 40,251,516 bytes saved); largest file drops from 1,435,183 to 74,394 bytes. TypeScript transpilation of all 93 modified component/utility TS sources produces identical runtime code (comments excluded). Generated bundle hashes are not used as a semantic-equivalence check because bundler identifier allocation can change.
