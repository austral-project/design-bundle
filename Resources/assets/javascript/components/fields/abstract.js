/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import abstract from "./../abstract"

export default class abstractField extends abstract{

  static initComponent(componentName, callback = null) {
    super.initComponent(componentName, callback);
  }

  create(el) {
    this.formContainer = this.element.closest("form");
    this.element = el;
  }

  addEventListener() {
    super.addEventListener();
    this.fieldContent = this.element.closest(".field-content");
    this.field = this.element.closest(".field");

    MiscEvent.addListener("component::load.finish", ()=> {
      this.addEventListenerToChangeField();
    }, this.element);
  }

  addEventListenerToChangeField() {
    // abstract function
  }


}