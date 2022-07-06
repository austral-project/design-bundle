import Input from "./Input";

export default class Password extends Input {

  static initComponent() {
    super.initComponent("password");
  }

  create(element) {
    super.create(element);
  }

  addEventListener() {
    super.addEventListener();
    MiscEvent.addListener("click", (event) => {
      if(this.element.type === "password") {
        this.element.type = "text";
        event.target.classList.add(event.target.dataset.pictoNoView);
        event.target.classList.remove(event.target.dataset.pictoView);
      }
      else {
        this.element.type = "password";
        event.target.classList.add(event.target.dataset.pictoView);
        event.target.classList.remove(event.target.dataset.pictoNoView);
      }
    }, this.field.querySelector(".picto-view-password"));
  }
}