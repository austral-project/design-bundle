import abstract from "../abstract";
import { gsap } from "gsap";

export default class Search extends abstract {

  static initComponent() {
    super.initComponent("search");
  }

  create() {
    this.elementsSearch = document.querySelectorAll("*[data-search-element='"+this.element.getAttribute("data-search")+"']");
    this.elementsHidden = document.querySelectorAll("*[data-search-hidden='"+this.element.getAttribute("data-search")+"']");
  }

  addEventListener() {
    let timeout = null;
    MiscEvent.addListener("keyup", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.search();
      }, 400);
    }, this.element);
  }

  search() {
    let searchValue = this.element.value;

    this.elementsHidden.forEach((item) => {
      if(!searchValue || searchValue === "")
      {
        item.style.display = "block";
      }
      else
      {
        item.style.display = "none";
      }
    });

    let regex = new RegExp(searchValue, "i");
    this.elementsSearch.forEach((item) => {
      let elementValue = item.getAttribute("data-search-value");
      if(!searchValue || searchValue === "" || elementValue.search(regex) >= 0)
      {
        item.style.display = "flex";
      }
      else
      {
        item.style.display = "none";
      }
    });
  }
}