/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config, Debug, DomEventManager, utils } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

export default class RefreshValue extends abstractComponent {

  static initComponent() {
    super.initComponent("refresh-value-by");
  }

  create(element, elementEvent) {
    this.element = element;
    if(this.element.dataset.refreshValueBy) {
      this.elementEvent = document.querySelector(this.element.dataset.refreshValueBy);
      this.changeValue()
    }
  }

  addEventListener() {
    super.addEventListener();
    if(this.elementEvent) {
      DomEventManager.addListener(["keyup", "keydown"], () => {
        this.changeValue();
      }, this.elementEvent);
    }
  }

  changeValue() {
    if(this.elementEvent) {
      if(this.elementEvent.value.length !== 0) {
        this.element.textContent = this.elementEvent.value;
      }
      else {
        this.element.textContent = this.element.dataset.defaultValue;
      }
    }
  }
}
DomEventManager.addListener("component::initialize", () => {
  RefreshValue.initComponent();
});
