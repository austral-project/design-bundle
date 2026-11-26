/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {abstractModule, DomEventManager, Config, Debug } from "@austral/design";

/**
 * The Components class is an extension of the abstractModule class.
 * It is responsible for managing the initialization and loading of components
 * by handling associated events and logging activities during the process.
 */
export default class Components extends abstractModule {

  /**
   * Initializes the load process and
   */
  async load() {
    if(!this.isInitialise)
    {
      this.isInitialise = true;
      Debug.log("Components - Load");
      this.timeInitComponents = 0;
      DomEventManager.addListener("components::load", async (event) => {
        await this.initilizeComponents(event.detail.timeout === undefined ? 100 : event.detail.timeout);
      });
    }
  }

  async initilizeComponents(timeout = 100) {
    clearTimeout(this.timeInitComponents);
    this.timeInitComponents = setTimeout(() => {
      Debug.startGroup("Component");
        Debug.startGroup("Initialize");
        DomEventManager.dispatch("component::initialize");
        Debug.stopGroup();
        Debug.startGroup("Finish");
        DomEventManager.dispatch("component::initialize.finish");
        Debug.stopGroup();
      Debug.stopGroup();
      Debug.log(Config.getComponents());
    }, timeout);

  }


}
