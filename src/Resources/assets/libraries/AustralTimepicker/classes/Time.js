import { utils } from "@austral/design";
import Choices from "@austral/design/libraries/AustralTimepicker/classes/Choices";

class Time {
  constructor(data) {
    this.value = data.value ?? null;
    this.hourLimitMax = data.hourLimitMax ?? null;
    this.minutesLimitMax = data.minutesLimitMax ?? null;
    this.choicesEnabled = data.choicesEnabled ?? ["hours", "minutes", "seconds"];
    this.choices = {};

    this.init();
  }

  init() {
    this.choicesEnabled.forEach((choiceType) => {
      this.choices[choiceType] = new Choices({
        choiceType: choiceType
      });
    });
    this.checkValue();
  }

  checkValue() {
    if (!this.value) {
      this.choicesEnabled.forEach((choiceType) => {
        this.choices[choiceType].init();
      });
      return;
    }

    if (utils.date.isValidDate(this.value)) {
      this.choicesEnabled.forEach((choiceType) => {
        let value = choiceType === "hours" ? this.value.getHours() :
          choiceType === "minutes" ? this.value.getMinutes():
            choiceType === "seconds" ? this.value.getSeconds():
              null;
        this.choices[choiceType].current = value;
        this.choices[choiceType].selected = value;
        this.choices[choiceType].set();
      });
      return;
    }

    if (this.value.includes("/") || this.value.includes("-")) {
      this.value = this.value.split(" ")[1];
    }

    if (!utils.date.isValidTime(this.value)) {
      this.choicesEnabled.forEach((choiceType) => {
        this.choices[choiceType].init();
      });
      return;
    }

    if (this.value.includes(":")) {
      this.value = this.value.split(":");
    }

    if (this.value.length === 2 || this.value.length === 3) {
      this.choicesEnabled.forEach((choiceType) => {
        this.choices[choiceType].current = Number(this.value[this.indexByChoiceType(choiceType)]);
        this.choices[choiceType].selected = Number(this.value[this.indexByChoiceType(choiceType)]);
        this.choices[choiceType].set();
      });
    } else {
      this.choicesEnabled.forEach((choiceType) => {
        this.choices[choiceType].init();
      });
    }

  }

  indexByChoiceType(choiceType)
  {
    return ["hours", "minutes", "seconds"].indexOf(choiceType);
  }

  set() {
    this.choicesEnabled.forEach((choiceType) => {
      this.choices[choiceType].set();
    });
  }

  getValues(choiceType)
  {
    return this.choices[choiceType];
  }

  setValue(value) {
    this.value = value;
    this.clear();
    this.checkValue();
  }

  setSelected() {
    this.choicesEnabled.forEach((choiceType) => {
      this.choices[choiceType].setSelected();
    });
  }

  reset() {
    this.choicesEnabled.forEach((choiceType) => {
      this.choices[choiceType].setCurrent();
    });
  }

  timeByLimit(date) {
    return date;
  }

  clear() {
    this.choicesEnabled.forEach((choiceType) => {
      this.choices[choiceType].clear();
    });
  }

  toString() {
    return utils.date.timeToString(this.choices["hours"]?.current, this.choices["minutes"]?.current, this.choices["seconds"]?.current);
  }
}

export default Time;
