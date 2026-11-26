/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { ComponentHook, DomEventManager, Debug } from "@austral/design";
import { v4 as uuidv4 } from "uuid";
import Config from "@austral/design/core/Config";

/**
 * Represents an abstract base class for creating and managing component instances.
 */
export default class abstractComponent {

  /**
   * Initializes all components matching the specified component name by querying DOM elements with `data-componentName` attributes.
   * Sets up each component by instantiating with the associated DOM element and optional callback.
   *
   * @param {string} componentName - The name of the component to initialize, used to query DOM elements.
   * @param {function|null} [callback=null] - An optional callback function to execute for each initialized component.
   * @return {void} This method does not return any value.
   */
  static initComponent(componentName, callback = null) {

    if (Config.isComponentDisabled(componentName)) {
      Debug.log("-- Component " + componentName + " is disabled, skipping initialization");
      return;
    }

    Debug.log("-- Component Initialise : "+componentName);
    [].forEach.call(document.querySelectorAll("*[data-"+componentName+"]"), (el) => {
      if(el.getAttribute("data-component-"+componentName+"-uuid") === undefined || el.getAttribute("data-component-"+componentName+"-uuid") === null)
      {
        let object = new this(el, componentName, callback);
      }
      else
      {
        let component = Config.getComponentByElement(componentName, el);
        if(component) {
          Debug.log("-- Component Refresh : " + componentName);
          component.refreshComponent();
        }
      }
    });
  }

  /**
   * Constructor for initializing a component with a unique identifier, name, and optional callback function.
   * Sets necessary attributes, registers the component, and manages event listeners.
   *
   * @param {Element} el - The DOM element associated with the component.
   * @param {string} componentName - The name of the component to be initialized.
   * @param {Function|null} [callback=null] - Optional callback function that executes after component initialization.
   * @return {void}
   */
  constructor (el, componentName, callback = null) {
    Debug.log("-- Component Constructor : " + componentName);
    this.uuid = uuidv4();
    this.componentName = componentName;
    this.element = el;
    try {
      if(!this.element.hasAttribute("data-component-"+componentName+"-uuid")) {
        this.element.setAttribute("data-component-"+componentName+"-uuid", this.uuid);
        Config.addComponent(componentName, this.uuid, this);
      }
      this.create(el);
      if(typeof callback === "function") {
        callback(this.element);
      }
      this.addEventListener();
      ComponentHook.run('component.'+this.componentName+".create", {
        module: this,
      });
      DomEventManager.addListener("component::initialize.finish", ()=> {
        this.addEventListenerLoadFinish();
      }, this.element);
    } catch (e) {
      Debug.log("Error : "+e+" -> "+componentName);
    }
  }

  /**
   * Deletes the associated element by setting it to null.
   *
   * @return {void} Does not return any value.
   */
  destroy() {
    Debug.log("Component - Destroy : "+this.componentName+" - "+this.uuid+"");
    ComponentHook.run('component.'+this.componentName+".delete", {
      module: this,
    });
    DomEventManager.removeAllListeners(this.element);
    this.element.remove();
    this.element = null;
  }

  /**
   * Registers an event listener on the specified target.
   *
   * @param {string} type - The name of the event to listen for.
   * @param {Function} listener - The callback function that will be invoked when the event is triggered.
   * @param {boolean|Object} [options] - Optional parameters to customize the event listener behavior.
   *                                       This can be a boolean indicating whether the event should be captured,
   *                                       or an object with additional options such as `capture`, `once`, and `passive`.
   * @throws {TypeError} Throws an error if the `type` is not a string or the `listener` is not a function.
   */
  addEventListener() {

  }

  /**
   * Attaches an event listener that triggers when the load operation is completed.
   *
   * This method is used to register a callback function that will be executed
   * when the "load finish" event is emitted. It can be useful for performing
   * operations or triggering processes once loading is fully complete.
   *
   * Note:
   * Ensure that the listener being added is properly managed to prevent memory leaks.
   */
  addEventListenerLoadFinish() {

  }

  /**
   * Creates a new element or instance based on the provided parameter.
   *
   * @param {any} el - The element or input data used to create the new instance or entity.
   */
  create (el) {

  }

  /**
   * Reloads or updates the current state or content. This method is typically used
   * to reinitialize, fetch new data, or apply updates, ensuring the application
   * reflects the latest changes.
   */
  refreshComponent () {

  }

}
