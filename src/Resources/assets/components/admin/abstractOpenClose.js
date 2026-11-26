/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config, Debug, DomEventManager, utils } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";
import ClickActions from "./action/ClickActions";

export default class abstractOpenClose extends abstractComponent {

  static initComponent(componentName) {
    super.initComponent(componentName);
  }


  addEventListener() {
    super.addEventListener();
    DomEventManager.addListener("component::action.open", (event) => {
      this.open(event);
    }, this.element);
    DomEventManager.addListener("component::action.close", (event) => {
      this.close(event);
    }, this.element);

    if(this.closeByClick === undefined || this.closeByClick === true)
    {
      DomEventManager.addListener("click", (e) => {
        DomEventManager.dispatch("component::action."+this.componentName, {}, this.element);
      }, this.element);
    }

    this.eventElements = [];
    DomEventManager.addListener("component::initialize.finish", ()=>{
      let eventElements = document.body.querySelectorAll("[data-"+this.componentName+"-container='#"+this.element.getAttribute("id")+"']");
      this.eventElements = eventElements;
      [].forEach.call(eventElements, (element) => {
        Debug.log("-- Component Configuration Button Action : "+this.componentName);
        this.addEventButtonAction(element, this.componentName);
      });
    }, this.element);
  }

  addEventButtonAction(element, actions) {
    this.currentElementClick = null;
    let elementButton = null;
    elementButton = Config.getComponentByElement("click-actions", element);
    if(!elementButton)
    {
      elementButton = new ClickActions(element, "click-actions");
    }

    if (typeof elementButton.isActionByKey !== "undefined") {
      if (!elementButton.isActionByKey(actions)) {
        if (elementButton) {
          elementButton.setActions(actions).initActions();
        }
        if (this.isOpen()) {
          element.classList.add("is-click");
          element.classList.add("open");
        }
        element.addEventListener("component::action." + this.componentName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.isOpen() && !elementButton.isClicked()) {
            DomEventManager.dispatch("component::action.close", {button: element}, this.element);
          } else {
            DomEventManager.dispatch("click", {"ignore": this}, document);
            DomEventManager.dispatch("component::action.open", {button: element}, this.element);
          }
          DomEventManager.dispatch("click", {button: element}, this.element);
        });
      }
    }

  }

  open(event, callback = null) {
    Debug.log("-- -- Component - Open : "+this.componentName+" -> "+this.uuid);
    this.element.classList.add("open");
    if (callback && typeof callback === 'function') {
      callback();
    }
    if(this.eventElements) {
      [].forEach.call(this.eventElements, (element) => {
        element.classList.add("open");
        element.classList.add("is-click");
      });
    }
    DomEventManager.dispatch("component::open.finish", {"componentName": this.componentName, "component": this});
  }

  isOpen() {
    return this.element.classList.contains("open");
  }

  close(event, callback = null) {
    Debug.log("-- -- Component - Close : "+this.componentName+" -> "+this.uuid);
    this.element.classList.remove("open");
    if(this.eventElements && this.currentElementClick === null) {
      [].forEach.call(this.eventElements, (element) => {
        if(element.classList.contains('is-click'))
        {
          this.currentElementClick = element;
          element.classList.remove("is-click");
        }
        element.classList.remove("open");
      });
    }
    if (callback && typeof callback === 'function') {
      callback();
    }
    DomEventManager.dispatch("component::close.finish", {"componentName": this.componentName, "component": this, "elementClick": this.currentElementClick});
    this.currentElementClick = null;
  }

  toggleOpenClose() {
    if(this.isOpen()) {
      this.close();
    }
    else {
      this.open();
    }
  }

}