/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {abstractModule, DomEventManager, Hook, Debug } from "@austral/design";

export default class Storybook extends abstractModule {

  /**
   * Initializes the load process and
   */
  async load() {
    if(!this.isInitialise)
    {
      Debug.log("Storybook - Load");
      this.isInitialise = true;
      this.timeInitStorybook = 0;
      await this.initialise();
      DomEventManager.addListener("storybook::refresh", async () => {
        await this.refresh();
      });
    }
  }

  async initialise()
  {
    Debug.log("Storybook - Initialise - Start");
    await Hook.run('storybook.initialise', {
      module: this,
    });
    Debug.log("Storybook - Initialise - End");
  }

  async refresh()
  {
    Debug.log("Storybook - Refresh - Start");
    await Hook.run('storybook.refresh', {
      module: this,
    });
    this.storybookPathSize();
    DomEventManager.dispatch("page::init");
    DomEventManager.dispatch("page::unload", {transition: true});

    Debug.log("Storybook - Refresh - End");
  }

  storybookPathSize() {
    const params = new URLSearchParams(window.location.search);
    const viewMode = params.get('viewMode') || "story";
    if(viewMode === "docs")
    {
      document.documentElement.style.setProperty('--storybook-marge', '182px');
    }
    else if(viewMode === "story")
    {
      document.documentElement.style.setProperty('--storybook-marge', '0px');
    }
  }

}
