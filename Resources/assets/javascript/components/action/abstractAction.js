import Request from "./../../request/Request";
import Response from "./../../response/Response";
import abstractComponent from "../abstract";

export default class abstractAction extends abstractComponent {

  static initComponent(componentName) {
    super.initComponent(componentName);
  }

  create(type) {
    this.executeAction = false;
    this.menuRightContext = null;
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
      if(Austral.Config.page.reloadElements !== undefined && reloadKey && reloadKey in Austral.Config.page.reloadElements)
      {
        this.reloadElements = Austral.Config.page.reloadElements[reloadKey];
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
  }

  initDefaultEventListener() {

    MiscEvent.addListener("component::action.request", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(!this.executeAction) {
        this.executeAction = true;
        Debug.log("Link - Click");
        this.request.execute();
      }
    }, this.element);

    MiscEvent.addListener("component::action.confirm", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(e.detail.hasOwnProperty("confirm") && e.detail.confirm === "changePage") {
        Alert.showPopup({
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
        Alert.showPopup({
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
      this.response = new Response();
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
      this.request = new Request(
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
      if(Austral.Config.getContextMenu().isOpen()) {
        Austral.Config.getContextMenu().close();
      }
    }

    if(this.isClicked()) {
      this.element.classList.remove("is-click");
    }
    else {
      this.element.classList.add("is-click");
    }

    if(action) {
      MiscEvent.dispatch("component::action."+action, {}, this.element);
    }
    else
    {
      if(this.isActionByKey("confirm"))
      {
        MiscEvent.dispatch("component::action.confirm", {"confirm": "default", "callback": () => {
          if(this.request)
          {
            MiscEvent.dispatch("component::action.request", {}, this.element);
          }
        }}, this.element);
      }
      else if(this.request) {
        if(this.type !== "form" && Austral.Config.hasComponent("form"))
        {
          let executeAlert = false;
          for(const[key, component] of Object.entries(Austral.Config.getComponentsByType("form"))) {
            if(component.formIsChanged()) {
              executeAlert = true;
            }
          }
          if(executeAlert) {
            MiscEvent.dispatch("component::action.confirm", {"confirm": "changePage", "callback": () => {
                if(this.request)
                {
                  MiscEvent.dispatch("component::action.request", {}, this.element);
                }
              }}, this.element);
          }
          else {
            MiscEvent.dispatch("component::action.request", {}, this.element);
          }
        }
        else {
          MiscEvent.dispatch("component::action.request", {}, this.element);
        }
      }
      else
      {
        for(let i = 0; i < this.actions.length; i++) {
          MiscEvent.dispatch("component::action."+this.actions[i], {}, this.element);
        }
      }
    }

    if(this.isActionByKey("popin") && false) {
      let popinOptions = this.element.dataset.popinOptions ? JSON.parse(this.element.dataset.popinOptions) : {};
      if(popinOptions.id !== undefined) {
        let popinElement = Austral.Config.page.dom.querySelector("*[data-popin='"+popinOptions.id+"']");
        if(popinElement && Austral.Config.hasComponent("popin", popinElement.dataset.popinKey)) {
          let popin = Austral.Config.getComponent("popin", popinElement.dataset.popinKey);
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