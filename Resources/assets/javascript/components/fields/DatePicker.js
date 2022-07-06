import 'vanillajs-datepicker/dist/css/datepicker.min.css';
import { Datepicker } from 'vanillajs-datepicker';
import abstractField from "./abstract";

export default class DatePicker extends abstractField {

  static initComponent() {
    super.initComponent("datepicker");
  }

  create(element) {
    super.create(element);
    this.initialValue = this.element.value;
    this.datePickerOptions = JSON.parse(this.element.dataset.datepickerOptions);
    this.datePickerOptions["language"] = Translate.currentLanguage();
    this.datepicker = new Datepicker(this.element, this.datePickerOptions);
  }


  addEventListener() {
    MiscEvent.addListener("click", ()=>{
      this.element.focus();
    }, this.element.parentNode.querySelector(".picto-field"));
  }

  addEventListenerToChangeField() {
    MiscEvent.addListener("keyup", ()=>{
      MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: (this.initialValue !== this.element.value) }, this.formContainer);
    }, this.element);
  }


}