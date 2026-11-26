/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { abstractField, DomEventManager, Debug } from "@austral/design";
import autosize from "autosize";
import Config from "@austral/design/core/Config";

export default class Textarea extends abstractField {

  static initComponent() {
    if (Config.isComponentDisabled("textarea")) {
      Debug.log("-- Component textarea is disabled, skipping initialization");
      return;
    }

    Debug.log("-- Component Initialise : textarea");
    [].forEach.call(document.querySelectorAll("textarea:not([data-wysiwyg])"), (el) => {
      if(el.getAttribute("data-component-uuid") === undefined || el.getAttribute("data-component-uuid") === null)
      {
        let object = new this(el, "textarea");
      }
    });
  }

  initialValueChange() {
    let currentValue = this.element.value;
    return this.initialValue !== currentValue;
  }

  create(element) {
    super.create(element);
    autosize(this.element);
    this.initialValue = this.element.value;
  }
}
DomEventManager.addListener("component::initialize", () => {
  Textarea.initComponent();
});
