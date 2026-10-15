# Select multiple value ordering

sortByOptionOrder resolves explicit local Boolean > global select.sortByOptionOrder > false. The optional local Boolean uses undefined internally to permit global inheritance. SConfigProvider and installation options share SelectGlobalConfig.

When enabled for multiple selection, model updates and change share the same sorted array. Existing controlled values, data-option reorder, bulk tools, removal and clearing use the same normalization. Data options include grouping, mapped option fields, virtual mode and pinned visual ordering. Declarative options use their registered order. Filtering does not remove values from the ordering domain. Values absent from current options remain at the end in their existing relative order; input arrays are never mutated. Object values retain the component's deep-equality matching behavior.

Primitive ordering uses a cached rank map; object values can fall back to deep matching. Sorting is opt-in and single Select values remain unchanged.

Verification: Select and ConfigProvider suites 50 tests passed; all 21 documentation audits passed; web and Vitest types passed; 233-page documentation build passed. Browser C/A/B clicks yielded c/a/b by default and a/b/c with local or inherited global sorting. Both localized examples, complete Code dialogs and Playground previews were inspected.

No release/version bump is included in this change.
