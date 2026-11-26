import {abstractComponent, DomEventManager} from "@austral/design";

export default class Pagination extends abstractComponent {

  static initComponent() {
    super.initComponent("pagination");
  }

  create() {

    let pathUrl = this.element.getAttribute("data-pagination");
    let options = this.element.getAttribute("data-pagination-options");
    DomEventManager.dispatch("reload-trigger::add", {
      element: this.element,
      clickEvent: false,
      options: options
    });

    DomEventManager.addListener("choice", (event) => {
      let numPage = event.detail.choice.value;
      const sep = pathUrl.includes('?') ? '&' : '?';
      const pathUrlFinal = pathUrl + sep + 'page=' + numPage;
      DomEventManager.dispatch('reloadTrigger::send', {pathUrl: pathUrlFinal}, this.element);
    }, this.element);


  }


}
DomEventManager.addListener("component::initialize", () => {
  Pagination.initComponent();
});
