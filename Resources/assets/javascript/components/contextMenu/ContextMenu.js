import Components from "../Components";
export default class ContextMenu {
  constructor() {
    this.contextMenu = document.createElement("div");
    this.contextMenu.id = "contextmenu-page";
    this.contextMenu.classList.add('toast-container');
    this.initPosition();
    document.body.append(this.contextMenu);
  }

  initPosition() {
    this.contextMenu.style.position = "fixed";
    this.contextMenu.style.opacity=0;
    this.contextMenu.style.pointerEvents = "none";
  }

  initTemplate(template) {
    this.contextMenu.innerHTML = template.innerHTML;
    [].forEach.call(this.contextMenu.querySelectorAll("*[data-component-uuid]"), (el) => {
      el.removeAttribute("data-component-uuid");
    });
    Components.loadComponent();
  }

  isOpen() {
    return this.contextMenu.classList.contains("is-open");
  }

  open(event) {
    this.contextMenu.classList.add('is-open');
    this.contextMenu.style.bottom = "auto";
    this.contextMenu.style.position = "fixed";
    this.contextMenu.style.top = event.clientY+"px";
    if (!MiscNodeSize.elementInViewport(this.contextMenu)) {
      this.contextMenu.style.bottom = (window.innerHeight - event.clientY)+"px";
      this.contextMenu.style.top = "auto";
    }
    this.contextMenu.style.pointerEvents = "all";
    this.contextMenu.style.left = event.clientX+"px";
    let limit = this.contextMenu.offsetLeft+this.contextMenu.offsetWidth;
    if(limit > window.innerWidth)
    {
      this.contextMenu.style.left = event.clientX-(limit-window.innerWidth)+"px";
    }
    MiscEvent.dispatch("contextmenu.open", {event: event});

    this.contextMenu.style.opacity = 1;
    document.body.classList.add('overflow-hidden');
  }
  close(event) {
    MiscEvent.dispatch("contextmenu.close", {});
    this.initPosition();
    this.contextMenu.innerHTML = "";
    this.contextMenu.removeAttribute("style");
    document.body.classList.remove('overflow-hidden');
  }


}