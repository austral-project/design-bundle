import abstractOpenClose from "../abstractOpenClose";
import Animation from "./../../animation/Animation";

export default class Toogle extends abstractOpenClose {

  static initComponent() {
    super.initComponent("toggle");
  }

  create() {
    this.toggleParameters = this.element.dataset.toggle;
    this.element.classList.add('toggle-element');
    this.animation = new Animation();
    this.elementsToAddClass = document.querySelectorAll(this.element.dataset.toggleElementsAddClass);

    var heightToOpen = 0;
    [].forEach.call(this.element.children, (child) => {
      heightToOpen = heightToOpen+child.clientHeight;
    });

    var animationParameters = {
      opacity: 1,
      ease: "none",
      height: heightToOpen+"px",
      duration: 0.2,
      onComplete: () => {
        this.element.style.height = "auto";
        this.element.style.overflow = "visible";
      },
      onReverseComplete: () => {
        this.element.removeAttribute("style");
      }
    };
    this.animation.timeline.to(this.element, animationParameters, "#anime-1").pause();
  }

  open(event) {
    super.open(event, ()=>{
      this.animation.timeline.timeScale(1).play();
      [].forEach.call(this.elementsToAddClass, (el) => {
        el.classList.add("toggle-open");
      });
    });
  }

  close(event) {
    super.close(event, ()=>{
      this.element.removeAttribute("style");
      this.element.style.height = this.element.clientHeight;
      this.animation.timeline.timeScale(2).reverse();
      [].forEach.call(this.elementsToAddClass, (el) => {
        el.classList.remove("toggle-open");
      });
    });
  }
}