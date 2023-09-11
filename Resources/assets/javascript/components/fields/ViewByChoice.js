import abstractField from "./abstract";
import {indexOf} from "core-js/internals/array-includes";

export default class ViewByChoice extends abstractField {

  static initComponent() {
    super.initComponent("view-by-choices");
  }

  create(element) {
    super.create(element);
    this.viewByChoices = JSON.parse(this.element.dataset.viewByChoices);

    this.regex = null;
    if(this.element.dataset.viewByChoicesRegex !== undefined)
    {
      this.regex = this.element.dataset.viewByChoicesRegex;
    }

    this.viewClassChildren = this.element.dataset.viewByChoicesChildren ? this.element.dataset.viewByChoicesChildren : ".view-element-by-choices";
    this.elementsViewByChoices = [];
    if(this.element.dataset.viewByChoicesElement) {
      this.elementsViewByChoices = this.element.closest(this.element.dataset.viewByChoicesElement).querySelectorAll(this.viewClassChildren);
    }
    else if(this.element.dataset.viewByChoicesParent) {
      this.elementsViewByChoices = [];
      [].forEach.call(this.element.closest(this.element.dataset.viewByChoicesParent).querySelectorAll(this.viewClassChildren), (el) => {
        if(el.closest(".group-col")) {
          this.elementsViewByChoices.push(el.closest(".group-col"));
        }
        else {
          this.elementsViewByChoices.push(el);
        }
      });
    }
    else if(this.element.closest(".form-type-content") !== null) {
      this.elementsViewByChoices = [];
      [].forEach.call(this.element.closest(".form-type-content").querySelectorAll(this.viewClassChildren), (el) => {
        if(el.closest(".group-col")) {
          this.elementsViewByChoices.push(el.closest(".group-col"));
        }
        else {
          this.elementsViewByChoices.push(el);
        }
      });
    }
    else {
      this.elementsViewByChoices = [];
      [].forEach.call(this.element.closest(".fieldset-content").querySelectorAll(this.viewClassChildren), (el) => {
        if(el.closest(".group-col")) {
          this.elementsViewByChoices.push(el.closest(".group-col"));
        }
        else {
          this.elementsViewByChoices.push(el);
        }
      });
    }
    this.changeValue(null);

    if(this.element.tagName !== "INPUT" && this.element.tagName !== "SELECT") {
      if(this.element.querySelectorAll("select").length > 0) {
        [].forEach.call(this.element.querySelectorAll("select"), (el) => {
          this.changeValue(el.value);
          MiscEvent.addListener("change", () => {
            this.changeValue(el.value);
          }, el);
        });
      }
      else if(this.element.querySelectorAll("input").length > 0) {
        [].forEach.call(this.element.querySelectorAll("input"), (el) => {
          if(el.getAttribute("type") === "checkbox")
          {
            this.changeValue(el.checked ? 1 : 0);
            MiscEvent.addListener("change", () => {
              this.changeValue(el.checked ? 1 : 0);
            }, el);
          }
          else if(el.getAttribute("type") === "radio")
          {
            if(el.checked)
            {
              this.changeValue(el.value);
            }
            MiscEvent.addListener("change", () => {
              this.changeValue(el.checked ? el.value : null);
            }, el);
          }
          else
          {
            this.changeValue(el.value);
            MiscEvent.addListener("change", () => {
              this.changeValue(el.value);
            }, el);
          }
        });
      }
    }
    else
    {
      if(this.element.getAttribute("type") === "checkbox")
      {
        this.changeValue(this.element.checked ? 1 : 0);
        MiscEvent.addListener("change", () => {
          this.changeValue(this.element.checked ? 1 : 0);
        }, this.element);
      }
      else if(this.element.getAttribute("type") === "radio")
      {
        if(this.element.checked)
        {
          this.changeValue(this.element.value);
        }
        MiscEvent.addListener("change", () => {
          this.changeValue(this.element.checked ? this.element.value : null);
        }, el);
      }
      else
      {
        this.changeValue(this.element.value);
        MiscEvent.addListener("change", () => {
          this.changeValue(this.element.value);
        }, this.element);
      }

    }

  }

  addEventListener() {
    super.addEventListener();
    MiscEvent.addListener("component::view-choice:remove", () => {
      this.changeValue(null);
    }, this.element);
  }

  changeValue(value) {
    if(this.elementsViewByChoices.length > 0) {
      if(this.regex && value)
      {
        value = value.match(new RegExp(this.regex, 'i'));
        if(value && Array.isArray(value) && value.length === 2)
        {
          value = value[1];
        }
        else
        {
          value = null;
        }
      }
      let classViewElement = null;
      console.log(this.viewByChoices, value);
      if(value !== null && this.viewByChoices[value] !== undefined)
      {
        classViewElement = this.viewByChoices[value];
      }
      this.elementsViewByChoices.forEach((el) => {
        let viewElement = false;
        if(classViewElement !== undefined && classViewElement !== null)
        {
          if(classViewElement instanceof Array)
          {
            classViewElement.forEach((classname) => {
              if(value !== null && (el.classList.contains(classname) || el.querySelectorAll((classname.indexOf(".") < 0 ? "." : "")+classname).length > 0))
              {
                viewElement = true;
              }
            });
          }
          else
          {
            if(value !== null && (el.classList.contains(classViewElement) || el.querySelectorAll((classViewElement.indexOf(".") < 0 ? "." : "")+classViewElement).length > 0))
            {
              viewElement = true;
            }
          }
        }
        if(viewElement)
        {
          el.style.display = "block";
        }
        else
        {
          el.style.display = "none";
        }
      });
    }
  }

}