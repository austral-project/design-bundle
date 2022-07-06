import abstractOpenClose from "../abstractOpenClose"
import { gsap } from "gsap";

export default class Toast extends abstractOpenClose {

  static initComponent() {
    super.initComponent("toast");
  }

  create() {
    this.position = this.element.dataset.toastPosition;
    this.elementCurrentClass = "";
    this.positionToShowY = "";
    this.positionToShowX = "";

    if(this.element.dataset.toastPositionOrigin !== undefined)
    {
      if(this.element.dataset.toastPositionOrigin !== "self") {
        this.originPosition = Austral.Config.page.dom.body.querySelector(this.element.dataset.toastPositionOrigin);
      }
      else {
        this.originPosition = this.element;
      }
    }
    if(this.originPosition === undefined || !this.originPosition)
    {
      this.originPosition = this.element.parentNode;
    }

    if(this.position === undefined || !this.position)
    {
      this.position = "left-center";
    }

    this.animationParametersShow = {
      opacity: 1,
      ease: "none",
      duration: 0.2,
    };
    this.animationParametersHide = {
      opacity: 0,
      ease: "none",
      duration: 0.1,
    };
    this.initElement();

  }

  initElement() {
    var positionY = this.getPositionY(true);
    var positionX = this.getPositionX(true);

    this.element.removeAttribute("style");
    if(this.elementCurrentClass) {
      this.element.classList.remove(this.elementCurrentClass);
    }
    this.element.classList.add(positionY+"-"+positionX);
    this.elementCurrentClass = positionY+"-"+positionX;
    this.initElementPosition(positionY, positionX);
  }

  initElementPosition(positionY, positionX) {
    if(positionY === "bottom")
    {
      this.element.style.top = MiscNodeSize.height(this.originPosition, "full", "middle")-10+"px";
    }
    else if(positionY === "top")
    {
      this.element.style.bottom = MiscNodeSize.height(this.originPosition, "full", "middle")-10+"px";
    }
    else if(positionY === "right")
    {
      this.element.style.left = MiscNodeSize.width(this.originPosition, "full", "middle")-10+"px";
    }
    else if(positionY === "left")
    {
      this.element.style.right = MiscNodeSize.width(this.originPosition, "full", "middle")-10+"px";
    }

    if(positionX === "right")
    {
      this.element.style.right = MiscNodeSize.width(this.originPosition, "full")-MiscNodeSize.width(this.originPosition, "inner")+"px";
    }
    else if(positionX === "left")
    {
      this.element.style.left = MiscNodeSize.width(this.originPosition, "full")-MiscNodeSize.width(this.originPosition, "inner")+"px";
    }
    else if(positionX === "bottom")
    {
      this.element.style.bottom = MiscNodeSize.height(this.originPosition, "full")-MiscNodeSize.height(this.originPosition, "inner")+"px";
    }
    else if(positionX === "top")
    {
      this.element.style.top = MiscNodeSize.height(this.originPosition, "full")-MiscNodeSize.height(this.originPosition, "inner")+"px";
    }
  }

  getPositionY(reel = true) {
    var positions = this.position.split("-");
    var positionY = positions[0];
    if(reel === false) {
      if (MiscNodeSize.elementInViewportOverrunY(this.element) === "bottom") {
        if(positionY === "bottom") {
          positionY = "top";
        }
      }
      else if (MiscNodeSize.elementInViewportOverrunY(this.element) === "top") {
        if(positionY === "top") {
          positionY = "bottom";
        }
      }
    }
    return positionY;
  }

  getPositionX(reel = true) {
    var positions = this.position.split("-");
    var positionX = positions[1];
    var positionY = positions[0];
    if(reel === false) {
      if (MiscNodeSize.elementInViewportOverrunY(this.element) === "bottom") {
        if (positionX === "center" && (positionY === "right" || positionY === "left")) {
          positionX = "bottom";
        }
      }
      else if (MiscNodeSize.elementInViewportOverrunY(this.element) === "top") {
        if (positionX === "center" && (positionY === "right" || positionY === "left")) {
          positionX = "top";
        }
      }
    }
    return positionX;
  }

  open(event) {
    super.open(event, ()=>{
      gsap.to(this.element, this.animateParameters(this.animationParametersShow, "show"));
    });
  }

  close(event) {
    super.close(event, ()=>{
      gsap.to(this.element, this.animateParameters(this.animationParametersHide, "hide")).eventCallback("onComplete", ()=> {
        this.initElement();
      });
    });
  }

  animateParameters(animateParameters, type) {

    var positionY = 0;
    var positionX = 0;
    if(type === "show")
    {
      this.element.classList.remove(this.getPositionY()+"-"+this.getPositionX());

      positionY = this.getPositionY(false);
      positionX = this.getPositionX(false);
      this.element.removeAttribute("style");
      if(this.elementCurrentClass) {
        this.element.classList.remove(this.elementCurrentClass);
      }
      this.element.classList.add(positionY+"-"+positionX);
      this.elementCurrentClass = positionY+"-"+positionX;
      this.initElementPosition(positionY, positionX);
      this.positionToShowY = positionY;
      this.positionToShowX = positionX;
    }
    else
    {
      positionY = this.positionToShowY;
      positionX = this.positionToShowX;
    }

    if(positionY === "bottom")
    {
      if(type === "show") {
        animateParameters.top = MiscNodeSize.height(this.originPosition, "full", "middle")+5;
      } else {
        animateParameters.top = MiscNodeSize.height(this.originPosition, "full", "middle")-10+"px";
      }
    }
    else if(positionY === "top")
    {
      if(type === "show") {
        animateParameters.bottom = MiscNodeSize.height(this.originPosition, "full", "middle")+5;
      } else {
        animateParameters.bottom = MiscNodeSize.height(this.originPosition, "full", "middle")-10+"px";
      }
    }
    else if(positionY === "right")
    {
      if(type === "show") {
        animateParameters.left = MiscNodeSize.width(this.originPosition, "full", "middle")+5;
      } else {
        animateParameters.left = MiscNodeSize.width(this.originPosition, "full", "middle")-10+"px";
      }
    }
    else if(positionY === "left")
    {
      if(type === "show") {
        animateParameters.right = MiscNodeSize.width(this.originPosition, "full", "middle")+5;
      } else {
        animateParameters.right = MiscNodeSize.width(this.originPosition, "full", "middle")-10+"px";
      }
    }
    return animateParameters;
  }


}