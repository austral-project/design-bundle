/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractField, DomEventManager, LibLoader} from "@austral/design";

export default class Timepicker extends abstractField {

  static initComponent() {
    super.initComponent("timepicker");
  }

  async create(element) {
    super.create(element);
    const AustralTimepicker = await LibLoader.librairieTimepicker();

    let options = {};
    try {
      options = JSON.parse(this.element.getAttribute("data-timepicker-options"));
    }catch(e){

    }

    let timepickerOptions = Object.assign({
      parent:       this.fieldRow,
      visible:      false,
      language:     "fr",
      locale:       "fr-FR",
      choicesEnabled: ["hours", "minutes"]
    }, options);
    this.timepicker = new AustralTimepicker(this.element, timepickerOptions);

  }

}
DomEventManager.addListener("component::initialize", () => {
  Timepicker.initComponent();
});
