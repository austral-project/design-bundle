/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Build of the design system shipped with the bundle (src/Resources/public/build).
// Rebuild with "npm run build" after any change in src/Resources/assets: the CI checks that the build is up to date.

import Encore from "@symfony/webpack-encore";
import configureAustralDesign from "./encore.mjs";

if(!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || "production");
}

configureAustralDesign(Encore)
  .setOutputPath("src/Resources/public/build/")
  .setPublicPath("/bundles/australdesign/build")
  .setManifestKeyPrefix("build/")
  .addEntry("austral-design", "./src/Resources/assets/entries/front.js")
  .addEntry("austral-design-admin", "./src/Resources/assets/entries/admin.js")
  .splitEntryChunks()
  .enableSingleRuntimeChunk()
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
  .configureBabelPresetEnv((config) => {
    config.useBuiltIns = false;
  });

export default Encore.getWebpackConfig();
