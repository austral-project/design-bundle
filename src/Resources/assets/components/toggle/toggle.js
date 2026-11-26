/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Debug, DomEventManager } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

/**
 * Opens and closes an element (height animated by a CSS transition, see _toggle.scss).
 *
 *   <button type="button" data-toggle-container="#filters">Filters</button>
 *   <div id="filters" data-toggle="" data-toggle-elements-add-class=".list">…</div>
 *
 * The buttons [data-toggle-container="#id"] open and close it (aria-expanded, aria-controls); the elements of
 * data-toggle-elements-add-class get the class toggle-open while it is open (disclosure pattern: it stays open until
 * a button closes it).
 * Events: component::action.open / component::action.close (on the element), component::open.finish /
 * component::close.finish.
 */
export default class Toggle extends abstractComponent {

  static initComponent() {
    super.initComponent("toggle");
  }

  create() {
    this.element.classList.add("toggle-element");
    this.elementsToAddClass = this.element.dataset.toggleElementsAddClass ? document.querySelectorAll(this.element.dataset.toggleElementsAddClass) : [];
    this.buttons = this.element.id ? document.querySelectorAll("*[data-toggle-container='#" + this.element.id + "']") : [];
    this.buttons.forEach((button) => {
      button.setAttribute("aria-controls", this.element.id);
      button.setAttribute("aria-expanded", this.isOpen() ? "true" : "false");
    });
  }

  addEventListener() {
    super.addEventListener();
    DomEventManager.addListener("component::action.open", () => this.open(), this.element);
    DomEventManager.addListener("component::action.close", () => this.close(), this.element);
    this.buttons.forEach((button) => {
      DomEventManager.addListener("click", (event) => {
        event.preventDefault();
        this.toggleOpenClose();
      }, button);
    });
    this.element.addEventListener("transitionend", (event) => {
      if (event.target === this.element && event.propertyName === "height" && this.isOpen()) {
        this.element.style.height = "auto";
      }
    });
  }

  isOpen() {
    return this.element.classList.contains("open");
  }

  toggleOpenClose() {
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    if (this.isOpen()) {
      return;
    }
    Debug.log("-- -- Component - Open : " + this.componentName + " -> " + this.uuid);
    this.element.style.height = this.element.scrollHeight + "px";
    this.element.classList.add("open");
    this.setButtonsState(true);
    this.elementsToAddClass.forEach((el) => el.classList.add("toggle-open"));
    DomEventManager.dispatch("component::open.finish", {"componentName": this.componentName, "component": this});
  }

  close() {
    if (!this.isOpen()) {
      return;
    }
    Debug.log("-- -- Component - Close : " + this.componentName + " -> " + this.uuid);
    // from "auto" to a fixed height, then 0: the transition needs two values
    this.element.style.height = this.element.scrollHeight + "px";
    this.element.offsetHeight;
    this.element.style.height = "";
    this.element.classList.remove("open");
    this.setButtonsState(false);
    this.elementsToAddClass.forEach((el) => el.classList.remove("toggle-open"));
    DomEventManager.dispatch("component::close.finish", {"componentName": this.componentName, "component": this});
  }

  /**
   * @param {boolean} open
   * @return {void}
   */
  setButtonsState(open) {
    this.buttons.forEach((button) => {
      button.classList.toggle("open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
}
DomEventManager.addListener("component::initialize", () => {
  Toggle.initComponent();
});
