import Tools from '../../library/Tools';
import Request from "../../request/Request";
import Response from "../../response/Response";
import abstractField from "./abstract";
import ViewByChoice from "./ViewByChoice";

export default class Choice extends abstractField{

  static initComponent() {
    super.initComponent("choice-element", (element) => {
      this.viewByChoice = {};
      if(element.dataset.hasOwnProperty("viewByChoices"))
      {
        this.viewByChoice = new ViewByChoice(element, "view-by-choices");
      }
    });
  }

  create(element) {
    super.create(element);
    this.options = JSON.parse(this.element.dataset.choiceElementStyles);
    this.isMultiple = this.element.dataset.choiceMultiple === "1";
    this.viewByChoiceElement = null;
    this.horizontal = this.element.dataset.choiceDirection === "horizontal";
    this.verticalLine = this.element.dataset.choiceDirection === "vertical-line";
    this.light = this.element.parentElement.classList.contains("light");


    this.currentBackground = null;
    if(!this.isMultiple)
    {
      this.currentBackground = this.element.querySelector(".current-background");
      if(this.horizontal)
      {
        this.currentBackground.style.width = this.element.clientWidth+"px";
        this.currentBackground.style.left = "-"+(this.element.clientWidth*1.1)+"px";
      }
      else if(!this.verticalLine)
      {
        this.currentBackground.style.width = this.element.clientWidth+"px";
        if(this.light)
        {
          this.currentBackground.style.height = "1px";
          this.currentBackground.style.top = "-40px";
        }
        else {
          this.currentBackground.style.height = "10px";
          this.currentBackground.style.top = "-40px";
        }
      }


    }
    this.initialValue  = [];

    [].forEach.call(this.element.querySelectorAll(".option-element"), (el) => {
      if(el.querySelector("input"))
      {
        if(el.querySelector("input").checked)
        {
          this.initialValue.push(el.querySelector("input").getAttribute("id"));
          this.changeCurrent(el, true);
        }
      }
      else if(el.classList.contains("current"))
      {
        this.changeCurrent(el, true);
      }
    });

    if(!this.element.querySelector(".option-element.current")){
      this.animateCurrentBackground();
    }
  }

  initialValueChange() {
    var isChanged = false;
    [].forEach.call(this.element.querySelectorAll(".option-element"), (el) => {
      if(el.querySelector("input"))
      {
        if(el.querySelector("input").checked) {
          if(!this.initialValue.includes(el.querySelector("input").getAttribute("id"))) {
            isChanged = true;
          }
        }
        else {
          if(this.initialValue.includes(el.querySelector("input").getAttribute("id"))) {
            isChanged = true;
          }
        }
      }
    });
    return isChanged;
  }

  addEventListener() {
    super.addEventListener();

    MiscEvent.addListener("component::choice.delete", () => {
      this.deleteChoice();
      if(this.formContainer) {
        MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: this.initialValueChange() }, this.formContainer);
      }
      MiscEvent.dispatch("component::view-choice:remove", { }, this.element);
    }, this.element);

    MiscEvent.addListener("component::choice.execute", (event) => {
      this.execute(event.detail.elementClick);
      if(this.formContainer) {
        MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: this.initialValueChange() }, this.formContainer);
      }
    }, this.element);

    MiscEvent.addListener("component::load.finish", () => {
      this.animateCurrentBackground();
    }, this.element);

    if(this.element.dataset.choiceElementReinitParent)
    {
      [].forEach.call(this.element.closest(this.element.dataset.choiceElementReinitParent).querySelectorAll("*[data-reinit-choice]"), (el) => {
        MiscEvent.addListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          MiscEvent.dispatch("component::choice.delete", {"component": this}, this.element);
        }, el);
      });
    }

    [].forEach.call(this.element.querySelectorAll(".option-element"), (el) => {

      MiscEvent.addListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        MiscEvent.dispatch("component::choice.execute", {"component": this, "elementClick": el}, this.element);
      }, el);

      MiscEvent.addListener("change", (e) => {
        e.preventDefault();
        e.stopPropagation();
        MiscEvent.dispatch("component::choice.execute", {"component": this, "elementClick": el}, this.element);
      }, el);

    });

  }

  execute(el) {
    this.element.classList.add("click");
    if(el.dataset.choiceElementUrl !== undefined)
    {
      this.changeCurrent(el, false);
      var response = new Response((fetchResponse) => {
        if(el.dataset.choiceElementCallback !== undefined && el.dataset.choiceElementCallback)
        {
          if(typeof this[el.dataset.choiceElementCallback] === "function")
          {
            this[el.dataset.choiceElementCallback](el, fetchResponse);
          }
        }
      });
      response.setUpdateBodyClass(true);
      var request = new Request(
        "GET",
        el.dataset.choiceElementUrl,
        {},
        response
      );
      request.execute();
    }
    else
    {
      this.changeCurrent(el);
    }
  }

  setViewByChoiceElement(element)
  {
    this.viewByChoiceElement = element;
  }

  hasCurrent() {
    return this.element.querySelectorAll(".current").length > 0;
  }

  deleteChoice() {
    [].forEach.call(this.element.querySelectorAll(".current"), (el) => {
      el.classList.remove("current");
      if(el.querySelector("input"))
      {
        el.querySelector("input").checked = false;
        MiscEvent.dispatch("change", {"component": this}, el.querySelector("input"));
      }
      if(!this.isMultiple)
      {
        this.currentBackground.style.width = 0;
        if(this.horizontal)
        {
          this.currentBackground.style.left = "0px";
        }
        else
        {
          this.currentBackground.style.top = "0px"
        }
      }
    });
    if(this.viewByChoiceElement)
    {
      this.viewByChoiceElement.classList.remove("view");
    }
  }

  changeCurrent(el, init = false, fetchResponse = null) {
    var input = el.querySelector("input");
    if(!this.isMultiple)
    {
      if(this.options["value-"+el.dataset.choiceElementValue])
      {
        this.currentBackground.style = null;
        [].forEach.call(Object.entries(this.options["value-"+el.dataset.choiceElementValue]), (value) => {
          var style = value[1].split(':');
          this.currentBackground.style.setProperty(style[0], style[1]);
        });
      }

      [].forEach.call(this.element.querySelectorAll(".current"), (elOldCurrent) => {
        elOldCurrent.classList.remove("current");
      });
      el.classList.add("current");
      if(input)
      {
        input.checked = true;
      }
      if(this.viewByChoiceElement)
      {
        this.viewByChoiceElement.classList.add("view");
      }

      if(this.horizontal)
      {
        this.currentBackground.style.width = el.clientWidth+"px";
        this.currentBackground.style.left = (Tools.offset(el).left)+"px";
      }
      else if(this.verticalLine)
      {
        this.currentBackground.style.height = el.clientHeight+"px";
        this.currentBackground.style.top = (Tools.offset(el).top/110*100)+"px";
      }
      else
      {
        this.currentBackground.style.width = el.clientWidth+"px";
        let scaleValue = 1;
        let popinContainer = this.element.closest('.popin-container');
        if(popinContainer)
        {
          if(!popinContainer.classList.contains("open"))
          {
            scaleValue = 2;
          }
        }
        if(this.light)
        {
          this.currentBackground.style.top = (Tools.offset(el).top*scaleValue+(el.scrollHeight))+"px";
          this.currentBackground.style.height = "1px";
        }
        else
        {
          this.currentBackground.style.height = el.clientHeight+"px";
          this.currentBackground.style.top = (Tools.offset(el).top*scaleValue)+1.6+"px";
        }
      }
      this.currentBackground.style.opacity = 1;
    }
    else
    {
      if(!init && input)
      {
        input.checked = !input.checked;
      }

      if(input && input.checked)
      {
        el.classList.add("current");
        el.querySelector(".current-background").style.opacity = 1;
      }
      else
      {
        el.classList.remove("current");
        el.querySelector(".current-background").style.opacity = 0;
      }
    }
    if(input)
    {
      MiscEvent.dispatch("change", {"component": this}, input);
    }

    setTimeout(()=>{
      el.classList.remove("click");
    }, 300);
  }

  animateCurrentBackground() {
    if(this.verticalLine)
    {
      this.element.classList.add("init");
      setTimeout(()=>{
        this.element.closest(".container-vertical-line").classList.add("init");
        if(this.currentBackground)
        {
          this.currentBackground.classList.add("animate");
        }
        else
        {
          [].forEach.call(this.element.querySelectorAll(".current-background"), (el) => {
            el.classList.add("animate");
          });
        }
      }, 600);
    }
    else {
      if(this.currentBackground)
      {
        this.currentBackground.classList.add("animate");
      }
      else
      {
        [].forEach.call(this.element.querySelectorAll(".current-background"), (el) => {
          el.classList.add("animate");
        });
      }
    }
  }

  updateBodyClass(el, fetchResponse = null) {
    if(fetchResponse)
    {
      var response = new Response();
      response.setUpdateBodyClass(true);
      response.executeSuccess(fetchResponse);
    }
  }
}