/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config, DomEventManager, Debug, utils } from "@austral/design";
import { v4 as uuidv4 } from "uuid";
import { contextMenu } from "./contextMenu/ContextMenu";

/**
 * Page of the administration: what the components of 3.1 read on Austral.Config.page (loader, theme, flash
 * messages, elements to reload by key from body[data-reload-elements]).
 */
class AdminPage {

  get reloadElements() {
    return document.body.dataset.reloadElements ? JSON.parse(document.body.dataset.reloadElements) : {};
  }

  loadPage() {
    document.body.classList.add('load');
  }

  unloadPage() {
    document.body.classList.remove('load');
  }

  checkSystemTheme() {
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(matched && document.body.classList.contains("auto"))
    {
      document.body.classList.add("dark");
    }
    else if(document.body.classList.contains("auto"))
    {
      document.body.classList.remove("dark");
    }
  }

  init() {
    DomEventManager.dispatch("admin-page::init.start");
    Debug.log("Admin page - Init - Start");
    this.checkSystemTheme();
    if(contextMenu.isOpen()) {
      contextMenu.close();
    }
    this.initFlashMessage(document);
    Debug.log("Admin page - Init - End");
    DomEventManager.dispatch("admin-page::init.end");
  }

  /**
   * Global listeners of the administration (3.1 austral.js). Drag and drop and history are handled by the
   * Page and PageBack modules of the core.
   */
  listen() {
    if(this.isListening) {
      return this;
    }
    this.isListening = true;

    // The components are initialised by the Page module of the core on "page::init.first" and "page::init".
    DomEventManager.addListener("page::init.first", () => {
      this.init();
    });
    DomEventManager.addListener("page::init", () => {
      this.init();
    });
    DomEventManager.addListener("change", () => {
      this.checkSystemTheme();
    }, window.matchMedia("(prefers-color-scheme: dark)"));

    DomEventManager.addListener("component::close-all", (event) => {
      this.closeAll(event.detail ?? {});
    });
    DomEventManager.addListener("click", (event) => {
      let target = event.target;
      DomEventManager.dispatch("component::close-all", {target: target, componentName: "toast"});
      if(!target.closest || !target.closest(".aside-container")) {
        DomEventManager.dispatch("component::close-all", {target: target, componentName: "aside"});
      }
    });
    DomEventManager.addListener("contextmenu", () => {
      if(contextMenu.isOpen()) {
        contextMenu.close();
      }
    });
    DomEventManager.addListener("component::close.finish", (event) => {
      Config.dispatchAllComponents("component::close.finish", event.detail, false);
    });
    DomEventManager.addListener("scroll", () => {
      Config.dispatchAllComponents("component::scroll", {}, false);
    }, window);
    DomEventManager.addListener("keydown", (event) => {
      this.keyboardShortcut(event);
    });
    return this;
  }

  /**
   * Closes every open component of a type, except the one given in detail.ignore.
   */
  closeAll(detail) {
    if(detail.componentName === undefined) {
      return;
    }
    let components = Config.getComponentsByType(detail.componentName);
    if(components) {
      Object.values(components).forEach((component) => {
        if(component && typeof component.isOpen === "function" && component.isOpen()) {
          let ignore = detail.ignore;
          if(!ignore || ignore.componentName !== detail.componentName || ignore.uuid !== component.uuid) {
            DomEventManager.dispatch("component::action.close", {}, component.element);
          }
        }
      });
    }
    if(contextMenu.isOpen()) {
      contextMenu.close();
    }
  }

  /**
   * Clicks the link or the button whose data-keyboard-shortcut matches the keys (e.g. "CTRL+MAJ+S").
   */
  keyboardShortcut(event) {
    if(!event.key) {
      return;
    }
    let shortcut = (event.ctrlKey || event.metaKey) ? "CTRL+" : "";
    shortcut += event.shiftKey ? "MAJ+" : "";
    shortcut += event.altKey ? "ALT+" : "";
    shortcut += event.key.toUpperCase();
    let action = document.querySelector('*[data-keyboard-shortcut="'+shortcut.replace(/["\\]/g, "\\$&")+'"]');
    if(action) {
      event.preventDefault();
      event.stopPropagation();
      if(action.tagName === "A" || action.tagName === "BUTTON") {
        action.click();
      }
    }
  }

  initFlashMessage(container = document) {
    [].forEach.call(container.querySelectorAll("*[data-message-text]"), (el) => {
      if(el.dataset.flashMessageKey === undefined)
      {
        el.dataset.flashMessageKey = uuidv4();
        utils.alert.showToast({
          title: el.dataset.messageText,
          icon: el.dataset.messageStatus,
          position: el.dataset.messagePosition,
          timer:  el.dataset.messageFix === undefined ? 5000 : false,
          customClass: {
            popup: el.dataset.messageStatus
          }
        });
      }
    });
  }

}

export const adminPage = new AdminPage();
