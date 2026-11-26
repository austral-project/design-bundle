/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { abstractField, DomEventManager } from "@austral/design";

export default class ChoiceList extends abstractField {

  static initComponent() {
    super.initComponent("choice-list", () => {
    });
  }

  create(element) {
    super.create(element);

    this.choiceList = this.element.querySelectorAll(".choice-item");
    let position = 0;
    this.choiceList.forEach((choice) => {
      let input = choice.querySelector("input");
      DomEventManager.addListener("click", (event)=>{
        event.preventDefault();
        event.stopPropagation();
        DomEventManager.dispatch("click", {}, choice.querySelector(".field-style"));
      }, choice);
      DomEventManager.addListener(["keyDown:enter", "keyDown:spacebar"], (event)=>{
        DomEventManager.dispatch("click", {}, choice.querySelector(".field-style"));
      }, input);
      position++;
    });
  }

  changeFocus(choice, direction, position) {
    let newPosition = parseInt(position);
    if(direction === "up")
    {
      newPosition = position+1;
    }
    else {
      newPosition = position-1;
    }
    if(newPosition < 0)
    {
      newPosition = this.choiceList.length-1;
    }
    else if(newPosition >= this.choiceList.length)
    {
      newPosition = 0;
    }
    choice.querySelector("input").focus();
    this.choiceList[newPosition].querySelector("input").focus();
  }

}
DomEventManager.addListener("component::initialize", () => {
  ChoiceList.initComponent();
});
