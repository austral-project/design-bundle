import abstractComponent from "../abstract";

export default class Counter extends abstractComponent {

  static initComponent() {
    super.initComponent("counter");
  }

  create(element, elementEvent) {
    this.element = element;
    this.maxCharacters = this.element.dataset.counterInitial;
    if(this.element.dataset.counterKeyup) {
      this.elementEvent = Austral.Config.page.dom.querySelector(this.element.dataset.counterKeyup);
      if(this.elementEvent) {
        this.count();
      }
    }
  }

  addEventListener() {
    super.addEventListener();
    if(this.elementEvent) {
      MiscEvent.addListener(["keyup", "keydown"], () => {
        this.count();
      }, this.elementEvent);
    }
  }

  count() {
    let value = this.elementEvent.value;
    let diff = this.maxCharacters-value.length;
    this.element.querySelector(".counter").innerText = diff;
    if(diff < 0)
    {
      this.element.classList.add("is-negative");
    }
    else
    {
      this.element.classList.remove("is-negative");
    }
  }
}