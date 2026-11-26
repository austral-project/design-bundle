/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* global Translate */ // translations of the administration (admin-bundle, Layout/translation.js.twig)
import { Config, Debug, DomEventManager, utils } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";
import { contextMenu } from "../contextMenu/ContextMenu";
import ActionRequest from "./ActionRequest";
import ActionResponse from "./ActionResponse";
import { adminPage } from "../AdminPage";

export default class abstractAction extends abstractComponent {

  static initComponent(componentName) {
    super.initComponent(componentName);
  }

  create(type) {
    this.executeAction = false;
    this.menuRightContext = null;
    this.menuContext = null;
    this.type = type;
    this.actions = [];
    if(this.type === "form") {
      this.setActions(this.element.dataset.formActions, false);
    }
    else if(this.element.dataset.clickActions) {
      this.setActions(this.element.dataset.clickActions, false);
    }

    if(this.actions) {
      this.initActions();
    }
    this.initDefaultEventListener();
  }

  setActions(actions, addlistener = true)
  {
    if(typeof actions === "string") {
      actions = actions.split(",");
    }
    if(Array.isArray(actions)) {
      for (let i = 0; i < actions.length; i++) {
        this.actions.push(actions[i].trim());
      }
    }
    return this;
  }

  initActions()
  {
    if(this.isActionByKey("reload") || this.isActionByKey("remove"))
    {
      var reloadKey = this.element.dataset.reloadElementsKey;
      if(adminPage.reloadElements !== undefined && reloadKey && reloadKey in adminPage.reloadElements)
      {
        this.reloadElements = adminPage.reloadElements[reloadKey];
      }
      else
      {
        try {
          this.reloadElements = JSON.parse(this.element.dataset.reloadElements);
        } catch (e) {
          this.reloadElements = this.element.dataset.reloadElements;
        }
      }
      this.createResponse().createRequest();
    }
    if(this.element.dataset.clickRightMenu) {
      this.menuRightContext = document.querySelector(this.element.dataset.clickRightMenu);
    }
    if(this.element.dataset.clickMenu) {
      this.menuContext = document.querySelector(this.element.dataset.clickMenu);
    }
  }

  initDefaultEventListener() {

    DomEventManager.addListener("component::action.request", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(!this.executeAction) {
        this.executeAction = true;
        Debug.log("Link - Click");
        this.request.execute();
      }
    }, this.element);

    DomEventManager.addListener("component::action.confirm", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(e.detail.hasOwnProperty("confirm") && e.detail.confirm === "changePage") {
        utils.alert.showPopup({
          type:               "warning",
          title:              Translate.trans('austral.sweetAlert.confirm.reload.title'),
          text:               Translate.trans('austral.sweetAlert.confirm.reload.message'),
          confirmButtonText:  Translate.trans('austral.sweetAlert.confirm.reload.actions.confirm'),
          cancelButtonText:   Translate.trans('austral.sweetAlert.confirm.reload.actions.cancel'),
          customClass: {
            popup:            "warning"
          },
        }, ()=>{
          if(e.detail.hasOwnProperty("callback") && typeof e.detail.callback === "function")
          {
            e.detail.callback();
          }
        });
      }
      else {
        utils.alert.showPopup({
          type:               "error",
          title:              Translate.trans('austral.sweetAlert.confirm.delete.title'),
          text:               Translate.trans('austral.sweetAlert.confirm.delete.message'),
          confirmButtonText:  Translate.trans('austral.sweetAlert.confirm.delete.actions.confirm'),
          cancelButtonText:   Translate.trans('austral.sweetAlert.confirm.delete.actions.cancel'),
          customClass: {
            popup:            "delete"
          },
        }, ()=>{
          if(e.detail.hasOwnProperty("callback") && typeof e.detail.callback === "function")
          {
            e.detail.callback();
          }
        });
      }

    }, this.element);
  }

  addEventListener() {
    // abstract method
  }

  createResponse() {
    if(!this.response) {
      this.response = new ActionResponse();
      this.response.setReplaceState(this.element.dataset.hasOwnProperty("ajaxUnique") ? false : true)
        .setPushHistory(this.element.dataset.hasOwnProperty("ajaxUnique") ? false : true)
        .setReplaceDom(true)
        .setElementsToRefresh(this.reloadElements);
    }
    return this;
  }

  createRequest() {
    if(!this.request) {
      if(this.element.dataset.url !== undefined) {
        this.pathUrl = this.element.dataset.url;
      }
      else if(this.element.getAttribute('action')) {
        this.pathUrl = this.element.getAttribute('action');
      }
      else {
        this.pathUrl = this.element.getAttribute('href');
      }
      this.request = new ActionRequest(
        this.type === "button" ? "GET" : "POST",
        this.pathUrl,
        {},
        this.response
      );
      this.request.setElementClick(this);
      if(this.type === "form") {
        this.request.setForm(this.element);
      }
    }
    return this;
  }

  isClicked() {
    return this.element.classList.contains("is-click");
  }

  execute(action = null) {
    Debug.log("-- -- Button -> Execute");

    if(this.element.closest("#contextmenu-page")) {
      if(contextMenu.isOpen()) {
        contextMenu.close();
      }
    }

    if(this.isClicked()) {
      this.element.classList.remove("is-click");
    }
    else {
      this.element.classList.add("is-click");
    }

    if(action) {
      DomEventManager.dispatch("component::action."+action, {}, this.element);
    }
    else
    {
      if(this.isActionByKey("confirm"))
      {
        DomEventManager.dispatch("component::action.confirm", {"confirm": "default", "callback": () => {
          if(this.request)
          {
            DomEventManager.dispatch("component::action.request", {}, this.element);
          }
        }}, this.element);
      }
      else if(this.request) {
        if(this.type !== "form" && Config.hasComponent("form"))
        {
          let executeAlert = false;
          for(const[key, component] of Object.entries(Config.getComponentsByType("form"))) {
            if(component.formIsChanged()) {
              executeAlert = true;
            }
          }
          if(executeAlert) {
            DomEventManager.dispatch("component::action.confirm", {"confirm": "changePage", "callback": () => {
                if(this.request)
                {
                  DomEventManager.dispatch("component::action.request", {}, this.element);
                }
              }}, this.element);
          }
          else {
            DomEventManager.dispatch("component::action.request", {}, this.element);
          }
        }
        else {
          DomEventManager.dispatch("component::action.request", {}, this.element);
        }
      }
      else
      {
        for(let i = 0; i < this.actions.length; i++) {
          DomEventManager.dispatch("component::action."+this.actions[i], {}, this.element);
        }
      }
    }

    if(this.isActionByKey("popin") && false) {
      let popinOptions = this.element.dataset.popinOptions ? JSON.parse(this.element.dataset.popinOptions) : {};
      if(popinOptions.id !== undefined) {
        let popinElement = document.querySelector("*[data-popin='"+popinOptions.id+"']");
        if(popinElement && Config.hasComponent("popin", popinElement.dataset.popinKey)) {
          let popin = Config.getComponent("popin", popinElement.dataset.popinKey);
          popin.init(popinOptions, this.element).open();
        }
      }
    }
  }

  hasRequest()
  {
    return this.isActionByKey("reload") || this.actionRemove("remove");
  }

  isActionByKey(key)
  {
    return this.actions.includes(key);
  }

}