/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DomEventManager, abstractComponent } from "@austral/design";

/**
 * Represents an abstract field component, extending the functionality of the abstractComponent.
 * This class provides methods for initializing input fields, managing their states,
 * and handling accessibility attributes and events.
 */
export default class abstractField extends abstractComponent {

  /**
   * Initializes the creation of components by assigning relevant DOM elements.
   *
   * @param {HTMLElement} el - The HTMLElement used for initialization.
   * @return {void}
   */
  async create(el) {
    this.formContainer = this.element.closest("form");
    this.element = el;
    this.fieldRow = this.element.closest("[data-field]");
    if(!this.fieldRow) {
      this.fieldRow = el.parentElement;
    }
    if(!this.fieldRow) {
    }
    this.field = this.element.closest(".field");

    this.toggleElements = null;
    this.toggleConfig = null;

    if(this.fieldRow.querySelector("*[data-toggle]"))
    {
      let toggleElement = this.fieldRow.querySelector("*[data-toggle]");
      this.toggleConfig = JSON.parse(toggleElement.getAttribute("data-toggle"));

      if(this.element.closest(".collection-embed-element"))
      {
        this.toggleElements = this.element.closest(".collection-embed-element").querySelectorAll("*[data-toggle-element='"+this.toggleConfig.name+"']");
      }
      else
      {
        this.toggleElements = document.querySelectorAll("*[data-toggle-element='"+this.toggleConfig.name+"']");
      }
    }
  }

  /**
   * Adds custom event listeners to the associated form element, updating its attributes
   * and state based on user interactions and conditions such as validation errors, focus,
   * and blur events. Also sets ARIA attributes for accessibility and ensures proper
   * handling of related label clicks and input deletions.
   *
   * @return {void} Does not return a value.
   */
  addEventListener() {
    super.addEventListener();

    if(this.element.hasAttribute("required") && this.element.getAttribute("required") === "required")
    {
      this.element.setAttribute("aria-required", true);
    }

    let fieldErrors = this.fieldRow.querySelector(".field-error");
    if(fieldErrors)
    {
      this.element.setAttribute("aria-invalid", true);
      let errorContent = fieldErrors.querySelector(".errors-content ul");
      if(errorContent) {
        let describedby = "";
        if(this.element.hasAttribute("aria-describedby"))
        {
          describedby = this.element.getAttribute("aria-describedby");
        }
        describedby = errorContent.getAttribute("id")+" "+describedby;
        this.element.setAttribute("aria-describedby", describedby.trim());
      }
    }

    let label = this.fieldRow.querySelector("label[for='"+this.element.getAttribute("id")+"']");
    if(label)
    {
      DomEventManager.addListener("click", ()=>{
        DomEventManager.dispatch("click", {}, this.element);
      }, label);
    }

    DomEventManager.addListener("component::form.input.delete", ()=> {
      DomEventManager.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), deleteInput: true }, this.formContainer);
    }, this.element);

    if(this.element.type !== "radio" && this.element.type !== "checkbox") {
      if (this.element.value && this.element.value !== "") {
        this.fieldRow.classList.add('active');
      }
    }

    DomEventManager.addListener('focus', () => {
      this.active();
    }, this.element);

    DomEventManager.addListener('blur', () => {
      this.inactive();
    }, this.element);

    DomEventManager.addListener('field::focus', () => {
      this.active();
    }, this.element);

    DomEventManager.addListener('field::blur', () => {
      this.inactive();
    }, this.element);

    DomEventManager.addListener('field::active', () => {
      if(this.element.type === "radio" || this.element.type === "checkbox")
      {
        if(this.element.checked) {
          this.active();
        }
      }
      else if(this.element.value && this.element.value !== "") {
        this.active();
      }
    }, this.element);
  }

  /**
   * Activates certain visual states on the respective elements based on their type
   * or tag. Updates classes to reflect the focus and active states accordingly.
   *
   * @return {void} Does not return a value.
   */
  active() {
    this.fieldRow.classList.add('focus');
    this.fieldRow.classList.add('active');
    if(this.element.type === "radio" || this.element.type === "checkbox")
    {
      if(this.element.closest("*[data-focusable]")) {
        this.element.closest("*[data-focusable]").classList.add('focus');
      }
      else {
        this.element.closest(".field").classList.add('focus');
      }
    }
    if(this.element.tagName === "SELECT")
    {
      this.fieldRow.classList.add('open');
    }
  }

  /**
   * Deactivates the corresponding UI elements such as removing 'focus', 'open', and 'active' CSS classes
   * from relevant DOM elements based on the type and state of the input element.
   *
   * @return {void} This method does not return a value.
   */
  inactive() {
    this.fieldRow.classList.remove('focus');
    if(this.element.type === "radio" || this.element.type === "checkbox")
    {
      if(this.element.closest("*[data-focusable]")) {
        this.element.closest("*[data-focusable]").classList.remove('focus');
      }
      else {
        this.element.closest(".field").classList.remove('focus');
      }
    }
    if(this.element.tagName === "SELECT" || this.element.classList.contains("choices__input")) {
      this.fieldRow.classList.remove('open');
      if(this.element.parentNode.querySelector(".choices__list--multiple")) {
        if(this.element.parentNode.querySelectorAll(".choices__list--multiple .choices__item").length === 0) {
          this.fieldRow.classList.remove('active');
        }
      }
      else if(this.element.parentNode.querySelector(".choices__list--single")) {
        if(!this.element.parentNode.querySelector(".choices__list .choices__item").dataset.value) {
          this.fieldRow.classList.remove('active');
        }
      }
    }
    else {
      if(!this.element.value || this.element.value === "") {
        this.fieldRow.classList.remove('active');
      }
    }
  }

  toggleElementsView(value) {
    if(this.toggleConfig) {
      if(this.toggleConfig.view !== undefined && this.toggleConfig.hide !== undefined)
      {
        let toggleView = this.toggleConfig.view;
        let toggleHide = this.toggleConfig.hide;


        if((toggleView === "NOT_NULL" && value) || (toggleView === "NULL" && !value) || value == this.toggleConfig.view)
        {
          this.toggleElements.forEach((el) => {
            if(this.toggleConfig.isOpacity !== undefined)
            {
              el.removeAttribute('style');
              el.style.opacity = 1;
              el.style.height = "auto";
              el.style.pointerEvents = "inherit";
            }
            else
            {
              el.style.display = "block";
            }
          });
        }
        else if((toggleHide === "NOT_NULL" && value) || (toggleHide === "NULL" && !value) || value == this.toggleConfig.hide)
        {
          this.toggleElements.forEach((el) => {
            if(this.toggleConfig.isOpacity !== undefined)
            {
              el.style.opacity = 0;
              el.style.height = 0;
              el.style.pointerEvents = "none";
              el.style.overflow = "hidden";
              el.style.margin = 0;
              el.style.padding = 0;
            }
            else
            {
              el.style.display = "none";
            }
          });
        }
      }
      else
      {
        this.toggleElements.forEach((el) => {
          let toggleValue = el.getAttribute("data-toggle-view");
          try {
            toggleValue = JSON.parse(toggleValue);
          } catch {
          }
          if(Array.isArray(toggleValue) === false)
          {
            toggleValue = [toggleValue];
          }
          el.style.display = "none";
          toggleValue.forEach((elem) => {
            if(elem === value)
            {
              el.style.display = "block";
            }
          });
        });
      }
    }

  }

}
