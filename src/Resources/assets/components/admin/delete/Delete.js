/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config, Debug, DomEventManager, utils } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

export default class Delete extends abstractComponent {

  static initComponent() {
    super.initComponent("delete");
  }

  create() {
  }

  addEventListener() {
    this.element.addEventListener("click", (e) => {
      let parentIsEmbed = this.element.closest("*[data-collection-embed]");
      DomEventManager.dispatch("component::delete", {element: this.element}, this.element.closest(this.element.dataset.delete).parentNode);
      this.element.closest(this.element.dataset.delete).parentNode.removeChild(this.element.closest(this.element.dataset.delete));
      if(parentIsEmbed)
      {
        DomEventManager.dispatch("component::embed.childrenParameterCheck", {},parentIsEmbed);
      }
    });
  }


}
DomEventManager.addListener("component::initialize", () => {
  Delete.initComponent();
});
