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

export default class MultiUser extends abstractComponent {

  static initComponent() {
    super.initComponent("multi-user");
  }

  create(element) {
    this.element = element;

    DomEventManager.addListener("click", () => {
      this.element.classList.add('is-open');
    }, this.element.querySelector(".reduce-container"));

    DomEventManager.addListener("click", () => {
      this.element.classList.remove('is-open');
    }, this.element.querySelector(".content-button-close .button"));
  }

}
DomEventManager.addListener("component::initialize", () => {
  MultiUser.initComponent();
});
