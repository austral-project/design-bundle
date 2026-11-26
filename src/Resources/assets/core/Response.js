/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { DomEventManager, ResponseHook, Config, Debug } from "@austral/design";

/**
 * Represents a Response that manages the state and dynamic DOM updates based on a fetch response.
 */
export default class Response {

  /**
   * Creates an instance of the class with options to manipulate the history state, refresh DOM elements,
   * and execute a callback function.
   *
   * @param {boolean} [replaceState=false] - Determines whether to replace the current history state.
   * @param {boolean} [pushHistory=false] - Determines whether to push a new entry to the history.
   * @param {boolean} [refreshDom=false] - Indicates whether the DOM should be refreshed.
   * @param {Array} [refreshElements=[]] - Specifies the list of elements to be refreshed in the DOM.
   * @param {Array} [refreshElementsClass=[]]  - Specifies the list of elements to be refreshed Class in the DOM.
   * @param {Function} [callback] - The callback function to be executed after actions are performed.
   * @return {void}
   */
  constructor(replaceState = false, pushHistory = false, refreshDom = false, refreshElements = [], refreshElementsClass = [], callback) {
    this.replaceState = replaceState;
    this.pushHistory = pushHistory;
    this.refreshDom = refreshDom;
    this.refreshElements = refreshElements;
    this.refreshElementsClass = refreshElementsClass;
    this.callback = callback;
    this.responseDom = null;
    this.status = null;
  }

  /**
   * Sets the replaceState property and updates its value.
   *
   * @param {boolean} replaceState - A boolean flag to define the new state to be set.
   * @return {Object} Returns the current instance to allow method chaining.
   */
  setReplaceState(replaceState) {
    this.replaceState = replaceState;
    return this;
  }

  /**
   * Sets the push history for the current instance.
   *
   * @param {Array|Object} pushHistory - The push history to be assigned. It can be an array or an object representing the history data.
   * @return {Object} The current instance for method chaining.
   */
  setPushHistory(pushHistory) {
    this.pushHistory = pushHistory;
    return this;
  }

  /**
   * Sets the elements to be refreshed.
   *
   * @param {Array|*} elements - The element or array of elements to be set for refreshing.
   *                             If a single element is provided, it is converted into an array internally.
   * @return {Object} Returns the instance of the current object for method chaining.
   */
  setRefreshElements(elements) {
    if(!Array.isArray(elements))
    {
      elements = [elements];
    }
    this.refreshElements = elements;
    return this;
  }

  /**
   * Sets the refreshDom property and synchronizes it with updateBodyClass.
   *
   * @param {boolean} refreshDom - A boolean value to indicate the refresh state of the DOM.
   * @return {Object} The current instance for method chaining.
   */
  setRefreshDom(refreshDom) {
    this.refreshDom = refreshDom;
    this.updateBodyClass = refreshDom;
    return this;
  }

  /**
   * Sets the updateBodyClass property and returns the current instance.
   *
   * @param {boolean} updateBodyClass - Indicates whether to update the body class.
   * @return {Object} The current instance for chaining.
   */
  setUpdateBodyClass(updateBodyClass) {
    this.updateBodyClass = updateBodyClass;
    return this;
  }

  /**
   * Executes the provided response handling process including parsing, history manipulation, and DOM updates.
   *
   * @param {Response} fetchResponse - The response object from a fetch request to be processed.
   * @return {Promise<void>} A promise that resolves once all response handling and callbacks are completed.
   */
  async execute(fetchResponse) {
    Debug.log("Response - Execute - Start");
    await fetchResponse.text().then(async (text) => {
      let parser = new DOMParser();
      await this.executeResponse(parser.parseFromString(text, "text/html"));
    });
  }

  /**
   * Executes the provided response handling process including parsing, history manipulation, and DOM updates.
   *
   * @param {Document} domHtml - The response object from a fetch request to be processed.
   * @return {Promise<void>} A promise that resolves once all response handling and callbacks are completed.
   */
  async executeResponse(domHtml, status = "success") {
    Debug.log("Response - Execute - Start");
    this.responseDom = domHtml;

    this.status = status;
    await ResponseHook.run('response.start', { response: this });
    if (this.pushHistory) {
      history.pushState({prevUrl: window.location.href}, null, this.responseDom.body.dataset.uri);
    }

    if (this.replaceState) {
      history.replaceState({path: this.responseDom.body.dataset.uri}, null, this.responseDom.body.dataset.uri);
    }

    if (this.refreshDom) {
      Config.dom.body.dataset.uri = this.responseDom.body.dataset.uri;
      Config.dom.body.dataset.mercure = this.responseDom.body.dataset.mercure;
      if (this.refreshElements) {
        this.refreshBodyClass();
        this.executeRefreshElementsClass();
        this.executeRefreshElements();
        this.executeRefreshMeta();
        this.executeReloadTracking();
      }
    } else if (this.refreshElements) {
      this.executeRefreshElements();
    }
    await ResponseHook.run('response.refresh', { response: this });

    if (typeof this.callback === "function") {
      Debug.log("Response - Execute - Callback");
      await this.callback(domHtml);
    }

    await ResponseHook.run('response.finish', { response: this });
    Debug.log("Response - Execute - Stop");
  }

  /**
   * Updates the meta elements, canonical link, and specific script-refresh elements in the DOM based on the response DOM.
   *
   * The method performs the following updates:
   * - Refreshes the page title using the corresponding title from the response DOM.
   * - Refreshes specific meta tags (e.g., description and og:title) using their counterparts in the response DOM.
   * - Updates the canonical link's href attribute if it exists in both the current and response DOMs.
   * - Updates elements marked with a `data-script-refresh` attribute by replacing their content with the matching element from the response DOM.
   *
   * @return {void} This method does not return any value.
   */
  executeRefreshMeta() {
    Debug.log("Response - Refresh Meta - Start");

    const dom = Config.dom;
    const responseDom = this.responseDom;

    // --- Title ---
    const newTitle = responseDom.querySelector("title");
    const title = dom.querySelector("title");
    if (title && newTitle) {
      title.text = newTitle.text;
    }

    // --- Canonical ---
    const newCanonical = responseDom.querySelector("link[rel='canonical']");
    const canonical = dom.querySelector("link[rel='canonical']");
    if (canonical && newCanonical) {
      canonical.href = newCanonical.href;
    }

    // --- Alternate links ---
    const oldAlternateLinks = Array.from(dom.querySelectorAll("link[rel='alternate']"));
    const newAlternateLinks = Array.from(responseDom.querySelectorAll("link[rel='alternate']"));

    // Create a map for faster lookup by hreflang
    const newAlternateMap = Object.fromEntries(newAlternateLinks.map(link => [link.getAttribute("hreflang"), link]));

    // Remove old that no longer exist
    oldAlternateLinks.forEach(link => {
      if (!newAlternateMap[link.getAttribute("hreflang")]) {
        link.remove();
      }
    });

    // --- Meta tags ---
    const metaNames = ["description", "og:title"];
    metaNames.forEach(name => {
      const oldMeta = dom.querySelector(`meta[name='${name}']`);
      const newMeta = responseDom.querySelector(`meta[name='${name}']`);
      if (oldMeta && newMeta) {
        oldMeta.content = newMeta.content;
      }
    });

    // --- Script refresh ---
    const oldScripts = Array.from(dom.querySelectorAll("*[data-script-refresh]"));
    const newScripts = Array.from(responseDom.querySelectorAll("*[data-script-refresh]"));

    // Remove old scripts not in new
    const newScriptMap = Object.fromEntries(newScripts.map(el => [el.getAttribute("data-script-refresh"), el]));
    oldScripts.forEach(el => {
      if (!newScriptMap[el.getAttribute("data-script-refresh")]) {
        el.remove();
      }
    });

    // Update or append new scripts
    newScripts.forEach(el => {
      const target = dom.querySelector(`*[data-script-refresh='${el.getAttribute("data-script-refresh")}']`);
      if (target) {
        target.innerHTML = el.innerHTML;
      } else {
        dom.head.appendChild(el.cloneNode(true));
      }
    });

    Debug.log("Response - Refresh Meta - Stop");
  }

  /**
   * Executes the process of reloading and tracking the user's activity on the current page.
   * This includes updating the document title, the current URL, and logging a page view.
   *
   * @return {void} Does not return a value.
   */
  executeReloadTracking() {
    Debug.log("Response - Refresh Tracking - Start");
    DomEventManager.dispatch('analytics::refresh', { response: this });
    Debug.log("Response - Refresh Tracking - Stop");
  }

  /**
   * Updates the body element's class list by refreshing and combining specific classes
   * from the current document and the response DOM. Filters classes containing specific
   * keywords, such as 'load' and 'popin-open', and applies them to the body element.
   *
   * @return {void} This method does not return a value.
   */
  refreshBodyClass() {
    Debug.log("Response - Refresh Body Class - Start");

    const preserveClasses = Config.bodyPreserveClasses || ['load'];
    let newBodyClassArray = [];

    Config.dom.body.classList.forEach((cls) => {
      if (preserveClasses.some(p => cls.includes(p))) {
        newBodyClassArray.push(cls);
      }
    });

    // Supprime toutes les classes existantes
    Config.dom.body.removeAttribute("class");

    // Ajoute les classes du response DOM
    this.responseDom.body.classList.forEach((cls) => {
      newBodyClassArray.push(cls);
    });

    // Applique les classes finales
    if (newBodyClassArray.length > 0) {
      Config.dom.body.classList.add(...newBodyClassArray);
    }

    Debug.log("Response - Refresh Body Class - Stop");
  }

  /**
   * Updates the body element's class list by refreshing and combining specific classes
   * from the current document and the response DOM. Filters classes containing specific
   * keywords, such as 'load' and 'popin-open', and applies them to the body element.
   *
   * @return {void} This method does not return a value.
   */
  executeRefreshElementsClass() {
    Debug.log("Response - Refresh Elements Class - Start");
    this.refreshElementsClass.forEach((element) => {
      let newElementClassArray = [];
      if(this.responseDom.querySelector(element))
      {
        Config.dom.querySelector(element).removeAttribute("class");
        this.responseDom.querySelector(element).classList.forEach((e) => {
          newElementClassArray.push(e);
        });
        if(newElementClassArray.length > 0)
        {
          Config.dom.querySelector(element).classList.add(...newElementClassArray);
        }
      }
    });
    Debug.log("Response - Refresh Elements Class - Stop");
  }

  /**
   * Executes the process of refreshing elements on the DOM with content from a response DOM.
   * It targets specific elements and containers, updating their inner content or classes as needed.
   *
   * @return {void} Does not return a value. This method updates the DOM directly.
   */
  executeRefreshElements() {
    this.refreshElements.forEach((element) => {
      if(Config.dom.querySelector(element) && this.responseDom.querySelector(element))
      {
        Debug.log("Response - Refresh Element - Start - "+element.toString());
        Debug.log("Response - Refresh Element Destination - Start - "+element.toString());
        Config.dom.querySelector(element).innerHTML = this.responseDom.querySelector(element).innerHTML;
        Debug.log("Response - Refresh Element - Stop - "+element.toString());
        Debug.log("Response - Refresh Element Destination - Stop - "+element.toString());
      }
    });

    [].forEach.call(Config.dom.querySelectorAll('*[data-refresh-container]'), (el) => {
      Debug.log("Response - Refresh Container - Start - "+el.dataset.refreshContainer);
      var origin = el.querySelectorAll("*[data-refresh-class]");
      var refresh = this.responseDom.querySelectorAll("*[data-refresh-container='"+el.dataset.refreshContainer+"']");
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

}
