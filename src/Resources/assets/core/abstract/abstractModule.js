/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DomEventManager, Config, Debug } from "@austral/design";

/**
 * Represents an abstract module. This class provides a template for creating modules
 * with essential functionalities such as initialization, event binding, and state management.
 */
export default class abstractModule {

  /**
   * Initializes a module by creating an instance and registering it in the configuration.
   *
   * @param {string} moduleName - The name of the module to initialize.
   * @return {void}
   */
  static async initialize(moduleName) {
    if (Config.isModuleDisabled(moduleName)) {
      Debug.log(moduleName + " - Module disabled, skipping load");
      return;
    }
    let module = new this(moduleName);
    Debug.log(moduleName + " - Initialize");
    Config.addModule(moduleName, module);
    return module;
  }

  /**
   * The constructor initializes the object by calling the `create` method
   * and sets the `isInitialise` property to
   */
  constructor() {
    this.create();
    this.isInitialise = false;
  }

  /**
   * Registers a listener for the "modules::load" event and binds it to the load method of the current context.
   *
   * @return {void} Does not return a value.
   */
  create() {
    DomEventManager.addListener("modules::load", this.load.bind(this));
  }

  /**
   * Determines if the current instance is initialized.
   *
   * @return {boolean} Returns true if the instance is initialized, false otherwise.
   */
  isInitialised() {
    return this.isInitialise;
  }

  /**
   * Loads the required data or resources necessary for the operation of the application or module.
   *
   * This method may perform initialization, resource fetching, or other preparatory tasks as needed.
   *
   * Note that this is a placeholder method and the specific implementation details
   * should be provided based on the requirements of the application.
   *
   * Throws an error if the loading process encounters any issues.
   */
  async load() {
  }


}
