/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


import {abstractModule, DomEventManager, Hook, Config, Request, Response, Debug } from "@austral/design";
import {v4 as uuidv4} from "uuid";

/**
 * This class provides functionality to handle reload triggers within a web page.
 * Reload triggers allow specified elements to initiate asynchronous page or content reloads
 * based on specific user interactions, such as clicks or form submissions.
 *
 * It includes management methods to initialize, clean, and process elements marked
 * with reload-trigger attributes, and executes the appropriate actions when interactions occur.
 *
 * Extends `abstractModule`.
 */
export default class ReloadTrigger extends abstractModule {

  /**
   * Initializes the reload trigger functionality if the "data-reload-trigger-enabled" attribute
   * is present on the document's body. Configures reload trigger options and sets up event
   * listeners for managing reload triggers.
   *
   * @return {void} Does not return anything.
   */
  async load() {
    let initialise = document.body.hasAttribute("data-reload-trigger-enabled");
    if(Config.getParameter("storybook", false) === true)
    {
      document.querySelectorAll(".sbdocs-preview a").forEach((reloadTriggerElement) => {
        DomEventManager.addListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          alert("Click Link disabled");
        }, reloadTriggerElement);
      });
    }
    else if(initialise)
    {
      Debug.log("ReloadTrigger - Load");
      this.reloadTriggerOptions = Object.assign({
        refresh:              {
          "default":    "body"
        },
        refreshElementsClass: [
          "#header-area"
        ]
      }, JSON.parse(document.body.dataset.reloadTriggerEnabled));
      this.reloadTriggerElements = {};
      if(this.isLoading)
      {
        DomEventManager.addListener("reload-trigger::load", this.loadReloadTriggers.bind(this));
        DomEventManager.addListener("reload-trigger::add", (event) => {
          if(event.detail.element)
          {
            this.initReloadTriggerElement(event.detail.element, event.detail.clickEvent ?? true, event.detail.options ?? {});
          }
        });
      }
      this.isLoading = true;
    }
  }

  /**
   * Loads and initializes reload trigger elements by selecting all elements with the `data-reload-trigger` attribute.
   * Ensures each element has a unique identifier and initializes it if necessary.
   * Cleans up previously registered reload trigger elements before processing.
   *
   * @return {void} Does not return a value.
   */
  async loadReloadTriggers() {
    this.cleanReloadTriggerElements();
    document.querySelectorAll("*[data-reload-trigger]").forEach((reloadTriggerElement) => {
      if(!reloadTriggerElement.hasAttribute("data-reload-trigger-uuid"))
      {
        this.initReloadTriggerElement(reloadTriggerElement);
      }
    });
    Debug.log(this.reloadTriggerElements ? this.reloadTriggerElements : "No reload trigger elements found !");
  }

  /**
   * Cleans up and removes reload trigger elements that are no longer present in the DOM.
   *
   * This method iterates through all registered reload trigger elements, checks if they still exist in the DOM,
   * and deletes the corresponding entries if they are not found in the document body.
   *
   * @return {void} This method does not return a value.
   */
  cleanReloadTriggerElements()
  {
    if(this.reloadTriggerElements) {
      for(const[key, reloadTriggerElement] of Object.entries(this.reloadTriggerElements)) {
        if(document.body.querySelector('*[data-reload-trigger-uuid="'+key+'"]') === null) {
          this.deleteReloadTriggerElementByKey(key);
        }
      }
    }
  }

  /**
   * Checks whether a reload trigger element exists for the specified key.
   *
   * @param {string} key - The key to check for a corresponding reload trigger element.
   * @return {boolean} Returns true if a reload trigger element exists for the given key, otherwise false.
   */
  hasReloadTriggerElementByKey(key) {
    return key !== undefined && key in this.reloadTriggerElements;
  }

  /**
   * Deletes a reload trigger element from the collection by the specified key.
   *
   * @param {string} key - The key of the reload trigger element to be deleted.
   * @return {Object} The current instance for chaining.
   */
  deleteReloadTriggerElementByKey(key) {
    if(this.hasReloadTriggerElementByKey(key))
    {
      let reloadTriggerElement = this.reloadTriggerElements[key];
      Debug.log("Reload Trigger - Destroy : "+reloadTriggerElement.uuid+"");
      DomEventManager.removeAllListeners(reloadTriggerElement.element);
      delete this.reloadTriggerElements[key];
    }
    return this;
  }

  /**
   * Initializes the reload trigger element by attaching necessary attributes, parsing options,
   * and setting up event listeners for the element. This method helps configure elements to
   * trigger reload actions with specific options and behavior.
   *
   * @param {HTMLElement} reloadTriggerElement - The DOM element that will act as a reload trigger.
   *                                             This can be a link, form, or other interactive element.
   * @param {boolean} clickEvent - Whether to attach a click event listener to the reload trigger element.
   *                                Defaults to true.
   * @return {void} This method does not return any value, it sets up the necessary configurations
   *                and stores them in the internal `reloadTriggerElements` property.
   */
  initReloadTriggerElement(reloadTriggerElement, clickEvent = true, options = {})
  {
    let uuid = uuidv4();
    reloadTriggerElement.setAttribute("data-reload-trigger-uuid", uuid);
    try {
      if(reloadTriggerElement.hasAttribute("data-reload-trigger-options"))
      {
        options = JSON.parse( reloadTriggerElement.getAttribute("data-reload-trigger-options"));
      }
    }catch(e){

    }

    let reloadTriggerElementOptions = Object.assign({
      action:                     "reload",
      pathUrl:                    "",
      isForm:                     reloadTriggerElement.tagName.toLowerCase() === "form",
      method:                     reloadTriggerElement.tagName.toLowerCase() === "form" ? (reloadTriggerElement.hasAttribute("method") ? reloadTriggerElement.getAttribute("method") : "POST") : "GET",
      requestParameters:          [],
      refreshKey:                 "default",
      refreshElements:            null,
      refreshElementsClass:       [],
      dispatch:                   null,
      replaceState:               true,
      pushHistory:                true,
      refreshDom:                 true,
      transition:                 "default",
      autoScroll:                 true,
      scrollToElement:            "",
      scrollTopOffset:            0
    }, options);

    if(reloadTriggerElementOptions.refreshElements !== null)
    {
      let refreshElements = null
      try {
        refreshElements = JSON.parse(reloadTriggerElementOptions.refreshElements);
      } catch (e) {
        refreshElements = reloadTriggerElementOptions.refreshElements;
      }
      reloadTriggerElementOptions.refreshElements = refreshElements;
    }
    else
    {
      let refreshKey = reloadTriggerElementOptions.refreshKey;
      if(!refreshKey && !(refreshKey in this.reloadElements['refresh']))
      {
        refreshKey = "default";
      }
      reloadTriggerElementOptions.refreshElements = this.reloadTriggerOptions["refresh"][refreshKey];
    }
    if(reloadTriggerElementOptions.refreshElementsClass.length === 0)
    {
      reloadTriggerElementOptions.refreshElementsClass = this.reloadTriggerOptions["refreshElementsClass"];
    }
    if(!reloadTriggerElementOptions.pathUrl)
    {
      if(reloadTriggerElement.tagName.toLowerCase() === "form")
      {
        reloadTriggerElementOptions.pathUrl = reloadTriggerElement.getAttribute("action");
      }
      else
      {
        reloadTriggerElementOptions.pathUrl = reloadTriggerElement.getAttribute("href");
      }
    }

    let request = new Request(
      reloadTriggerElementOptions.pathUrl,
      reloadTriggerElementOptions.method,
      reloadTriggerElementOptions.requestParameters
    );
    if(reloadTriggerElementOptions.isForm)
    {
      request.setForm(reloadTriggerElement);
    }

    let response = null;
    if(reloadTriggerElementOptions.refreshKey === "login")
    {
      response = new Response(reloadTriggerElementOptions.replaceState,
        reloadTriggerElementOptions.pushHistory,
        reloadTriggerElementOptions.refreshDom,
        this.reloadTriggerOptions["refresh"]["all"],
        reloadTriggerElementOptions.refreshElementsClass
      );
    }
    else
    {
      response = new Response(reloadTriggerElementOptions.replaceState,
        reloadTriggerElementOptions.pushHistory,
        reloadTriggerElementOptions.refreshDom,
        reloadTriggerElementOptions.refreshElements,
        reloadTriggerElementOptions.refreshElementsClass
      );
    }

    this.reloadTriggerElements[uuid] = {
      "element":    reloadTriggerElement,
      "uuid":       uuid,
      "options":    reloadTriggerElementOptions,
      "request":    request,
      "response":   response,
    };


    DomEventManager.addListener('refresh-url', this.refreshUrl.bind(this, uuid), reloadTriggerElement);

    if(reloadTriggerElementOptions.isForm)
    {
      if(clickEvent)
      {
        DomEventManager.addListener('submit', this.submit.bind(this, uuid), reloadTriggerElement);
      }
      DomEventManager.addListener('reloadTrigger::send', (event) => {
        this.submit(uuid, event)
      }, reloadTriggerElement);
    }
    else
    {
      if(clickEvent)
      {
        DomEventManager.addListener('click', this.click.bind(this, uuid), reloadTriggerElement);
      }
      DomEventManager.addListener('reloadTrigger::send', (event) => {
        this.click(uuid, event)
      }, reloadTriggerElement);
    }
  }

  async refreshUrl(objectUuid, event) {
    const reloadTriggerElement = this.reloadTriggerElements[objectUuid];
    if (reloadTriggerElement) {
      reloadTriggerElement.request.url = reloadTriggerElement.element.href;
      this.reloadTriggerElements[uuid] = reloadTriggerElement;
    }
  }

  /**
   * Handles click events on specific elements, performs actions based on the provided event properties,
   * and executes additional transitions or scroll logic when applicable.
   *
   * @param {string} objectUuid - The unique identifier of the object associated with the clicked element.
   * @param {Event} event - The event object representing the triggered click event.
   * @return {Promise<void>} A promise that resolves when all actions, including potential page transitions and events, are completed.
   */
  async click(objectUuid, event) {
    const reloadTriggerElement = this.reloadTriggerElements[objectUuid];
    if (reloadTriggerElement) {

      if(event.detail?.pathUrl)
      {
        reloadTriggerElement.options.pathUrl = event.detail.pathUrl;
        reloadTriggerElement.request.url = event.detail.pathUrl;
      }

      const result = await Hook.run('reloadTrigger.click.before', {
        event: event,
        module: this,
        reloadTriggerElement: reloadTriggerElement
      });

      event.preventDefault();
      event.stopPropagation();
      if (result === false) {
        return;
      }

      reloadTriggerElement.element.classList.add("load");
      let loadingOverlay = reloadTriggerElement.element.closest("*[data-loading-overlay]");
      if(loadingOverlay)
      {
        loadingOverlay.classList.add("loading-overlay-view");
      }

      if (event.ctrlKey) {
        window.open(reloadTriggerElement.options.pathUrl, "_blank");
      } else {
        DomEventManager.dispatch("page::load");
        await Config.getModule("PageTransition")?.transitionStart(reloadTriggerElement.options.transition);
        await reloadTriggerElement.request.execute(reloadTriggerElement.response);
        await Config.getModule("PageTransition")?.transitionScroll(
          reloadTriggerElement.options.autoScroll ? window : null,
          reloadTriggerElement.options.scrollToElement,
          reloadTriggerElement.options.scrollTopOffset
        ).then(async () => {
            DomEventManager.dispatch("page::init");
            DomEventManager.dispatch("page::unload", {transition: true});
            if (reloadTriggerElement.options.dispatch) {
              DomEventManager.dispatch(reloadTriggerElement.options.dispatch, {});
            }
            await Hook.run('reloadTrigger.click.finish', {
              event: event,
              module: this,
              reloadTriggerElement: reloadTriggerElement
            });
        });

        await Hook.run('reloadTrigger.click.after', {
          event: event,
          module: this,
          reloadTriggerElement: reloadTriggerElement
        });

      }
    }
  }

  /**
   * Submits a form or interface interaction defined by an object UUID, manages page reloads,
   * transitions, and error handling for specific elements.
   *
   * @param {string} objectUuid - The unique identifier for the target element associated with the submission.
   * @param {Event} event - The event object triggered by the submission.
   * @return {Promise<void>} A promise that resolves when the submission process, including page interactions and transitions, is fully completed.
   */
  async submit(objectUuid, event) {
    const reloadTriggerElement = this.reloadTriggerElements[objectUuid];
    if (reloadTriggerElement) {

      const result = await Hook.run('reloadTrigger.submit.before', {
        event: event,
        module: this,
        reloadTriggerElement: reloadTriggerElement
      });
      event.preventDefault();
      event.stopPropagation();
      if (result === false) {
        return;
      }

      DomEventManager.dispatch("page::load");
      let buttonClick = event.detail !== undefined && event.detail.buttonClick !== undefined ? event.detail.buttonClick : null;
      if(buttonClick === null && event.submitter)
      {
        buttonClick = event.submitter;
      }
      this.buttonClickToggle(buttonClick);

      let formSuccess = false;
      let responseDom;
      let scrollElement = null;
      let firstErrorInput = null;
      let scrollOffset = 0;
      await reloadTriggerElement.request.execute(async (fetchResponse) => {
        await fetchResponse.text().then(async (text) => {
          let parser = new DOMParser();
          responseDom = parser.parseFromString(text, "text/html");
          if(responseDom.querySelectorAll(".field-row.error").length === 0)
          {
            formSuccess = true;
          }
          if(buttonClick)
          {
            buttonClick = responseDom.querySelector("#"+buttonClick.getAttribute("id")) ?? buttonClick;
            this.buttonClickToggle(buttonClick);
          }
        });
      }).then(async resolved => {
        if(formSuccess) {
          await Config.getModule("PageTransition")?.transitionStart(reloadTriggerElement.options.transition);
          setTimeout(async () => {
            await reloadTriggerElement.response.executeResponse(responseDom);
            await Config.getModule("PageTransition")?.transitionScroll(
              reloadTriggerElement.options.autoScroll ? window : null,
              reloadTriggerElement.options.scrollToElement,
              reloadTriggerElement.options.scrollTopOffset,
              "instant"
            ).then(async () => {
              DomEventManager.dispatch("page::init");
              DomEventManager.dispatch("page::unload", {transition: true});
              if (reloadTriggerElement.options.dispatch) {
                DomEventManager.dispatch(reloadTriggerElement.options.dispatch, {});
              }
              if(buttonClick)
              {
                buttonClick = document.querySelector("#"+buttonClick.getAttribute("id"));
                this.buttonClickToggle(buttonClick, true);
              }
            });
          }, 500);
        }
        else {
          await reloadTriggerElement.response.executeResponse(responseDom, "error");
          await Config.getModule("Page")?.init(false);
          await Config.getModule("ScrollAnimate")?.execute();
          await Config.getModule("Page")?.pageUnload(false);
          if (reloadTriggerElement.options.dispatch) {
            DomEventManager.dispatch(reloadTriggerElement.options.dispatch, {});
          }
          scrollOffset = 200;
          scrollElement = document.querySelectorAll(".field-row.error")[0];
          firstErrorInput = scrollElement.querySelector("input, select");
          firstErrorInput.focus({preventScroll: true});
          await Config.getModule("PageTransition")?.transitionScroll(
            window,
            firstErrorInput,
            scrollOffset,
            "smooth"
          );
          if (buttonClick) {
            buttonClick = document.querySelector("#" + buttonClick.getAttribute("id"));
            this.buttonClickToggle(buttonClick, true);
          }
        }
        await Hook.run('reloadTrigger.button.finish', {
          event: event,
          module: this,
          reloadTriggerElement: reloadTriggerElement,
          buttonClick: buttonClick,
          formStatus: formSuccess ? "success" : "error"
        });


      });
      await Hook.run('reloadTrigger.submit.after', {
        event: event,
        module: this,
        buttonClick: buttonClick,
        reloadTriggerElement: reloadTriggerElement
      });

    }
  }

  buttonClickToggle(buttonClick, unload = false)
  {
    if(buttonClick)
    {
      if(unload) {
        buttonClick.classList.remove("load");
      }
      else {
        buttonClick.classList.add("load");
      }

      let loadingOverlay = buttonClick.closest("*[data-loading-overlay]");
      if(loadingOverlay)
      {
        if(unload) {
          loadingOverlay.classList.remove("loading-overlay-view");
        }
        else {
          loadingOverlay.classList.add("loading-overlay-view");
        }
      }
    }
  }

}


