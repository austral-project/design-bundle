/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractField, DomEventManager, LibLoader} from "@austral/design";

export default class Select extends abstractField {

  static initComponent() {
    super.initComponent("select", () => {
    });
  }

  async waitLoadChoices() {
    let Choices;
    if (window.STORYBOOK) {
      Choices = window.Choices;
    } else {
      Choices = await LibLoader.choices();
    }
    return Choices;
  }

  async create(element) {
    super.create(element);
    const Choices = await this.waitLoadChoices();

    if(this.element.dataset.selectOptions) {
      this.options = JSON.parse(element.dataset.selectOptions);
    }
    else {
      this.options = {};
    }
    if(this.options['searchEnabled'] !== undefined && (this.options['tag'] !== undefined && this.options['tag'] === false)) {
      if(this.element.querySelectorAll("option").length < 20) {
        this.options['searchEnabled'] = false;
      }
    }
    else {
      this.options['searchEnabled'] = false;
    }
    if(!this.element.querySelector("option[value='']") && (this.element.dataset.valueNull !== undefined || !this.element.hasAttribute("required")))
    {
      let option = document.createElement("option");
      option.setAttribute("value", "");
      option.innerText = this.element.getAttribute("data-select-null-label") ?? null;
      if(!this.element.querySelector("option[selected]"))
      {
        option.setAttribute("selected", "");
      }
      this.element.prepend(option);
    }

    this.valueSelectCache = this.element.innerHTML;
    this.options['itemSelectText'] = "";
    this.options['allowHTML'] = true;
    this.options['resetScrollPosition'] = false;
    this.options["searchChoices"] = this.options['searchEnabled'];
    this.initialValue = this.element.value;
    this.toggleElementsView(this.element.value);
    this.choices = new Choices(this.element, this.options);
    this.choicesElement = this.element.closest(".choices")
    this.viewByChoice = null;
    this.addEventListenerChoice();
  }

  choiceBuild() {
    this.choices = new Choices(this.element, this.options);
  }

  addEventListenerChoice() {
    super.addEventListener();

    DomEventManager.addListener('focus', () => {
      if(!this.element.disabled)
      {
        this.active();
        this.choices.showDropdown();
      }
    }, this.choicesElement);

    DomEventManager.addListener('blur', () => {
      this.inactive();
    }, this.choicesElement);

    let label = this.fieldRow.querySelector("label[for='"+this.element.getAttribute("id")+"']");
    if(label)
    {
      DomEventManager.addListener("click", ()=>{
        if(!this.element.disabled) {
          this.active();
          this.choices.showDropdown();
          DomEventManager.dispatch("click", {}, this.element);
        }
      }, label);
    }

    DomEventManager.addListener("choice", (event) => {
      if(event.detail !== undefined && event.detail.choice.disabled !== true) {
        if(this.viewByChoice) {
          this.viewByChoice.changeValue(event.detail.choice.value);
        }
        this.choices.setChoiceByValue(event.detail.choice.value);
        this.choices.hideDropdown();
        let fieldContent = this.element.closest(".animate");
        if(fieldContent) {
          if(event.detail.choice.value) {
            fieldContent.classList.add('active');
          } else {
            fieldContent.classList.remove('active');
          }
        }
        DomEventManager.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), value: event.detail.choice.value, change: event.detail.choice.value !== this.initialValue }, this.formContainer);
        DomEventManager.dispatch("select::auto-send", {}, this.element);
        this.initialValue = event.detail.choice.value;
        this.toggleElementsView(event.detail.choice.value);
      }
      this.toggleFields(!this.initialValue);
    }, this.element);


    DomEventManager.addListener("select:choice", (event) => {
      console.log(event);
      if(event.detail.value !== undefined)
      {
        this.choices.setChoiceByValue(event.detail.value);
      }
    }, this.element);

    if(this.element.dataset.autoSend)
    {
    }

  }

  toggleFields(enabled = true)
  {

  }

}
DomEventManager.addListener("component::initialize", () => {
  Select.initComponent();
});
