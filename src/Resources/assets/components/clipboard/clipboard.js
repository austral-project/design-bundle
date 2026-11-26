/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractComponent, Config, DomEventManager, LibLoader} from "@austral/design";

export default class Clipboard extends abstractComponent {

  static initComponent() {
    super.initComponent("clipboard");
  }

  async create() {
    let ClipboardJS = await LibLoader.clipboard();
    var clipboardJs = new ClipboardJS(this.element, {
      text: (trigger) => {
        return this.element.hasAttribute("data-clipboard-value") ?
          this.element.getAttribute("data-clipboard-value") :
          this.element.textContent;
      }
    });
    clipboardJs.on('success', (e) => {
      Config.getModule("AlertSwal")?.showToast({
        title: this.element.dataset.clipboardMessage ? this.element.dataset.clipboardMessage : "Copied is success !",
        icon: "success",
        position: "top",
        customClass: {
          popup: "success"
        }
      });
    });
  }

  addEventListener() {
  }


}
DomEventManager.addListener("component::initialize", () => {
  Clipboard.initComponent();
});
