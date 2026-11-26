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

export default class Counter extends abstractComponent {

  static initComponent() {
    super.initComponent("counter");
  }

  create(element, elementEvent) {
    this.element = element;
    this.maxCharacters = this.element.dataset.counterInitial;
    if(this.element.dataset.counterKeyup) {
      this.elementEvent = document.querySelector(this.element.dataset.counterKeyup);
      if(this.elementEvent) {
        this.count();
      }
    }
  }

  addEventListener() {
    super.addEventListener();
    if(this.elementEvent) {
      DomEventManager.addListener(["keyup", "keydown"], () => {
        this.count();
      }, this.elementEvent);
    }
  }

  count() {
    let value = this.elementEvent.value;
    let diff = this.maxCharacters-value.length;
    this.element.querySelector(".counter").innerText = diff;
    if(diff < 0)
    {
      this.element.classList.add("is-negative");
    }
    else
    {
      this.element.classList.remove("is-negative");
    }
  }
}
DomEventManager.addListener("component::initialize", () => {
  Counter.initComponent();
});
