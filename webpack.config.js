const Austral = require("./austral.config");
module.exports = Austral.generateEncore()
  .getEncore()
  .enableVersioning(true)
  .getWebpackConfig();
module.exports["resolve"]["symlinks"] = false;
module.exports["output"]["library"] = "Austral";