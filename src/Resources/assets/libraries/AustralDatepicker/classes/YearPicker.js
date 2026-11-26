import { Button } from "@austral/design/dom";
import { ModalFocusTrap } from "@austral/design/core/accessibility";

class YearPicker {
  constructor(data) {
    this.translations = data.translations;
    this.language = data.language;
    this.locale = data.locale;
    this.input = data.input;
    this.years = data.years;
    this.panel = data.panel;

    this.onGoBack = data.onGoBack ?? (() => {});
    this.onSelectYear = data.onSelectYear ?? (() => {});
    this.currentYear = null;

    this.isSlide = false;
  }

  init() {
    this.yearPicker = this.create();
  }

  get() {
    return this.yearPicker;
  }

  render() {
    this.destroy();
    this.init();
  }

  create() {
    const yearPicker = document.createElement("div");
    yearPicker.classList.add("austral-years-container");

    const header = document.createElement("div");
    header.classList.add("header");
    yearPicker.appendChild(header);

    const goBackBtn = new Button({
      type: "button",
      ariaLabel: this.translations.buttons.return,
      onClick: this.onGoBack,
      pictoLeftName: "cross",
    });
    header.appendChild(goBackBtn.get());

    const content = document.createElement("div");
    content.classList.add("years");
    yearPicker.appendChild(content);

    this.years.years.forEach((year) => {
      const yearContainer = document.createElement("div");
      yearContainer.classList.add("year");
      content.appendChild(yearContainer);

      const yearBtn = document.createElement("button");
      if (year.isSelected) {
        yearBtn.classList.add("selected");
      }
      if (year.isToday) yearBtn.classList.add("today");
      yearBtn.type = "button";
      yearBtn.textContent = year.year.getFullYear();
      yearBtn.addEventListener("click", () => this.onSelectYear(year.year));
      yearContainer.appendChild(yearBtn);
    });

    this.observer = new MutationObserver(() => {
      const selectedYear = this.yearPicker.querySelector(".selected");
      selectedYear.scrollIntoView({ block: "center" });
    });
    this.observer.observe(this.panel.australDatepickerPanel.querySelector(".austral-datepicker-container"), { childList: true });

    return yearPicker;
  }

  destroy() {
    ModalFocusTrap.removeFocusLoop();
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.yearPicker) {
      this.yearPicker.remove();
    }
  }
}

export default YearPicker;
