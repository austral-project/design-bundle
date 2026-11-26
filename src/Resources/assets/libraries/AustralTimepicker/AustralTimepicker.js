import {Button, Config, DomEventManager, FocusManager} from "@austral/design";
import {v4 as uuidv4} from "uuid";

import Panel from "@austral/design/libraries/AustralTimepicker/classes/Panel";
import Time from "@austral/design/libraries/AustralTimepicker/classes/Time";
import TimePicker from "@austral/design/libraries/AustralTimepicker/classes/TimePicker";
import defaultLocales from "@austral/design/libraries/AustralTimepicker/locales";
import Inputs from "@austral/design/libraries/AustralTimepicker/classes/Inputs";

export default class AustralTimepicker {

  static locales = { ...defaultLocales };

  static registerLocale(lang, translations) {
    AustralTimepicker.locales[lang] = translations;
  }

  constructor(input, options = {})
  {
    this.input = input;
    this.options = Object.assign({
      parent: null,
      visible: false,
      language: "fr",
      locale: "fr-FR",
      choicesEnabled: ["hours", "minutes"],
      buttonTimepicker: null,
    }, options);

    this.translations = AustralTimepicker.locales[this.options.language];
    this.uuid = uuidv4();

    this.fieldContent = this.input.parentNode;
    if(this.options.parent === null) {
      this.options.parent = this.input.closest(".field-row") ?? null;
    }

    this.init();
    this.initButtonTimepicker();
    DomEventManager.dispatch("components::load");

    DomEventManager.addListener("click", (event)=>{
      event.stopPropagation();
      if(event.target.tagName === "INPUT") return;
      console.log(this.australTimePickerFields.get().firstElementChild);
      FocusManager.setFocus(this.australTimePickerFields.get().firstElementChild?.querySelector("input"));
    }, this.fieldContent);

    DomEventManager.addListener("focus", (event) => {
      event.stopPropagation();
      FocusManager.setFocus(this.australTimePickerFields.get().firstElementChild?.querySelector("input"));
    }, this.input);

    DomEventManager.addListener("blur", () => {}, this.input);

  }

  init() {

    this.australTimePickerFields = new Inputs({
      uuid: this.uuid,
      input: this.input,
      locale: this.options.locale,
      fieldContent: this.fieldContent,
      choicesEnabled: this.options.choicesEnabled,
      onChange: (initialiseReelValueByAustralTimePickerInput) => {
        let hourFinal = "00";
        let minuteFinal = "00";
        let secondFinal = "00";
        this.options.choicesEnabled.forEach((choiceType)=>{
          if(choiceType === "hours")
          {
            hourFinal = this.time.getValues("hours").getSelected();
            if(this.australTimePickerFields.inputByChoiceType("hours").valueIsValid())
            {
              hourFinal = this.australTimePickerFields.inputByChoiceType("hours").get().value;
            }
            else if(this.australTimePickerFields.inputByChoiceType("hours").valueIsNull())
            {
              hourFinal = null;
            }
          }
          if(choiceType === "minutes")
          {
            minuteFinal = this.time.getValues("minutes").getSelected();
            if(this.australTimePickerFields.inputByChoiceType("minutes").valueIsValid())
            {
              minuteFinal = this.australTimePickerFields.inputByChoiceType("minutes").get().value;
            }
            else if(this.australTimePickerFields.inputByChoiceType("minutes").valueIsNull())
            {
              minuteFinal = null;
            }
          }
          if(choiceType === "seconds")
          {
            secondFinal = this.time.getValues("seconds").getSelected();
            if(this.australTimePickerFields.inputByChoiceType("seconds").valueIsValid())
            {
              secondFinal = this.australTimePickerFields.inputByChoiceType("seconds").get().value;
            }
            else if(this.australTimePickerFields.inputByChoiceType("seconds").valueIsNull())
            {
              secondFinal = null;
            }
          }

        });
        if(hourFinal && minuteFinal && secondFinal)
        {
          let date = new Date();
          date.setHours(hourFinal);
          date.setMinutes(minuteFinal);
          date.setSeconds(secondFinal);
          date = this.time.timeByLimit(date);
          this.setValue(date, true, initialiseReelValueByAustralTimePickerInput);
        }
        else
        {
          this.setValue(null, true, initialiseReelValueByAustralTimePickerInput);
        }
      }
    });

    this.australTimePickerFields.render();
    this.fieldContent.appendChild(this.australTimePickerFields.get());

    this.panel = new Panel({
      uuid: this.uuid,
      parent: this.options.parent,
      input: this.input,
      onOpen: () => {
        this.input.blur();
      },
      onClose: () => {
        if(this.options.visible === false) {
          this.time.reset();
          this.input.blur();
        }
      },
    });

    this.time = new Time({
      value: this.input.value,
      choicesEnabled: this.options.choicesEnabled,
    });

    this.timepicker = new TimePicker({
      uuid: this.uuid,
      visible: this.options.visible,
      translations: this.translations,
      language: this.options.language,
      locale: this.options.locale,
      time: this.time,
      choicesEnabled: this.options.choicesEnabled,
      onCancel: () => {
        this.close();
      },
      onAccept: () => {
        this.time.clear();
        this.time.setSelected();
        this.time.set();
        this.close();
        this.setValue(this.time.toString());
      },
    });

    if(this.options.visible) {
      this.open();
    }
  }

  initButtonTimepicker() {
    this.australButtonTimepicker = this.options.buttonTimepicker ?? null;
    if (this.australButtonTimepicker === null && this.options.parent !== null && this.options.parent.querySelector(".field-container")) {
      const australButtonTimepicker = new Button({
        type: "button",
        title: this.translations.buttons.timepickerOpen,
        pictoLeftName: "clock",
      });
      const fieldAfter = document.createElement("div");
      fieldAfter.classList.add("field-after");
      fieldAfter.appendChild(australButtonTimepicker.get());
      this.australButtonTimepicker = australButtonTimepicker.get();
      this.options.parent.querySelector(".field-container").appendChild(fieldAfter);
      this.options.parent.classList.add("with-after");
    }

    if(this.australButtonTimepicker && this.options.visible === false)
    {
      DomEventManager.addListener("click", (event)=>{
        event.stopPropagation();
        if(this.panel.isOpen)
        {
          this.close();
        }
        else
        {
          this.open();
        }
      }, this.australButtonTimepicker);
    }
  }

  get() {
    return this.input;
  }

  open() {
    this.panel.open().then(()=>{});
    this.timepicker.render();
    this.panel.render(this.timepicker.get());
  }

  close(resetFocus = true) {
    if(this.options.visible === true) return;
    if(this.australButtonTimepicker && resetFocus) {
      Config.setCurrentFocus(this.australButtonTimepicker);
    }
    else {
      Config.setCurrentFocus(this.input);
    }
    this.panel.close().then(()=>{
      if(resetFocus) {
        FocusManager.restoreCurrentFocus();
      }
    });
    this.timepicker.destroy();
  }

  getValue() {
    return this.input.getValue();
  }

  setValue(value, refreshPanel = false, initialiseReelValueByAustralTimePickerInput = true) {
    if(value)
    {
      this.time.setValue(value);
      this.time.setSelected();
      this.input.value = this.time.toString();
      if(refreshPanel)
      {
        this.options.choicesEnabled.forEach((choiceType)=>{
          if(this.australTimePickerFields.inputByChoiceType(choiceType).valueIsValid())
          {
            let buttonSelect = this.timepicker.getChoicePicker(choiceType).get().querySelector(".button-choice[data-value='"+this.time.getValues(choiceType).getSelected()+"']");
            if(buttonSelect)
            {
              DomEventManager.dispatch("timepicker::button.selected", {}, buttonSelect);
            }
          }
        });
      }
    }
    else
    {
      this.time.setValue(null);
      this.time.setSelected();
      this.input.value = "";
    }
    if(value)
    {
      this.australTimePickerFields.setValue(this.time, initialiseReelValueByAustralTimePickerInput);
    }
    else
    {
      this.australTimePickerFields.setValue(null, initialiseReelValueByAustralTimePickerInput);
    }
  }

}
