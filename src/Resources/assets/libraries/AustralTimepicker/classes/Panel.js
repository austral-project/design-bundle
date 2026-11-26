
class Panel {
  constructor(data) {
    this.uuid = data.uuid;
    this.parent = data.parent;
    this.onOpen = data.onOpen ?? (() => {});
    this.onClose = data.onClose ?? (() => {});

    this.isOpen = false;
    this.isClose = false;
  }

  async open() {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    this.australTimepickerPanel = this.create();
    this.parent.appendChild(this.australTimepickerPanel);
    this.onOpen();
  }

  render(el) {
    this.australTimepickerPanel.firstChild.appendChild(el);
    this.checkPosition();
    setTimeout(()=>{
      this.australTimepickerPanel.classList.add('animate');
    }, 100);
  }

  checkPosition() {
    const container = this.australTimepickerPanel.querySelector('.austral-timepicker-container');
    const rect = container.getBoundingClientRect();

    if (rect.bottom > window.innerHeight) {
      this.australTimepickerPanel.classList.add('austral-timepicker--flip-up');
    } else {
      this.australTimepickerPanel.classList.remove('austral-timepicker--flip-up');
    }
  }

  create() {
    const australTimepickerPanel = document.createElement("div");
    australTimepickerPanel.classList.add("austral-timepicker");
    australTimepickerPanel.setAttribute("data-austral-timepicker", this.uuid);

    australTimepickerPanel.addEventListener("mousedown", this.checkClose.bind(this));
    australTimepickerPanel.addEventListener("touchstart", this.checkClose.bind(this), { passive: true });
    australTimepickerPanel.addEventListener("click", () => {
      if (this.isClose) {
        this.close().then(() => {});
      }
    });


    const australTimepickerPanelContainer = document.createElement("div");
    australTimepickerPanelContainer.classList.add("austral-timepicker-container");
    australTimepickerPanelContainer.addEventListener("click", (e) => e.stopPropagation());
    australTimepickerPanel.appendChild(australTimepickerPanelContainer);

    return australTimepickerPanel;
  }

  checkClose(e) {
    if (e.target === this.australTimepickerPanel) {
      this.isClose = true;
    }
  }

  async close() {
    this.isOpen = false;
    this.isClose = false;

    this.onClose();
    this.destroy();
  }

  destroy() {
    this.australTimepickerPanel.remove();
  }
}

export default Panel;