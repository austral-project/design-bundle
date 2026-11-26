/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config, Debug, DomEventManager, utils } from "@austral/design";
import { contextMenu } from "../contextMenu/ContextMenu";
import abstractAction from "./abstractAction";

export default class ClickActions extends abstractAction {

  static initComponent() {
    super.initComponent("click-actions");
  }

  create() {
    super.create("button");
  }

  addEventListener()
  {
    DomEventManager.addListener("click", (e) => {
      if(this.menuContext && !e.target.closest("a")) {
        e.preventDefault();
        e.stopPropagation();
        contextMenu.initTemplate(this.menuContext);
        contextMenu.open(e);
      }
      else {
        contextMenu.close();

        if(!e.target.closest("*[data-no-click-actions]") && e.target.dataset.noClickActions === undefined)
        {
          if (e.ctrlKey && this.hasRequest()) {
            window.open(this.pathUrl, "_blank");
          }
          else {
            this.execute();
          }
          e.preventDefault();
          e.stopPropagation();
        }

      }
    }, this.element);

    DomEventManager.addListener("contextmenu", (e) => {
      if(this.menuRightContext && !e.target.closest("a")) {
        e.preventDefault();
        e.stopPropagation();
        const toast = Config.getComponentByElement("toast", this.menuRightContext);
        contextMenu.initTemplate(toast.element);
        contextMenu.open(e);
      }
      else {
        contextMenu.close();
      }
    }, this.element);

    DomEventManager.addListener("mouseup", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(this.element.tagName !== "A")
      {
        if ((e.ctrlKey || e.which === 2) && this.hasRequest()) {
          window.open(this.pathUrl, "_blank");
        }
      }
    }, this.element);

    DomEventManager.addListener("keyup", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Enter") {
        this.execute();
      }
    }, this.element);

    DomEventManager.addListener("component::action.anchor-collapse", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(e.target.dataset.collapseId)
      {
        let collapseElement = document.querySelector("*[data-collapse='"+e.target.dataset.collapseId+"']");
        if(collapseElement)
        {
          DomEventManager.dispatch("component::action.open-close", {}, collapseElement);
          document.body.scrollTop = collapseElement.offsetTop - 200;
          document.querySelector("html").scrollTop = collapseElement.offsetTop - 200;
        }
      }
    }, this.element);

    DomEventManager.addListener("component::action.link-choice", (e) => {
      e.preventDefault();
      e.stopPropagation();

      let popinEditorMaster = document.querySelector("#popin-editor-master");
      if(popinEditorMaster)
      {
        DomEventManager.dispatch("component::action.select-link", {
          keyLink: this.element.dataset.keyLink,
          linkName: this.element.dataset.linkName,
        }, popinEditorMaster);
      }

      let sunEditorChoiceLink = document.querySelector(".sun-editor .sun-editor-diag-link-choice.is-open");
      if(sunEditorChoiceLink)
      {
        DomEventManager.dispatch("component::action.select-link", {
          keyLink: this.element.dataset.keyLink,
          linkName: this.element.dataset.linkName,
        }, sunEditorChoiceLink);
      }


      let popinSelectLink = document.querySelector("#popin-select-links");
      DomEventManager.dispatch("component::action.close", {}, popinSelectLink);
    }, this.element);
  }

}
DomEventManager.addListener("component::initialize", () => {
  ClickActions.initComponent();
});
