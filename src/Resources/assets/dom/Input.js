/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class Input {
  constructor(data) {
    this.type = data.type ?? "text";
    this.ariaLabel = data.ariaLabel ?? null;
    this.name = data.name ?? "";
    this.id = data.id ?? "";
    this.value = data.value ?? "";
    this.inputMode = data.inputMode ?? null;
    this.maxlength = data.maxlength ?? null;
    this.pattern = data.pattern ?? null;
    this.classes = data.classes ?? [];
    this.placeholder = data.placeholder ?? "";
    this.init();
  }

  init() {
    this.input = this.create();
  }

  get() {
    return this.input;
  }

  create() {
    const input = document.createElement("input");
    input.type = this.type ?? "text";
    input.name = this.name ?? "";
    input.id = this.id ?? "";
    input.value = this.value ?? "";
    this.classes.forEach((className) => input.classList.add(className));
    if(this.placeholder !== null)
    {
      input.setAttribute("placeholder", this.placeholder);
    }
    if(this.maxlength !== null)
    if(this.ariaLabel !== null)
    {
      input.setAttribute("aria-label", this.ariaLabel);
    }
    if(this.maxlength !== null)
    {
      input.setAttribute("maxlength", this.maxlength);
    }
    if(this.inputMode !== null)
    {
      input.setAttribute("inputmode", this.inputMode);
    }
    if(this.pattern !== null)
    {
      input.setAttribute("pattern", this.pattern);
    }
    return input;
  }

  valueIsValid()
  {
    return this.input.value !== "" && this.input.value.length >= this.maxlength;
  }

  valueIsNull()
  {
    return this.input.value === null || this.input.value === "";
  }

}
