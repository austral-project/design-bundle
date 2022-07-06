import abstractField from "./abstract"

export default class Input extends abstractField {

  static initComponent(componentName = null, callback = null) {
    if(componentName) {
      super.initComponent(componentName, callback)
    }
    else {
      Debug.log("-- Component Initialise : input");
      [].forEach.call(document.querySelectorAll("input"), (el) => {
        if(el.getAttribute("data-component-uuid") === undefined || el.getAttribute("data-component-uuid") === null)
        {
          let object = new this(el, "input");
        }
      });
    }
  }

  create(element) {
    super.create(element);
    if(this.element.type === "checkbox")
    {
      this.initialValue = this.element.checked ? "checked" : "";
    }
    else
    {
      this.initialValue = this.element.value;
    }
  }

  initialValueChange() {
    let currentValue = null;
    if(this.element.type === "checkbox")
    {
      currentValue = this.element.checked ? "checked" : "";
    }
    else
    {
      currentValue = this.element.value;
    }
    return this.initialValue !== currentValue;
  }

  addEventListenerToChangeField() {
    MiscEvent.addListener(["keyup", "keydown"], ()=>{
      MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: this.initialValueChange() }, this.formContainer);
    }, this.element);
  }


}