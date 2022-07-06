import Swal from "sweetalert2";

export default class Alert {

  static showToast(options) {
    options = Object.assign({
      title:                "",
      toast:                true,
      icon:                 "",
      position:             "",
      showConfirmButton:    false,
      timer:                5000,
      timerProgressBar:     true,
      customClass: {
        popup:              ""
      },
      showClass: {
        popup:              'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup:              'animate__animated animate__fadeOutUp'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    }, options);
    Swal.fire(options);
  }

  static showPopup(options, callbackConfirm = null, callbackOther = null) {
    options = Object.assign({
      type:               "",
      title:              "",
      text:               "",
      icon:               'warning',
      confirmButtonColor: '',
      confirmButtonText:  Translate.trans('austral.sweetAlert.confirm.delete.actions.confirm'),
      showCloseButton:    true,
      closeButtonHtml:    "",
      showCancelButton:   true,
      cancelButtonColor:  '',
      cancelButtonText:   Translate.trans('austral.sweetAlert.confirm.delete.actions.cancel'),
      customClass: {
        popup:            ""
      },
      showClass: {
        popup:            'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup:            'animate__animated animate__fadeOutUp'
      }
    }, options);

    Swal.fire(options).then((result) => {
      if (result.isConfirmed) {
        if(typeof callbackConfirm == "function") {
          callbackConfirm(result);
        }
      }
      else {
        if(typeof callbackOther == "function") {
          callbackOther(result);
        }
      }
    });

  }


}