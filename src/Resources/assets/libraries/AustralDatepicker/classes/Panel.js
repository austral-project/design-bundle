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

    this.australDatepickerPanel = this.create();
    this.parent.appendChild(this.australDatepickerPanel);
    this.onOpen();
  }

  render(el) {
    this.australDatepickerPanel.firstChild.appendChild(el);
    this.checkPosition();
    setTimeout(()=>{
      this.australDatepickerPanel.classList.add('animate');
    }, 100);
  }

  checkPosition() {
    const container = this.australDatepickerPanel.querySelector('.austral-datepicker-container');
    const rect = container.getBoundingClientRect();

    if (rect.bottom > window.innerHeight) {
      this.australDatepickerPanel.classList.add('austral-datepicker--flip-up');
    } else {
      this.australDatepickerPanel.classList.remove('austral-datepicker--flip-up');
    }
  }


  create() {
    const australDatepickerPanel = document.createElement("div");
    australDatepickerPanel.classList.add("austral-datepicker");
    australDatepickerPanel.setAttribute("data-austral-datepicker", this.uuid);
    australDatepickerPanel.addEventListener("mousedown", this.checkClose.bind(this));
    australDatepickerPanel.addEventListener("touchstart", this.checkClose.bind(this), { passive: true });
    australDatepickerPanel.addEventListener("click", () => {
      if (this.isClose) {
        this.close().then(() => {});
      }
    });

    const australDatepickerPanelContainer = document.createElement("div");
    australDatepickerPanelContainer.classList.add("austral-datepicker-container");
    australDatepickerPanelContainer.addEventListener("click", (e) => e.stopPropagation());
    australDatepickerPanel.appendChild(australDatepickerPanelContainer);

    return australDatepickerPanel;
  }

  checkClose(e) {
    if (e.target === this.australDatepickerPanel) {
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
    this.australDatepickerPanel.remove();
  }
}

export default Panel;
