/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
export default class LibLoader {

  static _gsap = null;
  static _loadedPlugins = {};
  static _pluginLoaders = {};

  /**
   * @returns {Promise<import("gsap").GSAPStatic>}
   */
  static async gsap() {
    if (!this._gsap) {
      const { gsap } = await import(/* webpackChunkName: "gsap" */ "gsap");
      this._gsap = gsap;

      // Enregistre tous les plugins déjà définis
      for (const [name, loader] of Object.entries(this._pluginLoaders)) {
        if (!this._loadedPlugins[name]) {
          const plugin = await loader();
          this._gsap.registerPlugin(plugin);
          this._loadedPlugins[name] = plugin;
        }
      }
    }
    return this._gsap;
  }

  static addGSAPPlugin(name, loader) {
    if (!this._pluginLoaders[name]) {
      this._pluginLoaders[name] = loader;
    }

    // Si GSAP est déjà chargé, on l’enregistre immédiatement
    if (this._gsap && !this._loadedPlugins[name]) {
      loader().then(plugin => {
        this._gsap.registerPlugin(plugin);
        this._loadedPlugins[name] = plugin;
      });
    }
  }

  static async loadGSAPPlugin(name) {
    if (!this._pluginLoaders[name]) {
      throw new Error(`Plugin GSAP "${name}" non déclaré`);
    }
    if (!this._loadedPlugins[name]) {
      const plugin = await this._pluginLoaders[name]();
      (await this.gsap()).registerPlugin(plugin);
      this._loadedPlugins[name] = plugin;
    }
    return this._loadedPlugins[name];
  }

  static async sweetalert() {
    if (!this._swal) {
      const { default: Swal } = await import(/* webpackChunkName: "sweetalert2" */ "sweetalert2");
      this._swal = Swal;
    }
    return this._swal;
  }

  static async clipboard() {
    if (!this._clipboard) {
      const { default: ClipboardJS } = await import(/* webpackChunkName: "clipboard" */ "clipboard");
      this._clipboard = ClipboardJS;
    }
    return this._clipboard;
  }

  static async intlTelInput() {
    if (!this._intlTelInput) {
      const [
        { default: intlTelInput },
        { default: utils },
        { fr, en }
      ] = await Promise.all([
        import(/* webpackChunkName: "intl-tel-input" */ "intl-tel-input"),
        import(/* webpackChunkName: "intl-tel-input-utils" */ "intl-tel-input/utils"),
        import(/* webpackChunkName: "intl-tel-input-i18n" */ "intl-tel-input/i18n")
      ]);
      this._intlTelInput = {
        "intlTelInput": intlTelInput,
        "utils": utils,
        "i18n": {
          "fr": fr,
          "en": en
        }
      }
    }
    return this._intlTelInput;
  }

  static async choices() {
    if(!this._choices)
    {
      const { default: Choices } = await import(/* webpackChunkName: "choices" */ "@austral/design/components/form/fields/select/base/choices");
      this._choices = Choices;
    }
    return this._choices;
  }

  static async librairieTimepicker()
  {
    if(!this._timepicker)
    {
      const { default: AustralTimepicker } = await import(/* webpackChunkName: "austral-timepicker" */ "@austral/design/libraries/AustralTimepicker");
      this._timepicker = AustralTimepicker;
    }
    return this._timepicker;
  }

  /**
   * SunEditor, its plugins, its languages and CodeMirror (source code view), with their styles: loaded only when
   * a page has a wysiwyg field (data-wysiwyg).
   *
   * @returns {Promise<{SunEditor: Object, plugins: Object, lang: Object, CodeMirror: Function}>}
   */
  static async suneditor() {
    if(!this._suneditor)
    {
      const [
        { default: SunEditor },
        { default: plugins },
        { default: lang },
        { default: CodeMirror }
      ] = await Promise.all([
        import(/* webpackChunkName: "suneditor" */ "suneditor"),
        import(/* webpackChunkName: "suneditor" */ "suneditor/src/plugins"),
        import(/* webpackChunkName: "suneditor" */ "suneditor/src/lang"),
        import(/* webpackChunkName: "codemirror" */ "codemirror"),
        import(/* webpackChunkName: "codemirror" */ "codemirror/mode/htmlmixed/htmlmixed"),
        import(/* webpackChunkName: "codemirror" */ "codemirror/lib/codemirror.css"),
        import(/* webpackChunkName: "suneditor" */ "suneditor/dist/css/suneditor.min.css")
      ]);
      this._suneditor = { SunEditor, plugins, lang, CodeMirror };
    }
    return this._suneditor;
  }

  /**
   * Cropper.js and its styles: loaded only when an image is cropped.
   *
   * @returns {Promise<Function>}
   */
  static async cropper() {
    if(!this._cropper)
    {
      const [{ default: Cropper }] = await Promise.all([
        import(/* webpackChunkName: "cropperjs" */ "cropperjs"),
        import(/* webpackChunkName: "cropperjs" */ "cropperjs/dist/cropper.css")
      ]);
      this._cropper = Cropper;
    }
    return this._cropper;
  }

  static async librairieDatepicker()
  {
    if(!this._datepicker)
    {
      const { default: AustralDatepicker } = await import(/* webpackChunkName: "austral-datepicker" */ "@austral/design/libraries/AustralDatepicker");
      this._datepicker = AustralDatepicker;
    }
    return this._datepicker;
  }

}
