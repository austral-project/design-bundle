class AustralConfig {

  constructor (Encore, merge, webpack, path) {
    this.config = {
      "outputPath":         "./Resources/public/build",
      "publicPath":         "/bundles/australdesign/build",
      "manifestPrefix":     "",
    }
    this.merge  = merge;
    this.Encore = Encore;
    this.path = path;
    this.webpack = webpack;

    if (!this.Encore.isRuntimeEnvironmentConfigured()) {
      this.Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
    }
  }

  setConfig(config)
  {
    this.config = this.merge(this.config, config);
    return this;
  }

  getEncore()
  {
    return this.Encore;
  }

  generateEncore() {

    this.Encore
      // directory where compiled assets will be stored
      .setOutputPath(this.config['outputPath'])
      // public path used by the web server to access the output path
      .setPublicPath(this.config['publicPath'])
      // only needed for CDN's or sub-directory deploy
      .setManifestKeyPrefix(this.config['manifestPrefix'])

      .addPlugin(new this.webpack.ProvidePlugin({
        MiscEvent: [ this.path.resolve("./Resources/assets/javascript/misc/Event.js"), "default"],
        MiscNodeSize: [ this.path.resolve("./Resources/assets/javascript/misc/NodeSize.js"), "default"],
        Alert: [ this.path.resolve("./Resources/assets/javascript/alert/Alert.js"), "default"],
        ConfigMaster: [ this.path.resolve("./Resources/assets/javascript/config/Config.js"), "default"],
        Tools: [ this.path.resolve("./Resources/assets/javascript/library/Tools.js"), "default"],
        Debug: [ !this.Encore.isProduction() ?
          this.path.resolve("./Resources/assets/javascript/debug/Debug.js") :
          this.path.resolve("./Resources/assets/javascript/debug/NoDebug.js"),
          "default"
        ]
      }))

      .addExternals({
        CodeMirror: 'codemirror',
      })
      .addEntry('austral', [
        this.path.resolve('node_modules', "codemirror/theme/monokai.css"),
        this.path.resolve('node_modules', "@vivid-web/flexboxgrid-sass"),
        this.path.resolve('node_modules', 'animate.css'),
        this.path.resolve('node_modules', 'codemirror/mode/htmlmixed/htmlmixed'),
        this.path.resolve('node_modules', 'codemirror/lib/codemirror.css'),
        this.path.resolve('node_modules', 'suneditor/src/assets/css/suneditor.css'),
        this.path.resolve('node_modules', 'suneditor/src/assets/css/suneditor-contents.css'),

        this.path.resolve('./Resources/assets/styles/admin.scss'),
        this.path.resolve('./Resources/assets/austral.js')
      ])

      .addAliases({
        "animation.gsap": this.path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
        "debug.addIndicators": this.path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
      })
      // will require an extra script tag for runtime.js
      // but, you probably want this, unless you're building a single-page app
      .enableSingleRuntimeChunk()
      /*
       * FEATURE CONFIG
       *
       * Enable & configure other features below. For a full
       * list of features, see:
       * https://symfony.com/doc/current/frontend.html#adding-more-features
       */
      .enableBuildNotifications()
      .enableSourceMaps(!this.Encore.isProduction())
      // enables hashed filenames (e.g. app.abc123.css)
      .cleanupOutputBeforeBuild()
      // enables Sass/SCSS support
      .enableSassLoader()
    ;
    return this;
  }

}
var  { merge } = require("webpack-merge");
module.exports = new AustralConfig(require('@symfony/webpack-encore'), merge, require('webpack'), require('path'));
