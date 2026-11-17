/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Austral = require("./austral.config");
module.exports = Austral.generateEncore()
  .getEncore()
  .enableVersioning(true)
  .getWebpackConfig();
module.exports["resolve"]["symlinks"] = false;
module.exports["output"]["library"] = "Austral";