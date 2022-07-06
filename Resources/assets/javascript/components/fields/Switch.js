import Request from "../../request/Request";
import Response from "../../response/Response";
import abstractField from "./abstract";

class Switch extends abstractField {

  static initComponent() {
    super.initComponent("switch");
  }

  create(element) {
    super.create(element);
    this.urls = this.element.dataset.switchUrls ?? null;
    if(this.urls) {
      this.urls = JSON.parse(this.urls);
    }

    this.input = null;
    this.initialValue = false;
    if(this.element.dataset.switchInput !== undefined)
    {
      this.input = this.element.querySelector("input");
      this.initialValue = this.input.checked ? "checked" : "";
      this.switchAction = this.input.checked ? "tails" : "heads";
      this.switchClass();
      this.input.addEventListener("change", (e) => {
        this.switchAction = this.input.checked ? "tails" : "heads";
        this.switchClass();
      });
    }
  }

  initialValueChange() {
    let currentValue = this.input.checked ? "checked" : "";
    return this.initialValue !== currentValue;
  }

  addEventListener() {
    super.addEventListener();

    MiscEvent.addListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      MiscEvent.dispatch("component::switch.change", {}, this.element);
    }, this.element.querySelector(".switch-button-content .switch-button"));

    MiscEvent.addListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(this.element.classList.contains("tails")) {
        MiscEvent.dispatch("component::switch.change", {}, this.element);
      }
    }, this.element.querySelector(".switch-button-content .heads"));

    MiscEvent.addListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(this.element.classList.contains("heads")) {
        MiscEvent.dispatch("component::switch.change", {}, this.element);
      }
    }, this.element.querySelector(".switch-button-content .tails"));

    [].forEach.call(this.element.querySelectorAll(".switch-button-content .text"), (elementText) => {
      MiscEvent.addListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        MiscEvent.dispatch("component::switch.change", {"switchAction": e.target.classList.contains("heads") ? "heads" : "tails"}, this.element);
      }, elementText);
    });

    MiscEvent.addListener("component::switch.change", (e) => {
      if(e.detail.switchAction !== undefined && e.detail.switchAction) {
        this.switchAction = e.detail.switchAction;
      }
      else {
        this.switchAction = this.element.classList.contains("heads") ? "tails" : "heads";
      }
      this.execute();
    }, this.element);

  }

  execute() {
    this.element.classList.add("click");
    if(this.input)
    {
      this.input.checked = !this.input.checked;
      this.switchAction = this.input.checked ? "tails" : "heads";
      this.switchClass();
    }
    else if(this.urls.heads !== undefined && this.urls.tails !== undefined)
    {
      var response = new Response(()=>{
        this.switchClass()
      });
      response.setUpdateBodyClass(true);
      var request = new Request(
        "GET",
        this.switchAction === "tails" ? this.urls.tails : this.urls.heads,
        {},
        response
      );
      request.execute();
    }
    else
    {
      this.switchClass();
    }
  }

  switchClass() {
    this.element.classList.remove(this.switchAction === "tails" ? "heads" : "tails");
    this.element.classList.add(this.switchAction === "tails" ? "tails": "heads");
    setTimeout(()=>{
      this.element.classList.remove("click");
    }, 300);
    if(this.input)
    {
      MiscEvent.dispatch("component::form.change", { field: this, key: this.input.getAttribute("id"), change: this.initialValueChange()  }, this.formContainer);
    }
  }

}
export default Switch;