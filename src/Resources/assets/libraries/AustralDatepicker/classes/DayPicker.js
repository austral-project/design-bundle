import { Button } from "@austral/design/dom";
import {ElementHtml, utils} from "@austral/design";
import Config from "@austral/design/core/Config";
import { ModalFocusTrap } from "@austral/design/core/accessibility";

class DayPicker {
  constructor(data) {
    this.uuid = data.uuid;
    this.translations = data.translations;
    this.language = data.language;
    this.locale = data.locale;
    this.input = data.input;
    this.dates = data.dates;
    this.visible = data.visible ?? false;

    this.onSelectYear = data.onSelectYear ?? (() => {});
    this.onSelectMonth = data.onSelectMonth ?? (() => {});
    this.onNextMonth = data.onNextMonth ?? (() => {});
    this.onPrevMonth = data.onPrevMonth ?? (() => {});
    this.onSelectDate = data.onSelectDate ?? (() => {});
    this.onClose = data.onClose ?? (() => {});
    this.isChangePicker = false;
  }

  init() {
    this.daypicker = this.create();
  }

  get() {
    return this.daypicker;
  }

  render() {
    this.destroy();
    this.init();
  }

  create() {
    const daypicker = document.createElement("div");
    daypicker.classList.add("austral-dates-container");

    const prevButton = new Button({
      type: "button",
      ariaLabel: this.translations.buttons.monthPrev,
      pictoLeftName: "arrow-left",
      onClick: () => {
        if (this.isChangePicker) {
          return;
        }
        this.onPrevMonth();
      },
    });

    this.date = this.createDate();

    const nextButton = new Button({
      type: "button",
      ariaLabel: this.translations.buttons.monthNext,
      pictoLeftName: "arrow-right",
      onClick: () => {
        if (this.isChangePicker) {
          return;
        }
        this.onNextMonth();
      },
    });

    const header = new ElementHtml({
      tag: "div",
      classes: ["header"],
      children: [
        prevButton.get(),
        this.date,
        nextButton.get(),
      ],
    });
    daypicker.appendChild(header.get());

    const weekdays = this.createWeekdays();
    daypicker.appendChild(weekdays);

    this.daysContainer = document.createElement("div");
    this.daysContainer.classList.add("days-container");
    daypicker.appendChild(this.daysContainer);

    this.currentDays = this.createDays();
    this.daysContainer.appendChild(this.currentDays);


    if(this.visible === false)
    {
      this.closeDayPicker = document.createElement("div");
      this.closeDayPicker.classList.add("close-container");

      const closeButton = new Button({
        type: "button",
        theme: "solid",
        entitled: this.translations.buttons.close,
        onClick: () => {
          this.onClose();
        },
      });
      this.closeDayPicker.appendChild(closeButton.get());
      daypicker.appendChild(this.closeDayPicker);
    }

    return daypicker;
  }

  createDate() {

    const monthYear = document.createElement("div");
    monthYear.classList.add("month-year");

    const month = this.dates.currentDate.toLocaleDateString(this.locale, { month: "long" });
    const monthButton = new Button({
      type: "button",
      classes: ["choice-button-month"],
      entitled: utils.string.capitalizeFirstLetter(month),
      onClick: () => {
        Config.setCurrentFocusPath("*[data-austral-datepicker='"+this.uuid+"'] .choice-button-month");
        this.onSelectMonth();
      },
    });

    const year = this.dates.currentDate.toLocaleDateString(this.locale, { year: "numeric" });
    const yearButton = new Button({
      type: "button",
      classes: ["choice-button-year"],
      entitled: year,
      onClick: () => {
        Config.setCurrentFocusPath("*[data-austral-datepicker='"+this.uuid+"'] .choice-button-year");
        this.onSelectYear();
      },
    });
    monthYear.appendChild(monthButton.get());
    monthYear.appendChild(yearButton.get());
    return monthYear;
  }

  createWeekdays() {
    const weekdays = document.createElement("div");
    weekdays.classList.add("weekdays");

    const weekdaysNarrow = utils.date.getWeekdays(this.locale, "narrow");

    weekdaysNarrow.forEach((weekday) => {
      const div = document.createElement("div");
      div.classList.add("weekday");
      div.textContent = weekday;
      weekdays.appendChild(div);
    });
    return weekdays;
  }

  createDays() {
    const days = document.createElement("div");
    days.classList.add("days");

    this.dates.dates.forEach((date) => {
      const day = document.createElement("div");
      day.classList.add("day");
      days.appendChild(day);

      let button = null;
      if(date.isPrev || date.isNext || date.isDisabled)
      {
        button = document.createElement("span");
      }
      else
      {
        button = document.createElement("button");
      }
      button.classList.add("button-day");

      if (date.isPrev) button.classList.add("prev");
      if (date.isCurrent) button.classList.add("current");
      if (date.isToday) button.classList.add("today");
      if (date.isSelected) button.classList.add("selected");
      if (date.isNext) button.classList.add("next");
      if (date.isDisabled) button.classList.add("disabled");
      if(!date.isPrev && !date.isNext && !date.isDisabled)
      {
        button.addEventListener("click", () => this.onSelectDate(date.date));
      }
      day.appendChild(button);

      const number = document.createElement("div");
      number.classList.add("number");
      number.textContent = date.date.getDate();
      button.appendChild(number);
    });

    return days;
  }

  async prev() {
    this.isChangePicker = true;
    this.prevDate = this.createDate();
    this.date.replaceWith(this.prevDate);
    this.date = this.prevDate;
    this.prevDays = this.createDays();
    this.daysContainer.appendChild(this.prevDays);
    this.currentDays.remove();
    this.currentDays = this.prevDays;
    this.isChangePicker = false;
  }

  async next() {
    this.isChangePicker = true;
    this.nextDate = this.createDate();
    this.date.replaceWith(this.nextDate);
    this.date = this.nextDate;
    this.nextDays = this.createDays();
    this.daysContainer.appendChild(this.nextDays);
    this.currentDays.remove();
    this.currentDays = this.nextDays;
    this.isChangePicker = false;
  }

  destroy() {
    ModalFocusTrap.removeFocusLoop();
    if (this.daypicker) {
      this.daypicker.remove();
    }
  }
}

export default DayPicker;
