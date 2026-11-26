/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { DomEventManager, Response, RequestHook, Config, Debug } from "@austral/design";

/**
 * Represents a network request configuration and execution handler. Provides methods for customizing
 * the request, including setting headers, form data, and handling response behaviors.
 */
export default class Request {

  /**
   * Initializes a new instance of the class with the specified parameters.
   *
   * @param {string} url - The URL to request.
   * @param {string} [method="GET"] - The HTTP method to use for the request (e.g., GET, POST).
   * @param {Array} [requestParameters=[]] - The list of request parameters to include with the request.
   * @return {Object} A new instance of the class.
   */
  constructor(url, method = "GET", requestParameters = []) {
    this.url = url;
    this.method = method;
    this.requestParameters = requestParameters;
    this.headers = new Headers();
    this.dispatchName = null;
  }

  /**
   * Sets the dispatch name for the reload action.
   *
   * @param {string} dispatchName - The name of the dispatch to be set.
   * @return {Object} The current instance to allow method chaining.
   */
  setReloadDispatch(dispatchName) {
    this.dispatchName = dispatchName;
    return this;
  }

  /**
   * Sets a header key-value pair in the headers object.
   *
   * @param {string} key - The name of the header.
   * @param {string} value - The value of the header.
   * @return {Object} Returns the current instance to allow method chaining.
   */
  setHeader(key, value) {
    this.headers.set(key, value);
    return this;
  }

  /**
   * Sets the form property of the instance.
   *
   * @param {Object} form - The form object to be set.
   * @return {Object} Returns the instance to allow method chaining.
   */
  setForm(form) {
    this.form = form;
    return this;
  }

  /**
   * Retrieves the value of the `method` property.
   *
   * @return {any} The current value of the `method` property.
   */
  getMethod() {
    return this.method;
  }

  /**
   * Executes an HTTP request based on the defined settings and handles the response.
   *
   * @param {null|Response|Function} response - Optional. The response handler. It could be:
   *   - `null`: No response-specific logic will be executed.
   *   - An instance of `Response`: Executes the `execute` method on the provided response object.
   *   - A function: Calls the provided function with the fetch response.
   * @param {null|FormData} formData - Optional FormData object containing the request payload. If `null`, FormData may be dynamically created from the `this.form` property.
   * @return {Promise<void>} A promise that resolves once the HTTP request and its response handling are fully completed.
   */
  async execute(response = null, formData = null) {
    this.timeLoadPage = new Date().getTime();
    Debug.log("Request - Execute - Start - "+this.method);

    const hookStart = await RequestHook.run('request.start', { request: this });
    if(hookStart === false) return;

    let fetchOptions = Object.assign({
      method:       this.method,
      mode:         "cors",
      cache:        "reload",
      credentials:  'same-origin',
      headers:      this.headers,
      redirect:     "follow",
    }, this.requestParameters);

    if(this.form) {

      let inputRecaptcha = this.form.querySelector("*[data-recaptcha]");
      if(inputRecaptcha)
      {
        let intputRecaptchaComponent = Config.getComponentByElement("input", inputRecaptcha);
        if (intputRecaptchaComponent) {
          await intputRecaptchaComponent.recaptcha();
        }
      }

      formData = new FormData(this.form);
      [].forEach.call(this.form.querySelectorAll("*[data-upload-file]"), (el)=>{
        if(Config.hasComponent("upload-file", el.dataset.componentUploadFileUuid))
        {
          let uploadFile = Config.getComponent("upload-file", el.dataset.componentUploadFileUuid);
          formData.set(uploadFile.input.name, uploadFile.uploadFile());
        }
      });
    }
    if (["POST", "PUT", "PATCH"].includes(this.method.toUpperCase()) && formData) {
      fetchOptions["body"] = formData;
    }
    else if (this.method.toUpperCase() === "GET" && formData) {
      const params = new URLSearchParams(formData);
      this.url += `?${params.toString()}`;
    }

    await fetch(this.url !== null ? this.url : "", fetchOptions).then(async (fetchResponse) => {

      // Hook après la réponse
      const hookResponse = await RequestHook.run('request.response', { request: this, fetchResponse });
      if(hookResponse === false) return;

      if (fetchResponse.ok) {
        if (this.dispatchName) {
          DomEventManager.dispatch(this.dispatchName, {fetchResponse: fetchResponse});
        }
        if (response instanceof Response) {
          await response.execute(fetchResponse);
        } else if (typeof response === 'function') {
          Debug.log("Response function - Start");
          await Promise.resolve( response(fetchResponse));
          Debug.log("Response function - Stop");
        }
      } else {// Hook après la réponse
        await RequestHook.run('request.error', { request: this, fetchResponse });
        this.error(fetchResponse.statusText);
      }

      Debug.log("Request - Execute - Stop - "+this.method);
    })
    .catch(async (err) => {
      await RequestHook.run('request.error', {request: this});
      this.error(err);
    });
  }

  /**
   * Handles and logs an error that occurs during a request operation.
   *
   * @param {Error|string} err - The error object or message to be logged.
   * @return {void} Does not return any value.
   */
  error(err) {
    Debug.log('Request - Error', err);
    //window.location = this.url;
  }
}
