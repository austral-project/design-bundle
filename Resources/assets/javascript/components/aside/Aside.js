import abstractOpenClose from "../abstractOpenClose";
import Animation from "./../../animation/Animation";

export default class Aside extends abstractOpenClose {

  static initComponent() {
    super.initComponent("aside");
  }

  create() {
    this.currentCliclElement = null;
    this.animation = new Animation();
    this.closeByClick = false;
    var animationParameter = {
      opacity: 1,
      visibility: "visible",
      ease: "none",
      duration: 0.2,
      onComplete: () => {
      },
      onReverseComplete: () => {
      }
    };
    if(this.element.classList.contains("right"))
    {
      animationParameter.right = 0;
    }
    else
    {
      animationParameter.left = 0;
    }
    this.animation.timeline.to(this.element, animationParameter, "#anime-1").pause();

    [].forEach.call(this.element.querySelectorAll("*[data-aside-close]"), (el) => {
      MiscEvent.addListener("click", (e)=>{
        e.preventDefault();
        e.stopPropagation();
        this.close();
      }, el);
    });
  }

  open(event) {
    if(event.detail.button !== undefined && event.detail.button.dataset.asideInsert) {
      this.insert = JSON.parse(event.detail.button.dataset.asideInsert);
      [].forEach.call(Object.entries(this.insert), (el) => {
        var element = document.querySelector(el[0]);
        element.innerHTML = el[1];
        MiscEvent.dispatch("component::aside.insert_finish", {"componentName": "aside", "insert": el}, element);
      });
    }
    super.open(event, ()=>{
      this.animation.timeline.timeScale(1).play();
    });
  }

  close(event) {
    super.close(event, ()=>{
      this.animation.timeline.timeScale(2).reverse();
    });
  }

  /** deprecated **/
  execute(clickEl = null, closeForce = false) {
    this.insert = clickEl !== null && clickEl.dataset.asideInsert ? JSON.parse(clickEl.dataset.asideInsert) : null;
    this.currentCliclElement = clickEl;

    console.log(this.element.classList.contains("open"), (clickEl !== null && clickEl.classList.contains("is-open")), closeForce === true)
    if(this.element.classList.contains("open") && (clickEl !== null && clickEl.classList.contains("is-open")) || closeForce === true) {
      super.close();
      if(this.insert !== undefined && this.insert !== null)
      {
        [].forEach.call(Object.entries(this.insert), (el) => {
          element.innerHTML = "";
        });
      }
    }
    else {
      /* Aside Open */
      if(clickEl)
      {
        clickEl.classList.add("is-open");
        if(this.insert !== undefined && this.insert !== null)
        {
          [].forEach.call(Object.entries(this.insert), (el) => {
            var element = Austral.Config.page.dom.querySelector(el[0]);
            element.innerHTML = el[1];
            MiscEvent.dispatch("component::aside.insert_finish", {"componentName": "aside", "insert": el}, element);
          });
        }
      }
      super.open();
    }
  }

}