/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { Config, modules, DomEventManager, IconRegistry, Debug } from "@austral/design";

class Loader {

  constructor() {

  }

  async initialize() {

    Debug.debugGridCol();
    Debug.debugFlexCol();

    const iconsPromise = window.AUSTRAL_PICTOS_URL
      ? IconRegistry.loadFromJson(window.AUSTRAL_PICTOS_URL)
      : Promise.resolve();

    Debug.log("Loader - Initialize all modules");
    await Promise.all([iconsPromise, this.loadModules()]);
    Debug.log("Loader - Initialization complete");
    DomEventManager.dispatch("modules::load");
    DomEventManager.dispatch("page::init.first");
  }

  async loadModules() {
    const entries = Object.entries(modules);

    const results = await Promise.allSettled(entries.map(async ([name, ModuleLoader]) => {
      if (Config.isModuleDisabled(name)) {
        Debug.log(`${name} - Module disabled, skipping load`);
        return;
      }
      if (!ModuleLoader) return;
      if (ModuleLoader?.initialize) {
        const module = await ModuleLoader.initialize(name);
        if (module?.load) {
          await module.load();
        }
      } else {
        Debug.log(`${name} - Module loaded but initialize() not found`);
      }
    }));

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        Debug.log(`${entries[i][0]} - Module failed to load`, r.reason);
      }
    });
  }

}

/**
 * @returns {Loader}
 */
export default new Loader();
