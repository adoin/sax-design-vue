---
title: Changelog
description: Releases and changes in Sax Design Vue.
---

# Changelog

## Unreleased

## 2.8.1

- Restore model inference for Form items, validators and events, and include control IDs in dynamic slot types.


## 2.8.0

- Show short file extensions inside default File Manager SVG icons when no custom thumbnail matches.

- Add shared context-menu submenus; group File Manager criteria and direction under Sort.

- Refine File Manager controls, custom sorting menus, icons and extension thumbnails, toolbar replacement, tree files and hidden-entry controls.

- Reduce duplicate type declarations through shared component references, while retaining typed props, events, slots and instance methods.

- Add File Manager with a directory tree, breadcrumbs, virtual icon/list views, drag/drop, keyboard operations and configurable global behavior.
- Customize folder covers through a slot and file previews through extension/MIME renderers. Use asynchronous operation guards for persistence and confirmation.

## 2.7.0

Released October 21, 2026. Uses `sax-design-vue-iconify` 1.1.0.

- Register project SVG files with the `signSvgs` Vite plugin. Use names such as `lo-home` in Icon or other components' icon props, including dynamic values. File changes reload development pages automatically.
- Emit only referenced/safelisted local icons and share identical SVG data. IconPicker loads missing candidates through its configurable API instead of embedding a candidate SVG catalog. Internal control fallbacks remain available offline.
- Explain IconPicker network requirements, self-hosted Docker API deployment and fully offline application bundling.

See [Local SVG files](./icons/#local-svg-files).

## 2.6.1

Released October 20, 2026.

- Icon morphing uses `svg-morpheus-ts/core` 2.0.0.
- Newly added or removed native stroke contours draw/retract along their own paths. Filled artwork preserves geometry interpolation, compound contours and holes.
- Rapid target changes retain current geometry and composited paint without multiplying paths. Disappearing strokes stay transparent at the end of a stroke-to-fill transition.
- Existing `morph`, global `icon.morph`, duration and spring configuration remain available. Reduced motion still follows the system.

See [Icon usage](./icons/#morphing).

## 2.6.0

Released October 20, 2026.

- Added opt-in Icon morphing, including multicolor, alpha and linear/radial gradient interpolation, isolated SVG definitions and global configuration.
- Added local/global Tabs indicator visibility and placement configuration.
- Kept disappearing contours collapsed during spring overshoot and improved movement across the requested duration.

[Full release history](https://github.com/adoin/sax-design-vue/blob/main/CHANGELOG.md)
