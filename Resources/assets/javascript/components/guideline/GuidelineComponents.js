import abstractComponent from "../abstract";
import MiscEvent from "../../../../../../../../assets/vendor/javascript/event/Event";

export default class GuidelineComponents extends abstractComponent {

  static initComponent() {
    super.initComponent("guideline-components");
  }

  create(element) {
    this.element = element;

    this.choiceScreen = this.element.querySelector("*[data-guideline-screen]");
    this.choiceWidth = this.element.querySelector("*[data-guideline-width]");
    this.choiceHeight = this.element.querySelector("*[data-guideline-height]");
    this.guidelineContainer = this.element.querySelector("*[data-guideline-container]");
    this.buttonSwitch = this.element.querySelector("*[data-guideline-switch-size]");
    this.buttonFull = this.element.querySelector("*[data-guideline-full]");
    this.reverse = false;

    let screenSizes = JSON.parse(this.choiceScreen.getAttribute("data-screen-sizes"));
    MiscEvent.addListener("component::select:choice:after", () => {
      if(screenSizes[this.choiceScreen.value] !== undefined)
      {
        this.choiceWidth.value = this.reverse ? screenSizes[this.choiceScreen.value].height : screenSizes[this.choiceScreen.value].width;
        this.choiceHeight.value = this.reverse ? screenSizes[this.choiceScreen.value].width : screenSizes[this.choiceScreen.value].height;
      }
      this.updateGuidelineContainer();
    }, this.choiceScreen);

    let timeout = 0;
    MiscEvent.addListener("keyup", ()=>{
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.selectRemoveValue();
        this.updateGuidelineContainer();
      }, 800);
    });


    this.element.querySelectorAll("*[data-modal-open]").forEach((el) => {
      MiscEvent.addListener("click", ()=>{
        this.modalOpen();
      }, el);
    });
    this.element.querySelectorAll("*[data-modal-close]").forEach((el) => {
      MiscEvent.addListener("click", ()=>{
        this.modalClose();
      }, el);
    });

    MiscEvent.addListener("click", ()=>{
      this.reverse = this.reverse === true ? false : true;
      let currentWidth = this.choiceWidth.value;
      let currentHeight = this.choiceHeight.value;
      this.choiceWidth.value = currentHeight;
      this.choiceHeight.value = currentWidth;
      if(this.reverse === true) {
        this.buttonSwitch.classList.add("is-reverse");
      }
      else {
        this.buttonSwitch.classList.remove("is-reverse");
      }
      this.updateGuidelineContainer();
    }, this.buttonSwitch);

    MiscEvent.addListener("resize", () => {
      this.sizeByWindowSize();
    }, window);

  }

  modalOpen()
  {
    this.element.classList.add("is-modal-open");
  }

  modalClose()
  {
    this.element.classList.remove("is-modal-open");
  }

  selectRemoveValue()
  {
    this.choiceScreen.value = null;
    MiscEvent.dispatch("choice", {choice: {value: ""}}, this.choiceScreen);
  }

  sizeByWindowSize(full = false)
  {
    let width = window.innerWidth - 40;
    let height = window.innerHeight - this.element.querySelector(".guideline-parameters").offsetHeight - 20;
    let isResize = false;
    if(width < this.guidelineContainer.offsetWidth || full)
    {
      isResize = true;
      this.choiceWidth.value = width;
    }
    if(height < this.guidelineContainer.offsetHeight || full)
    {
      isResize = true;
      this.choiceHeight.value = height;
    }
    if(isResize)
    {
      this.selectRemoveValue();
      this.updateGuidelineContainer();
    }
  }

  updateGuidelineContainer()
  {
    this.guidelineContainer.style.width = this.choiceWidth.value+"px";
    this.guidelineContainer.style.height = this.choiceHeight.value+"px";
  }


  addEventListener() {
    super.addEventListener();
  }

}