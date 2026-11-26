/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DomEventManager, LibLoader } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";
import icons from "./icons";

/**
 * Editor of the textareas with data-wysiwyg (Wysiwyg field of austral/form-bundle), built on SunEditor.
 *
 * data-wysiwyg-options is the configuration of the field: "toolbar" (groups of [name, [buttons]]), "minHeight"
 * and "icons" (button => picto class). Their names are translated to SunEditor below. SunEditor and CodeMirror are
 * loaded by LibLoader only when a page has a wysiwyg field.
 */
export default class Wysiwyg extends abstractComponent {

  // Buttons of the field => buttons of SunEditor (null: no equivalent).
  static BUTTONS = {
    "undo": "undo",
    "redo": "redo",
    "bold": "bold",
    "italic": "italic",
    "underline": "underline",
    "strikethrough": "strike",
    "superscript": "superscript",
    "subscript": "subscript",
    "clear": "removeFormat",
    "ul": "list",
    "ol": "list",
    "paragraph": "align",
    "hr": "horizontalRule",
    "link": "link",
    // Link editor of the 3.1 admin (internal pages, emails, phones): not ported yet, the link of SunEditor is used.
    "austral-links": "link",
    "unlink": null,
    "codeview": "codeView",
    "fullscreen": "fullScreen",
    "showblocks": "showBlocks"
  };

  // Icons of the field => icons of SunEditor.
  static ICONS = {
    "undo": "undo",
    "redo": "redo",
    "bold": "bold",
    "italic": "italic",
    "underline": "underline",
    "strikethrough": "strike",
    "superscript": "superscript",
    "orderedlist": "list_number",
    "unorderedlist": "list_bullets",
    "minus": "horizontal_rule",
    "code": "code_view",
    "arrowsAlt": "expansion",
    "link": "link",
    "unlink": "unlink",
    "alignLeft": "align_left",
    "alignRight": "align_right",
    "alignCenter": "align_center",
    "alignJustify": "align_justify",
    "outdent": "outdent",
    "indent": "indent"
  };

  // Tags kept when pasting.
  static PASTE_TAGS = ["p", "ul", "ol", "li", "br", "b", "i", "u", "strong", "em", "span"];

  static initComponent() {
    super.initComponent("wysiwyg");
  }

  create(element) {
    super.create(element);
    this.initEditor();
  }

  /**
   * Loads SunEditor, then creates the editor on the textarea.
   *
   * @return {Promise<void>}
   */
  async initEditor() {
    const { SunEditor, plugins, lang, CodeMirror } = await LibLoader.suneditor();
    this.formContainer = this.element.closest("form");
    this.field = this.element.closest(".field");
    let options = {};
    try {
      options = this.element.dataset.wysiwygOptions ? JSON.parse(this.element.dataset.wysiwygOptions) : {};
    }
    catch(e) {
      options = {};
    }

    this.editor = SunEditor.create(this.element, {
      plugins: plugins,
      buttonList: Wysiwyg.buttonList(options.toolbar ?? []),
      icons: Wysiwyg.icons(options.icons ?? {}),
      codeMirror: CodeMirror,
      charCounter: true,
      height: "auto",
      minHeight: (options.minHeight ?? 150) + "px",
      addTagsWhitelist: "p|div|ul|ol|li|span|a|br|hr",
      attributesWhitelist: {
        "all": "lang|style|title|data-.+"
      },
      lang: lang[(document.documentElement.lang || "en").substring(0, 2)] ?? lang.en
    });

    this.editor.onChange = () => {
      this.element.value = this.editor.getContents();
      DomEventManager.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: true }, this.formContainer);
    };
    this.editor.onFocus = () => {
      this.field?.classList.add("focus");
    };
    this.editor.onBlur = () => {
      this.field?.classList.remove("focus");
    };
    this.editor.onPaste = (e, cleanData) => Wysiwyg.cleanPaste(cleanData);
  }

  /**
   * Toolbar of the field ([[group, [buttons]], ...]) => buttonList of SunEditor ([[buttons], ...]).
   */
  static buttonList(toolbar) {
    let buttonList = [];
    toolbar.forEach((group) => {
      let buttons = [];
      (Array.isArray(group) ? (group[1] ?? []) : []).forEach((name) => {
        let button = Wysiwyg.BUTTONS[name];
        if(button && !buttons.includes(button)) {
          buttons.push(button);
        }
      });
      if(buttons.length > 0) {
        buttonList.push(buttons);
      }
    });
    return buttonList.length > 0 ? buttonList : [["undo", "redo"], ["bold", "italic", "underline"], ["list", "link"]];
  }

  /**
   * Icons of the field ({button: "austral-picto-name"}) => icons of SunEditor, with the pictos of icons.js.
   * A picto missing from icons.js keeps the icon of SunEditor.
   */
  static icons(fieldIcons) {
    let result = {
      expansion: icons["maximize"],
      reduction: icons["minimize"],
      show_blocks: icons["content-left"]
    };
    Object.entries(fieldIcons).forEach(([name, pictoClass]) => {
      let key = Wysiwyg.ICONS[name];
      let picto = String(pictoClass).replace(/^austral-picto-/, "");
      if(key && icons[picto]) {
        result[key] = icons[picto];
      }
    });
    return result;
  }

  /**
   * Keeps only the tags of PASTE_TAGS, without their attributes.
   */
  static cleanPaste(html) {
    return String(html).replace(/<(\/?)(\w*)[^>]*>?/gm, (match, slash, tag) => {
      return Wysiwyg.PASTE_TAGS.includes(tag.toLowerCase()) ? "<" + slash + tag.toLowerCase() + ">" : "";
    });
  }

}
DomEventManager.addListener("component::initialize", () => {
  Wysiwyg.initComponent();
});
