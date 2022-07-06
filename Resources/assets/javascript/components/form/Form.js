import abstractAction from "./../action/abstractAction";

export default class Form extends abstractAction {

  static initComponent() {
    Debug.log("-- Component Initialise : form");
    [].forEach.call(document.querySelectorAll("form:not(.no-ajax)"), (el) => {
      if(el.getAttribute("data-component-uuid") === undefined || el.getAttribute("data-component-uuid") === null)
      {
        let object = new this(el, "form");
      }
    });
  }

  create() {
    super.create("form");
    this.animateToChangeElement = this.element.querySelector("*[data-animate-to-save]");
    this.fieldIsChange = {};
  }

  formIsChanged() {
    if(this.animateToChangeElement) {
      return this.animateToChangeElement.classList.contains('animate-buzz');
    }
    return false
  }

  addAnimateToChange() {
    this.animateToChangeElement.classList.add('animate-buzz');
  }

  removeAnimateToChange() {
    this.animateToChangeElement.classList.remove('animate-buzz');
  }

  addEventListener()
  {
    MiscEvent.addListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.execute();
    }, this.element);

    MiscEvent.addListener("component::form.change", (event) => {
      if(this.animateToChangeElement) {
        if(event.detail.change) {
          this.fieldIsChange[event.detail.key] = {};
        }
        else if(event.detail.key in this.fieldIsChange) {
          delete this.fieldIsChange[event.detail.key];
        }
        if(Object.keys(this.fieldIsChange).length > 0) {
          this.addAnimateToChange();
        }
        else {
          this.removeAnimateToChange();
        }
      }
    }, this.element);
  }

}