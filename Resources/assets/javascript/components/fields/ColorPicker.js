import '@simonwep/pickr/dist/themes/classic.min.css';   // 'classic' theme
import Pickr from '@simonwep/pickr';
import abstractField from "./abstract"

class ColorPicker extends abstractField {

  static initComponent() {
    super.initComponent("colorpicker");
  }

  create(element) {
    super.create(element);
    this.colorPickerOptions = JSON.parse(this.element.dataset.colorpickerOptions);
    this.colorPickerOptions['el'] = Austral.Config.page.dom.querySelector(this.element.dataset.colorpickerElement);
    this.colorPickerOptions['default'] = this.element.value;
    this.colorPickerOptions['theme'] = "classic";
    this.pickr = Pickr.create(this.colorPickerOptions);
    this.initialValue = this.element.value;
    this.pickr.on('swatchselect', (color, instance) => {
      this.pickr.setColor(color.toRGBA().toString());
      this.element.value = color.toHEXA().toString();
      MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: (this.initialValue !== this.element.value) }, this.formContainer);
      this.pickr.hide();
    });
  }

  addEventListener() {
    super.addEventListener();
    MiscEvent.addListener("click", () => {
      this.pickr.show();
    }, this.element);
    MiscEvent.addListener("keyup", () => {
      this.pickr.setColor(this.element.value);
    }, this.element);
  }

}

export default ColorPicker;