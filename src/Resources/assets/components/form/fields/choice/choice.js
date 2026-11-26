/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { abstractField, DomEventManager, Debug } from "@austral/design";

export default class Choice extends abstractField {

  static initComponent(componentName = null, callback = null) {
    Debug.log("-- Component Initialise : choice");

    const excludedTypes = ["checkbox", "radio"];
    const selector = excludedTypes
      .map(type => `input[type="${type}"]`)
      .join(",");

    [].forEach.call(document.querySelectorAll(selector), (el) => {
      if(!el.getAttribute("data-component-choice-uuid"))
      {
        let object = new this(el, "choice");
      }
    });
  }

  create(element) {
    super.create(element);

    this.choiceElement = this.element.closest("*[data-choice-element]");
    if(this.element.type === "checkbox" && this.element.closest(".field-checkbox"))
    {
      this.initialValue = this.element.checked ? "checked" : "";
      this.initialValueChange();
      if(!this.element.hasAttribute("disabled"))
      {
        if(this.element.closest(".field-checkbox").querySelector(".field-style")) {
          DomEventManager.addListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.element.checked = !this.element.checked;
            DomEventManager.dispatch("field::change", {}, this.element);
            this.element.focus();
          }, this.element.closest(".field-checkbox").querySelector(".field-style"));
        }
        DomEventManager.addListener("change", () => {
          DomEventManager.dispatch("field::change", {}, this.element);
        }, this.element);
      }

    }
    else if(this.element.type === "radio" && this.element.closest(".field-radio"))
    {
      this.initialValue = this.element.checked ? "checked" : "";
      this.initialValueChange();
      if(!this.element.hasAttribute("disabled"))
      {
        if(this.element.closest(".field-radio").querySelector(".field-style")) {
          DomEventManager.addListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.element.checked = true;
            DomEventManager.dispatch("field::change", {}, this.element);
          }, this.element.closest(".field-radio").querySelector(".field-style"));
        }
        DomEventManager.addListener("change", () => {
          DomEventManager.dispatch("field::change", {}, this.element);
        }, this.element);
      }
    }
  }

  initialValueChange() {
    let currentValue = null;
    let parent = null;
    if(this.element.closest(".field-item"))
    {
      parent = this.element.closest(".field-item");
    }
    else
    {
      parent = this.element.closest(".field-container");
    }

    if(this.element.type === "checkbox")
    {
      currentValue = this.element.checked ? "checked" : "";
      if(currentValue === "checked")
      {
        if(this.element.closest(".field-checkbox")) {
          this.element.closest(".field-checkbox").classList.add('is-checked');
          this.element.setAttribute("aria-checked", true);
          if(parent) {
            parent.classList.add('field-is-checked');
          }
        }
      }
      else
      {
        if(this.element.closest(".field-checkbox")) {
          this.element.closest(".field-checkbox").classList.remove('is-checked');
          this.element.removeAttribute("aria-checked");
        }
        if(parent) {
          parent.classList.remove('field-is-checked');
        }
      }
    }
    else if(this.element.type === "radio")
    {
      currentValue = this.element.checked ? "checked" : "";
      if(currentValue === "checked")
      {
        if(this.element.closest(".field-radio")) {
          this.element.closest(".field-radio").classList.add('is-checked');
        }
        if(parent) {
          parent.classList.add('field-is-checked');
        }
        let parentList = this.element.closest(".field-element-container");
        if(this.element.closest(".field-items"))
        {
          parentList = this.element.closest(".field-items");
        }
        if(parentList)
        {
          parentList.querySelectorAll("input").forEach((element) => {
            if(element !== this.element)
            {
              if(element.closest(".field-radio")) {
                element.closest(".field-radio").classList.remove('is-checked');
              }
              if(element.closest(".field-is-checked")) {
                element.closest(".field-is-checked").classList.remove('field-is-checked');
              }
              element.removeAttribute("aria-checked");
            }
          });
        }
      }
      else
      {
        if(this.element.closest(".field-radio")) {
          this.element.closest(".field-radio").classList.remove('is-checked');
        }
        this.element.setAttribute("aria-checked", true);
        if(parent) {
          parent.classList.remove('field-is-checked');
        }
      }
    }
    return this.initialValue !== currentValue;
  }

  addEventListener() {
    super.addEventListener();
    DomEventManager.addListener(["field::change"], (event) => {
      if(this.element.type === "checkbox" && this.element.checked === true)
      {
        let parentList = this.element.closest(".field-items");
        if(parentList)
        {
          if(this.element.hasAttribute("data-value-is-unique"))
          {
            parentList.querySelectorAll("input").forEach((element) => {
              if(element !== this.element)
              {
                if(element.closest(".field-checkbox")) {
                  element.closest(".field-checkbox").classList.remove('is-checked');
                }
                if(element.closest(".field-is-checked")) {
                  element.closest(".field-is-checked").classList.remove('field-is-checked');
                }
                element.checked = false;
                element.removeAttribute("aria-checked");
              }
            });
          }
          else if(parentList.querySelector("*[data-value-is-unique]"))
          {
            let element = parentList.querySelector("*[data-value-is-unique]");
            if(element.closest(".field-checkbox")) {
              element.closest(".field-checkbox").classList.remove('is-checked');
            }
            if(element.closest(".field-is-checked")) {
              element.closest(".field-is-checked").classList.remove('field-is-checked');
            }
            element.checked = false;
            element.removeAttribute("aria-checked");
          }
        }
      }

      if(this.choiceElement) {
        DomEventManager.dispatch("component::choice.close", {}, this.choiceElement);
      }
      DomEventManager.dispatch("component::form.change", {
        field: this,
        type: event.type,
        key: this.element.getAttribute("id"),
        value: this.element.value,
        change: this.initialValueChange()
      }, this.formContainer);
    }, this.element);
  }


}
DomEventManager.addListener("component::initialize", () => {
  Choice.initComponent();
});
