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
        else if(data.type === "deployment-start") {
          let deploymentMessageStart = document.createElement("div");
          deploymentMessageStart.classList.add("deployment-message");
          deploymentMessageStart.classList.add("alert");

          let deploymentMessageStartIcon = document.createElement("span");
          deploymentMessageStartIcon.classList.add("picto");
          deploymentMessageStartIcon.classList.add("austral-picto-caution");
          deploymentMessageStart.append(deploymentMessageStartIcon);

          let deploymentMessageStartContent = document.createElement("div");
          deploymentMessageStartContent.classList.add("content");
          deploymentMessageStartContent.innerText = data.message;
          deploymentMessageStart.append(deploymentMessageStartContent);
          document.querySelector("body").append(deploymentMessageStart);
          setTimeout(() => {
            document.querySelector(".deployment-message.alert").classList.add("is-open");
          }, 100);
        }
        else if(data.type === "deployment-stop") {
          document.querySelector(".deployment-message.alert").classList.remove("is-open");

          let deploymentMessageStart = document.createElement("div");
          deploymentMessageStart.classList.add("deployment-message");
          deploymentMessageStart.classList.add("success");

          let deploymentMessageStartIcon = document.createElement("span");
          deploymentMessageStartIcon.classList.add("picto");
          deploymentMessageStartIcon.classList.add("austral-picto-check");
          deploymentMessageStart.append(deploymentMessageStartIcon);

          let deploymentMessageStartContent = document.createElement("div");
          deploymentMessageStartContent.classList.add("content");
          deploymentMessageStartContent.innerText = data.message;
          deploymentMessageStart.append(deploymentMessageStartContent);
          document.querySelector("body").append(deploymentMessageStart);
          setTimeout(() => {
            document.querySelector(".deployment-message.alert").remove();
            document.querySelector(".deployment-message.success").classList.add("is-open");
            setTimeout(() => {
              document.querySelector(".deployment-message.success").classList.remove("is-open");
              setTimeout(() => {
                document.querySelector(".deployment-message.success").remove();
              }, 600);
            }, 3000);
          }, 600);
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
        else if(data.type === "message") {
          Alert.showToast({
            title: data.message.text,
            icon: data.message.status,
            position: "top",
            timer:  data.message.fix === undefined ? 5000 : false,
            customClass: {
              popup: data.message.status
            }
          });
        }
        MiscEvent.dispatch("mercure.notification.receive."+data.type, data);
      }
    };
  }

}
export const mercure = new Mercure();
