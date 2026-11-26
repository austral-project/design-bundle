/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { DomEventManager, IconRegistry } from "@austral/design";

export default class Button {
  constructor(data) {
    this.classes = data.classes ?? [];
    this.attr = data.attr ?? [];
    this.type = data.type ?? "button";
    this.ariaLabel = data.ariaLabel ?? null;
    this.title = data.title ?? "";
    this.entitled = data.entitled ?? "";
    this.theme = data.theme ?? "ghost";
    this.color = data.color ?? "primary";
    this.size = data.size ?? "sm";
    this.onClick = data.onClick ?? null;
    this.pictoLeftName = data.pictoLeftName ?? null;
    this.pictoRightName = data.pictoRightName ?? null;
    this.init();
  }

  init() {
    this.button = this.create();
  }

  get() {
    return this.button;
  }

  create() {
    const button = document.createElement("button");
    button.type = this.type ?? "button";
    button.classList.add("button");
    button.classList.add("theme-"+this.theme);
    button.classList.add("color-"+this.color);
    button.classList.add("size-"+this.size);
    this.classes.forEach((className) => button.classList.add(className));

    this.attr.forEach((attr) => {
      button.setAttribute(attr.name, attr.value);
    });

    if(this.ariaLabel)
    {
      button.setAttribute("aria-label", this.ariaLabel);
    }
    if(this.title)
    {
      button.setAttribute("title", this.title);
    }

    if(this.onClick !== null && typeof this.onClick === "function")
    {
      DomEventManager.addListener("click", (event)=>{
        event.stopPropagation();
        this.onClick();
      }, button);
    }

    const buttonContent = document.createElement("span");
    buttonContent.classList.add("button-content");

    const masterContent = document.createElement("span");
    masterContent.classList.add("master-content");

    if(this.pictoLeftName)
    {
      const pictoLeftContent = IconRegistry.get(this.pictoLeftName)?.source;
      if(pictoLeftContent)
      {
        const pictoLeft = document.createElement("span");
        pictoLeft.classList.add("picto");
        pictoLeft.classList.add("stroke");
        pictoLeft.innerHTML = pictoLeftContent;
        masterContent.appendChild(pictoLeft);
      }
    }
    if(this.entitled)
    {
      const entitled = document.createElement("span");
      entitled.classList.add("entitled");
      entitled.textContent = this.entitled;
      masterContent.appendChild(entitled);
    }
    else
    {
      button.classList.add("hide-entitled");
    }
    buttonContent.appendChild(masterContent);

    if(this.pictoRightName)
    {
      const pictoRightContent = IconRegistry.get(this.pictoRightName)?.source;
      if(pictoRightContent)
      {
        const additionalContent = document.createElement("span");
        additionalContent.classList.add("additional-content");

        const pictoRight = document.createElement("span");
        pictoRight.classList.add("picto");
        pictoRight.classList.add("stroke");
        pictoRight.innerHTML = pictoRightContent;
        additionalContent.appendChild(pictoRight);
        buttonContent.appendChild(additionalContent);
      }

    }

    button.appendChild(buttonContent);

    return button;
  }
}
