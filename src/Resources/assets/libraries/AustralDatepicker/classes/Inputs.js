import { DomEventManager, Input, ElementHtml, FocusManager, utils } from "@austral/design";

class Inputs {
  constructor(data) {
    this.input = data.input;
    this.locale = data.locale;
    this.uuid = data.uuid;
    this.fieldContent = data.fieldContent;
    this.onChange = data.onChange ?? (() => {});

    this.input.setAttribute("type", "hidden");

    let labelInput = document.querySelector("label[for='"+this.input.id+"']");
    if(labelInput)
    {
      DomEventManager.addListener("click", (event) => {
        event.stopPropagation();
        FocusManager.setFocus(this.australDatepickerFields.firstElementChild?.querySelector("input"));
      }, labelInput);
    }

    this.inputDateValue = null;
    if(this.input.value)
    {
      this.inputDateValue = utils.date.parseDate(this.input.value);
    }

    this.pattern = utils.date.datePatternFromLocale(this.locale);
    this.separator = this.pattern.match(/[^dMy]/)?.[0] || "/";
  }

  render()
  {
    this.australDatepickerFields = document.createElement("div");
    this.australDatepickerFields.classList.add("austral-datepicker-fields");

    this.createInputDay();
    this.createInputMonth();
    this.createInputYear();
    this.appendInputs();
  }

  createInputDay()
  {
    this.australDatepickerInputDay = new Input({
      id: this.uuid+"-day",
      name: this.uuid+"-day",
      type: "text",
      classes: ["austral-date-day"],
      placeholder: "dd",
      inputMode: "numeric",
      pattern: "[0-9]*",
      maxlength: 2,
      value: this.inputDateValue ? this.inputDateValue.getDate() > 9 ? this.inputDateValue.getDate() : "0"+this.inputDateValue.getDate() : null,
    });

    DomEventManager.addListener("input", ()=>{
      let value = this.australDatepickerInputDay.get().value.replace(/\D/g, "");
      if (value === "") {
        this.australDatepickerInputDay.get().value = null;
        this.changeInput();
        return;
      }

      if (parseInt(value, 10) > 31) value = "31";
      if(value === "00") value = "01";

      this.australDatepickerInputDay.get().value = value;
      this.changeInput();
    }, this.australDatepickerInputDay.get());

    DomEventManager.addListener("focus", ()=>{
      DomEventManager.dispatch("field::focus", {}, this.input);
    }, this.australDatepickerInputDay.get());

    DomEventManager.addListener("blur", ()=>{
      DomEventManager.dispatch("field::blur", {}, this.input);
    }, this.australDatepickerInputDay.get());
  }

  createInputMonth()
  {
    let month = this.inputDateValue ? this.inputDateValue.getMonth()+1 : null;
    this.australDatepickerInputMonth = new Input({
      id: this.uuid+"-month",
      name: this.uuid+"-month",
      type: "text",
      classes: ["austral-date-month"],
      placeholder: "mm",
      inputMode: "numeric",
      pattern: "[0-9]*",
      maxlength: 2,
      value: month ? (month > 9 ? month : "0"+month) : null,
    });

    DomEventManager.addListener("input", ()=>{
      let value = this.australDatepickerInputMonth.get().value.replace(/\D/g, "");
      if (value === "") return;

      if (parseInt(value, 10) > 12) value = "12";
      if(value === "00") value = "01";

      // si la valeur est valide, on la met
      this.australDatepickerInputMonth.get().value = value;
      this.changeInput();
    }, this.australDatepickerInputMonth.get());

    DomEventManager.addListener("focus", ()=>{
      DomEventManager.dispatch("field::focus", {}, this.input);
    }, this.australDatepickerInputMonth.get());

    DomEventManager.addListener("blur", ()=>{
      DomEventManager.dispatch("field::blur", {}, this.input);
    }, this.australDatepickerInputMonth.get());
  }

  createInputYear()
  {
    this.australDatepickerInputYear = new Input({
      id: this.uuid+"-year",
      name: this.uuid+"-year",
      type: "text",
      classes: ["austral-date-year"],
      placeholder: "yyyy",
      inputMode: "numeric",
      pattern: "[0-9]*",
      maxlength: 4,
      value: this.inputDateValue ? this.inputDateValue.getFullYear() : null,
    });

    DomEventManager.addListener("input", ()=>{
      let value = this.australDatepickerInputYear.get().value.replace(/\D/g, "");
      if (value === "") return;

      if (value.length > 4) {
        value = value.slice(0, 4);
      }

      // si la valeur est valide, on la met
      this.australDatepickerInputYear.get().value = value;
      this.changeInput();
    }, this.australDatepickerInputYear.get());

    DomEventManager.addListener("focus", ()=>{
      DomEventManager.dispatch("field::focus", {}, this.input);
    }, this.australDatepickerInputYear.get());

    DomEventManager.addListener("blur", ()=>{
      DomEventManager.dispatch("field::blur", {}, this.input);
    }, this.australDatepickerInputYear.get());
  }

  appendInputs()
  {
    let partIndex = 0;
    let monthNextElement = null;

    const order = this.pattern
      .split(this.separator)
      .map(part =>
        part.includes("d") ? { type: "day", size: 2 }
          : part.includes("M") ? { type: "month", size: 2 }
            : { type: "year", size: 4 }
      );

    order.forEach((part) => {
      if(partIndex > 0) {
        const separatorElement = document.createElement("span");
        separatorElement.classList.add("austral-date-separator");
        separatorElement.textContent = this.separator;
        this.australDatepickerFields.appendChild(separatorElement);
      }
      if(part.type === "day") {

        let australDatepickerInputDayLabel = new ElementHtml({
          tag: "label",
          classes: ["austral-datepicker-day-label", "label"],
          content: 'dd',
          attributes: {
            "for": this.uuid+"-day"
          },
        });

        let australDatepickerInputDayContainer = new ElementHtml({
          classes: ["austral-datepicker-field"],
          children: [
            australDatepickerInputDayLabel.get(),
            this.australDatepickerInputDay.get()
          ],
          attributes: {
            "data-field": "#"+this.uuid+"-day"
          },
        });

        this.australDatepickerFields.appendChild(australDatepickerInputDayContainer.get());
        if(partIndex === 0) {
          monthNextElement = this.australDatepickerInputYear.get();
          this.eventInputChange(this.australDatepickerInputDay.get(), this.australDatepickerInputMonth.get(), 2);
        }
        else if(partIndex === 1) {
          this.eventInputChange(this.australDatepickerInputDay.get(), this.australDatepickerInputYear.get(), 2);
        }
      }
      else if(part.type === "month") {
        let australDatepickerInputMonthLabel = new ElementHtml({
          tag: "label",
          classes: ["austral-datepicker-month-label", "label"],
          content: 'mm',
          attributes: {
            "for": this.uuid+"-month"
          },
        });

        let australDatepickerInputMonthContainer = new ElementHtml({
          classes: ["austral-datepicker-field"],
          children: [
            australDatepickerInputMonthLabel.get(),
            this.australDatepickerInputMonth.get()
          ],
          attributes: {
            "data-field": "#"+this.uuid+"-month"
          },
        });

        this.australDatepickerFields.appendChild(australDatepickerInputMonthContainer.get());
        if(partIndex === 0) {
          this.eventInputChange(this.australDatepickerInputMonth.get(), this.australDatepickerInputDay.get(), 2);
        }
        else if(partIndex === 1) {
          this.eventInputChange(this.australDatepickerInputMonth.get(), monthNextElement, 2);
        }
      }
      else if(part.type === "year") {
        let australDatepickerInputYearLabel = new ElementHtml({
          tag: "label",
          classes: ["austral-datepicker-year-label", "label"],
          content: 'yyyy',
          attributes: {
            "for": this.uuid+"-year"
          },
        });

        let australDatepickerInputYearContainer = new ElementHtml({
          classes: ["austral-datepicker-field"],
          children: [
            australDatepickerInputYearLabel.get(),
            this.australDatepickerInputYear.get()
          ],
          attributes: {
            "data-field": "#"+this.uuid+"-year"
          },
        });

        this.australDatepickerFields.appendChild(australDatepickerInputYearContainer.get());
        if(partIndex === 0) {
          monthNextElement = this.australDatepickerInputDay.get();
          this.eventInputChange(this.australDatepickerInputYear.get(), this.australDatepickerInputMonth.get(), 4);
        }
      }
      partIndex++;
    });
  }

  get()
  {
    return this.australDatepickerFields;
  }

  inputDay()
  {
    return this.australDatepickerInputDay;
  }
  inputMonth()
  {
    return this.australDatepickerInputMonth;
  }
  inputYear()
  {
    return this.australDatepickerInputYear;
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
    let initialiseReelValueByAustralDatepickerInput = false;
    if(this.australDatepickerInputDay.valueIsValid() && this.australDatepickerInputMonth.valueIsValid() && this.australDatepickerInputYear.valueIsValid())
    {
      initialiseReelValueByAustralDatepickerInput = true;
    }
    this.onChange(initialiseReelValueByAustralDatepickerInput);
  }


  setValue(date, initialiseReelValueByAustralDatepickerInput = true)
  {
    if(initialiseReelValueByAustralDatepickerInput)
    {
      this.australDatepickerInputDay.get().value =  utils.date.reelValue(date, "day");
      this.australDatepickerInputMonth.get().value = utils.date.reelValue(date, "month");
      this.australDatepickerInputYear.get().value = utils.date.reelValue(date, "year");
    }
    if(this.australDatepickerInputDay.valueIsValid())
    {
      DomEventManager.dispatch("field::active", {}, this.australDatepickerInputDay.get());
    }
    if(this.australDatepickerInputMonth.valueIsValid())
    {
      DomEventManager.dispatch("field::active", {}, this.australDatepickerInputMonth.get());
    }
    if(this.australDatepickerInputYear.valueIsValid())
    {
      DomEventManager.dispatch("field::active", {}, this.australDatepickerInputYear.get());
    }
  }
}

export default Inputs;
