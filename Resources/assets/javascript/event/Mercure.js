import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import Request from "./../request/Request";
import Response from "./../response/Response";
import MiscEvent from "../misc/Event";
export default class Mercure {

  constructor() {
    Debug.log('Mercure - Construct');
  }

  init() {
    Debug.log('Mercure - Initialise');
    this.mercureParameters = document.body.dataset.mercure ? JSON.parse(document.body.dataset.mercure) : {};
    this.mercure = {};
    if(this.mercureParameters.url) {
      this.mercure.url = new URL(this.mercureParameters.url);
      for(var i = 0; i < this.mercureParameters.subscribes.length; i++) {
        this.mercure.url.searchParams.append('topic', this.mercureParameters.subscribes[i]);
      }
    }

    try {
      this.pingRequest = new Request(
        "POST",
        austral.ping,
        {},
        (response) => {
          if(response.ok) {
            response.json().then(function (array) {
            });
          }
        }
      );
    } catch(e) {
      e; // => ReferenceError
    }

    if(this.mercure.url !== undefined) {
      this.addEventSource();
    }
  }

  addEventSource() {
    if(this.eventSource) {
      this.eventSource.close();
    }
    this.eventSource = new EventSourcePolyfill(this.mercure.url, {
      heartbeatTimeout: 8640000000,
      headers: {
        "Authorization": 'Bearer ' + Tools.getCookie("mercureAuthorization")
      }
    });

    var timeout = setTimeout(() => {
      //this.ping();
    }, 1000);

    this.eventSource.onmessage = (notification) => {
      Debug.log("**** Mercure - Receive Notification");
      Debug.log(notification);
      var data = JSON.parse(notification.data);
      if(data.type !== undefined) {
        if(data.type === "refresh") {
          var response = new Response();
          response.setReplaceState(false)
            .setPushHistory(false)
            .setReplaceDom(true)
            .setElementsToRefresh(data.reloadElements);
          var request = new Request(
            "GET",
            data.url !== "current" ? data.url : window.location,
            {},
            response
          );
          request.execute();
        }
        else if(data.type === "multi-user") {
          const contentConflictDetected = document.body.querySelector("#content-conflict-detected *[data-multi-user]");
          const parser = new DOMParser();
          const template = parser.parseFromString(data.template, "text/html");
          contentConflictDetected.querySelector(".list-items").innerHTML = template.querySelector("*[data-multi-user] .list-items").innerHTML;
          contentConflictDetected.querySelector(".reduce-container").innerHTML = template.querySelector("*[data-multi-user] .reduce-container").innerHTML;
        }
        else if(data.type === "multi-user-finish") {
          const contentConflictDetected = document.body.querySelector("#content-conflict-detected *[data-multi-user]");
          contentConflictDetected.querySelector(".list-items").innerHTML = "";
          contentConflictDetected.querySelector(".reduce-container").innerHTML = "";
        }
        MiscEvent.dispatch("mercure.notification.receive."+data.type, data);
      }
    };
  }

  ping(){
    let parameters = new URLSearchParams();
    parameters.append("uri", document.body.dataset.uri);
    parameters.append(`userTabId`, this.mercureParameters.userTabId);
    this.pingRequest.execute(parameters);
  }


}
export const mercure = new Mercure();
