/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ASSETS = path.resolve(__dirname, "src/Resources/assets");

/**
 * Configures an Encore instance to build the sources of the design system.
 *
 * Only needed when a project builds the design system itself (to extend it or override its styles).
 * Otherwise, the compiled build shipped in src/Resources/public/build is used by the Twig functions
 * austral_design_styles() and austral_design_scripts().
 *
 * @param {object} Encore  The Encore instance (import Encore from "@symfony/webpack-encore").
 * @param {object} options
 * @param {boolean} [options.debug]         Logs of the design system (default: not production).
 * @param {boolean} [options.debugContext]  Adds the call site to the logs (default: false).
 * @param {string}  [options.themePath]     Folder of the project overriding the theme (default: assets/theme of the
 *                                          working directory): a file there replaces the file of the same path in
 *                                          src/Resources/assets/styles/theme.
 * @return {object} The Encore instance.
 */
export default function configureAustralDesign(Encore, options = {})
{
  const debug = options.debug ?? !Encore.isProduction();
  const debugContext = options.debugContext ?? false;
  const themePath = options.themePath ?? path.resolve(process.cwd(), "assets/theme");

  return Encore
    .enableSassLoader()
    .addAliases({
      // Listed before "@austral/design": the first matching alias wins, the first existing path is used.
      "@austral/design/styles/theme": [themePath, path.join(ASSETS, "styles/theme")],
      "@austral/design": ASSETS
    })
    .addPlugin(new webpack.DefinePlugin({
      __DEBUG__: JSON.stringify(debug),
      __DEBUG_CONTEXT__: JSON.stringify(debugContext)
    }));
}

export { ASSETS as assetsPath };
