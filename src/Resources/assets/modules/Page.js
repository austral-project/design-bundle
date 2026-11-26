/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {abstractModule, DomEventManager, Config, FocusManager, Hook, Debug, LibLoader} from "@austral/design";

/**
 * Represents the Page module that manages page lifecycle events such as initialization,
 * loading, and unloading, while integrating with additional modules and handling transitions.
 *
 * The module listens for various events to manage page-specific functionality including transitions,
 * accessibility, and event-based interactions.
 */
export default class Page extends abstractModule {

  /**
   * Sets up event listeners for various page lifecycle events such as load, unload, and initialization.
   * The method handles asynchronous actions based on the event details and ensures appropriate page transitions.
   *
   * @return {void} This method does not return a value.
   */
  async load() {
    if(!this.isInitialise)
    {
      LibLoader.addGSAPPlugin('ScrollTrigger', async () => {
        const { ScrollTrigger } = await import(/* webpackChunkName: "gsap-scrollTrigger" */ 'gsap/ScrollTrigger');
        return ScrollTrigger;
      });

      this.gsap = await LibLoader.gsap();
      this.scrollTrigger = await LibLoader.loadGSAPPlugin('ScrollTrigger');
      this.isInitialise = true;
      DomEventManager.addListener("page::load", async (event) => {
        await this.pageLoad();
      });
      DomEventManager.addListener("page::unload", async (event) => {
        await this.pageUnload(event.detail.transition ?? false);
      });
      DomEventManager.addListener("page::init", async () => {
        await this.init();
      });
      DomEventManager.addListener("page::init.first", async () => {
        await this.init(true);
        await this.pageUnload(false, true);
      });

      let timeDragEnabled;
      DomEventManager.addListener(["dragover", "dragenter", "dragstart"], (e) => {
        clearTimeout(timeDragEnabled);
        if(!document.body.classList.contains("dragover-event") && e.dataTransfer.types.includes("Files"))
        {
          document.body.classList.add('dragover-event');
        }
      });
      DomEventManager.addListener(["dragleave", "dragend", "drop"], () => {
        timeDragEnabled = setTimeout(() => {
          document.body.classList.remove('dragover-event');
        }, 500);
      });


    }
  }

  /**
   * Handles the loading of a page, adding a load class to the body element
   * and optionally triggering a page transition if specified.
   *
   * @return {Promise<void>} Resolves when the pageLoad logic, including optional transitions, completes.
   */
  async pageLoad()
  {
    Config.dom.body.classList.add('load');
  }

  /**
   * Handles the unloading process for a page, including optional transitions and animations.
   *
   * @param {boolean} [transition=false] - A flag indicating whether to enable transition effects during the unload process.
   * @return {Promise<void>} Resolves when the page unload process, including any transitions or animations, is complete.
   */
  async pageUnload(transition = false, firstInitialise = false)
  {
    await Hook.run('page.unload.start', {
      module: this,
      firstInitialise: firstInitialise,
      transition: transition
    });
    if(transition)
    {
      await Config.getModule("ScrollAnimate")?.execute();
      await Config.getModule("PageTransition")?.transitionEnd();
      Debug.log("Nombre de tweens GSAP : "+this.gsap.globalTimeline.getChildren().length, this.gsap.globalTimeline.getChildren());
      Debug.log("Nombre de ScrollTrigger : "+this.scrollTrigger.getAll().length);
    }
    Config.dom.body.classList.remove('load');
    await Hook.run('page.unload.end', {
      module: this,
      firstInitialise: firstInitialise,
      transition: transition
    });
  }

  /**
   * Initializes the page by setting up configuration, accessibility features, and event dispatching.
   * Clears previous configurations, reassigns the document object, initializes DOM-specific accessibility settings,
   * dispatches various custom events, and adjusts hover behaviors for elements with `title` attributes.
   * Finally, restores the current focus state of the document.
   *
   * @return {Promise<void>} A promise that resolves when the initialization process is complete.
   */
  async init(firstInitialise = false) {
    Debug.log("Page - Init Start" +(firstInitialise ? " - FIRST" : ""));
    await Hook.run('page.init.start', {
      module: this,
      firstInitialise: firstInitialise
    });
    Config.clean();
    Config.dom = document;
    this.checkSystemTheme();
    FocusManager.initDom();
    this.gsap.globalTimeline.clear();
    await Config.getModule("Components")?.initilizeComponents(0);
    await Config.getModule("ReloadTrigger")?.loadReloadTriggers();
    Config.getModule("AlertSwal")?.initFlashMessages(document);
    DomEventManager.dispatch("lazy-loading::refresh");
    FocusManager.restoreCurrentFocus();
    await Hook.run('page.init.end', {
      module: this,
      firstInitialise: firstInitialise
    });
    Debug.log("Page - Init End");
  }

  /**
   * checkSystemTheme
   * With the theme "auto" (class auto on the body, theme of the user of the admin), follows the theme of the system:
   * class dark when the system is in dark mode.
   *
   * @return {void}
   */
  checkSystemTheme() {
    const body = document.body;
    if(!body.classList.contains("auto")) {
      return;
    }
    body.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
}
