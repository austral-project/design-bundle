import Animation from "./../../animation/Animation";
import abstractComponent from "./../abstract"

export default class StickyBandeauTop extends abstractComponent {

  static initComponent() {
    super.initComponent("sticky-bandeau");
  }

  create(element) {
    this.element = element;
    this.animation = new Animation();

    this.animation.timeline
      .to(this.element, { padding: 0, height: "5rem", ease: "none", duration: 1 }, "#anime-1")
      .to(Austral.Config.page.dom.querySelector(".form-container"),  { "padding-top": "16rem", ease: "none" }, "#anime-1")
      .to(this.element.querySelector(".h1-sub-title"), { height: "0", opacity: 0, ease: "none", duration: 0.8 }, "#anime-1")
      .to(this.element.querySelector(".h1-title"), { "font-size": "1.8rem", ease: "none", duration: 0.8 }, "#anime-1");

    var hasButtonReturn = false;
    if(this.element.querySelector(".button-return-top-container"))
    {
      hasButtonReturn = true;
      this.animation.timeline
        .to(this.element.querySelector(".button-return-container"), {left: "-0.5rem", opacity: 1, ease: "none", duration: 0.8 }, "#anime-1")
        .to(this.element.querySelector(".button-return-top-container"), { top: "-6rem", opacity: 0, height:0, flex: "auto", ease: "none", duration: 0.8 }, "#anime-1");
    }
    this.animation.timeline
      .to(this.element.querySelector(".title-button-content "),{ "padding-top": "0.6rem", "padding-left": hasButtonReturn ? "3.5rem" : "0", ease: "none", duration: 0.8 }, "#anime-1")
      .to(this.element,{ "border-bottom-width": "0.1rem", ease: "none", duration: 0.8 }, "#anime-1")
      .pause();

    this.animation.timeline.eventCallback("onComplete", () => {
      this.element.classList.add("sticky");
    });

    if(window.scrollY > 60) {
      this.animation.timeline.timeScale(10).play();
    }
  }

  addEventListener() {
    MiscEvent.addListener("component::scroll", () => {
      if(window.scrollY < 60) {
        this.animation.timeline.timeScale(2).reverse();
        this.element.classList.remove("sticky");
      }
      else
      {
        this.animation.timeline.timeScale(2).play();
      }
    }, this.element);

  }

}