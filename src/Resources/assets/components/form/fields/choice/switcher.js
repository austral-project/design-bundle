/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractField, DomEventManager, LibLoader} from "@austral/design";

export default class Switcher extends abstractField {

  static initComponent() {
    super.initComponent("switcher", () => {
    });
  }

  async create(element) {
    super.create(element);
    this.gsap = await LibLoader.gsap();
    this.choiceList = this.element.querySelectorAll(".switcher-item");

    this.switcherHighlight = this.element.querySelector(".switcher-highlight");
    this.switcherHighlightInitialyse = false;

    let inputChecked = this.element.querySelector("input:checked");
    if(!inputChecked)
    {
      this.toggleElementsView(null);
    }

    this.choiceList.forEach((choice) => {
      let input = choice.querySelector("input");
      DomEventManager.addListener("click", (event)=>{
        event.preventDefault();
        event.stopPropagation();

        if(!choice.classList.contains("disabled"))
        {
          DomEventManager.dispatch("click", {}, choice.querySelector(".field-style"));
        }
      }, choice);

      DomEventManager.addListener("field::change", (event)=>{
        this.selectSwitch(choice);
      }, input);

      DomEventManager.addListener("field::remove", (event)=>{
        this.removeChoice();
      }, element);


      if(input && input.checked)  {
        this.selectSwitch(choice);
      }

      DomEventManager.addListener(["keyDown:enter", "keyDown:spacebar"], (event)=>{
        DomEventManager.dispatch("click", {}, choice.querySelector(".field-style"));
      }, input);
    });
  }

  selectSwitch(choice) {
    this.switcherHighlight.style.width = choice.offsetWidth+"px";
    if(!this.switcherHighlightInitialyse)
    {
      this.switcherHighlightInitialyse = true;
      this.switcherHighlight.style.left = choice.offsetLeft+"px";
    }
    else {
      this.gsap.to(this.switcherHighlight, {duration: 0.2, left: choice.offsetLeft+"px"});
    }
    let input = choice.querySelector("input");
    if(input) {
      this.toggleElementsView(input.value);
    }
  }

  removeChoice() {
    this.switcherHighlight.style.width = "0px";
    this.switcherHighlight.style.left = "0px";
    this.switcherHighlightInitialyse = false;
    this.element.querySelectorAll("input").forEach((input)=>{
      input.removeAttribute("checked");
      input.removeAttribute("aria-checked");
      input.checked = false;
      input.closest(".field-item").classList.remove("field-is-checked");
      input.closest(".field").classList.remove("is-checked");
    });
    this.toggleElementsView(null);
  }

}
DomEventManager.addListener("component::initialize", () => {
  Switcher.initComponent();
});
