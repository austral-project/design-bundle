class Choices {
  constructor(data) {
    this.choiceType = data.choiceType ?? "hours";
    this.limit = this.choiceType === "hours" ? 24 : 60;
    this.choices = [];
    this.current = null;
    this.selected = null;
  }

  init() {
    this.current = this.choiceType === "hours" ? new Date().getHours() :
    this.choiceType === "minutes" ? new Date().getMinutes() :
    this.choiceType === "seconds" ? new Date().getSeconds() : null;
    this.selected = this.current;

    this.set();
  }

  get() {
    return this.choices;
  }

  set() {
    for (let i = 0; i < this.limit; i++) {
      let choice = (this.limit + i + this.selected - 4) % this.limit;
      let type = "hide";

      if (choice === (this.limit + this.selected - 2) % this.limit) {
        type = "prev-last";
      } else if (choice === (this.limit + this.selected - 1) % this.limit) {
        type = "prev";
      } else if (choice === this.selected) {
        type = "current";
      } else if (choice === (this.limit + this.selected + 1) % this.limit) {
        type = "next";
      } else if (choice === (this.limit + this.selected + 2) % this.limit) {
        type = "next-last";
      }

      this.add({ choice, type });
    }
  }

  next() {
    this.current = (this.limit + this.current + 1) % this.limit;
  }

  prev() {
    this.current = (this.limit + this.current - 1) % this.limit;
  }

  getSelected() {
    return this.selected;
  }

  setSelected() {
    this.selected = this.current;
  }

  setCurrent() {
    this.current = this.selected;
  }

  add(value) {
    this.choices = [...this.choices, value];
  }

  clear() {
    this.choices = [];
  }
}

export default Choices;
