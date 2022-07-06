import Components from './../components/Components';
import {v4 as uuidv4} from "uuid";
import Swal from "sweetalert2";
import { mercure } from "../event/Mercure";

class Page {

  constructor() {
    Debug.log("Page - Constructor");
    this.dom  = null;
    MiscEvent.addListener("page:init", () => {
      Austral.Config.clean();
      this.setDom(document).init();
      this.checkSystemTheme();
      mercure.init();
    });

  }

  loadPage()
  {
    this.dom.body.classList.add('load');
  }

  unloadPage()
  {
    this.dom.body.classList.remove('load');
  }

  setDom(dom) {
    this.dom = dom;
    this.reloadElements = dom.body.dataset.reloadElements ? JSON.parse(dom.body.dataset.reloadElements) : {};
    return this;
  }

  setNewDom(dom) {
    this.newDom = dom;
    this.reloadElements = dom.body.dataset.reloadElements ? JSON.parse(dom.body.dataset.reloadElements) : {};
    return this;
  }

  checkSystemTheme() {
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(matched && document.body.classList.contains("auto"))
    {
      document.body.classList.add("dark");
    }
    else if(document.body.classList.contains("auto"))
    {
      document.body.classList.remove("dark");
    }
  }

  init() {
    MiscEvent.dispatch("page:init:start");
    Debug.log("Page - Init - Start");
    if(Austral.Config.getContextMenu().isOpen()) {
      Austral.Config.getContextMenu().close();
    }
    Components.loadComponent();
    this.initFlashMessage();
    Debug.log("Page - Init - End");
    MiscEvent.dispatch("page:init:end");
  }

  initFlashMessage() {
    [].forEach.call(this.dom.querySelectorAll("*[data-message-text]"), (el) => {
      if(el.dataset.flashMessageKey === undefined)
      {
        let uuid = uuidv4();
        el.dataset.flashMessageKey = uuid;
        Alert.showToast({
          title: el.dataset.messageText,
          icon: el.dataset.messageStatus,
          position: el.dataset.messagePosition,
          customClass: {
            popup: el.dataset.messageStatus
          }
        });
      }
    });
  }

}
export const page = new Page();