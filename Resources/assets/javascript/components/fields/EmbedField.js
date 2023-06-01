import abstractField from "./abstract";
import { v4 as uuidv4 } from "uuid";
import Components from "../Components";

export default class EmbedField  extends abstractField {


  static initComponent() {
    super.initComponent("collection-embed");
  }

  create(element) {
    this.lastTemplateAdd = null;
    super.create(element);
    if(this.element.dataset.collectionEmbedFieldsTemplate)
    {
      this.fieldsTemplate = JSON.parse(this.element.dataset.collectionEmbedFieldsTemplate);
    }
    else
    {
      this.fieldsTemplate = JSON.parse(this.element.closest("*[data-collection-embed-fields-template]").dataset.collectionEmbedFieldsTemplate);
    }

    this.childrenParameters = {
      min: null,
      max: null
    }
    if(this.element.dataset.collectionEmbedChildrenParameters)
    {
      this.childrenParameters = JSON.parse(this.element.dataset.collectionEmbedChildrenParameters);
    }

    MiscEvent.addListener("component::embed.add", (event) => {
      this.addNewTemplate(event.detail.button);
    }, this.element);

    MiscEvent.addListener("component::embed.childrenParameterCheck", (event) => {
      this.checkChildrenParameter();
    }, this.element);

    if(this.element.children[0].classList.contains("collections-add-content"))
    {
      [].forEach.call(this.element.children[0].querySelectorAll(".add-new-collection-embed"), (button) => {
        button.addEventListener("click", (e) => {
          MiscEvent.dispatch("component::embed.add", {"button": button}, this.element);
        });
      });
    }
    else
    {
      [].forEach.call(this.element.children[0].children[0].querySelectorAll(".add-new-collection-embed"), (button) => {
        button.addEventListener("click", (e) => {
          MiscEvent.dispatch("component::embed.add", {"button": button}, this.element);
        });
      });
    }

    if(this.element.classList.contains("component-file-children") && this.hasOneTemplate())
    {
      var buttonAddChildren = this.element.querySelector(".add-new-collection-embed");

      MiscEvent.addListener(["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"], (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, buttonAddChildren);

      MiscEvent.addListener(["dragstart", "dragover", "dragenter"], (e) => {
        if(e.dataTransfer.types.includes("Files")) {
          this.element.classList.add('is-dragover');
        }
      }, buttonAddChildren);

      MiscEvent.addListener(["dragleave", "dragend"], (e) => {
        this.element.classList.remove('is-dragover');
      }, buttonAddChildren);

      MiscEvent.addListener("drop", (e) => {
        this.element.classList.remove('is-dragover');
        if(e.dataTransfer.types.includes("Files")) {
          if(e.dataTransfer.files.length > 1)
          {
            if(this.hasOneTemplate())
            {
              for(let i = 0; i < e.dataTransfer.files.length; i++) {
                MiscEvent.dispatch("component::embed.add", {button: buttonAddChildren}, this.element);
                var uploadFileElement = this.lastTemplateAdd.querySelector("*[data-upload-file]");
                if(uploadFileElement)
                {
                  MiscEvent.dispatch("component::upload.change", {"file": e.dataTransfer.files.item(i)}, uploadFileElement);
                }
              }
            }
          }
        }
      }, buttonAddChildren);

    }

    this.betweenInsert = false;
    this.initActions(this.element);

    if(this.childrenParameters.min > 0)
    {
      for(let i = 0; i < this.childrenParameters.min; i++)
      {
        if(this.element.children[0].classList.contains("collections-add-content"))
        {
          [].forEach.call(this.element.children[0].querySelectorAll(".add-new-collection-embed"), (button) => {
            MiscEvent.dispatch("component::embed.add", {"button": button}, this.element);
          });
        }
        else
        {
          [].forEach.call(this.element.children[0].children[0].querySelectorAll(".add-new-collection-embed"), (button) => {
            MiscEvent.dispatch("component::embed.add", {"button": button}, this.element);
          });
        }
      }
    }

  }

  addEventListener() {
    super.addEventListener();
    MiscEvent.addListener("component::close.finish", (event) => {
      this.betweenInsert = false;
      if(event.detail.elementClick !== undefined && event.detail.elementClick) {
        if(event.detail.elementClick.classList.contains('between-insert'))
        {
          this.betweenInsert = event.detail.elementClick;
        }
      }
    }, this.element);

  }

  initActions(element)
  {
    this.initComponentParametersButton(element);
  }

  initComponentParametersButton(element) {
    [].forEach.call(element.querySelectorAll("*[data-component-parameters-button]"), (button) => {
      button.addEventListener("click", () => {
        var contentComponentParameters = button.parentNode.parentNode.querySelector('.group-parameters-fields-container');
        if(button.classList.contains("is-open"))
        {
          button.classList.remove("is-open");
          contentComponentParameters.style.height = "0px";
        }
        else
        {
          button.classList.add("is-open");
          contentComponentParameters.style.height = contentComponentParameters.querySelector(".group-fields-content").clientHeight+"px";
        }
      });
    });
  }

  checkChildrenParameter()
  {
    if(this.childrenParameters.max > 0)
    {
      if((this.element.children[0].children.length-1) >= this.childrenParameters.max)
      {
        if(this.element.children[0].classList.contains("collections-add-content"))
        {
          [].forEach.call(this.element.children[0].querySelectorAll(".add-new-collection-embed"), (button) => {
            button.style.display = "none";
          });
        }
        else
        {
          [].forEach.call(this.element.children[0].children[0].querySelectorAll(".add-new-collection-embed"), (button) => {
            button.style.display = "none";
          });
        }
      }
      else
      {
        if(this.element.children[0].classList.contains("collections-add-content"))
        {
          [].forEach.call(this.element.children[0].querySelectorAll(".add-new-collection-embed"), (button) => {
            button.style.display = "block";
          });
        }
        else
        {
          [].forEach.call(this.element.children[0].children[0].querySelectorAll(".add-new-collection-embed"), (button) => {
            button.style.display = "block";
          });
        }
      }
    }


    if(this.childrenParameters.min > 0)
    {
      if((this.element.children[0].children.length-1) <= this.childrenParameters.min)
      {
        [].forEach.call(this.element.children[0].children, (children) => {
          let deleteContent = children.querySelector(".hover .collection-embed-form .delete-content");
          if(deleteContent)
          {
            deleteContent.style.display = "none";
          }
        });
      }
      else
      {
        [].forEach.call(this.element.children[0].children, (children) => {
          let deleteContent = children.querySelector(".hover .collection-embed-form .delete-content");
          if(deleteContent)
          {
            deleteContent.style.display = "block";
          }
        });
      }
    }

  }

  hasOneTemplate()
  {
    return Object.keys(this.fieldsTemplate).length === 1;
  }

  addNewTemplate(button) {
    var templateName = button.dataset.collectionEmbedChoiceType;
    var collectionParentId = button.dataset.collectionParentId ?? "";
    var collectionEmbedAppend = this.element.querySelector(button.dataset.collectionEmbedAppend);
    if(this.fieldsTemplate[templateName] !== undefined)
    {
      var template = this.fieldsTemplate[templateName] ;
      var regex = null;
      if(collectionEmbedAppend.dataset.replaceId)
      {
        regex = new RegExp(collectionEmbedAppend.dataset.replaceId, 'g');
      }
      else
      {
        regex = new RegExp("__name__", 'g');
      }
      var uuid = uuidv4();
      var matches = template.match(/data-replace-id="(\w+)"/);
      template = template.replace(regex, uuid);
      template = template.replace(/__parentId__/g, collectionParentId);
      if(matches)
      {
        template = template.replace('data-replace-id="'+uuid+'"', matches[0]);
      }

      var color = this.betweenInsert ? this.betweenInsert.closest("*[data-color]").dataset.color : this.element.closest("*[data-color]").dataset.color;
      if(!color) {
        color = 1;
      }
      color = (parseFloat(color)+1);
      if(color > 6) {
        color = 1;
      }
      template = template.replace(/__COLOR__/g, color);
      var parser = new DOMParser();
      var templateParser = parser.parseFromString(template, "text/html");
      templateParser.body.firstChild.classList.add("add-new-embed-template");
      if(this.betweenInsert)
      {
        this.betweenInsert.parentNode.parentNode.insertBefore(templateParser.body.firstChild, this.betweenInsert.parentNode);
        this.betweenInsert = false;
      }
      else
      {
        collectionEmbedAppend.append(templateParser.body.firstChild);
      }

      if(collectionEmbedAppend.closest("*[data-sortable]"))
      {
        MiscEvent.dispatch("component::sortable.refresh", {}, collectionEmbedAppend.closest("*[data-sortable]"));
      }

      this.lastTemplateAdd = collectionEmbedAppend.querySelector(".add-new-embed-template");
      this.lastTemplateAdd.classList.remove("add-new-embed-template");
      [].forEach.call(this.element.querySelectorAll(".init-form"), (el) => {
        this.initActions(el);
      });
      Components.loadComponent();
      MiscEvent.dispatch("component::embed.childrenParameterCheck", {}, this.element);
    }
  }

}