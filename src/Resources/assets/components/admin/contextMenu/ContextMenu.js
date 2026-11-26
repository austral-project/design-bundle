/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DomEventManager, utils } from "@austral/design";

/**
 * Context menu of the administration (menu of a click-actions element, right click on a list row): one element
 * #contextmenu-page, created on first use, filled with a copy of a template and positioned at the cursor.
 */
class ContextMenu {

  constructor() {
    this.contextMenu = null;
  }

  getElement() {
    if(!this.contextMenu) {
      this.contextMenu = document.createElement("div");
      this.contextMenu.id = "contextmenu-page";
      this.contextMenu.classList.add('toast-container');
      this.initPosition();
      document.body.append(this.contextMenu);
    }
    return this.contextMenu;
  }

  initPosition() {
    this.getElement().style.position = "fixed";
    this.getElement().style.opacity = 0;
    this.getElement().style.pointerEvents = "none";
  }

  initTemplate(template) {
    const element = this.getElement();
    element.innerHTML = template.innerHTML;
    // The copy gets its own components: the identifiers of the components of the template are removed
    [].forEach.call(element.querySelectorAll("*"), (el) => {
      [...el.attributes].forEach((attribute) => {
        if(/^data-component-.+-uuid$/.test(attribute.name)) {
          el.removeAttribute(attribute.name);
        }
      });
    });
    DomEventManager.dispatch("components::load", {timeout: 0});
  }

  isOpen() {
    return this.contextMenu !== null && this.contextMenu.classList.contains("is-open");
  }

  open(event) {
    const element = this.getElement();
    element.classList.add('is-open');
    element.style.bottom = "auto";
    element.style.position = "fixed";
    element.style.top = event.clientY+"px";
    if (!utils.dom.elementInViewport(element)) {
      element.style.bottom = (window.innerHeight - event.clientY)+"px";
      element.style.top = "auto";
    }
    element.style.pointerEvents = "all";
    element.style.left = event.clientX+"px";
    let limit = element.offsetLeft+element.offsetWidth;
    if(limit > window.innerWidth)
    {
      element.style.left = event.clientX-(limit-window.innerWidth)+"px";
    }
    DomEventManager.dispatch("contextmenu.open", {event: event});

    element.style.opacity = 1;
    document.body.classList.add('overflow-hidden');
  }

  close() {
    if(!this.contextMenu) {
      return;
    }
    DomEventManager.dispatch("contextmenu.close", {});
    this.initPosition();
    this.contextMenu.innerHTML = "";
    this.contextMenu.removeAttribute("style");
    this.contextMenu.classList.remove('is-open');
    document.body.classList.remove('overflow-hidden');
  }

}

export const contextMenu = new ContextMenu();
