/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { A11yHelpers, Debug, DomEventManager } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

/**
 * Side panel (slide and fade by a CSS transition, see _aside.scss; class "right" for the right side).
 *
 *   <button type="button" data-aside-container="#filters-aside" data-aside-insert='{"#filters-aside .content": "…"}'>Filters</button>
 *   <div id="filters-aside" class="aside-container" data-aside="">… <button type="button" data-aside-close>Close</button></div>
 *
 * The buttons [data-aside-container="#id"] open it (aria-expanded, aria-controls); data-aside-insert fills elements
 * of the page before the opening (selector => HTML written by the server). Escape, a click outside and the buttons
 * [data-aside-close] close it. The focus goes into the panel and back to its button.
 * Events: component::action.open / component::action.close (on the element), component::aside.insert_finish,
 * component::open.finish / component::close.finish.
 */
export default class Aside extends abstractComponent {

  static initComponent() {
    super.initComponent("aside");
  }

  create() {
    this.currentButton = null;
    this.buttons = this.element.id ? document.querySelectorAll("*[data-aside-container='#" + this.element.id + "']") : [];
    this.buttons.forEach((button) => {
      button.setAttribute("aria-controls", this.element.id);
      button.setAttribute("aria-expanded", "false");
    });
  }

  addEventListener() {
    super.addEventListener();
    DomEventManager.addListener("component::action.open", (event) => this.open(event.detail?.button ?? null), this.element);
    DomEventManager.addListener("component::action.close", () => this.close(), this.element);
    this.buttons.forEach((button) => {
      DomEventManager.addListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.isOpen() && this.currentButton === button ? this.close() : this.open(button);
      }, button);
    });
    this.element.querySelectorAll("*[data-aside-close]").forEach((button) => {
      DomEventManager.addListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }, button);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
    document.addEventListener("click", (event) => {
      if (this.isOpen() && !this.element.contains(event.target)) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.element.classList.contains("open");
  }

  /**
   * @param {Element|null} button - The button which opens the panel.
   * @return {void}
   */
  open(button = null) {
    Debug.log("-- -- Component - Open : " + this.componentName + " -> " + this.uuid);
    if (this.currentButton && this.currentButton !== button) {
      this.setButtonState(this.currentButton, false);
    }
    this.currentButton = button;
    if (button?.dataset.asideInsert) {
      Object.entries(JSON.parse(button.dataset.asideInsert)).forEach(([selector, html]) => {
        const element = document.querySelector(selector);
        if (element) {
          element.innerHTML = html;
          DomEventManager.dispatch("component::aside.insert_finish", {"componentName": "aside", "insert": [selector, html]}, element);
        }
      });
    }
    this.element.classList.add("open");
    if (button) {
      this.setButtonState(button, true);
    }
    this.element.querySelector(A11yHelpers.getEnabledElementsSelector().join(","))?.focus();
    DomEventManager.dispatch("component::open.finish", {"componentName": this.componentName, "component": this});
  }

  close() {
    if (!this.isOpen()) {
      return;
    }
    Debug.log("-- -- Component - Close : " + this.componentName + " -> " + this.uuid);
    this.element.classList.remove("open");
    const button = this.currentButton;
    if (button) {
      this.setButtonState(button, false);
      button.focus();
    }
    this.currentButton = null;
    DomEventManager.dispatch("component::close.finish", {"componentName": this.componentName, "component": this, "elementClick": button});
  }

  /**
   * @param {Element} button
   * @param {boolean} open
   * @return {void}
   */
  setButtonState(button, open) {
    button.classList.toggle("open", open);
    button.classList.toggle("is-click", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }
}
DomEventManager.addListener("component::initialize", () => {
  Aside.initComponent();
});
