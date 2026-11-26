import {ElementHtml, Button} from "@austral/design";
import ChoicesPicker from "@austral/design/libraries/AustralTimepicker/classes/ChoicesPicker";

class TimePicker {
  constructor(data) {
    this.time = data.time;
    this.visible = data.visible ?? false;
    this.translations = data.translations;
    this.language = data.language;
    this.locale = data.locale;
    this.choicesEnabled = data.choicesEnabled ?? ["hours", "minutes", "seconds"];
    this.onCancel = data.onCancel ?? (() => {});
    this.onAccept = data.onAccept ?? (() => {});
    this.onClose = data.onClose ?? (() => {});

    this.choicesPicker = {}

  }

  init() {
    this.timepicker = this.create();
  }

  get() {
    return this.timepicker;
  }

  render() {
    this.destroy();
    this.init();
  }

  getChoicePicker(choiceType) {
    return this.choicesPicker[choiceType];
  }

  create() {

    const timespicker = document.createElement("div");
    timespicker.classList.add("austral-times-container");

    const content = document.createElement("div");
    content.classList.add("austral-times-content");

    this.choicesEnabled.forEach((choiceType) => {
      this.choicesPicker[choiceType] = new ChoicesPicker({
        time: this.time,
        choiceType: choiceType,
      });
      content.appendChild(this.choicesPicker[choiceType].get());
    });
    timespicker.appendChild(content);

    const cancelButton = new Button({
      type: "button",
      ariaLabel: this.translations.buttons.cancel,
      entitled: this.translations.buttons.cancel,
      pictoRightName: "cross",
      onClick: () => {
        this.onCancel();
      },
    });

    const acceptButton = new Button({
      type: "button",
      ariaLabel: this.translations.buttons.accept,
      entitled: this.translations.buttons.accept,
      pictoRightName: "check",
      onClick: () => {
        this.onAccept();
      },
    });

    const buttonContent = new ElementHtml({
      tag: "div",
      classes: ["buttons-content"],
      children: [
        cancelButton.get(),
        acceptButton.get(),
      ]
    });

    const bottom = new ElementHtml({
      tag: "div",
      classes: ["bottom", "buttons-area", "side"],
      children: [
        buttonContent.get(),
      ]
    });
    timespicker.appendChild(bottom.get());


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
      timespicker.appendChild(this.closeDayPicker);
    }

    return timespicker;
  }

  destroy() {
    if (this.timepicker) {
      this.timepicker.remove();
    }
  }
}

export default TimePicker;
