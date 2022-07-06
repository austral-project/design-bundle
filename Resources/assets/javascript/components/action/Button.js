import abstractAction from "./abstractAction";
export default class Button extends abstractAction {

  static initComponent() {
    super.initComponent("click-actions");
  }

  create() {
    super.create("button");
  }

  addEventListener()
  {
    MiscEvent.addListener("click", (e) => {
      if(!e.target.closest("*[data-no-click-actions]") && e.target.dataset.noClickActions === undefined)
      {
        if (e.ctrlKey && this.hasRequest()) {
          window.open(this.pathUrl, "_blank");
        }
        else {
          this.execute();
        }
        e.preventDefault();
        e.stopPropagation();
      }
    }, this.element);

    MiscEvent.addListener("contextmenu", (e) => {
      if(this.menuRightContext && !e.target.closest("a")) {
        e.preventDefault();
        e.stopPropagation();
        const toast = Austral.Config.getComponent("toast", this.menuRightContext.dataset.componentUuid);
        Austral.Config.getContextMenu().initTemplate(toast.element);
        Austral.Config.getContextMenu().open(e);
      }
      else {
        Austral.Config.getContextMenu().close();
      }
    }, this.element);

    MiscEvent.addListener("mouseup", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(this.element.tagName !== "A")
      {
        if ((e.ctrlKey || e.which === 2) && this.hasRequest()) {
          window.open(this.pathUrl, "_blank");
        }
      }
    }, this.element);

    MiscEvent.addListener("keyup", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Enter") {
        this.execute();
      }
    }, this.element);
  }

}
