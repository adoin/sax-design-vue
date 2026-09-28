## Changelog

### 1.1.1

- Added shared week-start and week-number rules for DatePicker, DatePanel, and Calendar, whole-week selection, current-period styling, and date-range hover previews.
- Added native email, URL, required, and pattern validation with Input/Form integration and localized messages.
- Added directional Radio dot motion, synchronized button backgrounds, and SVG contour/fill animation.
- Refined Checkbox mixed states and square logo loading, unified close artwork, clear-icon sizing, and loading cursors.
- Improved multiple-date tags, Input surfaces, breadcrumb overflow, Tabs rendering, Table workflows, and component alignment.
- Unified documentation API structure and scoped-slot types; supplied known icons automatically to Playground.
- Compatibility: DatePicker defaults to Monday as the first weekday. Set `start-day="0"` or global `firstDayOfWeek: 0` to retain Sunday-first calendars. The standalone Sidebar component has been removed. Prefer Tabs `render-mode` over its compatibility rendering flags.
- Companion package: `sax-design-vue-iconify@1.0.1` preserves the built-in `sax:close` icon during strict Vite transforms.

### 1.0.1

- Expanded Table editing, validation, selection, grouping, and renderer workflows.
- Added shared motion tokens, reduced-motion protection, and refined component transitions.
- Improved localized documentation, examples, built-in icons, and deployment behavior.

### 1.0.0

- First stable release of Sax Design Vue.
- Includes the Vue 3 component library, theme styles, TypeScript declarations, and Iconify integration.

### 0.0.1
