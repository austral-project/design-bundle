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

    MiscEvent.addListener("component::action.anchor-collapse", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(e.target.dataset.collapseId)
      {
        let collapseElement = document.querySelector("*[data-collapse='"+e.target.dataset.collapseId+"']");
        if(collapseElement)
        {
          MiscEvent.dispatch("component::action.open-close", {}, collapseElement);
          Austral.Config.page.dom.body.scrollTop = collapseElement.offsetTop - 200;
          document.querySelector("html").scrollTop = collapseElement.offsetTop - 200;
        }
      }
    }, this.element);

    MiscEvent.addListener("component::action.link-choice", (e) => {
      e.preventDefault();
      e.stopPropagation();

      let popinEditorMaster = document.querySelector("#popin-editor-master");
      if(popinEditorMaster)
      {
        MiscEvent.dispatch("component::action.select-link", {
          keyLink: this.element.dataset.keyLink,
          linkName: this.element.dataset.linkName,
        }, popinEditorMaster);
      }

      let sunEditorChoiceLink = document.querySelector(".sun-editor .sun-editor-diag-link-choice.is-open");
      if(sunEditorChoiceLink)
      {
        MiscEvent.dispatch("component::action.select-link", {
          keyLink: this.element.dataset.keyLink,
          linkName: this.element.dataset.linkName,
        }, sunEditorChoiceLink);
      }


      let popinSelectLink = document.querySelector("#popin-select-links");
      MiscEvent.dispatch("component::action.close", {}, popinSelectLink);
    }, this.element);
  }

}
