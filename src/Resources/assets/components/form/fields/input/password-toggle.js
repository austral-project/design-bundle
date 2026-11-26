/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { abstractComponent, DomEventManager } from "@austral/design";

export default class PasswordToggle extends abstractComponent {

  static initComponent() {
    super.initComponent("password-toggle");
  }

  create() {
    this.input = this.element.closest("*[data-field]").querySelector(this.element.getAttribute("data-password-toggle"));
    if(this.input)
    {
      DomEventManager.addListener("click", (event)=>{
        if(this.element.classList.contains("password-show"))
        {
          this.element.classList.remove("password-show");
          this.input.type = "password";
        }
        else
        {
          this.element.classList.add("password-show");
          this.input.type = "text";
        }
      }, this.element);
    }
  }

  addEventListener() {
  }

}
DomEventManager.addListener("component::initialize", () => {
  PasswordToggle.initComponent();
});
