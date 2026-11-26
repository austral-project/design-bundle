import { utils } from "@austral/design";

class Years {
  constructor(data) {
    this.translations = data.translations;
    this.language = data.language;
    this.locale = data.locale;
    this.input = data.input;
    this.value = data.value;

    this.yearStart = data.yearStart ?? 1900;
    this.yearEnd = data.yearEnd ?? 2100;

    this.years = [];

    this.todayYear = null;
    this.selectedYear = null;

    this.init();
  }

  init() {
    this.initYears();
    this.setYears();
  }

  initYears() {
    this.todayYear = utils.date.dateFromDatetime(new Date());
    this.selectedYear = utils.date.dateFromDatetime(new Date());

    const valueDate = utils.date.parseDate(this.value);

    if (utils.date.isValidDate(valueDate)) {
      this.selectedYear = utils.date.dateFromDatetime(new Date(valueDate));
    }
  }

  setSelectedYear(date) {
    this.selectedYear = new Date(date);
  }

  resetYears() {
    this.clear();
    this.setYears();
  }

  setYears() {
    for (let i = this.yearStart; i <= this.yearEnd; i++) {
      const year = new Date(i, 0, 1);
      this.addYear(year);
    }

    this.years = this.years.map((year) => {
      return {
        year: year,
        isSelected: year.getFullYear() === this.selectedYear.getFullYear(),
        isToday: year.getFullYear() === this.todayYear.getFullYear(),
      }
    });
  }

  addYear(year) {
    this.years = [...this.years, year];
  }

  clear() {
    this.years = [];
  }
}

export default Years;
