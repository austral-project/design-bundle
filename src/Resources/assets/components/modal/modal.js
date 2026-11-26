/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


import {abstractComponent, DomEventManager, LibLoader, utils, Request, Config} from "@austral/design";
import gsap from "gsap";

export default class Modal extends abstractComponent {

  static initComponent() {
    super.initComponent("modal");
  }

  async create() {
    this.gsap = await LibLoader.gsap();
    let options = {};
    try {
      options = JSON.parse(this.element.getAttribute("data-modal"));
    }catch(e){

    }
    this.options = Object.assign({
      modalId: "modal-master",
      theme: "full"
    }, options);

    this.modalContent = this.element.querySelector("*[data-modal-content]");
    this.buttonsOpen = document.querySelectorAll("*[data-modal-open='"+this.options.modalId+"']");
    this.buttonsClose = this.element.querySelectorAll("*[data-modal-close]");
    this.modalParentZIndex = this.element.closest("*[data-modal-z-index]");

    this.initButtonTrigger();

    DomEventManager.addListener("modal::"+this.options.modalId+"::open", () => {
      this.open();
    });
    DomEventManager.addListener("modal::"+this.options.modalId+"::close", () => {
      this.close();
    });

    DomEventManager.addListener("modal::close", (event)=>{
      this.close();
    }, this.element);
    DomEventManager.addListener("modal::open", (event)=>{
      this.open();
    }, this.element);

    this.timeline = this.gsap.timeline({
      onReverseComplete:()=>{
        this.element.classList.remove("view");
        DomEventManager.dispatch("modal::"+this.options.modalId+"::close.finish", {});
      },
      onComplete:()=>{
        DomEventManager.dispatch("modal::"+this.options.modalId+"::open.finish", {});
      }
    }).pause();
    this.timeline.to(this.element, {duration: 0.2, opacity: 1});
    if(this.options.theme === "left")
    {
      this.timeline.to(this.element.querySelector(".modal-container"), {duration: 0.4, left: 0});
    }
    else if(this.options.theme === "right")
    {
      this.timeline.to(this.element.querySelector(".modal-container"), {duration: 0.4, right: 0});
    }
    else if(this.options.theme === "center")
    {
      this.timeline.to(this.element.querySelector(".modal-container"), {duration: 0.4, top: 0, opacity: 1});
    }
    else
    {
      this.timeline.to(this.element.querySelector(".modal-container"), {duration: 0.4, scaleY: 1, scaleX: 1, opacity: 1});
    }
  }

  initButtonTrigger(refresh = false)
  {
    this.buttonsOpen.forEach((button) => {
      if(!button.hasAttribute("data-modal-button-initialize") || refresh === false)
      {
        button.setAttribute("data-modal-button-initialize", "");
        DomEventManager.removeAllListeners(button, "click");
        DomEventManager.addListener("click", (event)=>{

          if(button.hasAttribute("data-modal-url"))
          {
            document.body.classList.add("load");
            button.classList.add("load");
            var request = new Request(
              button.dataset.modalUrl,
              "GET",
            );
            request.execute((fetchResponse)=>{
              fetchResponse.json().then((json) => {
                if(json.status === "success")
                {
                  let parser = new DOMParser();
                  let templateHtml = parser.parseFromString(json.templateHtml, "text/html");
                  this.innerHtml(templateHtml.body.innerHTML, button);
                }
                else
                {
                  document.body.classList.remove("load");
                  button.classList.remove("load");
                }
              })
            });
          }
          else
          {
            if(button.hasAttribute("data-modal-close"))
            {
              let modalId = button.getAttribute("data-modal-close");
              if(modalId)
              {
                DomEventManager.dispatch("modal::"+modalId+"::close");
              }
            }
            if(button.hasAttribute("data-modal-replaces"))
            {
              let replaces = JSON.parse(button.getAttribute("data-modal-replaces"));
              for (const [key, value] of Object.entries(replaces)) {
                let elementReplace = this.element.querySelector(key);
                if(elementReplace)
                {
                  if(key.includes("*[data-modal-replaces-path]") && elementReplace.href !== undefined)
                  {
                    elementReplace.href = value;
                    DomEventManager.dispatch('refresh-url', {}, elementReplace);
                  }
                  else
                  {
                    elementReplace.innerHTML = value;
                  }
                }
              }
            }
            this.open();
          }
        }, button);
      }
    });

    this.buttonsClose.forEach((button) => {
      if(!button.hasAttribute("data-modal-button-initialize") || refresh === false)
      {
        DomEventManager.removeAllListeners(button, "click");
        DomEventManager.removeListener("click", (event)=>{}, button);
        DomEventManager.addListener("click", (event)=>{
          this.close();
        }, button);
      }
    });
  }

  innerHtml(html, button = null) {
    this.modalContent.innerHTML = html;
    setTimeout(()=>{
      DomEventManager.dispatch("components::load");
      DomEventManager.dispatch("reload-trigger::load");
      document.body.classList.remove("load");
      if(button)
      {
        button.classList.remove("load");
      }
      this.open();

      let scrollOffset = 100;
      let scrollElement = this.modalContent.querySelectorAll(".field-row.error")[0];
      if(scrollElement)
      {
        let firstErrorInput = scrollElement.querySelector("input, select");
        firstErrorInput.focus({preventScroll: true});
        Config.getModule("PageTransition")?.transitionScroll(
          this.modalContent,
          firstErrorInput,
          scrollOffset,
          "smooth"
        );
      }
      else
      {
        Config.getModule("PageTransition")?.transitionScroll(
          this.modalContent,
          null,
          0,
          "instant"
        );
      }

      if(button && button.hasAttribute("data-modal-close"))
      {
        let modalId = button.getAttribute("data-modal-close");
        if(modalId)
        {
          DomEventManager.dispatch("modal::"+modalId+"::close");
        }
      }

    }, 100);
  }

  close() {
    Debug.log("Modal - Close");
    if(this.element && this.element.classList.contains("open"))
    {
      if(this.modalParentZIndex)
      {
        this.modalParentZIndex.classList.remove("modal-parent-z-index");
      }
      this.element.classList.remove("open");
      this.timeline.timeScale(2).reverse();
      if(document.querySelectorAll(".modal-area.open").length === 0)
      {
        document.body.classList.remove("modal-open");
      }
    }
  }

  open() {
    Debug.log("Modal - Open");
    if(this.element) {
      if(this.modalParentZIndex)
      {
        this.modalParentZIndex.classList.add("modal-parent-z-index");
      }
      this.element.classList.add("open");
      this.element.classList.add("view");
      document.body.classList.add("modal-open");
      this.timeline.play();
    }
  }

  refreshComponent() {
    this.buttonsOpen = document.querySelectorAll("*[data-modal-open='"+this.options.modalId+"']");
    this.buttonsClose = this.element.querySelectorAll("*[data-modal-close]");
    this.initButtonTrigger(true);
  }

}
DomEventManager.addListener("component::initialize", () => {
  Modal.initComponent();
});
