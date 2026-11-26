/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DomEventManager from "@austral/design/core/events";
import {Config, Loader} from "@austral/design/index";

class DebugClass  {

  constructor() {
    this.enabled = __DEBUG__;
    this.enabledContext = __DEBUG_CONTEXT__;
  }


  setEnabled(value) {
    this.enabled = value;
    Debug.log("Debug activé !");
  }

  setEnabledContext(value) {
    this.enabledContext = value;
    Debug.log("Debug context activé !");
  }

  /**
   * Logs all provided arguments to the console.
   *
   * @param {...*}  - One or more arguments to be logged to the console.
   * @return {void} This method does not return a value.
   */
  log() {
    if (!this.enabled) return;

    let context = null;
    if(this.enabledContext) {
      let stack = new Error().stack.split('\n')[2];
      context = stack ? stack.trim() : '';
      console.log('%c' + "----------------", 'color:#888;font-weight:bold');
      console.log('%c' + context, 'color:#888;font-weight:bold');
    }

    for(var i = 0; i < arguments.length; i++ )
    {
      console.log(arguments[i]);
    }
  }

  /**
   * Initiates a new console group, collapsing the output by default, to organize console messages
   * under the specified group name. If no group name is provided, an unnamed group is started.
   *
   * @param {string|null} [groupName=null] - The name of the console group to be started. Can be null to create an unnamed group.
   * @return {void} This method does not return any value.
   */
  startGroup(groupName = null) {
    if (!this.enabled) return;

    let context = null;
    if(this.enabledContext) {
      let stack = new Error().stack.split('\n')[2];
      context = stack ? stack.trim() : '';
      console.log('%c' + "----------------", 'color:#888;font-weight:bold');
      console.log('%c' + context, 'color:#888;font-weight:bold');
    }

    console.groupCollapsed(groupName)
  }

  /**
   * Ends the most recently started group in the console output, if any.
   * It is used to exit out of a group created by console.group().
   *
   * @return {void} Does not return a value.
   */
  stopGroup() {
    if (!this.enabled) return;
    console.groupEnd();
  }

  /**
   * Creates a visual debug grid overlay and allows toggling its visibility using keyboard shortcuts.
   * This method dynamically generates a debug grid structure with 12 columns and appends it to the document body.
   * The keyboard shortcut Shift+G toggles the visibility of the grid, and aligns it with a flex debugger, if present.
   *
   * @return {void} This method does not return a value.
   */
  debugGridCol() {
    if (!this.enabled) return;
    let gridContainer = document.createElement("div");
    gridContainer.classList.add("grid--container");
    gridContainer.classList.add("container");
    gridContainer.classList.add("col-auto-column");
    for(let i=0; i<12; i++)
    {
      gridContainer.innerHTML += `<div class="grid--col color grid--col-xs-1 grid--col-offset-xs-${i}"></div>`;
    }

    let container = document.createElement("div");
    container.classList.add("container-width");
    container.classList.add("container-margin-auto");
    container.classList.add("container-padding");
    container.append(gridContainer);


    let template = document.createElement("div");
    template.classList.add("grid--debugger");
    template.append(container);
    document.body.append(template);

    DomEventManager.addListener("keydown", (event) => {
      let flexDebugger = document.querySelector(".flex--debugger");
      if(event.shiftKey && event.key.toUpperCase() === "G") {
        if(template.classList.contains("view")) {
          template.classList.remove("view");
          template.classList.remove("middle");
          flexDebugger.classList.remove("middle");
        }
        else {
          template.classList.add("view");
          if(flexDebugger.classList.contains("view"))
          {
            template.classList.add("middle");
            flexDebugger.classList.add("middle");
          }
        }
      }
    });

  }

  /**
   * Creates and injects a debugging tool for visualizing a flexible column-based layout into the document body.
   * The method generates a grid structure with a 12-column layout and sets up event listeners for toggling visibility and positioning.
   * The keyboard shortcut Shift+A toggles the visibility of the grid, and aligns it with a flex debugger, if present.
   *
   * @return {void} Does not return any value. The method directly manipulates the DOM to add the debugging tool.
   */
  debugFlexCol() {
    if (!this.enabled) return;
    let rowContainer = document.createElement("div");
    rowContainer.classList.add("row");
    for(let i=0; i<12; i++)
    {
      rowContainer.innerHTML += `<div class="col col--xs-1"><div class="color"></div></div>`;
    }
    let gridContainer = document.createElement("div");
    gridContainer.classList.add("grid");
    gridContainer.classList.add("container");
    gridContainer.append(rowContainer);

    let container = document.createElement("div");
    container.classList.add("container-width");
    container.classList.add("container-margin-auto");
    container.classList.add("container-padding");
    container.append(gridContainer);


    let template = document.createElement("div");
    template.classList.add("flex--debugger");
    template.append(container);
    document.body.append(template);

    DomEventManager.addListener("keydown", (event) => {
      let gridDebugger = document.querySelector(".grid--debugger");
      if(event.shiftKey && event.key.toUpperCase() === "A") {
        if(template.classList.contains("view")) {
          template.classList.remove("view");
          template.classList.remove("middle");
          gridDebugger.classList.remove("middle");
        }
        else {
          template.classList.add("view");
          if(gridDebugger.classList.contains("view"))
          {
            template.classList.add("middle");
            gridDebugger.classList.add("middle");
          }
        }
      }
    });
  }
}
const Debug = new DebugClass();
if (typeof window !== 'undefined') {
  window.Debug = Debug;
}
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug-js') === '1' || urlParams.get('debug-js') === 'true' || urlParams.get('debug-js') === '') {
    Debug.setEnabled(true);
  }
}
export default Debug;
