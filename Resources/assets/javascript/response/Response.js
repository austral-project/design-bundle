import Swal from "sweetalert2";

class Response {

  constructor(callback) {
    this.responseDom = null;
    this.replaceState = false;
    this.pushHistory = false;
    this.replaceDom = false;
    this.elementsToRefresh = [];
    this.callback = callback;
  }

  /**
   *
   * @param replaceState
   * @returns {Response}
   */
  setReplaceState(replaceState) {
    this.replaceState = replaceState;
    return this;
  }

  /**
   *
   * @param pushHistory
   * @returns {Response}
   */
  setPushHistory(pushHistory) {
    this.pushHistory = pushHistory;
    return this;
  }

  setElementsToRefresh(elements) {
    if(!Array.isArray(elements))
    {
      elements = [elements];
    }
    this.elementsToRefresh = elements;
    return this;
  }

  /**
   *
   * @returns {Response}
   * @param replaceDom
   */
  setReplaceDom(replaceDom) {
    this.replaceDom = replaceDom;
    this.updateBodyClass = replaceDom;
    return this;
  }

  /**
   *
   * @returns {Response}
   * @param updateBodyClass
   */
  setUpdateBodyClass(updateBodyClass) {
    this.updateBodyClass = updateBodyClass;
    return this;
  }

  /**
   *
   * @param request
   * @returns {Response}
   */
  request(request) {
    this.request = request;
    return this;
  }

  /**
   *
   * @param fetchResponse
   */
  executeSuccess(fetchResponse) {
    Debug.log("Response - ExecuteSuccess - Start");
    fetchResponse.text().then((text) => {
      var parser = new DOMParser();
      this.responseDom = parser.parseFromString(text, "text/html");

      MiscEvent.dispatch("response:start",  {
        "object" : this,
      });

      if(this.pushHistory)
      {
        history.pushState({ prevUrl: window.location.href }, null, this.responseDom.body.dataset.uri);
      }
      if(this.replaceState)
      {
        history.replaceState({path: this.responseDom.body.dataset.uri }, null, this.responseDom.body.dataset.uri);
      }
      if(this.updateBodyClass)
      {
        this.refreshBodyClass();
        Austral.Config.page.checkSystemTheme();
        this.reloadFlashMessage();
      }
      if(this.replaceDom)
      {
        Austral.Config.page.dom.body.scrollTop = 0;
        Austral.Config.page.dom.body.dataset.uri = this.responseDom.body.dataset.uri;
        Austral.Config.page.dom.body.dataset.mercure = this.responseDom.body.dataset.mercure;
        if(this.elementsToRefresh)
        {
          this.refreshElements();
        }
        this.refreshMeta();
        MiscEvent.dispatch("page:init");
      }
      else if(this.elementsToRefresh) {
          this.refreshElements();
          MiscEvent.dispatch("page:init");
      }
      if (typeof this.callback === 'function') {
        this.callback(fetchResponse);
      }

      MiscEvent.dispatch("response:end",  {
        "object" : this,
      });
    });
    Debug.log("Response - ExecuteSuccess - Stop");
  }

  refreshMeta() {
    Debug.log("Response - Refresh Meta - Start");
    Austral.Config.page.dom.querySelector("title").text = this.responseDom.querySelector("title").text;
    [].forEach.call(["description", "og:title"], (el) => {
      if(Austral.Config.page.dom.querySelector("meta[name=\""+el+"\"]") !== null && this.responseDom.querySelector("meta[name=\""+el+"\"]") !== null)
      {
        Austral.Config.page.dom.querySelector("meta[name=\""+el+"\"]").content = this.responseDom.querySelector("meta[name=\""+el+"\"]").content;
      }
    });
    Debug.log("Response - Refresh Meta - Stop");
/*
    this.mercure.initEventSource();
 */
  }

  refreshBodyClass() {
    Debug.log("Response - Refresh Body Class - Start");
    let newBodyClassArray = [];
    Austral.Config.page.dom.body.classList.forEach((e) => {
      if(e.indexOf('swal') >= 0) {
        newBodyClassArray.push(e);
      }
    });
    Austral.Config.page.dom.body.removeAttribute("class");
    this.responseDom.body.classList.forEach((e) => {
      newBodyClassArray.push(e);
    });
    if(newBodyClassArray.length > 0)
    {
      Austral.Config.page.dom.body.classList.add(...newBodyClassArray);
    }
    Debug.log("Response - Refresh Body Class - Stop");
  }

  refreshElements(elements, refreshImg) {
    this.elementsToRefresh.forEach((element) => {
      if(Austral.Config.page.dom.querySelector(element) && this.responseDom.querySelector(element))
      {
        Debug.log("Response - Refresh Element - Start - "+element.toString());
        Austral.Config.page.dom.querySelector(element).innerHTML = this.responseDom.querySelector(element).innerHTML;
        Debug.log("Response - Refresh Element - Stop - "+element.toString());
      }
    });

    [].forEach.call(Austral.Config.page.dom.querySelectorAll('*[data-refresh-container]'), (el) => {
      Debug.log("Response - Refresh Container - Start - "+el.dataset.refreshContainer);
      var origin = el.querySelectorAll("*[data-refresh-class]");
      var refresh = this.responseDom.querySelectorAll("*[data-refresh-container='"+el.dataset.refreshContainer+"'] *[data-refresh-class]");
      if(origin.length !== refresh.length)
      {
        if(this.responseDom.querySelector("*[data-refresh-container='"+el.dataset.refreshContainer+"']"))
        {
          el.innerHTML = this.responseDom.querySelector("*[data-refresh-container='"+el.dataset.refreshContainer+"']").innerHTML;
        }
      }
      else
      {
        origin.forEach((element, i) => {
          element.setAttribute("class", refresh[i].getAttribute("class"));
        });
      }
      Debug.log("Response - Refresh Container - Stop - "+el.dataset.refreshContainer);
    });
  }

  reloadFlashMessage() {
    if(this.responseDom.body.querySelector("#flash-messages-content"))
    {
      let deploymentMessage = Austral.Config.page.dom.body.querySelector("#flash-messages-content").querySelector(".object-deployment");
      if(deploymentMessage)
      {
        this.responseDom.body.querySelector("#flash-messages-content")
          .querySelector(".object-deployment")
          .setAttribute("data-flash-message-key", deploymentMessage.getAttribute("data-flash-message-key"))
      }
      Austral.Config.page.dom.body.querySelector("#flash-messages-content").innerHTML = this.responseDom.body.querySelector("#flash-messages-content").innerHTML;
      Austral.Config.page.initFlashMessage(Austral.Config.page.dom.body.querySelector("#flash-messages-content"));
    }
  }

}
export default Response;