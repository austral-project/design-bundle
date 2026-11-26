/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { DomEventManager, A11yHelpers, Debug } from "@austral/design";

/**
 * Represents the application's configuration and provides utility methods for managing components,
 * modules, parameters, objects, and focus states.
 */
class Config {

  /**
   * Creates an instance of the class and initializes internal properties
   * such as components, modules, objects, parameters, and other state-related variables.
   *
   * @return {Object} An instance of the class with initialized default properties.
   */
  constructor() {
    this.components = {};
    this.disabledComponents = new Set();
    this.modules = {};
    this.disabledModules = new Set();
    this.objects = {};
    this.parameters = {};
    this.dom = null;
    this.userId = null;
    this.currentFocus = null;
    this.currentFocusPath = null;
    this.lazyLoadingCheckLimit = true;
    this.mousePosition = {x: 0, y: 0};
    this.bodyPreserveClasses = ['load'];
    this.needCancelKeybordArrow = [".field-select"];
  }

  setCurrentFocusPath(elementPath) {
    this.currentFocusPath = elementPath;
    return this;
  }

  /**
   * Sets the current focus to the given element and updates the focus path accordingly.
   *
   * @param {HTMLElement} element - The HTML element to set as the current focus. If null or undefined, the focus is cleared.
   * @return {Object} The instance of the class, allowing method chaining.
   */
  setCurrentFocus(element) {
    this.currentFocus = element;
    this.currentFocusPath = element ? A11yHelpers.getPath(element) : null;
    return this;
  }

  /**
   * Retrieves the current focus of the object.
   *
   * @return {Object} The object or element currently in focus.
   */
  getCurrentFocus() {
    return this.currentFocus;
  }

  /**
   * Retrieves the current focus path.
   *
   * @return {string} The current focus path.
   */
  getCurrentFocusPath() {
    return this.currentFocusPath;
  }

  /**
   * Retrieves the current position of the mouse cursor.
   *
   * @return {Object} The current mouse position, typically containing x and y coordinates.
   */
  getMousePosition() {
    return this.mousePosition;
  }

  /**
   * Sets the mouse position to the specified x and y coordinates.
   *
   * @param {number} x - The x-coordinate of the mouse position.
   * @param {number} y - The y-coordinate of the mouse position.
   * @return {Object} The current instance of the object for method chaining.
   */
  setMousePosition(x, y) {
    this.mousePosition = {x: x, y: y};
    return this;
  }

  /**
   * Retrieves the user ID. If the user ID is not already set, it fetches it
   * from the body element's data attribute and stores it for future use.
   *
   * @return {string} The user ID.
   */
  getUserId() {
    if(!this.userId) {
      this.userId = document.querySelector("body").dataset.userId;
    }
    return this.userId;
  }

  /**
   * Checks if a specified key exists in the `objects` property of the class.
   *
   * @param {string|null} keyname - The key to be checked within the `objects` property. Defaults to null.
   * @return {boolean} Returns true if the key exists within the `objects` property, otherwise false.
   */
  hasObject(keyname = null) {
    return keyname in this.objects;
  }

  /**
   * Assigns an object to a specified key in the internal storage.
   *
   * @param {string} keyname - The key under which the object will be stored.
   * @param {Object} object - The object to store in the internal storage.
   * @return {Object} The instance of the class, allowing method chaining.
   */
  setObject(keyname, object)
  {
    this.objects[keyname] = object;
    return this;
  }

  /**
   * Retrieves an object associated with the specified key name.
   *
   * @param {string} keyname - The name of the key to retrieve the object for.
   * @return {Object|null} The object associated with the key, or null if not found.
   */
  getObject(keyname)
  {
    if(this.hasObject(keyname))
    {
      return this.objects[keyname];
    }
    return null;
  }

  /**
   * Checks if the specified parameter exists in the parameters object.
   *
   * @param {string|null} keyname - The name of the parameter to check. Defaults to null.
   * @return {boolean} Returns true if the parameter exists, otherwise false.
   */
  hasParameter(keyname = null) {
    return keyname in this.parameters;
  }

  /**
   * Sets a parameter in the parameters object with the specified key and value.
   *
   * @param {string} keyname - The key under which the object will be stored.
   * @param {*} object - The value to be assigned to the specified key.
   * @return {Object} The current instance of the object to allow method chaining.
   */
  setParameter(keyname, object)
  {
    this.parameters[keyname] = object;
    return this;
  }

  /**
   * Retrieves the value of a specified parameter.
   *
   * @param {string} keyname - The name of the parameter to retrieve.
   * @param {*} [defaultValue=null] - The value to return if the parameter does not exist.
   * @return {*} The value of the parameter if it exists, otherwise the default value.
   */
  getParameter(keyname, defaultValue = null)
  {
    if(this.hasParameter(keyname))
    {
      return this.parameters[keyname];
    }
    return defaultValue;
  }

  /**
   * Retrieves the list of modules.
   *
   * @return {Array} The array of modules.
   */
  getModules() {
    return this.modules;
  }

  /**
   * Retrieves a module by its name if it exists.
   *
   * @param {string} moduleName - The name of the module to retrieve.
   * @return {object|null} The module object if found, otherwise null.
   */
  getModule(moduleName) {
    if(this.hasModule(moduleName))
    {
      return this.modules[moduleName];
    }
    return null;
  }

  /**
   * Checks if the specified module exists in the collection of modules.
   *
   * @param {string} moduleName - The name of the module to check for existence.
   * @return {boolean} Returns true if the module exists, otherwise false.
   */
  hasModule(moduleName) {
    return moduleName in this.modules;
  }

  /**
   * Adds a module to the modules collection.
   *
   * @param {string} moduleName - The name of the module to be added.
   * @param {Object} module - The module object to be associated with the moduleName.
   * @return {void} No return value.
   */
  addModule(moduleName, module) {
    this.modules[moduleName] = module;
  }

  /**
   * Disables a module by adding it to the collection of disabled modules.
   *
   * @param {string} name - The name of the module to disable.
   * @return {void} This method does not return anything.
   */
  disableModule(name) {
    this.disabledModules.add(name.toLowerCase());
  }

  /**
   * Enables a previously disabled module by removing it from the disabledModules set.
   *
   * @param {string} name - The name of the module to enable.
   * @return {void} No return value.
   */
  enableModule(name) {
    this.disabledModules.delete(name.toLowerCase());
  }

  /**
   * Checks if a module is disabled.
   *
   * @param {string} name - The name of the module to check.
   * @return {boolean} Returns true if the module is disabled, otherwise false.
   */
  isModuleDisabled(name) {
    return this.disabledModules.has(name.toLowerCase());
  }

  /**
   * Retrieves the components associated with the instance.
   *
   * @return {Array|Object} The components associated with the instance.
   */
  getComponents() {
    return this.components;
  }

  /**
   * Retrieves components of a specified type from the internal storage.
   *
   * @param {string} type - The type of the component to retrieve.
   * @param {*} [defaultValue=null] - The default value to return if the component type does not exist.
   * @return {*} Returns the component of the specified type if it exists, otherwise returns the default value.
   */
  getComponentsByType(type, defaultValue = null) {
    if(this.hasComponent(type)) {
      return this.components[type];
    }
    return defaultValue;
  }

  /**
   * Adds a component of the specified type with the given key and value.
   * If the component type does not exist, it initializes the component type.
   *
   * @param {string} type - The type of component to add.
   * @param {string} key - The key for the component.
   * @param {*} value - The value to associate with the component key.
   * @return {Object} The current instance for method chaining.
   */
  addComponent(type, key, value) {
    if(!this.hasComponent(type)) {
      this.components[type] = {};
    }
    this.components[type][key] = value;
    return this;
  }

  /**
   * Checks if a specific component type or a component with a specific key exists.
   *
   * @param {string} type - The type of the component to check.
   * @param {string|null} [key=null] - The key of the component to check within the type. Defaults to null.
   * @return {boolean} Returns true if the component type exists; if key is provided, returns true if the key exists within the type.
   */
  hasComponent(type, key = null) {
    var returnValue = type in this.components;
    if(key !== null && returnValue === true) {
      return key in this.components[type];
    }
    return returnValue;
  }

  /**
   * Retrieves a specific component from the components storage based on the given type and key.
   * If the component does not exist, a default value is returned.
   *
   * @param {string} type - The type of the component.
   * @param {string} key - The key identifying the specific component within its type.
   * @param {*} [defaultValue=null] - The value to return if the component is not found.
   * @return {*} The component associated with the given type and key, or the default value if it does not exist.
   */
  getComponent(type, key, defaultValue = null) {
    if(this.hasComponent(type, key)) {
      return this.components[type][key];
    }
    return defaultValue;
  }

  /**
   * Retrieves a component of a specified type associated with a given element.
   *
   * @param {string} type - The type of the component to retrieve.
   * @param {Element} element - The DOM element corresponding to the component.
   * @param {*} [defaultValue=null] - The default value to return if the component is not found or the element is undefined.
   * @return {*} The component of the specified type if found, otherwise the default value.
   */
  getComponentByElement(type, element, defaultValue = null)
  {
    return element !== undefined ? this.getComponent(type, element.getAttribute("data-component-"+type+"-uuid"), defaultValue) : defaultValue;
  }

  /**
   * Removes a component of the specified type and optionally a key from the components collection.
   *
   * @param {string} type - The type of the component to remove.
   * @param {string|null} [key=null] - The optional specific key of the component to remove. If not provided, all components of the specified type will be removed.
   * @return {Object} The instance of the object after the component has been removed.
   */
  removeComponent(type, key = null){
    if(this.hasComponent(type, key)) {
      if(key !== null) {
        if(typeof this.components[type][key].destroy === "function") {
          this.components[type][key].destroy();
        }
        delete this.components[type][key];
      }
      else {
        delete this.components[type];
      }
    }
    return this;
  }

  /**
   * Disables a component by adding it to the collection of disabled components.
   *
   * @param {string} name - The name of the component to disable.
   * @return {void} This method does not return anything.
   */
  disableComponent(name) {
    this.disabledComponents.add(name.toLowerCase());
  }

  /**
   * Enables a previously disabled component by removing it from the disabledComponents set.
   *
   * @param {string} name - The name of the component to enable.
   * @return {void} No return value.
   */
  enableComponent(name) {
    this.disabledComponents.delete(name.toLowerCase());
  }

  /**
   * Checks if a component is disabled.
   *
   * @param {string} name - The name of the component to check.
   * @return {boolean} Returns true if the component is disabled, otherwise false.
   */
  isComponentDisabled(name) {
    return this.disabledComponents.has(name.toLowerCase());
  }


  /**
   * Cleans up the components by removing any that are no longer present in the DOM.
   *
   * Iterates through all registered components and checks if corresponding elements exist in the DOM.
   * If an element is not found, the component is removed.
   *
   * @return {Object} Returns the current instance for method chaining.
   */
  clean() {
    Debug.log("Config - Clean - Start");
    for(const[type, components] of Object.entries(this.getComponents())) {
      for(const[key, component] of Object.entries(components)) {
        if(document.body.querySelector('*[data-component-'+type+'-uuid="'+key+'"]') === null) {
          this.removeComponent(type, key);
        }
      }
    }
    Debug.log("Config - Clean - Stop");
    return this;
  }

  /**
   * Reinitialized the component configuration by removing component-related attributes
   * from the specified container's child elements and clears associated components.
   *
   * @param {HTMLElement} container - The DOM container to process for reinitialization.
   * @return {Object} - Returns the current instance of the object for method chaining.
   */
  reinit(container) {
    Debug.log("Config - Reinit - Start");
    for(const[type, components] of Object.entries(this.getComponents())) {
      for(const[key, component] of Object.entries(components)) {
        let element = container.querySelector('*[data-component-'+type+'-uuid="'+key+'"]');
        if(element) {
          element.removeAttribute("data-component-"+type+"-uuid");
          this.removeComponent(type, key);
        }
      }
    }
    Debug.log("Config - Reinit - Stop");
    return this;
  }

  /**
   * Dispatches a specified event to all components registered within the system.
   *
   * @param {string} eventName - The name of the event to be dispatched.
   * @param {Object} data - The data payload to be passed along with the event.
   * @param {boolean} [debug=true] - Flag indicating whether to log debug messages.
   * @param {string|null} [componentType=null] - The specific type of component to dispatch the event to. If null, the event is dispatched to all component types.
   * @return {Object} The current instance to allow method chaining.
   */
  dispatchAllComponents(eventName, data, debug = true, componentType = null) {
    if(debug) {
      Debug.log("Config - Dispatch All Components - Start :"+eventName);
    }
    for(const[type, components] of Object.entries(this.getComponents())) {
      if(componentType === null || componentType === type)
      {
        for(const[key, component] of Object.entries(components)) {
          if(component.hasOwnProperty("element"))
          {
            DomEventManager.dispatch(eventName, data, component.element);
          }
        }
      }
    }
    if(debug) {
      Debug.log("Config - Dispatch All Components - Stop : "+eventName);
    }
    return this;
  }

}

/**
 * @returns {Config}
 */
export default new Config();
