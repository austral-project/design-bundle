import { Button } from "@austral/design/dom";
import { utils } from "@austral/design";
import { ModalFocusTrap } from "@austral/design/core/accessibility";

class MonthPicker {
  constructor(data) {
    this.translations = data.translations;
    this.language = data.language;
    this.locale = data.locale;
    this.input = data.input;
    this.months = data.months;
    this.panel = data.panel;

    this.onGoBack = data.onGoBack ?? (() => {});
    this.onSelectMonth = data.onSelectMonth ?? (() => {});

    this.isSlide = false;
  }

  init() {
    this.monthPicker = this.create();
  }

  get() {
    return this.monthPicker;
  }

  render() {
    this.destroy();
    this.init();
  }

  create() {
    const monthPicker = document.createElement("div");
    monthPicker.classList.add("austral-months-container");

    const header = document.createElement("div");
    header.classList.add("header");
    monthPicker.appendChild(header);

    const goBackBtn = new Button({
      type: "button",
      ariaLabel: this.translations.buttons.return,
      onClick: this.onGoBack,
      pictoLeftName: "cross",
    });
    header.appendChild(goBackBtn.get());

    const content = document.createElement("div");
    content.classList.add("months");
    monthPicker.appendChild(content);

    this.months.months.forEach((month) => {
      const monthContainer = document.createElement("div");
      monthContainer.classList.add("month");
      content.appendChild(monthContainer);

      const monthBtn = document.createElement("button");
      if (month.isSelected) monthBtn.classList.add("selected");
      if (month.isToday) monthBtn.classList.add("today");
      monthBtn.type = "button";

      let monthValue = month.month.toLocaleDateString(this.locale, { month: "long" });
      monthBtn.textContent = utils.string.capitalizeFirstLetter(monthValue);
      monthBtn.addEventListener("click", () => this.onSelectMonth(month.month));
      monthContainer.appendChild(monthBtn);
    });

    this.observer = new MutationObserver(() => {
      const selectedYear = this.monthPicker.querySelector(".selected");
      selectedYear.scrollIntoView({ block: "center" });
    });
    this.observer.observe(this.panel.australDatepickerPanel.querySelector(".austral-datepicker-container"), { childList: true });

    return monthPicker;
  }

  destroy() {
    ModalFocusTrap.removeFocusLoop();
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.monthPicker) {
      this.monthPicker.remove();
    }
  }
}

export default MonthPicker;
