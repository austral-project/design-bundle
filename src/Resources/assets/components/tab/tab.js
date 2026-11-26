/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Debug, DomEventManager } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

/**
 * Tabs.
 *
 *   <div data-tabs="">
 *     <button type="button" data-tab-choice="general">General</button>
 *     <button type="button" data-tab-choice="seo">SEO</button>
 *     <div data-tab="general" class="open">…</div>
 *     <div data-tab="seo">…</div>
 *   </div>
 *
 * The roles tablist / tab / tabpanel and aria-selected are set; the arrows, Home and End move between the tabs.
 * Events: component::action.open {tabId} / component::action.close {tabId} (on the element),
 * component::open.finish / component::close.finish.
 */
export default class Tab extends abstractComponent {

  static initComponent() {
    super.initComponent("tabs");
  }

  create() {
    this.tabs = {};
    this.choices = [...this.element.querySelectorAll("*[data-tab-choice]")];
    this.element.querySelectorAll("*[data-tab]").forEach((tab) => {
      this.tabs[tab.dataset.tab] = tab;
    });

    this.choices[0]?.parentElement?.setAttribute("role", "tablist");
    const current = Object.values(this.tabs).find((tab) => tab.classList.contains("open"))?.dataset.tab ?? this.choices[0]?.dataset.tabChoice;
    this.choices.forEach((choice) => {
      const tabId = choice.dataset.tabChoice;
      const panel = this.tabs[tabId];
      choice.setAttribute("role", "tab");
      if (!choice.id) {
        choice.id = "tab-" + this.uuid + "-" + tabId;
      }
      if (panel) {
        if (!panel.id) {
          panel.id = "tabpanel-" + this.uuid + "-" + tabId;
        }
        choice.setAttribute("aria-controls", panel.id);
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", choice.id);
      }
    });
    if (current) {
      this.select(current);
    }
  }

  addEventListener() {
    super.addEventListener();
    DomEventManager.addListener("component::action.open", (event) => this.select(event.detail.tabId), this.element);
    DomEventManager.addListener("component::action.close", (event) => this.close(event.detail.tabId), this.element);
    this.choices.forEach((choice, index) => {
      DomEventManager.addListener("click", (event) => {
        event.preventDefault();
        this.select(choice.dataset.tabChoice);
      }, choice);
      choice.addEventListener("keydown", (event) => {
        const last = this.choices.length - 1;
        const next = {ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: last}[event.key];
        if (next === undefined) {
          return;
        }
        event.preventDefault();
        const target = this.choices[(next + last + 1) % (last + 1)];
        this.select(target.dataset.tabChoice);
        target.focus();
      });
    });
  }

  /**
   * Opens a tab and closes the others.
   *
   * @param {string} tabId
   * @return {void}
   */
  select(tabId) {
    if (!this.tabs[tabId]) {
      return;
    }
    Object.keys(this.tabs).forEach((id) => {
      if (id !== tabId) {
        this.close(id);
      }
    });
    this.open(tabId);
  }

  /**
   * @param {string} tabId
   * @return {void}
   */
  open(tabId) {
    Debug.log("-- -- Component - Open : " + this.componentName + " -> " + this.uuid);
    this.tabs[tabId]?.classList.add("open");
    this.tabs[tabId]?.removeAttribute("hidden");
    this.setChoiceState(tabId, true);
    DomEventManager.dispatch("component::open.finish", {"componentName": this.componentName, "component": this, "tabId": tabId});
  }

  /**
   * @param {string} tabId
   * @return {void}
   */
  close(tabId) {
    if (!this.tabs[tabId]) {
      return;
    }
    Debug.log("-- -- Component - Close : " + this.componentName + " -> " + this.uuid);
    this.tabs[tabId].classList.remove("open");
    this.tabs[tabId].setAttribute("hidden", "");
    this.setChoiceState(tabId, false);
    DomEventManager.dispatch("component::close.finish", {"componentName": this.componentName, "component": this, "tabId": tabId});
  }

  /**
   * @param {string} tabId
   * @param {boolean} open
   * @return {void}
   */
  setChoiceState(tabId, open) {
    this.choices.filter((choice) => choice.dataset.tabChoice === tabId).forEach((choice) => {
      choice.classList.toggle("is-open", open);
      choice.setAttribute("aria-selected", open ? "true" : "false");
      choice.setAttribute("tabindex", open ? "0" : "-1");
    });
  }
}
DomEventManager.addListener("component::initialize", () => {
  Tab.initComponent();
});
