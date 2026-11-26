/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {abstractModule, DomEventManager, Request, Response, Config, Debug, Hook, utils} from "@austral/design";
import {EventSourcePolyfill} from "event-source-polyfill";


export default class Mercure extends abstractModule {

  /**
   * Initializes the load process and
   */
  async load() {
    let mercureDefined = document.body.hasAttribute("data-mercure");
    if(!this.isInitialise && mercureDefined)
    {
      this.isInitialise = true;
      Debug.log("Mercure - Load");
      await this.initialise();
      DomEventManager.addListener("mercure::initialise", this.initialise.bind(this));
    }
  }

  async initialise()
  {
    Debug.log("Mercure - Initialise - Start");
    await Hook.run('mercure.initialise', {
      module: this,
    });
    Debug.log("Mercure - Initialise - End");

    this.mercureParameters = document.body.dataset.mercure ? JSON.parse(document.body.dataset.mercure) : {};
    this.mercure = {};
    if(this.mercureParameters.url) {
      this.mercure.url = new URL(this.mercureParameters.url);
      for(var i = 0; i < this.mercureParameters.subscribes.length; i++) {
        this.mercure.url.searchParams.append('topic', this.mercureParameters.subscribes[i]);
      }
    }

    if(this.mercure.url !== undefined) {
      this.addEventSource();
    }

  }



  addEventSource() {

    Debug.log("Mercure - Event Source");
    if(this.eventSource) {
      this.eventSource.close();
    }
    this.eventSource = new EventSourcePolyfill(this.mercure.url, {
      heartbeatTimeout: 8640000000,
      headers: {
        "Authorization": 'Bearer ' + utils.dom.getCookie("mercureAuthorization")
      }
    });

    this.eventSource.onmessage = async (notification) => {
      Debug.log("**** Mercure - Receive Notification");
      let data = JSON.parse(notification.data);
      Debug.log(data);

      if (data.type !== undefined && (data.type === "reload" || data.type === "refresh")) {
        let response = new Response(false,
          false,
          data.type === "reload",
          !Array.isArray(data.reloadElements) ? [data.reloadElements] : data.reloadElements,
          []
        );
        let request = new Request(
          data.url !== "current" ? data.url : window.location,
          "GET",
        );
        await request.execute(response);
        DomEventManager.dispatch("components::load");
      }

      if (data.eventsRefreshUrl !== undefined && data.eventsRefreshUrl.url !== undefined && data.user.id !== Config.getUserId()) {
        let requestRefresh = new Request(
          data.eventsRefreshUrl.url !== "current" ? data.eventsRefreshUrl.url : window.location,
          "GET",
        );
        await requestRefresh.execute((fetchResponse)=>{
          fetchResponse.text().then(async (text) => {
            data.eventsRefreshUrl.events.forEach((event) => {
              if(event.query)
              {
                Debug.log("**** Mercure - Push Refresh Url Notification : " + event.name);
                document.querySelectorAll(event.query).forEach((element) => {
                  DomEventManager.dispatch(event.name, {"user": data.user, "vars": { "template": text }}, element);
                });
              }
            });
          });
        });
      }

      if (data.events !== undefined && data.user.id !== Config.getUserId()) {
        data.events.forEach((event) => {
          if(event.vars)
          {
            Debug.log("**** Mercure - Push Events Notification : " + event.name);
            document.querySelectorAll(event.query).forEach((element) => {
              DomEventManager.dispatch(event.name, {"user": data.user, "vars": event.vars}, element);
            });
          }
        });
      }

      if(data.event !== undefined && data.user.id !== Config.getUserId()) {
        Debug.log("**** Mercure - Push Event Notification : "+data.event.name);
        document.querySelectorAll(data.event.query).forEach((element) => {
          DomEventManager.dispatch(data.event.name, data, element);
        });
      }

      if(data.alertMessage !== undefined) {
        Debug.log("**** Mercure - Push AlertMessage Notification");
        let parser = new DOMParser();
        let templateHtml = parser.parseFromString(data.alertMessage, "text/html");
        DomEventManager.dispatch("Components::alert-messages.add", {messageHtml: templateHtml.body.firstChild});
      }

      if(data.type !== undefined && data.type === "hook")
      {
        Debug.log("**** Mercure - Push Hook Notification");
        await Hook.run('mercure.event', {
          module: this,
          data: data
        });
      }

    };
  }


}
