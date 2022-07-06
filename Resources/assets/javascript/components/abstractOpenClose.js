import abstract from "./abstract"
import Button from "./action/Button";

export default class abstractOpenClose extends abstract {

  static initComponent(componentName) {
    super.initComponent(componentName);
  }

  addEventListener() {
    super.addEventListener();
    MiscEvent.addListener("component::action.open", (event) => {
      this.open(event);
    }, this.element);
    MiscEvent.addListener("component::action.close", (event) => {
      this.close(event);
    }, this.element);

    if(this.closeByClick === undefined || this.closeByClick === true)
    {
      MiscEvent.addListener("click", (e) => {
        MiscEvent.dispatch("component::action."+this.componentName, {}, this.element);
      }, this.element);
    }

    this.eventElements = [];
    MiscEvent.addListener("component::load.finish", ()=>{
      let eventElements = Austral.Config.page.dom.body.querySelectorAll("[data-"+this.componentName+"-container='#"+this.element.getAttribute("id")+"']");
      this.eventElements = eventElements;
      [].forEach.call(eventElements, (element) => {
        Debug.log("-- Component Configuration Button Action : "+this.componentName);
        this.addEventButtonAction(element, this.componentName);
      });
    }, this.element);
  }

  addEventButtonAction(element, actions) {
    let elementButton = null;
    if(element.dataset.componentUuid !== undefined && element.dataset.componentUuid)
    {
      elementButton = Austral.Config.getComponent(element.dataset.componentName, element.dataset.componentUuid, null);
    }
    else
    {
      elementButton = new Button(element, "click-actions");
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
            MiscEvent.dispatch("component::action.close", {button: element}, this.element);
          } else {
            MiscEvent.dispatch("click", {"ignore": this}, document);
            MiscEvent.dispatch("component::action.open", {button: element}, this.element);
          }
          MiscEvent.dispatch("click", {button: element}, this.element);
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
      });
    }
    MiscEvent.dispatch("component::open.finish", {"componentName": this.componentName, "component": this});
  }

  isOpen() {
    return this.element.classList.contains("open");
  }

  close(event, callback = null) {
    Debug.log("-- -- Component - Close : "+this.componentName+" -> "+this.uuid);
    this.element.classList.remove("open");
    var currentElementClick = null;
    if(this.eventElements) {
      [].forEach.call(this.eventElements, (element) => {
        if(element.classList.contains('is-click'))
        {
          currentElementClick = element;
          element.classList.remove("is-click");
        }
        element.classList.remove("open");
      });
    }
    if (callback && typeof callback === 'function') {
      callback();
    }
    MiscEvent.dispatch("component::close.finish", {"componentName": this.componentName, "component": this, "elementClick": currentElementClick});
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