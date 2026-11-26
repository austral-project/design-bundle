/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { abstractField, DomEventManager, Debug, utils } from "@austral/design";
import {v4 as uuidv4} from "uuid";

export default class Collection extends abstractField {

  static initComponent() {
    super.initComponent("collection", () => {
    });
  }

  create(element) {
    super.create(element);

    this.collectionParameters = Object.assign({
      templates: {},
      keyname: null
    }, JSON.parse(this.element.getAttribute("data-collection")));



    this.container = this.element.querySelector("*[data-collection-container='"+this.collectionParameters.keyname+"']");
    this.buttons = this.element.querySelectorAll("*[data-collection-add='"+this.collectionParameters.keyname+"']");


    for (const child of this.container.children) {
      this.listenerEmbed(child);
    }

    this.buttons.forEach((button)=>{
      DomEventManager.addListener("click", () => {
        this.elementAdd(button.getAttribute("data-collection-add"));
      }, button);
    });

    DomEventManager.addListener("collection::remove-by-input", (event) => {
      event.detail.element.remove();
    }, this.element);
  }

  checkButtonHide()
  {
    this.buttons.forEach((button)=>{
      if(button.parentElement.classList.contains("toggle-view"))
      {
        if(this.container.children.length > 0)
        {
          button.parentElement.classList.remove("hide");
        }
        else
        {
          button.parentElement.classList.add("hide");
        }
      }
    });

  }

  elementAdd(templateName = null) {

    if(templateName &&this.collectionParameters.templates[templateName] !== undefined ) {
      const objectId  = uuidv4();
      let template     = this.collectionParameters.templates[templateName].replace(/__name__/g, objectId);

      let regex = new RegExp("__FIELD_KEYNAME__", 'g');
      template = template.replace(regex, "other-"+utils.string.generateRandomString(4));

      const parsed = new DOMParser().parseFromString(template, "text/html");
      parsed.querySelector("*[data-embed-id]").setAttribute("data-embed-id", objectId);

      this.container.append(parsed.body.firstChild);
      this.checkButtonHide();

      let embed = this.container.querySelector("*[data-embed-id='"+objectId+"']");
      if(embed)
      {
        this.listenerEmbed(embed);
      }
      DomEventManager.dispatch("components::load");
    }
  }

  /**
   * Removes the entry when one of its [data-delete] buttons is clicked (the former admin component "delete" of 3.1).
   * "component::delete" is dispatched on the container of the entries before the removal.
   *
   * @param {Element} embed - The entry of the collection.
   * @return {void}
   */
  listenerEmbed(embed)
  {
    let deleteButtons = embed.querySelectorAll("*[data-delete]");
    deleteButtons.forEach((button)=>{
      DomEventManager.addListener("click", (event) => {
        event.preventDefault();
        DomEventManager.dispatch("component::delete", {element: button, embed: embed}, embed.parentNode);
        embed.remove();
        this.checkButtonHide();
      }, button);
    });
  }

}
DomEventManager.addListener("component::initialize", () => {
  Collection.initComponent();
});
