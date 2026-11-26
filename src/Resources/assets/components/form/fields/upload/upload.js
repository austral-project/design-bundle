/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {abstractField, DomEventManager, utils} from "@austral/design";

export default class Upload extends abstractField {

  static initComponent(componentName = null, callback = null) {
    super.initComponent("upload-file", () => {
    });
  }

  create(element) {
    super.create(element);
    this.initialValue = this.element.value;

    this.file = null;
    this.fileImageSize = {"width": 0, "height": 0};
    this.input = this.element.querySelector("input");
    this.button = this.element.querySelector(".button");
    this.previewContainer = this.element.querySelector(".preview-file");
    this.options = JSON.parse(this.element.dataset.fileOptions);
    this.errorContainer = this.element.querySelector(".errors-content .messages-content");
    if(this.input.files.length > 0)
    {
      this.handleFile(this.input.files[0]);
    }

  }

  addEventListener() {
    super.addEventListener();

    DomEventManager.addListener(["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"], (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, this.element);

    DomEventManager.addListener(["dragstart", "dragover", "dragenter"], (e) => {
      if(e.dataTransfer.types.includes("Files")) {
        this.element.classList.add('is-dragover');
      }
    }, this.element);

    DomEventManager.addListener(["dragleave", "dragend"], (e) => {
      this.element.classList.remove('is-dragover');
    }, this.element);

    if(this.button) {
      DomEventManager.addListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.input.click();
      }, this.button);
    }
    DomEventManager.addListener("mouseenter", (e) => {
      this.element.classList.add('button-view');
    }, this.element);

    DomEventManager.addListener("mouseleave", (e) => {
      if(!this.element.classList.contains("load"))
      {
        this.element.classList.remove('button-view');
      }
    }, this.element);


    DomEventManager.addListener("drop", (e) => {
      if(e.dataTransfer.types.includes("Files")) {
        DomEventManager.dispatch("component::upload.change", {"file": e.dataTransfer.files.item(0), "isDragover": true}, this.element);
      }
    }, this.element);

    DomEventManager.addListener("change", (e) => {
      DomEventManager.dispatch("component::upload.change", {"file": e.target.files[0], "isDragover": false}, this.element);
    }, this.input);

    DomEventManager.addListener("component::upload.change", (e) => {
      this.initNewFile(e.detail.isDragover !== undefined ? e.detail.isDragover : false, false);
      this.element.classList.remove('is-dragover');
      this.button.classList.add('load');
      this.element.classList.add('button-view');
      setTimeout(() => {
        this.removeDeleteFile();
        this.handleFile(e.detail.file);
        setTimeout(() => {
          this.element.classList.remove('button-view');
          this.button.classList.remove('load');
        }, 300);
      }, e.detail.isDragover !== undefined ? 800 : 400);
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
      this.previewContainer.innerHTML = "";
      this.previewContainer.append(img);
      this.element.classList.remove('has-error');
    }
    else {
      this.previewContainer.innerHTML = "";
      this.element.classList.remove('has-error');
      this.element.classList.remove('edit');
    }
  }

  handleFile(file) {
    var absolutePathPicto = "/bundles/australdesignsystem/mime-type-files";
    this.file = file;
    var hasError = false;
    this.errorContainer.innerHTML = "";
    let mimeTypeAccepted = this.options["mime-types"];
    if(mimeTypeAccepted.length > 0 && !mimeTypeAccepted.includes(this.file.type))
    {
      hasError = true;
      this.addError("validators.errors.file.mimeTypesJs", {
        "__MIME_TYPE__": this.file.type.replaceAll('image/', ""),
        "__MIME_TYPE_ACCEPTED__": mimeTypeAccepted.join(", ").replaceAll('image/', "")
      });
    }

    let sizeLimit = this.options["max-size"];
    if(this.file.size > sizeLimit)
    {
      hasError = true;
      this.addError("validators.errors.file.maxSizeJs", {
        "__SIZE__": utils.file.fileSizeHumanize(this.file.size),
        "__LIMIT__": utils.file.fileSizeHumanize(sizeLimit)
      });
    }

    if(!hasError)
    {
      if(this.file.type.indexOf("image") >= 0)
      {
        let imageSizes = this.options["image-sizes"];
        var widthMax = this.previewContainer.offsetWidth;
        var heightMax = this.previewContainer.offsetHeight;

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
              this.addError("validators.errors.file.dimensionMin", {
                "__DIMENSION__": orrigineW+"x"+orrigineH,
                "__DIMENSION_MIN__": imageSizes.minWidth+"x"+imageSizes.minHeight
              });
            }
            else if(imageSizes.maxWidth !== undefined && imageSizes.maxWidth > 0 && orrigineW > imageSizes.maxWidth || imageSizes.maxHeight !== undefined && imageSizes.maxHeight > 0 && orrigineH > imageSizes.maxHeight)
            {
              hasError = true;
              this.addError("validators.errors.file.dimensionMax", {
                "__DIMENSION__": orrigineW+"x"+orrigineH,
                "__DIMENSION_MAX__": imageSizes.minWidth+"x"+imageSizes.minHeight
              });
            }

            if(!hasError)
            {
              this.fileImageSize = {"width": orrigineW, "height": orrigineH};
              var taille = utils.dom.calcFinalSize(orrigineW, orrigineH, widthMax, heightMax);
              this.previewContainer.append(document.createElement('canvas'));
              var canvas = this.previewContainer.querySelector("canvas");
              if(!canvas) {
                this.previewContainer.append(document.createElement("canvas"));
                canvas = this.previewContainer.querySelector("canvas");
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
        if(utils.file.fileExists(absolutePathPicto+"/"+fileTypeArray[1]+".png"))
        {
          this.previewContainer.innerHTML = "<img src='"+absolutePathPicto+"/"+fileTypeArray[1]+".png' />";
        }
        else
        {
          this.previewContainer.innerHTML = "<img src='"+absolutePathPicto+"/default.png' />";
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
        return utils.file.fileSizeHumanize(this.file.size);
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


  addError(messageKey, replace)
  {
    var error = document.createElement('li');
    if(Translate !== undefined)
    {
      error.textContent = Translate.trans(messageKey, replace);
    }
    else
    {
      error.textContent = messageKey;
    }
    this.errorContainer.append(error);
  }

  viewError()
  {
    setTimeout(() => {
      this.element.classList.add('has-error');
    }, 200);
  }

}
DomEventManager.addListener("component::initialize", () => {
  Upload.initComponent();
});
