# Upgrade from 3.1 to 4.0

## Requirements

- PHP 8.4 minimum
- Symfony 7.4
- symfony/ux-twig-component 2
- Node.js 22.18 minimum, only to build the design system in the project

## Update the dependencies

```diff
- "austral/design-bundle": "^3.1"
+ "austral/design-bundle": "^4.0"
```

All `austral/*` packages must be upgraded to `^4.0` at the same time. Register TwigComponentBundle if Flex does not:

```php
return [
    // ...
    Symfony\UX\TwigComponent\TwigComponentBundle::class => ['all' => true],
    Austral\DesignBundle\AustralDesignBundle::class => ['all' => true],
];
```

## Breaking changes

### Styles and scripts

The compiled build is still in the bundle (`bundles/australdesign/build` after `assets:install`), but it is included with the functions of the bundle: WebpackEncoreBundle and its build configuration are no longer needed.

```diff
  # config/packages/webpack_encore.yaml
  webpack_encore:
    builds:
-     austral-design: '%kernel.project_dir%/public/bundles/australdesign/build'
```

```diff
- {{ encore_entry_link_tags('austral', null, 'austral-design') }}
+ {{ austral_design_styles('austral-design-admin') }}

- {{ encore_entry_script_tags('austral', null, 'austral-design') }}
+ {{ austral_design_scripts('austral-design-admin') }}
```

| 3.1 entry | 4.0 entry |
|-----------|-----------|
| `austral` | `austral-design-admin` (administration), `austral-design` (front) |

### JavaScript

The global `window.Austral` (`Austral.Config`, `Austral.Config.page`) is removed. Build your scripts with the design system (see the README, "Building the design system") and import what you need:

```diff
- Austral.Config.getComponent('toast', key)
+ import { Config } from '@austral/design';
+ Config.getComponent('toast', key)
```

| 3.1 | 4.0 |
|-----|-----|
| `MiscEvent.addListener()`, `MiscEvent.dispatch()` | `DomEventManager.addListener()`, `DomEventManager.dispatch()` |
| `Austral.Config` / `ConfigMaster` | `Config` |
| `Austral.Config.page` | `admin.adminPage` (`import { admin } from '@austral/design/admin'`) |
| event `component::load.finish` | `component::initialize.finish` |
| event `page:init` | `page::init` (dispatched by the core; `page::init.first` on load) |
| attribute `data-keybord-shortcut` | `data-keyboard-shortcut` |

### Templates

The templates of 3.1 are removed: `@AustralDesign/Components/*`, `@AustralDesign/Guidelines/*` and `@AustralDesign/SVG/*`. Use the Twig components:

| 3.1 | 4.0 |
|-----|-----|
| `@AustralDesign/Components/Button/*` | `<twig:Austral:Button>`, `<twig:Austral:Buttons>` |
| `@AustralDesign/Components/Title/*` | `<twig:Austral:Title>` |
| `@AustralDesign/Components/Popin/*` | `<twig:Austral:Modal>` |
| `@AustralDesign/Components/Form/*` | form theme `@AustralDesign/Form/austral_layout.html.twig` |

The templates of the administration (avatar, tile, counter, notification, helper, language selector, loader, logo) are part of austral/admin-bundle 4.0.

### Form theme

The forms of austral/form-bundle 4 are rendered by the form theme of the bundle:

```yaml
# config/packages/twig.yaml
twig:
  form_themes: ['@AustralDesign/Form/austral_layout.html.twig']
```

### Pictos

The icon font `Austral-picto` is removed. Every picto of the font exists as an SVG file with the same name:

```diff
- <span class="austral-picto-check"></span>
+ <twig:Austral:Picto name="check" />
```

The classes `.font-austral-*` of the administration only keep their size.

### Root font size of the administration

The administration is still sized in `rem`, but the root follows the font size chosen by the user and the browser zoom: 1rem = 10px with the default font size (16px) up to 1440px of width, then up to 12px on wide screens. Sizes given in `px` in your styles do not follow these settings: prefer `rem`.

### Dark theme

The administration is dark with `body.dark`; with `body.auto` it follows the system (`prefers-color-scheme`). On the front, `body.dark-mode` enables the dark colors when the system prefers them.

### Wysiwyg

The editor reads the options of the Wysiwyg field of form-bundle (`data-wysiwyg-options`: `toolbar`, `minHeight`, `icons`). The link editor of 3.1 (internal pages, email, phone) and the variables plugin are not available yet: `austral-links` uses the link dialog of SunEditor.
