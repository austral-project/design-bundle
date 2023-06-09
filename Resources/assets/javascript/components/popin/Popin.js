import Animation from "./../../animation/Animation";
import Template from "./Template";
import abstractOpenClose from "../abstractOpenClose";
import Request from "../../request/Request";
import Components from "../Components";
import MiscEvent from "../../misc/Event";

class Popin  extends abstractOpenClose {

  static initComponent() {
    super.initComponent("popin");
  }

  create(element) {
    this.element = element;
    this.options = {};
    this.template = null;
    this.initialiseUnique = false;

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

    if( this.element.dataset.templateAjax !== undefined)
    {
      if(this.options) {
        this.options["url"] = this.element.dataset.templateAjax
      }
      else {
        this.options = {
          url: this.element.dataset.templateAjax
        };
      }
    }

    return this;
  }

  open() {
    Debug.log("Popin - Open");
    this.element.style.zIndex = 110000;
    if(this.options.url && (this.initialiseUnique === false))
    {
      var request = new Request(
        "GET",
        this.options.url,
        {},
        (fetchResponse) => {
          fetchResponse.text().then((text) => {
            var parser = new DOMParser();
            var responseDom = parser.parseFromString(text, "text/html");
            this.element.querySelector(".popin-content").innerHTML = responseDom.querySelector(".popin-content").innerHTML;
            if(this.element.getAttribute("id") === "popin-select-links")
            {
              this.initialiseUnique = true;
              this.element.querySelector(".popin-content").setAttribute("data-tabs", "");
              Components.loadComponent();
              this.initInitialiseUnique();
            }
            else if(this.element.getAttribute("id") === "popin-graphic-items")
            {
              let graphicElementChoices = this.element.querySelectorAll("*[data-grahic-element-choice]");
              let fieldToGraphicElement = document.querySelector(this.options.field);
              if(graphicElementChoices.length > 0 && fieldToGraphicElement)
              {
                let graphicElementChoiceCurrent = this.element.querySelector('*[data-grahic-element-choice="'+fieldToGraphicElement.value+'"]');
                if(graphicElementChoiceCurrent && graphicElementChoiceCurrent.getAttribute("data-grahic-element-choice"))
                {
                  graphicElementChoiceCurrent.classList.add("current");
                  let dataTabValue = graphicElementChoiceCurrent.closest("*[data-tab]").getAttribute("data-tab");
                  let dataTabChoice = this.element.querySelector('*[data-tab-choice="'+dataTabValue+'"]');
                  if(dataTabChoice) {
                    setTimeout(() => {
                      MiscEvent.dispatch("click", {}, dataTabChoice);
                    }, 100);
                  }
                }

                graphicElementChoices.forEach((graphicElementChoice) => {
                  MiscEvent.addListener("click", (e) => {
                    let value = graphicElementChoice.getAttribute("data-grahic-element-choice");
                    fieldToGraphicElement.value = value;
                    if(value)
                    {
                      fieldToGraphicElement.closest(".field-content").querySelector(".graphic-item .preview").innerHTML = graphicElementChoice.innerHTML;
                      fieldToGraphicElement.closest(".field-content").querySelector(".graphic-item").classList.add('edit');
                    }
                    else
                    {
                      fieldToGraphicElement.closest(".field-content").querySelector(".graphic-item .preview").innerHTML = "";
                      fieldToGraphicElement.closest(".field-content").querySelector(".graphic-item").classList.remove('edit');
                    }
                    this.close();
                  }, graphicElementChoice);
                });
              }
              Components.loadComponent();
            }
            else
            {
              Components.loadComponent();
            }

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
      if(this.initialiseUnique === true)
      {
        this.initInitialiseUnique();
      }
      if(this.options.class !== undefined)
      {
        this.element.classList.add(this.options.class);
      }
      Austral.Config.page.dom.body.classList.add('popin-open');
      MiscEvent.dispatch("component::popin.open", {"component": this}, this.element);
      this.element.classList.add("open");
      this.animation.timeline.timeScale(1).play();
    }

  }

  initInitialiseUnique() {
    let fieldLinkChoice = null;
    if(document.querySelector(".sun-editor-diag-link-choice.is-open"))
    {
      fieldLinkChoice = document.querySelector(".sun-editor-diag-link-choice.is-open #popin-field-link-choice")
    }
    else
    {
      fieldLinkChoice = document.querySelector("#popin-editor-master #popin-field-link-choice");
    }
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

      let fieldLinkChoiceValue = fieldLinkChoice.value;
      if(fieldLinkChoiceValue)
      {
        fieldLinkChoiceValue = fieldLinkChoiceValue.replace("#INTERNAL_LINK_", "");
        fieldLinkChoiceValue = fieldLinkChoiceValue.replace("#", "");
      }

      var allToogles = this.element.querySelectorAll("*[data-toggle]");
      [].forEach.call(allToogles, (el) => {
        MiscEvent.dispatch("component::action.close", {}, el);
      });

      let elementSelected = this.element.querySelector("*[data-key-link='"+fieldLinkChoiceValue+"']");
      if(elementSelected)
      {
        elementSelected.classList.add("selected");
        setTimeout(()=>{
          this.openParentToogle(elementSelected.closest("*[data-toggle]"));
        }, 100);
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