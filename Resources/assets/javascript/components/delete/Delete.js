import abstractComponent from "../abstract";
export default class Delete extends abstractComponent {

  static initComponent() {
    super.initComponent("delete");
  }

  create() {
  }

  addEventListener() {
    this.element.addEventListener("click", (e) => {
      let parentIsEmbed = this.element.closest("*[data-collection-embed]");
      MiscEvent.dispatch("component::delete", {element: this.element}, this.element.closest(this.element.dataset.delete).parentNode);
      this.element.closest(this.element.dataset.delete).parentNode.removeChild(this.element.closest(this.element.dataset.delete));
      if(parentIsEmbed)
      {
        MiscEvent.dispatch("component::embed.childrenParameterCheck", {},parentIsEmbed);
      }
    });
  }


}