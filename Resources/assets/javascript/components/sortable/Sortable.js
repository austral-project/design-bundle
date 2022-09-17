import SortableJs, {AutoScroll, Swap, MultiDrag } from 'sortablejs/modular/sortable.core.esm.js';
SortableJs.mount(new AutoScroll(), new Swap(), new MultiDrag());
import abstractComponent from "./../abstract"
import Request from "../../request/Request";
import Response from "../../response/Response";

export default class Sortable extends abstractComponent {

  static initComponent() {
    super.initComponent("sortable");
  }

  create() {
    this.options = {
      group: this.element.dataset.componentUuid,
      multiDrag: true,
      selectedClass: 'selected',
      animation: 150,
      ghostClass: 'blue-background-class',
      scroll: true,
      invertSwap: true,
      forceAutoscrollFallback: true,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
      scrollSpeed: 10, // px, speed of the scrolling
      bubbleScroll: true // apply autoscroll to all parent elements, allowing for easier movement
    };
    if(this.element.dataset.sortableHandle)
    {
      this.options["handle"] = this.element.dataset.sortableHandle;
      [].forEach.call(this.element.querySelectorAll(this.element.dataset.sortableHandle), (element) => {
        MiscEvent.addListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
        }, element);
      });
    }
    if(this.element.dataset.sortableDraggable)
    {
      this.options["draggable"] = this.element.dataset.sortableDraggable;
    }
    this.options["onChange"] = (evt) => {
      this.initInput();
    };
    this.options["onSort"] = (evt) => {
      evt.item.classList.add('hover');
      if(this.element.dataset.sortableUpdate)
      {
        var formData = new FormData();
        var values = {};
        [].forEach.call(this.element.children, (el, i) => {
          if(el.dataset.rowId) {
            values[i] = el.dataset.rowId;
          }
        });
        formData.set("positions", JSON.stringify(values));
        this.execute(formData);
      }
    };
    this.options["onStart"] = (evt) => {
      this.element.classList.add('sortable-enabled');
    };
    this.options["onEnd"] = (evt) => {
      this.element.classList.remove('sortable-enabled');
      for (let i in evt.items) {
        SortableJs.utils.deselect(evt.items[i]);
      }
    };
    this.sortableJs = SortableJs.create(this.element, this.options);
    this.initInput();
  }

  execute(formData) {
    this.response = new Response();
    this.response.setUpdateBodyClass(true);
    this.request = new Request(
      "POST",
      this.element.dataset.sortableUpdate,
      {
      },
      this.response
    );
    this.request.execute(formData);
  }

  addEventListener() {
    MiscEvent.addListener("click", () => {
      this.initInput();
    }, this.element);
    MiscEvent.addListener("component::sortable.refresh", () => {
      this.refresh();
    }, this.element);


    [].forEach.call(this.element.children, (element) => {
      MiscEvent.addListener("mouseover", (event) => {
        if(element.querySelector(".col-content")) {
          element.querySelector(".col-content").classList.add('hover');
        }
        else {
          element.classList.add('hover');
        }
      }, element);
      MiscEvent.addListener("mouseout", (event) => {
        if(element.querySelector(".col-content")) {
          element.querySelector(".col-content").classList.remove('hover');
        }
        else {
          element.classList.remove('hover');
        }
      }, element);
    });
  }

  refresh() {
    this.sortableJs.destroy();
    this.sortableJs = SortableJs.create(this.element, this.options);
    this.initInput();
  }

  initInput() {
    var sortableInputElements = {};
    var sortableElements = {};
    var position = 0;

    if(this.element.dataset.sortableInput)
    {
      [].forEach.call(this.element.querySelectorAll(this.element.dataset.sortableInput), (el, index) => {
        var parent = el.closest("*[data-sortable-draggable]");
        if(parent.dataset.componentUuid)
        {
          if(sortableInputElements[parent.dataset.componentUuid] === undefined)
          {
            sortableInputElements[parent.dataset.componentUuid] = [];
          }
          sortableInputElements[parent.dataset.componentUuid].push(el);
        }
      });

      [].forEach.call(Object.entries(sortableInputElements), (children, index) => {
        position = 1;
        if(children[1] !== undefined)
        {
          [].forEach.call(children[1], (child, index) => {
            child.value = position;
            position++;
          });
        }
      });

      [].forEach.call(this.element.querySelectorAll("*[data-position-view]"), (el, index) => {
        var parent = el.closest("*[data-sortable-draggable]");
        if(parent.dataset.componentUuid)
        {
          if(sortableElements[parent.dataset.componentUuid] === undefined)
          {
            sortableElements[parent.dataset.componentUuid] = [];
          }
          sortableElements[parent.dataset.componentUuid].push(el);
        }
      });

      [].forEach.call(Object.entries(sortableElements), (children, index) => {
        position = 1;
        if(children[1] !== undefined)
        {
          [].forEach.call(children[1], (child, index) => {
            child.textContent = position;
            position++;
          });
        }
      });

    }
  }

}