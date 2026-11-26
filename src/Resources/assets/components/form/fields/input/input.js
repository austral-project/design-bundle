/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { abstractField, DomEventManager, Config, Debug } from "@austral/design";

export default class Input extends abstractField {

  static initComponent(componentName = null, callback = null) {
    Debug.log("-- Component Initialise : input");

    const excludedTypes = ["date", "checkbox", "radio"];
    const selector = 'input' + excludedTypes.map(type => `:not([type="${type}"])`).join("");

    [].forEach.call(document.querySelectorAll(selector), (el) => {
      if(!el.getAttribute("data-component-input-uuid"))
      {
        let object = new this(el, "input");
      }
    });
  }

  create(element) {
    super.create(element);
    this.inputNumeric = this.element.type === "number" || this.element.getAttribute("inputmode") === "numeric";
    this.initialValue = this.element.value;


    if(this.element.hasAttribute("data-auto-select"))
    {
      DomEventManager.addListener("click", ()=>{
        this.element.select();
      }, this.element);
      DomEventManager.addListener("click", (e)=>{
        e.preventDefault();
      }, this.element);

    }
    this.buttonAdd = null;
    this.buttonSubtract = null;
    if(this.inputNumeric)
    {
      this.buttonAdd = this.fieldRow.querySelector("*[data-number-add]");
      this.buttonSubtract = this.fieldRow.querySelector("*[data-number-subtract]");
      let newValue = null;

      if(this.buttonAdd) {
        DomEventManager.addListener("click", ()=>{
          if(!this.buttonAdd.hasAttribute("disabled"))
          {
            newValue = parseInt(this.element.value) + 1;
            this.element.value = newValue;
            DomEventManager.dispatch("field::change", {
              element: this.element,
              buttonClick: this.buttonAdd,
            }, this.element);
          }
        }, this.buttonAdd);
      }

      if(this.buttonSubtract) {
        DomEventManager.addListener("click", ()=>{
          if(!this.buttonSubtract.hasAttribute("disabled"))
          {
            newValue = parseInt(this.element.value) - 1;
            if(newValue < 0)
            {
              newValue = 0;
            }
            this.element.value = newValue;
            DomEventManager.dispatch("field::change", {
              element: this.element,
              buttonClick: this.buttonSubtract,
            }, this.element);
          }
        }, this.buttonSubtract);
      }

      this.incrementAndDecrementeValue();
    }

    if(this.element.dataset.recaptcha !== undefined)
    {
      DomEventManager.addListener("recaptcha:execute", (event)=> {
        this.recaptcha();
      }, this.element);
    }

  }

  async recaptcha() {
    Debug.log("Input : Recaptcha")
    const action = this.element.dataset.typeAction || "form";
    const siteKey = this.element.dataset.recaptcha;
    await new Promise(resolve => grecaptcha.ready(resolve));

    const token = await grecaptcha.execute(siteKey, { action });
    Debug.log("Recaptcha execute");
    this.element.value = token;
    return token; // important
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
    currentValue = this.element.value;
    return this.initialValue !== currentValue;
  }

  incrementAndDecrementeValue(reinitValue = false)
  {
    let minValue = this.element.hasAttribute("data-number-min") && this.element.getAttribute("data-number-min") !== null && this.element.getAttribute("data-number-min") !== "" ? parseInt(this.element.getAttribute("data-number-min")) : 0;
    let maxValue = this.element.hasAttribute("data-number-max") && this.element.getAttribute("data-number-max") !== null && this.element.getAttribute("data-number-max") !== "" ? parseInt(this.element.getAttribute("data-number-max")) : null;

    if(this.buttonSubtract)
    {
      if(this.element.value > minValue)
      {
        this.buttonSubtract.removeAttribute("disabled");
      }
      else
      {
        if(reinitValue && this.element.value !== ""+minValue) {
          this.element.value = ""+minValue;
        }
        this.buttonSubtract.setAttribute("disabled", "");
      }
    }

    if(this.buttonAdd && maxValue !== null)
    {
      if(this.element.value < maxValue)
      {
        this.buttonAdd.removeAttribute("disabled");
      }
      else
      {
        if(reinitValue && this.element.value !== ""+maxValue) {
          this.element.value = ""+maxValue;
        }
        this.buttonAdd.setAttribute("disabled", "");
      }
    }

    if(reinitValue)
    {
      if(this.element.hasAttribute("data-collection-remove") && this.element.value === ""+minValue)
      {
        DomEventManager.dispatch("collection::remove-by-input", {
          element: this.element.closest("*[data-collection-element]")
        }, this.element.closest("*[data-collection]"));
      }
    }

  }

  addEventListener() {
    super.addEventListener();


    let nextField = this.element.getAttribute("data-maxlength-next-field");
    let nextFieldElement = document.querySelector(nextField);
    let maxlength = this.element.maxLength;
    if(maxlength !== undefined && maxlength > 0 && nextFieldElement)
    {
      DomEventManager.addListener("input", (event) => {
        if (event.target.value.length >= maxlength) {
          nextFieldElement.focus();
        }
      }, this.element);
    }

    let backField = document.querySelector("*[data-maxlength-next-field='#"+this.element.id+"']");
    if(backField)
    {
      DomEventManager.addListener("keydown", (event) => {
        if (event.key === 'Backspace' && !event.target.value) {
          backField.focus();
        }
      }, this.element);
    }


    DomEventManager.addListener(["keyDown:enter", "keyup", "field::change"], (event) => {

      if(this.inputNumeric)
      {
        let minValue = this.element.hasAttribute("data-number-min") && this.element.getAttribute("data-number-min") !== null && this.element.getAttribute("data-number-min") !== "" ? parseInt(this.element.getAttribute("data-number-min")) : 0;
        if(minValue > this.element.value)
        {
          this.element.value = minValue;
        }
        this.incrementAndDecrementeValue(true);
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
  Input.initComponent();
});
