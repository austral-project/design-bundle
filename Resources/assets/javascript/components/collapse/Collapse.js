import abstractComponent from "../abstract";

export default class Collapse extends abstractComponent {

  static initComponent() {
    super.initComponent("collapse");
  }

  create(element, elementEvent) {
    this.element = element;
    this.collapseId = this.element.dataset.collapse;
    [].forEach.call(this.element.querySelectorAll("*[data-collapse-trigger='"+this.collapseId+"']"), (el) => {
      MiscEvent.addListener("click", () => {
        this.openClose();
      }, el);
    });

    MiscEvent.addListener("component::action.open", () => {
      this.open();
    }, this.element);

    MiscEvent.addListener("component::action.open-close", () => {
      this.open();
      [].forEach.call(Object.entries(ConfigMaster.getComponentsByType("collapse")), (componentArray) => {
        let component = componentArray[1];
        if(component && component.isOpen()) {
          if(this.uuid !== component.uuid)
          {
            MiscEvent.dispatch("component::action.close", {}, component.element);
          }
        }
      });
    }, this.element);

    MiscEvent.addListener("component::action.close", () => {
      this.close();
    }, this.element);

  }

  addEventListener() {
    super.addEventListener();
  }

  openClose() {
    if(this.element.classList.contains("is-open"))
    {
      this.close();
    }
    else
    {
      this.open();
    }
  }

  isOpen()
  {
    return this.element.classList.contains('is-open');
  }

  open() {
    this.element.classList.add('is-open');
  }

  close() {
    this.element.classList.remove('is-open');
  }

}