/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import abstractComponent from "./../abstract";

export default class MultiUser extends abstractComponent {

  static initComponent() {
    super.initComponent("multi-user");
  }

  create(element) {
    this.element = element;

    MiscEvent.addListener("click", () => {
      this.element.classList.add('is-open');
    }, this.element.querySelector(".reduce-container"));

    MiscEvent.addListener("click", () => {
      this.element.classList.remove('is-open');
    }, this.element.querySelector(".content-button-close .button"));
  }

}