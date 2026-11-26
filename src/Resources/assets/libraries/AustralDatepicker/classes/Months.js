import { utils } from "@austral/design";

class Months {
  constructor(data) {
    this.translations = data.translations;
    this.language = data.language;
    this.locale = data.locale;
    this.input = data.input;
    this.value = data.value;

    this.months = [];

    this.todayMonth = null;
    this.selectedMonth = null;

    this.init();
  }

  init() {
    this.initMonths();
    this.setMonths();
  }

  initMonths() {
    this.todayMonth = utils.date.dateFromDatetime(new Date());
    this.selectedMonth = utils.date.dateFromDatetime(new Date());

    const valueDate = utils.date.parseDate(this.value);

    if (utils.date.isValidDate(valueDate)) {
      this.selectedMonth = utils.date.dateFromDatetime(new Date(valueDate));
    }
  }

  setSelectedMonth(date) {
    this.selectedMonth = new Date(date);
  }

  resetMonths() {
    this.clear();
    this.setMonths();
  }

  setMonths() {
    for (let i = 0; i <= 11; i++) {
      const month = new Date(this.selectedMonth.getFullYear(), i, 1);
      this.addMonth(month);
    }

    this.months = this.months.map((month) => {
      return {
        month: month,
        isSelected: month.getMonth() === this.selectedMonth.getMonth(),
        isToday: month.getMonth() === this.todayMonth.getMonth(),
      }
    });
  }

  addMonth(month) {
    this.months = [...this.months, month];
  }

  clear() {
    this.months = [];
  }
}

export default Months;
