/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* global Translate */ // translations of the administration (admin-bundle, Layout/translation.js.twig)
import { Config, Debug, DomEventManager, utils } from "@austral/design";
import { adminPage } from "../AdminPage";
import ActionResponse from "./ActionResponse";
import Swal from "sweetalert2";


class ActionRequest {

  constructor(method, url, requestParameters, response) {
    this.method = method;
    this.url = url;
    this.requestParameters = requestParameters;
    this.response = response;
    this.headers = new Headers();
    this.elementClick = null;
  }

  setElementClick(elementClick) {
    this.elementClick = elementClick;
  }

  setHeader(key, value) {
    this.headers.set(key, value);
    return this;
  }

  setForm(form) {
    this.form = form;
    return this;
  }

  execute(formData = null) {

    this.timeoutLoadPage = 200;
    this.timeLoadPage = new Date().getTime();
    adminPage.loadPage();
    Debug.log("Request - Execute - Start - "+this.method);

    let fetchOptions = Object.assign({
      method:       this.method,
      mode:         "cors",
      cache:        "reload",
      credentials:  'same-origin',
      headers:      this.headers,
      redirect:     "follow",
    }, this.requestParameters);

    DomEventManager.dispatch("request:start",  {
      "object" : this,
      "fetchOptions": fetchOptions
    });

    if(this.method === "POST") {
      if(this.form) {
        formData = new FormData(this.form);
        [].forEach.call(this.form.querySelectorAll("*[data-upload-file]"), (el)=>{
          if(Config.hasComponent("upload-file", el.getAttribute("data-component-upload-file-uuid")))
          {
            let uploadFile = Config.getComponent("upload-file", el.getAttribute("data-component-upload-file-uuid"));
            formData.set(uploadFile.input.name, uploadFile.uploadFile());
          }
        });
      }

      if(formData) {
        fetchOptions["body"] = formData;
      }

    }

    fetch(this.url !== null ? this.url : "", fetchOptions).then((fetchResponse) => {
      if(this.response instanceof ActionResponse) {
        this.response.request = this;
      }

      var nowTime = new Date().getTime();
      var timeout = this.timeoutLoadPage - (nowTime - this.timeLoadPage);
      timeout = timeout < 0 ? 0 : timeout;
      setTimeout(() => {
        if(fetchResponse.ok)
        {
          Debug.log("Request - FetchResponse - Start");
          adminPage.unloadPage();
          if(this.response instanceof ActionResponse)
          {
            this.response.executeSuccess(fetchResponse);
          }
          else if (typeof this.response === 'function') {
            this.response(fetchResponse);
          }
          if(this.elementClick) {
            this.elementClick.executeAction = false;
          }
          Debug.log("Request - FetchResponse - Stop");
        }
        else
        {
          this.error(fetchResponse);
        }
      }, timeout);
    }).catch((err) => {
      this.error(err);
    });
    DomEventManager.dispatch("request:end",  {
      "object" : this,
      "fetchOptions": fetchOptions
    });
    return this;
  }

  error(err) {
    adminPage.unloadPage();
    Debug.log('Request - Error', err);
    if(this.elementClick) {
      this.elementClick.executeAction = false;
    }
    utils.alert.showPopup({
      title:              Translate.trans('austral.sweetAlert.error500.title'),
      text:               Translate.trans('austral.sweetAlert.error500.message'),
      icon:               'error',
      confirmButtonText:  Translate.trans('austral.sweetAlert.error500.actions.reload'),
      cancelButtonText:   Translate.trans('austral.sweetAlert.error500.actions.stay'),
    }, (result) => {
      location.reload();
    });
    Debug.log("Request - Execute - Stop");
  }


}
export default ActionRequest;