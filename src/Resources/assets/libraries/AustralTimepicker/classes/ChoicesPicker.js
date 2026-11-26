import {DomEventManager} from "@austral/design";

class ChoicesPicker {
  constructor(data) {
    this.choiceType = data.choiceType ?? "hours";
    this.time = data.time;
    this.isMove = false;

    this.init();
  }

  init() {
    this.choicesPicker = this.create();
  }

  get() {
    return this.choicesPicker;
  }

  create() {
    const choicesPicker = document.createElement("div");
    choicesPicker.classList.add("column");
    choicesPicker.addEventListener("mousedown", this.handleStart.bind(this));
    choicesPicker.addEventListener("touchstart", this.handleStart.bind(this), { passive: true });

    const viewerLeft = document.createElement("div");
    viewerLeft.classList.add("viewer");
    choicesPicker.appendChild(viewerLeft);

    this.choicesEl = document.createElement("div");
    this.choicesEl.classList.add(this.choiceType, "choices");
    viewerLeft.appendChild(this.choicesEl);


    this.time.getValues(this.choiceType).get().forEach((choice) => {
      const choiceEl = document.createElement("button");
      choiceEl.classList.add("button-choice", choice.type);
      choiceEl.setAttribute("data-value", choice.choice);
      choiceEl.textContent = choice.choice.toString().padStart(2, "0");
      if(choice.type === "current")
      {
        choiceEl.setAttribute("tabindex", 0);
      }
      else
      {
        choiceEl.setAttribute("tabindex", -1);
      }
      this.choicesEl.appendChild(choiceEl);
    });

    this.initKeyboardNavigation();

    DomEventManager.addListener("wheel", (e)=>{
      e.preventDefault();
      const delta = e.deltaY; // positif = scroll vers le bas

      this.currentMoveY = delta;  // comme un drag inversé
      this.totalMoveY = delta;
      this.paint(delta); // réutilise la fonction existante

    }, choicesPicker);


    return choicesPicker;
  }

  handleStart(e) {
    this.isMove = true;

    this.move = this.handleMove.bind(this);
    this.end = this.handleEnd.bind(this);

    DomEventManager.addListener("mousemove", this.move, this.choicesPicker);
    DomEventManager.addListener("touchmove", this.move, this.choicesPicker, { passive: true });
    DomEventManager.addListener("mouseup", this.end, this.choicesPicker);
    DomEventManager.addListener("touchmove", this.end, this.choicesPicker, { passive: true });


    const y = e.clientY ?? e.touches[0].clientY;

    this.startY = y;
    this.currentY = y;
    this.startTop = this.choicesEl.offsetTop;

    this.startTime = new Date();

    this.reset();
  }

  handleMove(e) {
    if (!this.isMove) {
      return;
    }

    const y = e.clientY ?? e.touches[0].clientY;

    this.currentMoveY = y - this.currentY;
    this.totalMoveY = y - this.startY;

    this.paint();
  }

  handleEnd() {
    if (!this.isMove) {
      return;
    }

    this.isMove = false;

    this.choicesEl.style.top = `${this.startTop}px`;

    this.endTime = new Date();
    this.elapsedTime = this.endTime.getTime() - this.startTime.getTime();
    this.pixelsPerTime = Math.abs(this.totalMoveY / this.elapsedTime);
    this.directionY = Math.sign(this.totalMoveY / this.elapsedTime);

    requestAnimationFrame(this.loop.bind(this));

    document.removeEventListener("mousemove", this.move);
    document.removeEventListener("touchmove", this.move);
    document.removeEventListener("mouseup", this.end);
    document.removeEventListener("touchend", this.end);
  }

  loop(timeStamp) {
    if (this.isMove) {
      return;
    }

    if (!this.oldTimeStamp) {
      this.oldTimeStamp = timeStamp;
    }

    this.timePassed = timeStamp - this.oldTimeStamp;
    this.oldTimeStamp = timeStamp;

    this.currentMoveY += this.pixelsPerTime * this.timePassed * this.directionY;
    this.reduction = this.reduction * this.reductionRatio;
    this.pixelsPerTime = this.pixelsPerTime - this.reduction;

    this.paint();

    if (this.pixelsPerTime < 0) {
      this.choicesEl.style.top = -100 + "px";
      return;
    }

    requestAnimationFrame(this.loop.bind(this));
  }

  paint(delta = null, changeValue = true) {
    this.choicesEl.style.top = `${this.startTop + this.currentMoveY}px`;

    const top = delta ?? this.choicesEl.offsetTop;

    if (top < -130) {
      this.choicesEl.appendChild(this.choicesEl.firstChild);
      if(changeValue) {
        this.time.getValues(this.choiceType).next();
      }
    }

    if (top > -70) {
      this.choicesEl.prepend(this.choicesEl.lastChild);
      if(changeValue) {
        this.time.getValues(this.choiceType).prev();
      }
    }

    if (top < -130 || top > -70) {
      this.choicesEl.style.top = -100 + "px";

      this.currentY = this.currentY + this.currentMoveY;
      this.currentMoveY = 0;

      this.choicesEl.childNodes.forEach((el, i) => {
        el.classList.remove("prev-last", "prev", "current", "next", "next-last", "hide");
        el.classList.add(this.time.getValues(this.choiceType).get()[i].type);
        if(this.time.getValues(this.choiceType).get()[i].type === "current")
        {
          el.setAttribute("tabindex", 0);
        }
        else
        {
          el.setAttribute("tabindex", -1);
        }
      });
    }
  }

  initKeyboardNavigation() {
    // On parcourt tous les boutons existants
    this.choicesEl.querySelectorAll(".button-choice").forEach((choice, i) => {
      DomEventManager.addListener("focus", (e) => this.handleFocus(choice), choice);
      DomEventManager.addListener("keydown", (e) => this.handleKey(e), choice);
      DomEventManager.addListener("timepicker::button.selected", (e) => this.handleSelect(choice), choice);
    });
  }

  handleFocus(button) {
    const current = this.choicesEl.querySelector(".current");
    const viewportCenter = -100;
    const currentButtonTop = current.offsetTop;
    const buttonTop = button.offsetTop;
    if(currentButtonTop === buttonTop)
    {
      return;
    }
    const delta = (currentButtonTop > buttonTop) ? viewportCenter + buttonTop : viewportCenter - buttonTop;
    this.paint(delta);
  }

  handleKey(e) {
    const current = this.choicesEl.querySelector(".current");
    let newElement;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      newElement = current.nextElementSibling;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      newElement= current.previousElementSibling;
    }
    if(newElement)
    {
      newElement.focus();
    }
  }

  handleSelect(newCurrent) {
    let current = this.choicesEl.querySelector(".current");
    let currentNumber = parseInt(current.getAttribute("data-value"));
    let newCurrentNumber = parseInt(newCurrent.getAttribute("data-value"));
    const ecart = Math.abs(currentNumber - newCurrentNumber);
    for(let i = 0; i < ecart; i++)
    {
      let current = this.choicesEl.querySelector(".current");
      const viewportCenter = -100;
      const currentButtonTop = current.offsetTop;
      const newCurrentButtonTop = newCurrent.offsetTop;
      if(currentButtonTop === newCurrentButtonTop)
      {
        return;
      }
      const delta = (currentButtonTop > newCurrentButtonTop) ? viewportCenter + newCurrentButtonTop : viewportCenter - newCurrentButtonTop;
      this.paint(delta, false);
    }
  }

  reset() {
    this.currentMoveY = 0;
    this.totalMoveY = 0;
    this.oldTimeStamp = null;
    this.reduction = 0.01;
    this.reductionRatio = 1.02;
  }

  destroy() {
    if (this.choicesPicker) {
      this.choicesPicker.remove();
    }
  }
}

export default ChoicesPicker;
