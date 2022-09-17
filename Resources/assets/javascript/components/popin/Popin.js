import Animation from "./../../animation/Animation";
import Template from "./Template";
import abstractOpenClose from "../abstractOpenClose";
import Request from "../../request/Request";
import Components from "../Components";

class Popin  extends abstractOpenClose {

  static initComponent() {
    super.initComponent("popin");
  }

  create(element) {
    this.element = element;
    this.options = {};
    this.template = null;

    /* Rewrite does not work */
    if(this.element.dataset.viewByChoiceElement !== undefined)
    {
      [].forEach.call(this.element.querySelectorAll("*[data-choice-value-checked]"), (el) => {
        var choiceElement = Austral.Config.getElement("choice-element", el.dataset.choiceElementKey);
        if(choiceElement)
        {
          choiceElement.setViewByChoiceElement(this.element);
          if(choiceElement.hasCurrent())
          {
            this.element.classList.add("view");
          }
        }
      });
    }

    this.animation = new Animation();
    this.animation.timeline.to(this.element,  {
      "opacity": 1,
      "scale": 1,
      "x":"-50%",
      "y":"-50%",
      duration: 0.2,
      onComplete: () => {
      },
      onReverseComplete: () => {
        this.element.style.zIndex = -1;
        if(this.options.class !== undefined)
        {
          this.element.classList.remove(this.options.class);
        }
        if(this.template)
        {
          this.template.update();
          this.element.querySelector(".popin-content").innerHTML = "";
          Austral.Config.page.init(this.element.querySelector(".popin-content"));
        }
      }
    }, "#anime-1").pause();

  }

  addEventListener() {
    MiscEvent.addListener("component::action.open", (e) => {
      this.init(e.detail).open();
    }, this.element);
    MiscEvent.addListener("component::action.close", (e) => {
      this.close();
    }, this.element);


    MiscEvent.addListener("component::action.select-link", (e) => {
      let inputChoiceLink = this.element.querySelector("*[data-popin-update-input='field-link-choice']");
      if(inputChoiceLink)
      {
        inputChoiceLink.value = e.detail.keyLink;
      }

      let inputLinkName = this.element.querySelector("*[data-popin-update-input='field-link-choice-name']");
      if(inputLinkName)
      {
        inputLinkName.textContent = e.detail.linkName;
      }
    }, this.element);

    MiscEvent.addListener("component::load.finish", ()=>{
      let eventElements = Austral.Config.page.dom.body.querySelectorAll("[data-"+this.componentName+"-container='#"+this.element.getAttribute("id")+"']");
      [].forEach.call(eventElements, (element) => {
        Debug.log("-- Component Configuration Button Action : "+this.componentName);
        this.addEventButtonAction(element, this.componentName);
        element.addEventListener("component::action."+this.componentName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          MiscEvent.dispatch("click", {"button": e.target}, this.element);
        });
      });
    }, this.element);

    this.initCloseButton();
  }

  initCloseButton()
  {
    [].forEach.call(this.element.querySelectorAll("*[data-popin-close]"), (el) => {
      this.element.classList.add('init');
      if(!el.classList.contains("lose-popin-init"))
      {
        el.classList.add('close-popin-init');
        MiscEvent.addListener("click", (event) => {
          event.preventDefault();
          this.close();
        }, el);
      }
    });
  }

  init(e) {
    if(e.button !== undefined) {
      this.options = e.button.dataset.popinOptions ? JSON.parse(e.button.dataset.popinOptions) : {};
      this.buttonClick = e.button;
      this.template = null;
      if(this.options.template !== undefined)
      {
        this.template = new Template(this);
        this.template.init();
      }
    }
    return this;
  }

  open() {
    Debug.log("Popin - Open");
    this.element.style.zIndex = 110000;
    if(this.options.url)
    {
      var request = new Request(
        "GET",
        this.options.url,
        {},
        (fetchResponse) => {
          fetchResponse.text().then((text) => {
            var parser = new DOMParser();
            var responseDom = parser.parseFromString(text, "text/html");
            this.element.querySelector(".popin-content").innerHTML = responseDom.querySelector(".contentPopin").innerHTML;
            Components.loadComponent();
            if(this.options.class !== undefined)
            {
              this.element.classList.add(this.options.class);
            }
            Austral.Config.page.dom.body.classList.add('popin-open');
            MiscEvent.dispatch("component::popin.open", {"component": this}, this.element);
            this.initCloseButton();
            this.element.classList.add("open");
            this.animation.timeline.timeScale(1).play();
          });

        }
      );
      request.execute();
    }
    else
    {
      if(this.options.class !== undefined)
      {
        this.element.classList.add(this.options.class);
      }
      Austral.Config.page.dom.body.classList.add('popin-open');
      MiscEvent.dispatch("component::popin.open", {"component": this}, this.element);
      this.element.classList.add("open");
      this.animation.timeline.timeScale(1).play();
    }

    if(this.element.getAttribute("id") === "popin-select-links")
    {
      let fieldLinkChoice = document.querySelector("#popin-field-link-choice");
      let tabIdSelected = null;
      if(fieldLinkChoice && fieldLinkChoice.value)
      {
        let elementsSelected = this.element.querySelectorAll(".selected[data-key-link]");
        if(elementsSelected)
        {
          [].forEach.call(elementsSelected, (element)=>{
            element.classList.remove("selected");
          });
        }

        let elementSelected = this.element.querySelector("*[data-key-link='"+fieldLinkChoice.value+"']");
        if(elementSelected)
        {
          elementSelected.classList.add("selected");
          this.openParentToogle(elementSelected.closest("*[data-toggle]"));
          let tab = elementSelected.closest("*[data-tab]");
          tabIdSelected = tab.dataset.tab;
        }
      }
      if(!tabIdSelected) {
        let firstChoiceDomain = this.element.querySelectorAll(".domains-list li *[data-tab-choice]")[0];
        tabIdSelected = firstChoiceDomain.dataset.tabChoice;
      }
      if(tabIdSelected) {
        let containerTab = this.element.querySelector("*[data-tabs]");
        MiscEvent.dispatch("component::action.open", {tabId: tabIdSelected}, containerTab);
      }
    }

  }

  openParentToogle(parentToggle)
  {
    if(parentToggle !== undefined && parentToggle)
    {
      MiscEvent.dispatch("component::action.open", {}, parentToggle);
      this.openParentToogle(parentToggle.parentElement.closest("*[data-toggle]"));
    }
  }

  isOpen() {
    return this.element.classList.contains("open")
  }

  close() {
    Debug.log("Popin - Close");
    MiscEvent.dispatch("component::popin.close", {"component": this}, this.element);
    this.animation.timeline.timeScale(1).reverse();
    this.element.classList.remove("open");
    if(Austral.Config.page.dom.body.querySelectorAll(".popin-container.open").length === 0)
    {
      Austral.Config.page.dom.body.classList.remove('popin-open');
    }
  }
}
export default Popin;