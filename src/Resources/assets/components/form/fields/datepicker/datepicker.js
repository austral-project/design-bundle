/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractField, DomEventManager, LibLoader} from "@austral/design";

export default class Datepicker extends abstractField {

  static initComponent() {
    super.initComponent("datepicker");
  }

  async create(element) {
    super.create(element);
    const AustralDatepicker = await LibLoader.librairieDatepicker();

    let options = {};
    try {
      options = JSON.parse(this.element.getAttribute("data-datepicker-options"));
    }catch(e){

    }
    let datepickerOptions = Object.assign({
      parent:       this.fieldRow,
      visible:      false,
      language:     "fr",
      locale:       "fr-FR",
    }, options);
    this.datepicker = new AustralDatepicker(this.element, datepickerOptions);
  }


}
DomEventManager.addListener("component::initialize", () => {
  Datepicker.initComponent();
});
