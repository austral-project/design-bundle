import abstractComponent from "./../abstract";

export default class MultiUser extends abstractComponent {

  static initComponent() {
    super.initComponent("multi-user");
  }

  create(element) {
    this.element = element;

    MiscEvent.addListener("click", () => {
      this.element.classList.add('is-open');
    }, this.element.querySelector(".reduce-container"));

    MiscEvent.addListener("click", () => {
      this.element.classList.remove('is-open');
    }, this.element.querySelector(".content-button-close .button"));
  }

}