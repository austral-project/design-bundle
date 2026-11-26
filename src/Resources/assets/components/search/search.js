/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DomEventManager } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

/**
 * Filters elements of the page while typing.
 *
 *   <input type="search" data-search="modules">
 *   <li data-search-element="modules" data-search-value="Pages News">…</li>
 *   <p data-search-hidden="modules">Shown when the field is empty</p>
 *
 * The text is searched without case in data-search-value (as text, not as a regular expression).
 */

export default class Search extends abstractComponent {

  static initComponent() {
    super.initComponent("search");
  }

  create() {
    this.elementsSearch = document.querySelectorAll("*[data-search-element='"+this.element.getAttribute("data-search")+"']");
    this.elementsHidden = document.querySelectorAll("*[data-search-hidden='"+this.element.getAttribute("data-search")+"']");
  }

  addEventListener() {
    super.addEventListener();
    let timeout = null;
    DomEventManager.addListener("keyup", () => {
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

    let regex = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
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
DomEventManager.addListener("component::initialize", () => {
  Search.initComponent();
});
