/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class ElementHtml {

  constructor(data) {
    this.tag = data.tag ?? "div";
    this.classes = data.classes ?? [];
    this.children = data.children ?? [];
    this.attributes = data.attributes ?? {};
    this.content = data.content ?? null;
    this.init();
  }

  init() {
    this.elementHtml = this.create();
  }

  get() {
    return this.elementHtml;
  }

  create() {
    const elementHtml = document.createElement(this.tag);

    this.classes.forEach((className) => {
      elementHtml.classList.add(className);
    });

    for (const [key, value] of Object.entries(this.attributes)) {
      elementHtml.setAttribute(key, "" + value);
    }

    if (this.content !== null && this.content !== "") {
      elementHtml.innerHTML = this.content;
    }

    /** @param {Node} child */
    this.children.forEach((child) => {
      elementHtml.appendChild(child);
    });

    return elementHtml;
  }

}
