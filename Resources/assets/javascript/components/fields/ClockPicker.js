import 'timepicker-ui/';
import { TimepickerUI } from 'timepicker-ui';
import abstractField from "./abstract"

class ClockPicker extends abstractField {

  static initComponent() {
    super.initComponent("clockpicker");
  }

  create(element) {
    super.create(element);
    this.clockpickerOptions = JSON.parse(this.element.dataset.clockpickerOptions);
    this.clockpicker = new TimepickerUI(this.element.parentNode, this.clockpickerOptions);
    this.clockpicker.create();

    this.initialValue = this.element.value;
    this.element.parentNode.querySelector(".picto-field").addEventListener("click", ()=>{
      this.clockpicker.open();
    });

  }

  addEventListenerToChangeField() {
    MiscEvent.addListener("update", ()=>{
      MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: (this.initialValue !== this.element.value) }, this.formContainer);
    }, this.element);
  }


}
export default ClockPicker;