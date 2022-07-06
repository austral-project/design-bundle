import Cropper from "./../cropper/Cropper";
import Components from "../Components";

class Template {

  constructor(popin) {
    Debug.log("PopinTemplate - Init");
    this.popin = popin;
    this.popinHtml = PopinTemplate.templateByKey(this.popin.options.template);
    this.originElements = null;
    this.uploadOption = null;
    this.absolutePathPicto = "/bundles/australadmin/images/mime-type-files";
    if(this.popin.options.update)
    {
      this.originElements = Austral.Config.page.dom.body.querySelector(this.popin.options.update);
    }
    if(this.popin.options.upload)
    {
      this.uploadOption = this.popin.options.upload;
      this.upload = Austral.Config.getComponent("upload-file", Austral.Config.page.dom.querySelector(this.uploadOption["file-container"]+"[data-upload-file]").dataset.componentUuid);
    }
  }

  init() {
    if(this.popinHtml)
    {
      this.popin.element.querySelector(".popin-content").innerHTML = this.popinHtml;
    }
    if(this.originElements)
    {
      this.addListener();
      this.initTemplate();
    }
    Components.loadComponent();
  }

  addListener() {
    [].forEach.call(this.popin.element.querySelectorAll("*[data-popin-command]"), (el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(el.dataset.popinCommand) {
          this.update(el.dataset.popinCommand);
        }
        this.popin.close();
      })
    });
  }

  initTemplate() {

    [].forEach.call(this.originElements.querySelectorAll("*[data-popin-update-input]"), (originElement) => {
      let element = this.popin.element.querySelector("*[data-popin-update-input='"+originElement.dataset.popinUpdateInput+"']");
      if(element && originElement.value) {
        if(element.tagName === "DIV") {
          let field = element.querySelector("input[value='" + originElement.value + "']");
          field.checked = true;
          MiscEvent.dispatch("change", {}, field.closest(".option-element"));
        }
        else if(element.tagName === "SELECT") {
          element.value = originElement.value;
          MiscEvent.dispatch("change", {value: originElement.value }, element);
        }
        else if(element.type === "checkbox") {
          element.checked = originElement.value === true ? 1 : 0;
        }
        else {
          element.value = originElement.value;
        }
      }
    });

    [].forEach.call(this.originElements.querySelectorAll("*[data-popin-update-dataset]"), (originElement) => {
      this.popin.element.querySelector("*[data-popin-update-dataset='"+originElement.dataset.popinUpdateDataset+"']")
        .setAttribute("data-"+originElement.dataset.popinUpdateDataset, originElement.getAttribute("data-"+originElement.dataset.popinUpdateDataset));
    });

    [].forEach.call(this.popin.element.querySelectorAll("*[data-popin-value]"), (element) => {
      if(this.popin.options.values)
      {
        if(this.popin.options.values[element.dataset.popinValue] !== undefined)
        {
          element.innerHTML = this.popin.options.values[element.dataset.popinValue];
        }
      }
      if(this.upload && this.upload.file) {
        let value = this.upload.getValueFileByKey(element.dataset.popinValue);
        if(value) {
          element.innerHTML = value;
        }
      }
    });

    [].forEach.call(this.popin.element.querySelectorAll("*[data-popin-clone-fields]"), (element) => {
      if(this.originElements.dataset.popinCloneFields)
      {
        element.innerHTML = this.originElements.innerHTML;
        [].forEach.call(this.originElements.querySelectorAll("input"), (originInput) => {
          this.popin.element.querySelector("#"+originInput.id).value = originInput.value;
        });
      }
    });

    [].forEach.call(this.popin.element.querySelectorAll("*[data-popin-remove]"), (element) => {
        element.remove();
    });

    [].forEach.call(this.popin.element.querySelectorAll("*[data-popin-upload-file]"), (element) => {
      if(this.originElements.querySelector(".file-upload-content"))
      {
        element.innerHTML = this.originElements.querySelector(".file-upload-content").outerHTML;
        let uploadFileElement = element.querySelector("*[data-upload-file-options]");
        uploadFileElement.setAttribute("data-upload-file", "");
        let uploadFileOptions = JSON.parse(uploadFileElement.dataset.uploadFileOptions);
        if(uploadFileOptions.fileValues["reel-filename"])
        {
          uploadFileElement.classList.add('edit');
          var previewContainer = uploadFileElement.querySelector(".preview-file");
          if(uploadFileOptions["file-path"])
          {
            previewContainer.innerHTML = "<img src='"+uploadFileOptions["file-path"]+"' />";
          }
          else
          {
            if(Tools.fileExists(this.absolutePathPicto+"/"+uploadFileOptions.fileValues["mime-type"]+".png"))
            {
              previewContainer.innerHTML = "<img src='"+this.absolutePathPicto+"/"+uploadFileOptions.fileValues["mime-type"]+".png' />";
            }
            else
            {
              previewContainer.innerHTML = "<img src='"+this.absolutePathPicto+"/default.png' />";
            }
          }
        }
        if(element.querySelector("*[data-popin-element]"))
        {
          element.querySelector("*[data-popin-element]").setAttribute("data-popin", "");
        }
        if(element.querySelector("*[data-popin-container]"))
        {
          element.querySelector("*[data-popin-container]").removeAttribute("data-component-uuid");
        }
      }
      if(this.originElements.querySelector(".file-informations"))
      {
        element.append(this.originElements.querySelector(".file-informations"));
      }
    });
    if(this.uploadOption)
    {
      var previewContainer = this.popin.element.querySelector("*[data-popin-value='preview-upload']");
      if(!Array.isArray(this.uploadOption.cropper) && this.uploadOption.cropper instanceof Object) {
        var cropper = PopinTemplate.templateByKey("cropper");
        var cropperAction = PopinTemplate.templateByKey("cropperAction");
        previewContainer.innerHTML = "";

        previewContainer.classList.add("croppers-content");
        previewContainer.setAttribute("data-cropper", "");
        previewContainer.setAttribute("data-cropper-image", this.uploadOption["file-path"] ?? "");
        var cropperActions = this.popin.element.querySelector("*[data-popin-cropper-actions]");
        cropperActions.innerHTML = "";
        Object.entries(this.uploadOption.cropper).forEach((options, i) => {
          var cropperByKey = cropper.replaceAll("__CROPPER_KEY__", options[0]);
          cropperByKey = cropperByKey.replaceAll("__CROPPER_NAME__", Translate.trans('austral.'+options[1].name, null, options[1].name));
          var cropperTemplate = document.createElement("div");
          cropperTemplate.innerHTML = cropperByKey;
          if(options[1].ratio)
          {
            cropperTemplate.querySelector("*[data-without-ratio]").remove();
            cropperTemplate.querySelector("*[data-cropper-ratio]").dataset.cropperRatio = options[1].aspectRatio;
          }
          if(i === 0) {
            cropperTemplate.querySelector(".cropper-content").classList.add('current');
          }
          previewContainer.innerHTML = previewContainer.innerHTML+cropperTemplate.innerHTML;

          var cropperActionByKey = cropperAction.replaceAll("__CROPPER_KEY__", options[0]);
          cropperActionByKey = cropperActionByKey.replaceAll("__CROPPER_NAME__", Translate.trans('austral.'+options[1].name, null, options[1].name));
          cropperActionByKey = cropperActionByKey.replaceAll("__CROPPER_PICTO__", options[1].picto);
          var cropperActionTemplate = document.createElement("li");
          cropperActionTemplate.innerHTML = cropperActionByKey;
          if(i === 0) {
            cropperActionTemplate.querySelector(".button").classList.add('current');
          }
          cropperActions.innerHTML = cropperActions.innerHTML+cropperActionTemplate.outerHTML;
        });
        this.cropper = new Cropper(this.popin, this.upload);
      }
      else {
        this.popin.element.querySelector("*[data-with-cropper]").remove();
        if(this.upload.input.files.length > 0)
        {
          var file = this.upload.input.files[0];
          if(file.type.indexOf("image") >= 0)
          {
            var widthMax = previewContainer.offsetWidth < 400 ? 400  : previewContainer.offsetWidth;
            var heightMax = previewContainer.offsetHeight < 400 ? 400  : previewContainer.offsetHeight;

            var reader = new FileReader;
            reader.onload = (event) => {
              var img = new Image();
              img.src = event.target.result;
              img.onload = () => {
                var orrigineW = img.width;
                var orrigineH = img.height;

                var taille = Tools.calcFinalSize(orrigineW, orrigineH, widthMax, heightMax);
                previewContainer.innerHTML = document.createElement("canvas").outerHTML;
                var canvas = previewContainer.querySelector("canvas");
                canvas.width = taille.width;
                canvas.height = taille.height;
                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
              };
            };
            reader.readAsDataURL(file);
          }
          else
          {
            const fileTypeArray = file.type.split('/');
            if(Tools.fileExists(this.absolutePathPicto+"/"+fileTypeArray[1]+".png"))
            {
              previewContainer.innerHTML = "<img src='"+this.absolutePathPicto+"/"+fileTypeArray[1]+".png' />";
            }
            else
            {
              previewContainer.innerHTML = "<img src='"+this.absolutePathPicto+"/default.png' />";
            }
          }
        }
        else
        {
          if(this.uploadOption["file-path"])
          {
            previewContainer.innerHTML = "<img src='"+this.uploadOption["file-path"]+"' />";
          }
          else
          {
            if(Tools.fileExists(this.absolutePathPicto+"/"+this.uploadOption.fileValues["mime-type"]+".png"))
            {
              previewContainer.innerHTML = "<img src='"+this.absolutePathPicto+"/"+this.uploadOption.fileValues["mime-type"]+".png' />";
            }
            else
            {
              previewContainer.innerHTML = "<img src='"+this.absolutePathPicto+"/default.png' />";
            }
          }
        }
      }
    }

  }

  update(command) {
    if(this.originElements)
    {
      if(command === "update" || command === "delete")
      {
        [].forEach.call(this.popin.element.querySelectorAll("*[data-popin-update-input]"), (el) => {
          let updateInputElement = this.originElements.querySelector("*[data-popin-update-input='"+el.dataset.popinUpdateInput+"']");
          if(updateInputElement) {
            let newValue = null;
            if(el.tagName === "DIV") {
              newValue = command === "update" ? el.querySelector("input[type='radio']:checked").value : null;
            }
            else if(el.type === "checkbox") {
              newValue = command === "update" ? (el.checked ? 1 : 0) : 0;
            }
            else {
              newValue = command === "update" ? el.value : null;
            }
            updateInputElement.value = newValue;
          }
        });

        if(command === "update") {
          [].forEach.call(this.popin.element.querySelectorAll("*[data-popin-clone-fields]"), (element) => {
            if (this.originElements.dataset.popinCloneFields) {
              [].forEach.call(this.popin.element.querySelectorAll("input"), (popinInput) => {
                if(popinInput.id)
                {
                  this.originElements.querySelector("#" + popinInput.id).value = popinInput.value;
                }
              });
            }
          });
          if(this.cropper) {
            this.cropper.saveCropperAllDatas();
          }
        }
        else if( command === "delete")
        {
          if(this.upload)
          {
            this.upload.deleteFile();
          }
        }
      }
    }
  }

}
export default Template;