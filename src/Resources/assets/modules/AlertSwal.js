/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractModule, DomEventManager, Hook, Debug, LibLoader} from "@austral/design";

export default class AlertSwal extends abstractModule {

  /**
   * Initializes the load process and
   */
  async load() {
    this.Swal = await LibLoader.sweetalert();
    if(!this.isInitialise)
    {
      Debug.log("AlertSwal - Load");
      this.isInitialise = true;
      await this.initialise();
      DomEventManager.addListener("alertSwal::showToast", async (event) => {
        await this.showToast(event.detail);
      });
      DomEventManager.addListener("alertSwal::showPopup", async (event) => {
        await this.showPopup(event.detail);
      });
    }
  }

  async initialise()
  {
    Debug.log("AlertSwal - Initialise - Start");
    await Hook.run('alertSwal.initialise', {
      module: this,
    });
    Debug.log("AlertSwal - Initialise - End");
  }

  async showToast(options)
  {
    options = Object.assign({
      title: "",
      toast: true,
      icon: "",
      position: "",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      customClass: {
        popup: ""
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', this.Swal.stopTimer)
        toast.addEventListener('mouseleave', this.Swal.resumeTimer)
      }
    }, options);
    this.Swal.fire(options).then(() => {
    });
  }

  async showPopup(options) {
    options = Object.assign({
      type: "",
      title: "",
      text: "",
      icon: 'warning',
      confirmButtonColor: '',
      confirmButtonText: "To validate",
      showCloseButton: true,
      closeButtonHtml: "",
      showCancelButton: true,
      cancelButtonColor: '',
      cancelButtonText: "To cancel",
      customClass: {
        popup: ""
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      callbackConfirm: null,
      callbackOther: null,
    }, options);
    this.Swal.fire(options).then((result) => {
      if (result.isConfirmed) {
        if (typeof options.callbackConfirm == "function") {
          options.callbackConfirm(result);
        }
      } else {
        if (typeof options.callbackOther == "function") {
          options.callbackOther(result);
        }
      }
    });
  }


  /**
   * initFlashMessages
   * Shows the flash messages of the page as toasts: elements with data-message-text (data-message-status,
   * data-message-position, data-message-fix for a message that stays). A message is shown once.
   *
   * @param {Document|Element} container
   * @return {Promise<void>}
   */
  async initFlashMessages(container = document) {
    if (!this.Swal) {
      this.Swal = await LibLoader.sweetalert();
    }
    for (const el of container.querySelectorAll("*[data-message-text]")) {
      if (el.dataset.messageShown !== undefined) {
        continue;
      }
      el.dataset.messageShown = "";
      await this.showToast({
        title: el.dataset.messageText,
        icon: el.dataset.messageStatus,
        position: el.dataset.messagePosition,
        timer: el.dataset.messageFix === undefined ? 5000 : false,
        customClass: {
          popup: el.dataset.messageStatus
        }
      });
    }
  }
}
