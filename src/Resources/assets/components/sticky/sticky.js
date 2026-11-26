/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DomEventManager } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

/**
 * Top bar reduced when the page is scrolled (the transitions are in styles/admin/components/_bandeau-top.scss).
 *
 *   <div class="bandeau-top-container" data-sticky-bandeau="">…</div>
 *
 * Past THRESHOLD pixels of scroll, the element gets the class "sticky" and the body "is-bandeau-sticky"; the class
 * "has-button-return" is set when the bar has a return button.
 */
export default class Sticky extends abstractComponent {

  static THRESHOLD = 60;

  static initComponent() {
    super.initComponent("sticky-bandeau");
  }

  create() {
    this.ticking = false;
    this.element.classList.toggle("has-button-return", this.element.querySelector(".button-return-top-container") !== null);
    this.update();
  }

  addEventListener() {
    super.addEventListener();
    window.addEventListener("scroll", () => {
      if (!this.ticking) {
        this.ticking = true;
        window.requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
      }
    }, {passive: true});
  }

  /**
   * @return {void}
   */
  update() {
    const sticky = window.scrollY > Sticky.THRESHOLD;
    this.element.classList.toggle("sticky", sticky);
    document.body.classList.toggle("is-bandeau-sticky", sticky);
  }
}
DomEventManager.addListener("component::initialize", () => {
  Sticky.initComponent();
});
