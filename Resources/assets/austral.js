import { page } from "./javascript/page/Page";
import { cacheHistory } from "./javascript/cache/CacheHistory";
import Response from "./javascript/response/Response";
import Request from "./javascript/request/Request";
import ContextMenu from "./javascript/components/contextMenu/ContextMenu";
import MiscEvent from "../../../../../assets/front/javascript/misc/Event";

ConfigMaster.setPage(page);
ConfigMaster.setContextMenu(new ContextMenu());

MiscEvent.addListener("DOMContentLoaded", () => {
  ConfigMaster.page.checkSystemTheme();
  MiscEvent.dispatch("page:init");
});

MiscEvent.addListener("component::close-all", (event) => {
  if(!event.detail.hasOwnProperty("componentName")) {
    return;
  }
  if(ConfigMaster.getComponentsByType(event.detail.componentName)) {
    [].forEach.call(Object.entries(ConfigMaster.getComponentsByType(event.detail.componentName)), (componentArray) => {
      let component = componentArray[1];
      if(component && component.isOpen()) {
        if(!event.detail.hasOwnProperty('ignore') || (event.detail.ignore.componentName !== event.detail.componentName || event.detail.ignore.uuid !== component.uuid))
        {
          MiscEvent.dispatch("component::action.close", {}, component.element);
        }
      }
    });
  }
  if(ConfigMaster.getContextMenu().isOpen()) {
    ConfigMaster.getContextMenu().close();
  }
});

MiscEvent.addListener("component::load.finish", (event) => {
  ConfigMaster.dispatchAllComponents("component::load.finish", event.detail);
});
MiscEvent.addListener("component::close.finish", (event) => {
  ConfigMaster.dispatchAllComponents("component::close.finish", event.detail);
});

MiscEvent.addListener("click", (event) => {
  let detail = event.hasOwnProperty("detail") ? event.detail : {};
  detail.target = event.target;
  detail.componentName = "toast";
  MiscEvent.dispatch("component::close-all", detail);
  if(event.target.classList === undefined || (!event.target.classList.contains("aside-container") && !event.target.closest(".aside-container")))
  {
    detail.componentName = "aside";
    MiscEvent.dispatch("component::close-all", detail);
  }
});

MiscEvent.addListener("contextmenu", (e) => {
  if(ConfigMaster.getContextMenu().isOpen()) {
    ConfigMaster.getContextMenu().close();
  }
});

MiscEvent.addListener("click", (event) => {
  let detail = event.hasOwnProperty("detail") ? event.detail : {};
  if(event.target.classList === undefined || (!event.target.classList.contains("popin-container") && !event.target.closest(".popin-container")))
  {
    detail.componentName = "popin";
    MiscEvent.dispatch("component::close-all", detail);
  }
  if(ConfigMaster.getContextMenu().isOpen()) {
    ConfigMaster.getContextMenu().close();
  }
}, document.body.querySelector("#overlay-master"));

MiscEvent.addListener("change", () => {
  ConfigMaster.page.checkSystemTheme();
}, window.matchMedia("(prefers-color-scheme: dark)"));


var timeDragEnabled;
MiscEvent.addListener(["dragover", "dragenter", "dragstart"], () => {
  clearTimeout(timeDragEnabled);
  if(!document.body.classList.contains("dragover-event") && event.dataTransfer.types.includes("Files"))
  {
    document.body.classList.add('dragover-event');
  }
});

MiscEvent.addListener(["dragleave", "dragend", "drop"], () => {
  timeDragEnabled = setTimeout(() => {
    document.body.classList.remove('dragover-event');
  }, 500);
});

MiscEvent.addListener("scroll", () => {
  ConfigMaster.dispatchAllComponents("component::scroll", {}, false);
});

MiscEvent.addListener("keydown", (event) => {
  let shortcut = "";
  if(event.ctrlKey)
  {
    shortcut = "CTRL+";
  }
  if(event.metaKey)
  {
    shortcut = "CTRL+";
  }
  if(event.shiftKey)
  {
    shortcut += "MAJ+";
  }
  if(event.altKey)
  {
    shortcut += "ALT+";
  }
  shortcut += event.key.toUpperCase();
  let action = document.querySelector("*[data-keybord-shortcut='"+shortcut+"']");
  if(action) {
    event.preventDefault();
    event.stopPropagation();
    if(action.tagName === "A" || action.tagName === "BUTTON") {
      action.click();
    }
    return false;
  }
});


document.addEventListener("keydown", (event) => {
});

MiscEvent.addListener("popstate", (e) => {
  Debug.log("Windows - Popstate - Start");

  var requestPath = false;
  if(e.state !== null && (typeof(e.state) !== 'undefined')) {
    let cacheHistoryContent = cacheHistory.pull(e.state.path);
    if(cacheHistoryContent) {
      PageObject.successResponse(cacheHistoryContent.dom);
    }
    else {
      requestPath = e.state.path;
    }
  }

  if(requestPath) {
    var response = new Response(true);
    response.setReplaceState(true)
      .setReplaceDom(true)
      .setElementsToRefresh(ConfigMaster.getPage().reloadElements["all"]);
    var request = new Request(
      "GET",
      requestPath,
      {},
      response
    );
    request.execute();
  }
}, window);

export var Config = ConfigMaster;