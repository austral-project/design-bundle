import { utils } from "@austral/design";
import {parseDate} from "@austral/design/utils/date";

class Dates {
  constructor(data) {
    this.translations = data.translations;
    this.language = data.language;
    this.locale = data.locale;
    this.input = data.input;
    this.value = data.value;
    this.dateLimitMin = data.dateLimitMin ?? null;
    this.dateLimitMax = data.dateLimitMax ?? null;

    this.dates = [];

    this.todayDate = null;
    this.currentDate = null;
    this.selectedDate = null;


    this.init();
  }

  init() {
    this.initDates();
    this.setDates();
  }

  initDates() {
    this.todayDate = utils.date.dateFromDatetime(new Date());
    this.currentDate = utils.date.dateFromDatetime(new Date());
    this.selectedDate = utils.date.dateFromDatetime(new Date());

    if (!this.value) {
      return;
    }

    const valueDate = utils.date.parseDate(this.value);

    if (utils.date.isValidDate(valueDate)) {
      this.currentDate = utils.date.dateFromDatetime(valueDate);
      this.selectedDate = utils.date.dateFromDatetime(valueDate);
    }

    this.currentDate.setDate(1);
  }

  setCurrentDate(date) {
    this.currentDate = utils.date.dateFromDatetime(new Date(date));
    this.currentDate.setDate(1);
  }

  setSelectedDate(date) {
    this.selectedDate = utils.date.dateFromDatetime(new Date(date));
  }

  prevCurrentDateMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  }

  nextCurrentDateMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  }

  setCurrentDateYear(date) {
    this.currentDate.setFullYear(date.getFullYear());
  }

  setCurrentDateMonth(date) {
    this.currentDate.setMonth(date.getMonth());
  }

  resetCurrentDate() {
    this.currentDate = utils.date.dateFromDatetime(new Date(this.selectedDate));
    this.currentDate.setDate(1);
  }

  resetDates() {
    this.clear();
    this.setDates();
  }

  setDates() {
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();

    const prevDate = new Date(currentYear, currentMonth - 1);
    const nextDate = new Date(currentYear, currentMonth + 1);

    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();

    const nextMonth = nextDate.getMonth();
    const nextYear = nextDate.getFullYear();

    const daysOfPrevMonth = utils.date.getDaysOfMonth(prevYear, prevMonth);
    const daysOfCurrentMonth = utils.date.getDaysOfMonth(currentYear, currentMonth);
    const daysOfNextMonth = utils.date.getDaysOfMonth(nextYear, nextMonth);

    const firstDayOfMonth = utils.date.getFirstDayOfMonth(currentYear, currentMonth);
    const lastDayOfMonth = utils.date.getLastDayOfMonth(currentYear, currentMonth);

    const firstDayOfMonthWeekIndex = utils.date.getDayOfWeekIndex(firstDayOfMonth);
    const lastDayOfMonthWeekIndex = utils.date.getDayOfWeekIndex(lastDayOfMonth);

    for (let i = daysOfPrevMonth.length - firstDayOfMonthWeekIndex + 1; i < daysOfPrevMonth.length; i++) {
      this.addDate(daysOfPrevMonth[i]);
    }

    for (let i = 0; i < daysOfCurrentMonth.length; i++) {
      this.addDate(daysOfCurrentMonth[i]);
    }

    for (let i = 0; i < 7 - lastDayOfMonthWeekIndex; i++) {
      this.addDate(daysOfNextMonth[i]);
    }

    if (this.dates.length < 42) {
      for (let i = 0; i < 7; i++) {
        this.addDate(daysOfNextMonth[i + 7]);
      }
    }

    this.dates = this.dates.map((date) => {
      return {
        date,
        isPrev: date.getMonth() < currentMonth,
        isToday: date.getTime() === this.todayDate.getTime(),
        isSelected: date.getTime() === this.selectedDate.getTime(),
        isCurrent: this.checkLimit(date) === false && date.getMonth() === currentMonth,
        isNext: date.getMonth() > currentMonth,
        isDisabled: this.checkLimit(date),
      };
    });
  }

  checkLimit(date) {
    let isDisabled = false;
    if(this.dateLimitMin)
    {
      isDisabled = date.getTime() < this.dateLimitMin.getTime();
    }
    if(this.dateLimitMax && isDisabled === false)
    {
      isDisabled = date.getTime() > this.dateLimitMax.getTime();
    }
    return isDisabled;
  }

  dateByLimit(date) {
    if(this.dateLimitMin && date.getTime() < this.dateLimitMin.getTime())
    {
      return this.dateLimitMin;
    }
    if(this.dateLimitMax && date.getTime() > this.dateLimitMax.getTime())
    {
      return this.dateLimitMax;
    }
    return date;
  }

  addDate(day) {
    this.dates = [...this.dates, day];
  }

  clear() {
    this.dates = [];
  }
}

export default Dates;
