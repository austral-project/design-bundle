import SortableJs, {AutoScroll, MultiDrag, Swap} from 'sortablejs/modular/sortable.core.esm.js';
import {abstractComponent, DomEventManager, Request, Response} from "@austral/design";
SortableJs.mount(new AutoScroll(), new Swap(), new MultiDrag());

export default class Sortable extends abstractComponent {

  static initComponent() {
    super.initComponent("sortable");
  }

  create() {
    let sortableGroup = this.element.getAttribute("data-sortable-group") ? this.element.getAttribute("data-sortable-group") : null;

    let put = true;
    if(sortableGroup)
    {
      if(sortableGroup)
      {
        put = (to, from)=>{
          return (to.el.dataset.sortableGroup === from.el.dataset.sortableGroup);
        };
      }
    }

    this.options = {
      group: {
        name: sortableGroup ? sortableGroup : this.element.dataset.componentUuid,
        put: put,
        pull: true,
      },
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
        DomEventManager.addListener("click", (event) => {
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
      let sortableParentInput = evt.item.querySelector("input[data-collection-sortable-parent-id]");
      if(sortableParentInput) {
        let sortableParent = evt.item.closest("*[data-sortable-parent-id]");
        if (sortableParent) {
          sortableParentInput.value = sortableParent.getAttribute("data-sortable-parent-id");
        } else {
          sortableParentInput.value = null;
        }
      }
    };
    this.sortableJs = [];
    this.sortableJs.push(SortableJs.create(this.element, this.options));
    let children = this.element.querySelectorAll(".editor-component-container");
    if(children)
    {
      children.forEach((child) => {
        if(child.querySelector(".container-children-row")) {
          child.querySelectorAll(".container-children-row .container-children-col .children").forEach((childChildren) => {
            this.sortableJs.push(SortableJs.create(childChildren, this.options));
          });
        }
        else {
          if(child.querySelector(".children")) {
            this.sortableJs.push(SortableJs.create(child.querySelector(".children"), this.options));
          }
        }
      });
    }
    this.initInput();
  }

  execute(formData) {
    this.request = new Request(
      this.element.dataset.sortableUpdate,
      "POST",
      {},
    );
    this.request.execute(()=>{
     }, formData);
  }

  addEventListener() {
    DomEventManager.addListener("click", () => {
      this.initInput();
    }, this.element);
    DomEventManager.addListener("component::sortable.refresh", () => {
      this.refresh();
    }, this.element);


    let childrenElement = this.element.dataset.sortableDraggable ? this.element.querySelectorAll(this.element.dataset.sortableDraggable) : this.element.children;
    [].forEach.call(childrenElement, (element) => {
      DomEventManager.addListener("mouseover", (event) => {
        if(element.querySelector(".col-content")) {
          element.querySelector(".col-content").classList.add('hover');
        }
        else {
          element.classList.add('hover');
        }
      }, element);
      DomEventManager.addListener("mouseout", (event) => {
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
    this.sortableJs.forEach((element) => {
      element.destroy();
    });
    this.sortableJs.push(SortableJs.create(this.element, this.options));
    let children = this.element.querySelectorAll(".editor-component-container");
    if(children)
    {
      children.forEach((child) => {
        if(child.querySelector(".children")) {
          this.sortableJs.push(SortableJs.create(child.querySelector(".children"), this.options));
        }
      });
    }
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
        if(parent.dataset.componentSortableUuid)
        {
          if(sortableInputElements[parent.dataset.componentSortableUuid] === undefined)
          {
            sortableInputElements[parent.dataset.componentSortableUuid] = [];
          }
          sortableInputElements[parent.dataset.componentSortableUuid].push(el);
        }
      });

      console.log(sortableInputElements);

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
DomEventManager.addListener("component::initialize", () => {
  Sortable.initComponent();
});
