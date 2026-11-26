# Austral Design

[![Version](https://img.shields.io/packagist/v/austral/design-bundle?label=version)](https://packagist.org/packages/austral/design-bundle)
[![CI](https://github.com/austral-project/design-bundle/actions/workflows/ci.yml/badge.svg?branch=4.x)](https://github.com/austral-project/design-bundle/actions/workflows/ci.yml)
[![PHP](https://img.shields.io/packagist/dependency-v/austral/design-bundle/php?version=4.x-dev)](https://packagist.org/packages/austral/design-bundle)
[![Symfony](https://img.shields.io/badge/symfony-7.4-black)](https://symfony.com/releases/7.4)
[![License](https://img.shields.io/github/license/austral-project/design-bundle)](LICENSE)

Design system of Austral: Twig components, form theme, styles and JavaScript of the front and of the administration.

> This bundle is part of [Austral](https://github.com/austral-project), a modular back office and CMS for Symfony.

## Requirements

- PHP 8.4 or higher
- Symfony 7.4
- symfony/ux-twig-component 2

Node.js is only needed to build the design system yourself (see [Building the design system](#building-the-design-system)).

## Installation

```bash
composer require austral/design-bundle
php bin/console assets:install
```

If you do not use Symfony Flex, register the bundle in `config/bundles.php`:

```php
return [
    // ...
    Symfony\UX\TwigComponent\TwigComponentBundle::class => ['all' => true],
    Austral\DesignBundle\AustralDesignBundle::class => ['all' => true],
];
```

## Usage

### Styles and scripts

The bundle ships its compiled build in `src/Resources/public/build`. Two entries are available:

| Entry | Content |
|-------|---------|
| `austral-design` | Styles and components of the front |
| `austral-design-admin` | The same, plus the styles and components of the administration |

```twig
<head>
  {{ austral_design_styles('austral-design') }}
  {{ austral_design_scripts('austral-design') }}
</head>
```

`austral_design_scripts()` renders deferred `<script>` tags; give other attributes as second argument (`{defer: false, type: 'module'}`). A file shared by two entries is rendered once per page.

The scripts need no inline code: the texts come from the attributes written by Twig. For example, a form of the administration asks for a confirmation before it is sent:

```twig
<form method="post" action="{{ url }}" data-confirm="{{ 'confirm.delete'|trans }}" data-confirm-yes="{{ 'confirm.yes'|trans }}" data-confirm-no="{{ 'confirm.no'|trans }}">
```

### Twig components

```twig
<twig:Austral:Button entitled="Save" theme="solid" color="primary" />
<twig:Austral:Picto name="check" />
<twig:Austral:Modal modalId="confirm">...</twig:Austral:Modal>
```

Components: `Austral:Button`, `Austral:Buttons`, `Austral:Link`, `Austral:Modal`, `Austral:Pagination`, `Austral:Picto`, `Austral:Picture`, `Austral:Spacer`, `Austral:Text`, `Austral:Title`, `Austral:Form` and its fields (`Austral:Form:Row`, `Austral:Form:Label`, `Austral:Form:Fields:*`).

The pictos are the SVG files of `src/Resources/public/austral-picto`. To add folders, override the parameter `austral_design.picto`:

```yaml
# config/services.yaml
parameters:
  austral_design.picto:
    path: ['%kernel.project_dir%/assets/pictos', '%kernel.project_dir%/vendor/austral/design-bundle/src/Resources/public/austral-picto']
    formats: ['svg']
    default: 'circle-help'
```

The default values of the components (sizes, themes, colors) are the parameter `austral_design.component_default_value`.

### Form theme

The form theme renders the forms of [austral/form-bundle](https://github.com/austral-project/form-bundle) (fieldsets, groups, modals, upload, collections, wysiwyg) with the components:

```yaml
# config/packages/twig.yaml
twig:
  form_themes: ['@AustralDesign/Form/austral_layout.html.twig']
```

## Building the design system

To change the sources (`src/Resources/assets`) of the bundle, rebuild the compiled build and commit it with your change: the CI checks that the build matches the sources.

```bash
npm ci
npm run build     # src/Resources/public/build
npm run icons     # after a change of the pictos used by the editor
```

A project can also build the sources itself, to extend the components or override the theme, with the helper `encore.mjs`:

```js
// webpack.config.mjs of the project
import Encore from "@symfony/webpack-encore";
import configureAustralDesign from "./vendor/austral/design-bundle/encore.mjs";

configureAustralDesign(Encore, { debugContext: false })
  .setOutputPath("public/build/")
  .setPublicPath("/build")
  .addEntry("app", "./assets/app.js")
  .enableSingleRuntimeChunk();

export default Encore.getWebpackConfig();
```

```js
// assets/app.js
import "@austral/design/styles/app.scss";
import { Loader } from "@austral/design";

window.addEventListener("DOMContentLoaded", () => Loader.initialize());
```

The dependencies of the design system (`package.json` of the bundle) must be installed in the project: `npm install ./vendor/austral/design-bundle`. A file of `assets/theme` replaces the file of the same path in `src/Resources/assets/styles/theme`.

## Customize the administration in a project

The administration (admin-bundle) loads the entry `austral-design-admin` of the build read by
`austral_design_styles()` and `austral_design_scripts()`: the build of the bundle by default. To add components,
scripts or styles, or to change the theme, the project builds the design system itself with its own additions, and
gives its build to the bundle. There is then one design system in the page: the components of the project extend
`abstractComponent`, use `Config` and the hooks.

1. Install the sources of the bundle as a local npm package, with their dependencies. `install-links=true` makes npm
   install it as a package (a linked folder would not get its dependencies: SunEditor, choices.js, SweetAlert2…):

   ```ini
   # .npmrc of the project
   install-links=true
   ```

   ```json
   // package.json of the project
   "devDependencies": {
     "@austral/design": "file:vendor/austral/design-bundle",
     "@symfony/webpack-encore": "^7.2.0",
     "sass": "^1.80.0",
     "sass-loader": "^17.0.0"
   }
   ```

2. Write the entry of the administration: the one of the bundle, then the files of the project.

   ```js
   // assets/admin.js
   import "@austral/design/entries/admin";   // styles and components of the administration
   import "./admin/preview";                  // components of the project
   import "./admin/admin.scss";               // styles of the project
   ```

   ```js
   // assets/admin/preview.js
   import { DomEventManager } from "@austral/design";
   import abstractComponent from "@austral/design/core/abstract/abstractComponent";

   export default class Preview extends abstractComponent {
     static initComponent() {
       super.initComponent("preview");   // elements with data-preview
     }
     create() {}
   }
   DomEventManager.addListener("component::initialize", () => Preview.initComponent());
   ```

   A component of the page is reached with `Config.getComponentByElement("toggle", element)` or
   `Config.getComponentsByType("toast")`.

3. Build it with the helper `encore.mjs`, under the name `austral-design-admin`. A file of `assets/theme` overrides
   the file of the same name of `styles/theme` (colors of the light and dark modes).

   ```js
   // webpack.config.mjs
   import Encore from "@symfony/webpack-encore";
   import configureAustralDesign from "@austral/design/encore";

   configureAustralDesign(Encore)
     .setOutputPath("public/build/")
     .setPublicPath("/build")
     .addEntry("austral-design-admin", "./assets/admin.js")
     .enableSingleRuntimeChunk();

   export default Encore.getWebpackConfig();
   ```

4. Give the build to the bundle:

   ```yaml
   # config/packages/austral_design.yaml
   austral_design:
     build: '%kernel.project_dir%/public/build/entrypoints.json'
   ```

> **After an update of austral/design-bundle, build again** (`npm install && npm run build`): the build of the
> project contains the sources of the version it was built with.

## Documentation

The guides and the components are documented in the Storybook of the bundle (`storybook/`). The full documentation is available at https://austral.dev.

## Versions

| Bundle | Symfony | PHP | Branch |
|--------|---------|-----|---------|
| 4.x    | 7.4     | ≥ 8.4 | `4.x` |
| 3.1    | 5.4 / 6.4 | ≥ 8.0 | `3.1` (maintenance) |

See the [CHANGELOG](CHANGELOG.md) and, to upgrade from 3.1, [UPGRADE-4.0](UPGRADE-4.0.md).

## Contributing

Contributions are welcome: see the [contributing guide](https://github.com/austral-project/.github/blob/master/CONTRIBUTING.md). To report a security issue, follow the [security policy](https://github.com/austral-project/.github/blob/master/SECURITY.md).

## License

MIT, see [LICENSE](LICENSE).

## Credits

Created by [Matthieu Beurel](https://www.mbeurel.com). Sponsored by [Yipikai Studio](https://yipikai.studio).
