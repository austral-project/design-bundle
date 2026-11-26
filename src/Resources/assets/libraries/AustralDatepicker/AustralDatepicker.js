import { Config, DomEventManager, Button, FocusManager, ModalFocusTrap, utils } from "@austral/design";

import Inputs from "@austral/design/libraries/AustralDatepicker/classes/Inputs";
import Panel from "@austral/design/libraries/AustralDatepicker/classes/Panel";
import Dates from "@austral/design/libraries/AustralDatepicker/classes/Dates";
import DayPicker from "@austral/design/libraries/AustralDatepicker/classes/DayPicker";
import Years from "@austral/design/libraries/AustralDatepicker/classes/Years";
import YearPicker from "@austral/design/libraries/AustralDatepicker/classes/YearPicker";
import Months from "@austral/design/libraries/AustralDatepicker/classes/Months";
import MonthPicker from "@austral/design/libraries/AustralDatepicker/classes/MonthPicker";
import defaultLocales from "@austral/design/libraries/AustralDatepicker/locales";
import { v4 as uuidv4 } from "uuid";

export default class AustralDatepicker {

  static locales = { ...defaultLocales };

  static registerLocale(lang, translations) {
    AustralDatepicker.locales[lang] = translations;
  }

  constructor(input, options = {}) {
    this.input = input;
    this.options = Object.assign({
      parent: null,
      visible: false,
      language: "fr",
      locale: "fr-FR",
      dateLimitMin: null,
      dateLimitMax: null,
      buttonDatepicker: null,
    }, options);
    this.translations = AustralDatepicker.locales[this.options.language];
    this.uuid = uuidv4();

    this.fieldContent = this.input.parentNode;
    if(this.options.parent === null) {
      this.options.parent = this.input.closest(".field-row") ?? null;
    }

    this.options.dateLimitMin = utils.date.parseDate(this.options.dateLimitMin);
    this.options.dateLimitMax = utils.date.parseDate(this.options.dateLimitMax);

    this.init();
    this.initButtonDatepicker();

    DomEventManager.dispatch("components::load");

    DomEventManager.addListener("click", (event)=>{
      event.stopPropagation();
      if(event.target.tagName === "INPUT") return;
      FocusManager.setFocus(this.australDatepickerFields.get().firstElementChild?.querySelector("input"));
    }, this.fieldContent);

    DomEventManager.addListener("focus", (event) => {
      event.stopPropagation();
      FocusManager.setFocus(this.australDatepickerFields.get().firstElementChild?.querySelector("input"));
    }, this.input);

    DomEventManager.addListener("blur", () => {}, this.input);
  }

  init() {

    this.australDatepickerFields = new Inputs({
      uuid: this.uuid,
      input: this.input,
      locale: this.options.locale,
      fieldContent: this.fieldContent,
      onChange: (initialiseReelValueByAustralDatepickerInput) => {
        let day = this.dates.selectedDate.getDate();
        if(this.australDatepickerFields.inputDay().valueIsValid())
        {
          day = this.australDatepickerFields.inputDay().get().value;
        }
        else if(this.australDatepickerFields.inputDay().valueIsNull())
        {
          day = null;
        }

        let month = this.dates.selectedDate.getMonth() + 1;
        if(this.australDatepickerFields.inputMonth().valueIsValid())
        {
          month = this.australDatepickerFields.inputMonth().get().value;
        }
        else if(this.australDatepickerFields.inputMonth().valueIsNull())
        {
          month = null;
        }

        let year = this.dates.selectedDate.getFullYear();
        if(this.australDatepickerFields.inputYear().valueIsValid())
        {
          year = this.australDatepickerFields.inputYear().get().value;
        }
        else if(this.australDatepickerFields.inputYear().valueIsNull())
        {
          year = null;
        }
        if(day && month && year)
        {
          let date = new Date(year, month-1, day);
          date = this.dates.dateByLimit(date);
          this.setValue(date, true, initialiseReelValueByAustralDatepickerInput);
        }
        else
        {
          this.setValue(null, true, initialiseReelValueByAustralDatepickerInput);
        }

      }
    });

    this.australDatepickerFields.render();
    this.fieldContent.appendChild(this.australDatepickerFields.get());

    this.panel = new Panel({
      uuid: this.uuid,
      parent: this.options.parent,
      onOpen: () => {
        this.input.blur();
      },
      onClose: () => {
        if(this.options.visible === false) {
          this.dates.resetCurrentDate();
          this.dates.resetDates();
          this.years.setSelectedYear(this.dates.selectedDate);
          this.years.resetYears();
          this.months.setSelectedMonth(this.dates.selectedDate);
          this.months.resetMonths();
          this.input.blur();
        }
      },
    });

    this.dates = new Dates({
      translations: this.translations,
      language: this.options.language,
      locale: this.options.locale,
      input: this.input,
      value: this.input.value,
      dateLimitMin: this.options.dateLimitMin,
      dateLimitMax: this.options.dateLimitMax,
    });

    this.years = new Years({
      translations: this.translations,
      language: this.options.language,
      locale: this.options.locale,
      input: this.input,
      value: this.input.value,
    });

    this.months = new Months({
      translations: this.translations,
      language: this.options.language,
      locale: this.options.locale,
      input: this.input,
      value: this.input.value,
    });

    this.daypicker = new DayPicker({
      uuid: this.uuid,
      visible: this.options.visible,
      translations: this.translations,
      language: this.options.language,
      locale: this.options.locale,
      input: this.input,
      dates: this.dates,
      onPrevMonth: () => {
        this.dates.clear();
        this.dates.prevCurrentDateMonth();
        this.dates.setDates();
        this.daypicker.prev().then(()=>{});
      },
      onNextMonth: () => {
        this.dates.clear();
        this.dates.nextCurrentDateMonth();
        this.dates.setDates();
        this.daypicker.next().then(()=>{});
      },
      onSelectYear: () => {
        this.daypicker.destroy();
        this.yearpicker.render();
        this.panel.render(this.yearpicker.get());
        ModalFocusTrap.addFocusLoop(this.yearpicker.get(), false);
        FocusManager.setFocus(this.yearpicker.get().querySelector(".selected"));
      },
      onSelectMonth: () => {
        this.daypicker.destroy();
        this.monthpicker.render();
        this.panel.render(this.monthpicker.get());
        ModalFocusTrap.addFocusLoop(this.monthpicker.get(), false);
        FocusManager.setFocus(this.monthpicker.get().querySelector(".selected"));
      },
      onSelectDate: (date) => {
        if(this.options.visible === false) {
          this.daypicker.onClose(false);
        }
        this.onSelect(date);
      },
      onClose: (resetFocus = true) => {
        this.close(resetFocus);
      }
    });

    this.yearpicker = new YearPicker({
      translations: this.translations,
      language: this.options.language,
      locale: this.options.locale,
      input: this.input,
      years: this.years,
      panel:  this.panel,
      onGoBack: () => {
        this.yearpicker.destroy();
        this.open();
        FocusManager.restoreCurrentFocus();
      },
      onSelectYear: (year) => {
        this.yearpicker.destroy();
        this.dates.setCurrentDateYear(year);
        this.dates.resetDates();
        this.years.setSelectedYear(year);
        this.years.resetYears();
        this.daypicker.destroy();
        this.open();
        FocusManager.restoreCurrentFocus();
      },
    });

    this.monthpicker = new MonthPicker({
      translations: this.translations,
      language: this.options.language,
      locale: this.options.locale,
      input: this.input,
      months: this.months,
      panel:  this.panel,
      onGoBack: () => {
        this.monthpicker.destroy();
        this.open();
        FocusManager.restoreCurrentFocus();
      },
      onSelectMonth: (month) => {
        this.monthpicker.destroy();
        this.dates.setCurrentDateMonth(month);
        this.dates.resetDates();
        this.months.setSelectedMonth(month);
        this.months.resetMonths();
        this.daypicker.destroy();
        this.open();
        FocusManager.restoreCurrentFocus();
      },
    });


    if(this.options.visible) {
      this.open();
    }

  }

  initButtonDatepicker() {
    this.australButtonDatepicker = this.options.buttonDatepicker ?? null;
    if(this.australButtonDatepicker === null && this.options.parent !== null && this.options.parent.querySelector(".field-container"))
    {
      const australButtonDatepicker = new Button({
        type: "button",
        title: this.translations.buttons.datepickerOpen,
        pictoLeftName: "calendar",
      });
      const fieldAfter = document.createElement("div");
      fieldAfter.classList.add("field-after");
      fieldAfter.appendChild(australButtonDatepicker.get());
      this.australButtonDatepicker = australButtonDatepicker.get();
      this.options.parent.querySelector(".field-container").appendChild(fieldAfter);
      this.options.parent.classList.add("with-after");

    }

    if(this.australButtonDatepicker)
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
      }, this.australButtonDatepicker);
    }
  }


  onSelect(date) {
    this.setValue(date);
  }

  open() {
    this.panel.open().then(()=>{});
    this.daypicker.render();
    this.panel.render(this.daypicker.get());
    ModalFocusTrap.addFocusLoop(this.daypicker.get(), false);
    FocusManager.setFocus(this.daypicker.get().querySelector(".selected"));
  }

  close(resetFocus = true) {
    if(this.options.visible === true) return;
    if(this.australButtonDatepicker && resetFocus) {
      Config.setCurrentFocus(this.australButtonDatepicker);
    }
    else {
      Config.setCurrentFocus(this.input);
    }
    this.panel.close().then(()=>{
      if(resetFocus) {
        FocusManager.restoreCurrentFocus();
      }
    });
    this.daypicker.destroy();
  }

  get() {
    return this.input;
  }

  getValue() {
    return this.input.value;
  }

  setValue(value, refreshPanel = false, initialiseReelValueByAustralDatepickerInput = true) {
    if(value) {
      let date = new Date(value);
      this.input.value = utils.date.formatDateShort(date, this.options.locale);
    }
    else {
      this.input.value = "";
    }

    this.australDatepickerFields.setValue(value, initialiseReelValueByAustralDatepickerInput);
    this.dates.setCurrentDate(value);
    this.dates.setSelectedDate(value);
    this.dates.resetDates();
    if(this.panel.isOpen && refreshPanel) {
      this.daypicker.destroy();
      this.daypicker.render();
      this.panel.render(this.daypicker.get());
    }
  }
}
