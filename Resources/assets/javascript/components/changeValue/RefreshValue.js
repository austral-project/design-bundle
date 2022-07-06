import abstractComponent from "../abstract";

export default class RefreshValue extends abstractComponent {

  static initComponent() {
    super.initComponent("refresh-value-by");
  }

  create(element, elementEvent) {
    this.element = element;
    if(this.element.dataset.refreshValueBy) {
      this.elementEvent = Austral.Config.page.dom.querySelector(this.element.dataset.refreshValueBy);
      this.changeValue()
    }
  }

  addEventListener() {
    super.addEventListener();
    if(this.elementEvent) {
      MiscEvent.addListener(["keyup", "keydown"], () => {
        this.changeValue();
      }, this.elementEvent);
    }
  }

  changeValue() {
    if(this.elementEvent) {
      if(this.elementEvent.value.length !== 0) {
        this.element.textContent = this.elementEvent.value;
      }
      else {
        this.element.textContent = this.element.dataset.defaultValue;
      }
    }
  }
}