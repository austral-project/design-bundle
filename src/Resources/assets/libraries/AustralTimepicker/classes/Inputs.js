import { DomEventManager, Input, ElementHtml, FocusManager, utils } from "@austral/design";

class Inputs {
  constructor(data) {
    this.input = data.input;
    this.locale = data.locale;
    this.uuid = data.uuid;
    this.fieldContent = data.fieldContent;
    this.onChange = data.onChange ?? (() => {});
    this.choicesEnabled = data.choicesEnabled ?? ["hours", "minutes", "seconds"];

    this.input.setAttribute("type", "hidden");
    let labelInput = document.querySelector("label[for='"+this.input.id+"']");
    if(labelInput)
    {
      DomEventManager.addListener("click", (event) => {
        event.stopPropagation();
        FocusManager.setFocus(this.australTimepickerFields.firstElementChild?.querySelector("input"));
      }, labelInput);
    }

    this.inputTimeValue = null;
    if(this.input.value)
    {
      const parts = this.input.value.split(":");
      if(parts.length >= 2) {
        const d = new Date();
        d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), parts[2] ? parseInt(parts[2], 10) : 0, 0);
        this.inputTimeValue = d;
      }
    }
    this.australFields = {};
  }

  render()
  {
    this.australTimepickerFields = document.createElement("div");
    this.australTimepickerFields.classList.add("austral-timepicker-fields");

    this.createInputs();
    this.appendInputs();
  }

  createInputs()
  {
    this.choicesEnabled.forEach((choiceType) => {
      this.australFields[choiceType] = new Input({
        id: this.uuid+"-"+choiceType,
        name: this.uuid+"-"+choiceType,
        type: "text",
        classes: ["austral-time-choice"],
        placeholder: choiceType === "hours" ? "HH" : choiceType === "minutes" ? "MM" : choiceType === "seconds" ? "SS" : null,
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxlength: 2,
        value: this.inputTimeValue ? (
          choiceType === "hours" ? (this.inputTimeValue.getHours() < 10 ? "0"+this.inputTimeValue.getHours() : this.inputTimeValue.getHours()) :
            choiceType === "minutes" ? (this.inputTimeValue.getMinutes() < 10 ? "0"+this.inputTimeValue.getMinutes() : this.inputTimeValue.getMinutes()) :
              choiceType === "seconds" ? (this.inputTimeValue.getSeconds() < 10 ? "0"+this.inputTimeValue.getSeconds() : this.inputTimeValue.getSeconds()) :
                null
        ) : null,
      });
      DomEventManager.addListener("input", (event)=>{
        let limit = choiceType === "hours" ? 24 : 60;
        let value = this.australFields[choiceType].get().value.replace(/\D/g, "");
        if (value === "") {
          this.australFields[choiceType].get().value = null;
          this.changeInput();
          return;
        }

        if (parseInt(value, 10) >= limit) value = ""+(limit - 1);

        this.australFields[choiceType].get().value = value;
        this.changeInput();
      }, this.australFields[choiceType].get());

      DomEventManager.addListener("focus", ()=>{
        DomEventManager.dispatch("field::focus", {}, this.input);
      }, this.australFields[choiceType].get());

      DomEventManager.addListener("blur", ()=>{
        DomEventManager.dispatch("field::blur", {}, this.input);
      }, this.australFields[choiceType].get());

    });
  }

  appendInputs()
  {
    let prevInput = null;
    this.choicesEnabled.forEach((choiceType) => {
      if(prevInput)
      {
        const separatorElement = document.createElement("span");
        separatorElement.classList.add("austral-time-separator");
        separatorElement.textContent = ":";
        this.australTimepickerFields.appendChild(separatorElement);
        this.eventInputChange(prevInput, this.australFields[choiceType].get(), 2);
      }
      let australInputLabel = new ElementHtml({
        tag: "label",
        classes: ["austral-timepicker-input-label", "label"],
        content: choiceType === "hours" ? "HH" : choiceType === "minutes" ? "MM" : choiceType === "seconds" ? "SS" : null,
        attributes: {
          "for": this.uuid+"-"+choiceType
        },
      });
      let australTimepickerInputHourContainer = new ElementHtml({
        classes: ["austral-timepicker-field"],
        children: [
          australInputLabel.get(),
          this.australFields[choiceType].get()
        ],
        attributes: {
          "data-field": "#"+this.uuid+"-"+choiceType
        },
      });
      this.australTimepickerFields.appendChild(australTimepickerInputHourContainer.get());
      prevInput = this.australFields[choiceType].get();
    });
  }

  get()
  {
    return this.australTimepickerFields;
  }

  inputByChoiceType(choiceType)
  {
    return this.australFields[choiceType];
  }

  eventInputChange(element, nextElement, limit = 2) {
    DomEventManager.addListener("input", (event)=>{
      const value = element.value;
      if(value.length >= limit) {
        FocusManager.setFocus(nextElement);
      }
    }, element);
  }

  changeInput()
  {
    let initialiseReelValueByAustralTimepickerInput = true;
    this.choicesEnabled.forEach((choiceType) => {
      if(!this.australFields[choiceType].valueIsValid())
      {
        initialiseReelValueByAustralTimepickerInput = false;
      }
    });
    this.onChange(initialiseReelValueByAustralTimepickerInput);
  }


  setValue(time, initialiseReelValueByAustralTimepickerInput = true)
  {
    this.choicesEnabled.forEach((choiceType) => {
      if(initialiseReelValueByAustralTimepickerInput) {
        this.australFields[choiceType].get().value = time.getValues(choiceType).getSelected().toString().padStart(2, "0");
      }
      if(this.australFields[choiceType].valueIsValid())
      {
        DomEventManager.dispatch("field::active", {}, this.australFields[choiceType].get());
      }
    });
  }
}

export default Inputs;
