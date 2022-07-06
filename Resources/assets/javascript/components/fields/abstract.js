import abstract from "./../abstract"

export default class abstractField extends abstract{

  static initComponent(componentName, callback = null) {
    super.initComponent(componentName, callback);
  }

  create(el) {
    this.formContainer = this.element.closest("form");
    this.element = el;
  }

  addEventListener() {
    super.addEventListener();
    this.fieldContent = this.element.closest(".field-content");
    this.field = this.element.closest(".field");

    MiscEvent.addListener("component::load.finish", ()=> {
      this.addEventListenerToChangeField();
    }, this.element);
  }

  addEventListenerToChangeField() {
    // abstract function
  }


}