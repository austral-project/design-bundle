/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Debug, DomEventManager, utils } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

/**
 * Bubble placed next to an element (menu of actions, help): fade and offset by a CSS transition, see _toast.scss.
 *
 *   <button type="button" data-toast-container="#help">?</button>
 *   <div id="help" class="toast-container" data-toast="" data-toast-position="bottom-center" data-toast-position-origin="self">…</div>
 *
 * data-toast-position is "<side>-<alignment>" (bottom-center by default: left-center); the side is reversed when
 * the bubble goes out of the screen. data-toast-position-origin is the element it is placed by (selector, or "self";
 * by default its parent). The buttons [data-toast-container="#id"] open and close it (aria-expanded,
 * aria-controls); Escape and a click outside close it.
 * Events: component::action.open / component::action.close (on the element), component::open.finish /
 * component::close.finish.
 */
export default class Toast extends abstractComponent {

  // Space between the bubble and its origin when it is open (px); closed, it is 15px closer (slide in).
  static OFFSET = 5;

  static initComponent() {
    super.initComponent("toast");
  }

  create() {
    this.position = this.element.dataset.toastPosition || "left-center";
    this.positionClass = "";
    this.currentSide = this.position.split("-");
    const origin = this.element.dataset.toastPositionOrigin;
    this.originPosition = (origin === "self" ? this.element : (origin ? document.body.querySelector(origin) : null)) || this.element.parentNode;
    this.buttons = this.element.id ? document.querySelectorAll("*[data-toast-container='#" + this.element.id + "']") : [];
    this.buttons.forEach((button) => {
      button.setAttribute("aria-controls", this.element.id);
      button.setAttribute("aria-expanded", "false");
    });
    this.applyPosition(this.currentSide, false);
  }

  addEventListener() {
    super.addEventListener();
    DomEventManager.addListener("component::action.open", () => this.open(), this.element);
    DomEventManager.addListener("component::action.close", () => this.close(), this.element);
    this.buttons.forEach((button) => {
      DomEventManager.addListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.isOpen() ? this.close() : this.open();
      }, button);
    });
    this.element.addEventListener("transitionend", (event) => {
      if (event.target === this.element && event.propertyName === "opacity" && !this.isOpen()) {
        this.currentSide = this.position.split("-");
        this.applyPosition(this.currentSide, false);
      }
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

  open() {
    if (this.isOpen()) {
      return;
    }
    Debug.log("-- -- Component - Open : " + this.componentName + " -> " + this.uuid);
    this.currentSide = this.side();
    this.applyPosition(this.currentSide, false);
    // reflow: the transition starts from the closed position
    this.element.offsetHeight;
    this.applyPosition(this.currentSide, true);
    this.element.classList.add("open");
    this.setButtonsState(true);
    DomEventManager.dispatch("component::open.finish", {"componentName": this.componentName, "component": this});
  }

  close() {
    if (!this.isOpen()) {
      return;
    }
    Debug.log("-- -- Component - Close : " + this.componentName + " -> " + this.uuid);
    this.element.classList.remove("open");
    this.applyPosition(this.currentSide, false);
    this.setButtonsState(false);
    DomEventManager.dispatch("component::close.finish", {"componentName": this.componentName, "component": this});
  }

  /**
   * Side and alignment of data-toast-position, the side reversed when the bubble goes out of the screen.
   *
   * @return {string[]} [side, alignment]
   */
  side() {
    let [positionY, positionX] = this.position.split("-");
    const overrun = utils.dom.elementInViewportOverrunY(this.element);
    if (overrun === "bottom" && positionY === "bottom") {
      positionY = "top";
    } else if (overrun === "top" && positionY === "top") {
      positionY = "bottom";
    }
    if (overrun && positionX === "center" && (positionY === "right" || positionY === "left")) {
      positionX = overrun;
    }
    return [positionY, positionX];
  }

  /**
   * Position class "<side>-<alignment>" and offsets from the origin.
   *
   * @param {string[]} side - [side, alignment]
   * @param {boolean} shown - Offset of the open bubble, else 15px closer to its origin.
   * @return {void}
   */
  applyPosition([positionY, positionX], shown) {
    this.element.removeAttribute("style");
    if (this.positionClass) {
      this.element.classList.remove(this.positionClass);
    }
    this.positionClass = positionY + "-" + positionX;
    this.element.classList.add(this.positionClass);

    const offset = shown ? Toast.OFFSET : Toast.OFFSET - 15;
    const sides = {
      bottom: ["top", () => utils.dom.height(this.originPosition, "full", "middle")],
      top: ["bottom", () => utils.dom.height(this.originPosition, "full", "middle")],
      right: ["left", () => utils.dom.width(this.originPosition, "full", "middle")],
      left: ["right", () => utils.dom.width(this.originPosition, "full", "middle")],
    };
    if (sides[positionY]) {
      this.element.style[sides[positionY][0]] = (sides[positionY][1]() + offset) + "px";
    }
    const alignments = {
      right: ["right", () => utils.dom.width(this.originPosition, "full") - utils.dom.width(this.originPosition, "inner")],
      left: ["left", () => utils.dom.width(this.originPosition, "full") - utils.dom.width(this.originPosition, "inner")],
      bottom: ["bottom", () => utils.dom.height(this.originPosition, "full") - utils.dom.height(this.originPosition, "inner")],
      top: ["top", () => utils.dom.height(this.originPosition, "full") - utils.dom.height(this.originPosition, "inner")],
    };
    if (alignments[positionX]) {
      this.element.style[alignments[positionX][0]] = alignments[positionX][1]() + "px";
    }
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
  Toast.initComponent();
});
