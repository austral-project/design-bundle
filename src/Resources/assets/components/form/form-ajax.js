/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


import {
  abstractComponent,
  DomEventManager,
  LibLoader,
  utils,
  Request,
  Response,
  Config,
  Debug
} from "@austral/design";
import gsap from "gsap";

export default class FormAjax extends abstractComponent {

  static initComponent() {
    super.initComponent("form-ajax");
  }

  create(element) {
    super.create(element);

    this.request = new Request(
      this.element.getAttribute("action"),
      "POST",
      []
    );
    this.request.setForm(this.element);
    this.modal = this.element.closest("*[data-modal]");
    this.modalComponent = this.modal ? Config.getComponentByElement("modal", this.modal) : null;
  }

  addEventListener()
  {

    DomEventManager.addListener('submit', (event)=>{
      event.preventDefault();
      event.stopPropagation();

      DomEventManager.dispatch("page::load");
      let buttonClick = event.detail !== undefined && event.detail.buttonClick !== undefined ? event.detail.buttonClick : null;
      if(buttonClick === null && event.submitter)
      {
        buttonClick = event.submitter;
      }
      if(buttonClick)
      {
        buttonClick.classList.add("load");
      }
      this.request.execute((fetchResponse)=>{
        fetchResponse.json().then(async (json) => {
          if(json.status === "success")
          {
            if(json.templateHtml) {
              let parser = new DOMParser();
              let templateHtml = parser.parseFromString(json.templateHtml, "text/html");
              if(this.modalComponent)
              {
                this.modalComponent.innerHtml(templateHtml.body.innerHTML, buttonClick);
              }
            }

            if(json.refresh !== undefined)
            {
              json.refresh.refreshElements = json.refresh.refreshElements !== undefined ? json.refresh.refreshElements : ["body"];

              if(json.refresh.url !== undefined)
              {
                let request = new Request(
                  json.refresh.url,
                  json.refresh.method !== undefined ? json.refresh.method : "GET",
                  []
                );

                let response = new Response( json.refresh.replaceState ?? false,
                  json.refresh.pushHistory ?? false,
                  json.refresh.refreshDom ?? false,
                  json.refresh.refreshElements
                );
                await request.execute(response);
              }
              else if(json.refresh.templateHtml !== undefined)
              {
                let parser = new DOMParser();
                let templateHtml = parser.parseFromString(json.refresh.templateHtml, "text/html");
                json.refresh.refreshElements.forEach((element) => {
                  if(document.body.querySelector(element) && templateHtml.querySelector(element))
                  {
                    document.body.querySelector(element).innerHTML = templateHtml.querySelector(element).innerHTML;
                  }
                });
              }
              DomEventManager.dispatch("components::load");
              DomEventManager.dispatch("reload-trigger::load");
            }

            if(json.events !== undefined)
            {
              json.events.forEach((event)=>{
                if(event.name !== undefined)
                {
                  DomEventManager.dispatch(event.name, event.values !== undefined ? event.values : {});
                }
              });
            }

            if(json.modalClose !== undefined && json.modalClose === true && this.modalComponent)
            {
              setTimeout(()=>{
                this.modalComponent.close();
              }, 200);
            }
          }
          document.body.classList.remove("load");
          if(buttonClick)
          {
            buttonClick.classList.remove("load");
          }
        });
      });

    }, this.element);
  }


}



DomEventManager.addListener("component::initialize", () => {
  FormAjax.initComponent();
});
