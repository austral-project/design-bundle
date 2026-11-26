# Changelog

All notable changes to this bundle are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). All Austral bundles share the same major and minor version.

## [Unreleased]

### Added

- Twig components (symfony/ux-twig-component): `Austral:Button`, `Austral:Buttons`, `Austral:Link`, `Austral:Modal`, `Austral:Pagination`, `Austral:Picto`, `Austral:Picture`, `Austral:Spacer`, `Austral:Text`, `Austral:Title`, `Austral:Form` and its fields
- Form theme `@AustralDesign/Form/austral_layout.html.twig`, rendering the view of austral/form-bundle 4 (fieldsets, groups, modals, upload, collections, wysiwyg)
- Compiled build shipped in `src/Resources/public/build`, with the entries `austral-design` (front) and `austral-design-admin` (administration), and the Twig functions `austral_design_styles()` and `austral_design_scripts()`
- npm package `@austral/design` (`package.json` of the bundle): JavaScript core (`Config`, `Loader`, `DomEventManager`, hooks, modules, components) and styles
- `encore.mjs`: configures a Webpack Encore build of the sources in a project; a file of `assets/theme` overrides the theme
- Option `austral_design.build`: the entrypoints.json read by `austral_design_styles()` / `austral_design_scripts()` (the build of the bundle by default), for a project that builds the design system with its own components and styles; the entries are exported (`@austral/design/entries/admin`)
- Wysiwyg editor (SunEditor) for the textareas with `data-wysiwyg`, configured by `data-wysiwyg-options` of form-bundle; SunEditor, CodeMirror and Cropper.js are loaded on demand (`LibLoader::suneditor()`, `LibLoader::cropper()`)
- Components of the administration taken from 3.1, in `components/` and on `abstractComponent` without gsap: `aside`, `collapse`, `search`, `sticky`, `tab`, `toast`, `toggle` (accessible: `aria-expanded`, `aria-controls`, roles of the tabs, keyboard); field behaviours `counter`, `refresh-value`, `view-by-choice`; the theme `auto`, the keyboard shortcuts (`data-keyboard-shortcut`) and the flash messages in the modules `Page`, `Keyboard` and `AlertSwal`
- Component `confirm`: a form with `data-confirm` (texts of the buttons in `data-confirm-yes` / `data-confirm-no`) is sent only after the confirmation popup of AlertSwal, without inline script
- CI job checking that the compiled build matches the sources (`npm run build:check`)
- Storybook of the components and guides (`storybook/`)

### Changed

- The services are defined explicitly (no autowiring); the components are private services tagged `twig.component`
- The pictos are the SVG files of `src/Resources/public/austral-picto`, rendered by `Austral:Picto` (the icon font `Austral-picto` is removed)
- The components of the administration (actions, aside, collapse, context menu, counter, cropper, delete, guideline, multi-user, refresh value, search, sticky header, tab, toast, toggle, view by choice) are ported on the JavaScript core
- The dark theme of the administration is `body.dark` (`body.auto` follows the system)
- The root font size of the administration follows the font size chosen by the user and the browser zoom (WCAG 1.4.4): 1rem = 10px with the default font size, growing up to 12px on wide screens
- The build uses Webpack Encore 7 and requires Node.js 22.18 or higher

### Fixed

- Keyboard shortcuts read `data-keyboard-shortcut`, the attribute written by list-bundle (3.1 read `data-keybord-shortcut`)

### Removed

- The templates of 3.1 (`Components/*`, `Guidelines/*`, `SVG/*`) and the popin, replaced by the Twig components
- The global `window.Austral` of 3.1: import from `@austral/design`
- The build configuration for WebpackEncoreBundle (`webpack_encore.builds`)

## [3.1.0] - 2022-02-10

- Adding Collapse components
- Adding Tab components
- Changed link selection for component blocks and wysiwyg
- Fix multi bug in the templates, scss and javascript

## [3.0.0] - 2021-02-10

- Created new repository and new branch in to Github
- Changed the project License to the MIT
- Writing and publish documentation
- Add to Packagist Service for installation with composer

## 2.x and 1.x

These versions were not open source and have no public documentation.

[Unreleased]: https://github.com/austral-project/design-bundle/compare/v3.1.3...4.x
[3.1.0]: https://github.com/austral-project/design-bundle/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/austral-project/design-bundle/releases/tag/v3.0.0
