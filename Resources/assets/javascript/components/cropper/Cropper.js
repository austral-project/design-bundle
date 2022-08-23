import CropperJs from 'cropperjs';
import 'cropperjs/dist/cropper.css';

var URL_UPLOAD_IMAGE = window.URL || window.webkitURL;
class Cropper  {

  constructor(popin, UploadFile) {
    Debug.log('Cropper - Construct');
    this.popin = popin;
    this.uploadFile = UploadFile;
    this.editorContainer = this.popin.element;
    this.fieldname = this.popin.options.upload['fieldname'];
    this.element = this.editorContainer.querySelector("*[data-cropper]");

    let cropperDataInputName = this.uploadFile.inputName.replace("["+this.uploadFile.options.fieldname+"]", "[cropperData]");
    this.cropperDataInput = Austral.Config.page.dom.querySelector("*[data-cropper-data][name='"+cropperDataInputName+"']");

    let cropperDataInputGenerateName = this.uploadFile.inputName.replace("["+this.uploadFile.options.fieldname+"]", "[generateCropperByKey]");
    this.cropperDataInputGenerate = Austral.Config.page.dom.querySelector("*[data-cropper-key-generate][name='"+cropperDataInputGenerateName+"']");

    this.cropperDataInputGenerate.value = null;
    this.cropperContainers = {};
    this.cropperCurrent = null;
    this.cropperKeyCurrent = null;
    this.cropperGenerateKeys = {};

    this.cropperDatas = this.cropperDataInput.value ? JSON.parse(this.cropperDataInput.value) : {};
    this.cropperIsFirst = false;
    if(this.cropperDatas.length === 0)
    {
      this.cropperDatas = {};
      this.cropperIsFirst = true;
    }

    [].forEach.call(this.editorContainer.querySelectorAll('.cropper-button-content .button'), (el) => {
      el.addEventListener("click", (elClick) => {
        elClick.preventDefault();
        elClick.stopPropagation();
        [].forEach.call(this.editorContainer.querySelectorAll('.cropper-button-content .button'), (el2) => {
          if(el2 !== el)
          {
            el2.classList.remove("current");
          }
        });
        el.classList.add("current");
        for (const [key, value] of Object.entries(this.cropperContainers)) {
          if (el.dataset.cropperKey === key) {
            this.cropperCurrent = value;
            this.cropperKeyCurrent = el.dataset.cropperKey;
            value.element.classList.add("current");
          } else {
            value.element.classList.remove("current");
          }
        }
      });
    });


    [].forEach.call(this.editorContainer.querySelectorAll('.cropper-content-bottom .button'),  (el) => {
      el.addEventListener("click", () => {
        if(el.dataset.method === "ratio")
        {
          if(el.dataset.option == "full") {
            var cropperOptions = this.options(null, {});
          }
          else {
            var cropperOptions = this.options(el.dataset.option, {});
          }
          this.cropperCurrent.cropper.destroy();
          this.cropperContainers[this.cropperKeyCurrent]['options'] = cropperOptions;
          this.cropperContainers[this.cropperKeyCurrent]['cropper'] = new CropperJs(this.cropperCurrent.element.querySelector("img"), cropperOptions);
        }
        else
        {
          this.cropperCurrent.cropper[el.dataset.method](el.dataset.option);
          switch (el.dataset.method)
          {
            case 'scaleX':
            case 'scaleY':
              el.setAttribute('data-option', -el.dataset.option);
              break;
            break;
          }
        }
      });
    });
    this.initCropper(this.cropperIsFirst);
  }

  initCropper(addCropperGenerate) {
    Debug.log("Cropper - Init");
    [].forEach.call(this.element.querySelectorAll(".cropper-content"), (el) => {
      var uploadedImageURL = this.element.dataset.cropperImage;
      if (this.uploadFile.file)
      {
        var uploadedImageURL = URL_UPLOAD_IMAGE.createObjectURL(this.uploadFile.file);
      }
      el.querySelector("img").setAttribute('src', uploadedImageURL);
      var optionsSave = {}
      if(this.cropperDatas[this.fieldname] !== undefined) {
        if (this.cropperDatas[this.fieldname][el.dataset.cropperKey] !== undefined) {
          optionsSave = this.cropperDatas[this.fieldname][el.dataset.cropperKey]["options"];
        }
      }

      if(addCropperGenerate)
      {
        this.addCropperGenerateKey(el.dataset.cropperKey);
      }

      let cropperOptions = this.options(el.dataset.cropperRatio, optionsSave);
      console.log(cropperOptions);
      if(this.cropperContainers[el.dataset.cropperKey])
      {
        this.cropperContainers[el.dataset.cropperKey].cropper.destroy();
      }
      let cropperJs = new CropperJs(el.querySelector("img"), cropperOptions);
      this.cropperContainers[el.dataset.cropperKey] = {
        "element": el,
        "options": cropperOptions,
        "cropper": cropperJs
      };
      if(el.classList.contains("current"))
      {
        this.cropperCurrent = this.cropperContainers[el.dataset.cropperKey];
        this.cropperKeyCurrent = el.dataset.cropperKey;
      }
      el.querySelector("img").addEventListener('ready', (event) => {
        if(this.cropperDatas[this.fieldname] !== undefined)
        {
          if(this.cropperDatas[this.fieldname][el.dataset.cropperKey] !== undefined)
          {
            if(this.cropperDatas[this.fieldname][el.dataset.cropperKey]['cropCanvas'] !== undefined)
            {
              cropperJs.setCanvasData(this.cropperDatas[this.fieldname][el.dataset.cropperKey]['cropCanvas']);
            }
            if(this.cropperDatas[this.fieldname][el.dataset.cropperKey]['cropBoxData'] !== undefined)
            {
              cropperJs.setCropBoxData(this.cropperDatas[this.fieldname][el.dataset.cropperKey]['cropBoxData']);
            }
          }
        }
        this.saveCropperByKeyAndCropper(el.dataset.cropperKey, cropperJs, cropperOptions);
      });
      "cropend zoom cropmove".split(" ").forEach((eventName) => {
        el.querySelector("img").addEventListener(eventName, (e) => {
          this.addCropperGenerateKey(el.dataset.cropperKey);
        });
      });
    });
  }

  saveCropperAllDatas() {
    Debug.log("Cropper - Save");
    [].forEach.call(this.element.querySelectorAll(".cropper-content"), (el) => {
      this.saveCropperByKeyAndCropper(el.dataset.cropperKey, this.cropperContainers[el.dataset.cropperKey].cropper, this.cropperContainers[el.dataset.cropperKey].options);
    });
    return this.cropperDatas;
  }

  saveCropperByKeyAndCropper(cropperKey, cropperJs, options) {
    Debug.log("Cropper - Save - "+cropperKey);
    if(this.cropperDatas[this.fieldname] === undefined || this.cropperDatas[this.fieldname].length === 0)
    {
      this.cropperDatas[this.fieldname] = {};
    }
    this.cropperDatas[this.fieldname][cropperKey] = {
      "containerData": cropperJs.getContainerData(),
      "imageData": cropperJs.getImageData(),
      "cropBoxData": cropperJs.getCropBoxData(),
      "cropCanvas": cropperJs.getCanvasData(),
      "options": options
    }
    this.cropperDataInput.value = JSON.stringify(this.cropperDatas);
    Debug.log(this.cropperDatas);
  }

  deleteCropperByKey(fieldname)
  {
    Debug.log("Cropper - Delete by fieldname - "+fieldname);
    if(this.cropperDatas[this.fieldname])
    {
      delete this.cropperDatas[this.fieldname];
    }
    this.cropperDataInput.value = JSON.stringify(this.cropperDatas);
    Debug.log(this.cropperDatas);
  }

  addCropperGenerateKey(cropperKey)
  {
    if(this.cropperGenerateKeys[this.fieldname] === undefined)
    {
      this.cropperGenerateKeys[this.fieldname] = {};
    }
    this.cropperGenerateKeys[this.fieldname][cropperKey] = 1;
    this.cropperDataInputGenerate.value = JSON.stringify(this.cropperGenerateKeys);
  }

  options(ratio, optionsSave) {
    var options = Object.assign({
      viewMode: 2,
      dragMode: "move",
      cropBoxMovable: true,
      cropBoxResizable: true
    }, optionsSave);

    if(ratio) {
      options["aspectRatio"] = parseFloat(ratio);
      options["viewMode"] = 1;
      options["cropBoxMovable"] = false;
      options["cropBoxResizable"] = false;

      var minWidth = this.editorContainer.querySelector('.croppers-content').offsetWidth - 20;
      var minHeight = this.editorContainer.querySelector('.croppers-content').offsetHeight - 100;
      if(ratio > 1)
      {
        options['minCropBoxWidth'] = minWidth;
        options['minCanvasWidth'] = minWidth;
      }
      else if(ratio < 1)
      {
        options['minCropBoxHeight'] = minHeight;
        options['minCanvasHeight'] = minHeight;
      }
      else
      {
        if(minWidth < minHeight)
        {
          options['minCropBoxWidth'] = minWidth;
          options['minCanvasWidth'] = minWidth;
        }
        else if(minWidth > minHeight)
        {
          options['minCropBoxHeight'] = minHeight;
          options['minCanvasHeight'] = minHeight;
        }
        else
        {
          options['minCropBoxWidth'] = minWidth;
          options['minCropBoxHeight'] = minHeight;
        }
      }
    }
    return options;
  }



}
export default Cropper;