import autosize from "autosize";
import CodeMirror from 'codemirror'
import SunEditor from "suneditor";
import plugins from 'suneditor/src/plugins';
import australLink from '../../../vendor/javascript/sunEditor/austral-link';

import lang from 'suneditor/src/lang';
import abstractField from "./abstract";

export default class Textarea extends abstractField {

  static initComponent() {
    Debug.log("-- Component Initialise : textarea");
    [].forEach.call(document.querySelectorAll("textarea"), (el) => {
      if(el.getAttribute("data-component-uuid") === undefined || el.getAttribute("data-component-uuid") === null)
      {
        let object = new this(el, "textarea");
      }
    });
  }

  create(element) {
    super.create(element);
    if(this.element.dataset.wysiwyg !== undefined) {
      plugins["australLink"] = australLink;
      this.editor = SunEditor.create(this.element,{
        plugins: plugins,
        charCounter:  true,
        codeMirror: CodeMirror,
        height: "auto",
        minHeight: 150,
        buttonList: [
          ['undo', 'redo'],
          ['bold', 'underline', 'italic', 'strike', 'superscript'],
          ['removeFormat'],
          ['outdent', 'indent'],
          ['horizontalRule', 'list', "australLink"],
          ['fullScreen', 'showBlocks', 'codeView'],
        ],
        "icons": {
          "undo": '<span class="austral-picto-corner-rearward"></span>',
          "redo": '<span class="austral-picto-corner-forward"></span>',
          "bold": '<span class="austral-picto-bold"></span>',
          "underline": '<span class="austral-picto-underline"></span>',
          "italic": '<span class="austral-picto-italic"></span>',
          "strike": '<span class="austral-picto-strike"></span>',
          "subscript": '<span class="austral-picto-inferior"></span>',
          "superscript": '<span class="austral-picto-superior"></span>',
          "outdent": '<span class="austral-picto-indent-less"></span>',
          "indent": '<span class="austral-picto-indent-more"></span>',
          "horizontalRule": '<span class="austral-picto-minus"></span>',
          "list_number": '<span class="austral-picto-list-ol"></span>',
          "list_bullets": '<span class="austral-picto-list-ul"></span>',
          "expansion": '<span class="austral-picto-maximize"></span>',
          "reduction": '<span class="austral-picto-minimize"></span>',
          "show_blocks": '<span class="austral-picto-content-left"></span>',
        },
        lang: lang.fr
      });

      this.editor.onChange = () => {
        this.element.value = this.editor.getContents();
        MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: true}, this.formContainer);
      };

      this.editor.onPaste = (e, cleanData, maxCharCount, core) => {
        let regex = /<(\/|)(\w{0,})[^>]*>?/mi;
        let m;
        let tagsAccepted = ["p", 'ul', 'ol', 'li', 'br', 'b', 'i', 'u', 'strong', 'em'];
        while ((m = regex.exec(cleanData)) !== null) {
          let replace = "";
          if(tagsAccepted.includes(m[2]) === true){
            replace = "__AUSTRAL_TAG_START__"+m[1]+m[2]+"__AUSTRAL_TAG_END__";
          }
          cleanData = cleanData.replace(m[0],replace);
        }
        cleanData = cleanData.replaceAll("__AUSTRAL_TAG_START__", "<");
        cleanData = cleanData.replaceAll("__AUSTRAL_TAG_END__", ">");
        return cleanData;
      }
    }
    else {
      autosize(this.element);
    }

  }
}