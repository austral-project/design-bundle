/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {abstractModule, DomEventManager, Hook, Debug, Request, Response, Config} from "@austral/design";

/**
 * The PageTransition class is responsible for managing page transitions,
 * including transition effects at the start and end of transitions,
 * as well as scroll-based transitions. This class extends the abstractModule,
 * enabling it to integrate easily into a modular architecture.
 *
 * It listens for specific events to trigger the appropriate transition behaviors
 * and provides methods for customizing those behaviors such as fade-in/out effects
 * and smooth scrolling.
 *
 * Event Listeners:
 * - `page-transition::start`: Triggers the transition start effect.
 * - `page-transition::end`: Triggers the transition end effect.
 * - `page-transition::scroll`: Handles scroll-based transitions.
 */
export default class PageBack extends abstractModule {

  /**
   * Initializes and handles page transition events such as start, end, and scroll.
   * This method checks for the presence of a "data-page-transition" attribute on the
   * document body to determine initialization. It sets up event listeners for page
   * transition events and ensures appropriate methods are invoked within each event
   * lifecycle including triggering relevant dispatches upon the completion of transitions.
   *
   * @return {void} This method does not return a value.
   */
  async load() {
    if (this.isInitialise === false) {
      Debug.log("PageBack - Load");

      await Hook.run('pageBack.load', {
        module: this,
      });
      this.isInitialise = true;

      DomEventManager.addListener("popstate", async (event) => {
        let requestPath = false;
        if (event.state !== null && (typeof (event.state) !== 'undefined')) {
          requestPath = event.state.path;
        } else if (event.srcElement) {
          requestPath = event.srcElement.location.pathname;
        }
        await this.back(requestPath);
      }, window);
    }
  }

  async back(path = null) {
    Debug.log("PageBack - Back");

    if(path) {

      await Hook.run('pageBack.back.start', {
        module: this,
        path: path,
      });

      let request = new Request(
        path,
        "GET",
        []
      );

      let reloadTriggerOptions = Object.assign({
        refreshKey:                 "default",
        refreshElements:            null,
        dispatch:                   null,
        refreshElementsClass:       [],
        transition:                 "default",
      }, JSON.parse(document.body.dataset.reloadTriggerEnabled));

      let hookValue = await Hook.run('pageBack.back.options', {
        module: this,
        path: path,
        reloadTriggerOptions: reloadTriggerOptions
      });
      reloadTriggerOptions = hookValue.reloadTriggerOptions;

      let response = new Response(true,
        false,
        true,
        reloadTriggerOptions["refresh"]["default"],
      );

      DomEventManager.dispatch("page::load");
      await Config.getModule("PageTransition")?.transitionStart(reloadTriggerOptions.transition);
      await request.execute(response);
      await Config.getModule("PageTransition")?.transitionScroll(
        reloadTriggerOptions.autoScroll ? window : null,
        reloadTriggerOptions.scrollToElement,
        reloadTriggerOptions.scrollTopOffset
      ).then(async () => {
        DomEventManager.dispatch("page::init");
        DomEventManager.dispatch("page::unload", {transition: true});
        if (reloadTriggerOptions.dispatch) {
          DomEventManager.dispatch(reloadTriggerOptions.dispatch, {});
        }
        await Hook.run('pageBack.back', {
          module: this,
          path: path
        });
      });

      await Hook.run('pageBack.back.end', {
        module: this,
        path: path
      });
    }
  }

}
