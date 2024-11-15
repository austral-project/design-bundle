import Choices from "../../../vendor/javascript/choices.js/assets/scripts/choices";
//import Choices from "choices.js/src/scripts/choices";
import "choices.js/src/styles/choices.scss"
import abstractField from "./abstract";
import ViewByChoice from "./ViewByChoice";
import Response from "../../response/Response";
import Request from "../../request/Request";

export default class Select extends abstractField {

  static initComponent() {
    super.initComponent("select", () => {
      this.viewByChoice = {};
    });
  }

  create(element) {
    super.create(element);
    if(this.element.dataset.selectOptions) {
      this.options = JSON.parse(element.dataset.selectOptions);
    }
    else {
      this.options = {};
    }
    if(this.options['searchEnabled'] && this.options['tag'] === false) {
      if(this.element.querySelectorAll("option").length < 10) {
        this.options['searchEnabled'] = false;
      }
    }
    if(!this.element.querySelector("option[value='']") && this.element.dataset.valueNull !== undefined)
    {
      let option = document.createElement("option");
      option.setAttribute("value", "");
      if(!this.element.querySelector("option[selected]"))
      {
        option.setAttribute("selected", "");
      }
      this.element.prepend(option);
    }
    this.options['itemSelectText'] = "";
    this.options['allowHTML'] = true;
    this.options['resetScrollPosition'] = false;
    this.options["searchChoices"] = this.options['searchEnabled'];
    this.initialValue = this.element.value;
    this.choices = new Choices(this.element, this.options);
  }

  addEventListenerToChangeField() {
    if(this.element.dataset.hasOwnProperty("viewByChoices"))
    {
      this.viewByChoice = new ViewByChoice(this.element, "view-by-choices");
    }
  }

  addEventListener() {
    super.addEventListener();
    MiscEvent.addListener("showDropdown", (event) => {
      this.element.closest(".field").classList.add("focus");
    }, this.element);
    MiscEvent.addListener("hideDropdown", (event) => {
      this.element.closest(".field").classList.remove("focus");
    }, this.element);

    MiscEvent.addListener("choice", (event) => {
      if(event.detail !== undefined) {
        this.choices.setChoiceByValue(event.detail.choice.value);
        this.choices.hideDropdown();
        MiscEvent.dispatch('mouseleave', {}, this.field);
        if(this.viewByChoice) {
          this.viewByChoice.changeValue(event.detail.choice.value);
        }

        if(!event.detail.choice.value) {
          let parentAnimate = this.element.closest(".animate");
          if(parentAnimate) {
            parentAnimate.classList.remove("active");
          }
        }
        else {
          let parentAnimate = this.element.closest(".animate");
          if(parentAnimate) {
            parentAnimate.classList.add("active");
          }
        }

        if(this.element.dataset.hasOwnProperty("refresh")) {
          var response = new Response();
          response.setReplaceState(true)
            .setPushHistory(true)
            .setReplaceDom(true)
            .setElementsToRefresh(this.element.dataset.refresh);
          var request = new Request(
            "GET",
            this.element.dataset.url+"?page="+event.detail.choice.value,
            {
            },
            response
          );
          request.execute();
        }
        MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: event.detail.choice.value !== this.initialValue }, this.formContainer);
      }
      MiscEvent.dispatch("component::select:choice:after", {}, this.element);
    }, this.element);

    MiscEvent.addListener("addItem", () => {
      if(this.options['tag'] === true) {
        this.element.parentNode.querySelector(".choices__input").click();
      }
    }, this.element);
  }

}