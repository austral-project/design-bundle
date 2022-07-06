import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/twig/twig';
var beautify_html = require('js-beautify').html;
import abstractComponent from "../abstract";

export default class Guideline  extends abstractComponent {

  static initComponent() {
    super.initComponent("guideline");
  }

  create(element) {
    this.element = element;
  }

  addEventListener() {
    super.addEventListener();
    this.element.addEventListener('component::aside.insert_finish', (el) => {
      this.initElement();
    });
  }

  initElement() {

    let html = this.element.innerHTML;
    this.element.innerHTML = null;
    var newDiv = document.createElement("div");
    newDiv.innerHTML = html;
    var text = newDiv.innerText.replace(/&quot;/g, '"');
    if(this.element.dataset.guidelineType !== "javascript")
    {
      text = text.replace(/></g, '>\n<');
      text = text.replace(/}last/g, '  }');
      text = beautify_html(text, {
        "indent_size": "2",
        "indent_char": " ",
        "max_preserve_newlines": "5",
        "preserve_newlines": true,
        "keep_array_indentation": true,
        "break_chained_methods": true,
        "indent_scripts": "normal",
        "brace_style": "collapse",
        "space_before_conditional": true,
        "unescape_strings": true,
        "jslint_happy": true,
        "end_with_newline": true,
        "wrap_line_length": "0",
        "indent_inner_html": false,
        "comma_first": true,
        "e4x": true,
        "indent_empty_lines": false
      });
    }

    CodeMirror(this.element, {
      value: text,
      theme: 'monokai',
      mode: this.element.dataset.guidelineType,
      htmlMode: true,
      lineWrapping: true,
      readOnly: true,
      lineNumbers: true,
      indentWithTabs: true,
      fixedGutter: true,
      tabSize: 2,
    });
  }

}