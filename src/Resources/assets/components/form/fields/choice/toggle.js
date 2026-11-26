/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { abstractField, DomEventManager } from "@austral/design";

export default class Toggle extends abstractField {

  static initComponent() {
    super.initComponent("field-toggle", () => {
    });
  }

  create(element) {
    super.create(element);

    this.input = this.element.querySelector("input");
    this.initialValue = false;
    if(this.input)
    {
      this.initialValue = this.input.checked ? "checked" : "";
      this.toggleAction = this.input.checked ? "tails" : "heads";
      this.toggleClass();
      this.toggleElementsView(this.input.checked ? 1 : 0);
      this.input.addEventListener("change", (e) => {
        this.toggleAction = this.input.checked ? "tails" : "heads";
        this.toggleClass();
      });
    }
  }

  initialValueChange() {
    let currentValue = this.input.checked ? "checked" : "";
    return this.initialValue !== currentValue;
  }

  addEventListener() {
    super.addEventListener();

    DomEventManager.addListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      DomEventManager.dispatch("component::toggle.change", {}, this.element);
    }, this.element.querySelector(".toggle-button-content .toggle-button"));

    DomEventManager.addListener("component::toggle.change", (event) => {
      this.toggleElementsView(this.element.classList.contains("heads") ? 1 : 0);
      if(event.detail.toggleAction !== undefined && event.detail.toggleAction) {
        this.toggleAction = event.detail.toggleAction;
      }
      else {
        this.toggleAction = this.element.classList.contains("heads") ? "tails" : "heads";
      }
      this.execute();

      if(this.input)
      {
        DomEventManager.dispatch("component::form.change", {
          field: this,
          type: event.type,
          key: this.element.getAttribute("id"),
          value: this.element.value,
          change: this.initialValueChange()
        }, this.formContainer);
      }

    }, this.element);

  }

  execute() {
    this.element.classList.add("click");
    if(this.input)
    {
      this.input.checked = !this.input.checked;
      this.toggleAction = this.input.checked ? "tails" : "heads";
      this.toggleClass();
      if(this.viewByChoice) {
        this.viewByChoice.changeValue(this.input.checked ? 1 : 0);
      }
    }
    else
    {
      this.toggleClass();
    }
  }

  toggleClass() {
    this.element.classList.remove(this.toggleAction === "tails" ? "heads" : "tails");
    this.element.classList.add(this.toggleAction === "tails" ? "tails": "heads");
    setTimeout(()=>{
      this.element.classList.remove("click");
    }, 300);
  }



}
DomEventManager.addListener("component::initialize", () => {
  Toggle.initComponent();
});
