import abstractField from "./abstract";

export default class UploadFile  extends abstractField {

  static initComponent() {
    super.initComponent("upload-file");
  }

  /**
   *
   * @param element
   */
  create(element) {
    super.create(element);
    this.previewContenainer = this.element.querySelector(".preview-file");
    this.options = JSON.parse(this.element.dataset.uploadFileOptions)
    this.input = this.element.querySelector(this.options["input-file"]);
    this.deleteInput = this.element.querySelector("*[data-delete-file]");
    this.file = null;
    this.fileImageSize = {"width": 0, "height": 0};
    this.inputName = this.input.getAttribute("name");
    if(this.input.files.length > 0)
    {
      this.handleFile(this.input.files[0]);
    }
  }

  addEventListener() {
    super.addEventListener();

    MiscEvent.addListener(["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"], (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, this.element);

    MiscEvent.addListener(["dragstart", "dragover", "dragenter"], (e) => {
      if(e.dataTransfer.types.includes("Files")) {
        this.element.classList.add('is-dragover');
      }
    }, this.element);

    MiscEvent.addListener(["dragleave", "dragend"], (e) => {
      this.element.classList.remove('is-dragover');
    }, this.element);

    MiscEvent.addListener("click", (e) => {
      this.input.click();
    }, this.element);


    MiscEvent.addListener("change", (e) => {
      MiscEvent.dispatch("component::upload.change", {"file": e.target.files[0]}, this.element);
    }, this.input);

    MiscEvent.addListener("drop", (e) => {
      if(e.dataTransfer.types.includes("Files")) {
        MiscEvent.dispatch("component::upload.change", {"file": e.dataTransfer.files.item(0)}, this.element);
        if(e.dataTransfer.files.length >= 2 && this.element.closest(".collection-embed-fields"))
        {
          var collectionEmbedComponent = Austral.Config.getComponent("collection-embed", this.element.closest(".collection-embed-fields").dataset.componentUuid);
          if(collectionEmbedComponent && collectionEmbedComponent.hasOneTemplate())
          {
            for(let i = 1; i < e.dataTransfer.files.length; i++) {
              MiscEvent.dispatch("component::embed.add", {button: collectionEmbedComponent.element.querySelector(".add-new-collection-embed")}, collectionEmbedComponent.element);
              var uploadFileElement = collectionEmbedComponent.lastTemplateAdd.querySelector("*[data-upload-file]");
              if(uploadFileElement)
              {
                MiscEvent.dispatch("component::upload.change", {"file": e.dataTransfer.files.item(i)}, uploadFileElement);
              }
            }
          }
        }
      }
    }, this.element);

    MiscEvent.addListener("component::upload.change", (e) => {
      this.initNewFile(true);
      setTimeout(() => {
        this.removeDeleteFile();
        this.handleFile(e.detail.file);
        this.element.classList.remove('is-dragover');
        setTimeout(() => {
          this.element.classList.remove('loader');
        }, 300);
      }, 1500);

    }, this.element);

  }


  uploadFile() {
    return this.file;
  }

  deleteFile() {
    Debug.log('-- Component - Upload - Delete');
    if(!this.file && this.deleteInput)
    {
      this.deleteInput.value = 1;
      this.initNewFile(null, false);
    }
    else {
      this.initNewFile(null, true);
    }
    this.input.value = null;
  }

  removeDeleteFile()
  {
    if(this.deleteInput)
    {
      this.deleteInput.value = null;
    }
  }

  initNewFile(dragOver, initial)
  {
    this.file = null;
    if(this.options['file-path'] && initial === true) {
      let img = document.createElement("img");
      img.src = this.options['file-path'];
      this.previewContenainer.innerHTML = "";
      this.previewContenainer.append(img);
      this.element.classList.remove('has-error');
    }
    else {
      this.previewContenainer.innerHTML = "";
      this.element.classList.remove('has-error');
      this.element.classList.remove('edit');
    }
    if(dragOver)
    {
      this.element.classList.add('is-dragover');
      this.element.classList.add('loader');
    }
  }

  handleFile(file) {
    var absolutePathPicto = "/bundles/australadmin/images/mime-type-files";
    this.file = file;
    var hasError = false;
    this.element.querySelector(".error-content .messages-content").innerHTML = "";
    let mimeTypeAccepted = this.options["mime-types"];
    if(mimeTypeAccepted.length > 0 && !mimeTypeAccepted.includes(this.file.type))
    {
      hasError = true;
      this.addError("austral.file.errors.mimeTypesJs");
    }

    let sizeLimit = this.options["max-size"];
    if(this.file.size > sizeLimit)
    {
      hasError = true;
      this.addError("austral.file.errors.maxSizeJs");
    }

    if(!hasError)
    {
      if(this.file.type.indexOf("image") >= 0)
      {
        let imageSizes = this.options["image-sizes"];
        var widthMax = this.previewContenainer.offsetWidth < 400 ? 400  : this.previewContenainer.offsetWidth;
        var heightMax = this.previewContenainer.offsetHeight < 400 ? 400  : this.previewContenainer.offsetHeight;

        var reader = new FileReader;
        reader.onload = (event) => {
          var img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            var orrigineW = img.width;
            var orrigineH = img.height;

            if(imageSizes.minWidth !== undefined  && orrigineW < imageSizes.minWidth || imageSizes.minHeight !== undefined && orrigineH < imageSizes.minHeight)
            {
              hasError = true;
              this.addError("austral.file.errors.dimensionMinJs");
            }
            else if(imageSizes.maxWidth !== undefined && imageSizes.maxWidth > 0 && orrigineW > imageSizes.maxWidth || imageSizes.maxHeight !== undefined && imageSizes.maxHeight > 0 && orrigineH > imageSizes.maxHeight)
            {
              hasError = true;
              this.addError("austral.file.errors.dimensionMaxJs");
            }

            if(!hasError)
            {
              this.fileImageSize = {"width": orrigineW, "height": orrigineH};
              var taille = Tools.calcFinalSize(orrigineW, orrigineH, widthMax, heightMax);
              this.previewContenainer.append(document.createElement('canvas'));
              var canvas = this.previewContenainer.querySelector("canvas");
              if(!canvas) {
                this.previewContenainer.append(document.createElement("canvas"));
                canvas = this.previewContenainer.querySelector("canvas");
              }
              canvas.width = taille.width;
              canvas.height = taille.height;
              var context = canvas.getContext('2d');
              context.drawImage(img, 0, 0, canvas.width, canvas.height);
              this.element.classList.add('edit');
            }
            else
            {
              this.viewError();
            }
          };
        };
        reader.readAsDataURL(this.file);
      }
      else
      {
        this.element.classList.add('edit');
        const fileTypeArray = this.file.type.split('/');
        if(Tools.fileExists(absolutePathPicto+"/"+fileTypeArray[1]+".png"))
        {
          this.previewContenainer.innerHTML = "<img src='"+absolutePathPicto+"/"+fileTypeArray[1]+".png' />";
        }
        else
        {
          this.previewContenainer.innerHTML = "<img src='"+absolutePathPicto+"/default.png' />";
        }
      }
    }
    else
    {
      this.viewError();
    }
  }

  getValueFileByKey(key) {
    if(this.file)
    {
      if(key === "size") {
        return Tools.fileSizeHumanize(this.file.size);
      } else if(key === "mime-type") {
        return this.file.name.split('.').pop();
      } else if(key === "dimensions" && this.fileImageSize.width && this.fileImageSize.height) {
        return this.fileImageSize.width + "x"+this.fileImageSize.height+"px";
      } else if(key === "reel-filename") {
        return this.file.name;
      }
    }
    return null;
  }


  addError(messageKey)
  {
    var error = document.createElement('li');
    error.textContent = Translate.trans(messageKey);
    this.element.querySelector(".error-content .messages-content").append(error);
  }

  viewError()
  {
    this.element.classList.remove('edit');
    this.element.classList.add('has-error');
    setTimeout(() => {
      this.deleteFile();
      this.element.classList.remove('has-error');
    }, 1500);
  }

}