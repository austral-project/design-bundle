import Response from "../response/Response";
import Swal from "sweetalert2";

class Request {

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
    Austral.Config.page.loadPage();
    Debug.log("Request - Execute - Start - "+this.method);

    let fetchOptions = Object.assign({
      method:       this.method,
      mode:         "cors",
      cache:        "reload",
      credentials:  'same-origin',
      headers:      this.headers,
      redirect:     "follow",
    }, this.requestParameters);

    MiscEvent.dispatch("request:start",  {
      "object" : this,
      "fetchOptions": fetchOptions
    });

    if(this.method === "POST") {
      if(this.form) {
        formData = new FormData(this.form);
        [].forEach.call(this.form.querySelectorAll("*[data-upload-file]"), (el)=>{
          if(Austral.Config.hasComponent("upload-file", el.dataset.componentUuid))
          {
            let uploadFile = Austral.Config.getComponent("upload-file", el.dataset.componentUuid);
            formData.set(uploadFile.input.name, uploadFile.uploadFile());
          }
        });
      }

      if(formData) {
        fetchOptions["body"] = formData;
      }

    }

    fetch(this.url !== null ? this.url : "", fetchOptions).then((fetchResponse) => {
      if(this.response instanceof Response) {
        this.response.request = this;
      }

      var nowTime = new Date().getTime();
      var timeout = this.timeoutLoadPage - (nowTime - this.timeLoadPage);
      timeout = timeout < 0 ? 0 : timeout;
      setTimeout(() => {
        if(fetchResponse.ok)
        {
          Debug.log("Request - FetchResponse - Start");
          Austral.Config.page.unloadPage();
          if(this.response instanceof Response)
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
    MiscEvent.dispatch("request:end",  {
      "object" : this,
      "fetchOptions": fetchOptions
    });
    return this;
  }

  error(err) {
    Austral.Config.page.unloadPage();
    Debug.log('Request - Error', err);
    if(this.elementClick) {
      this.elementClick.executeAction = false;
    }
    Alert.showPopup({
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
export default Request;