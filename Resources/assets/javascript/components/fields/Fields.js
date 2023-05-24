import {v4 as uuidv4} from "uuid";
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/src/tagify.scss';

import ColorPicker from "./ColorPicker";
import ClockPicker from "./ClockPicker";
import Password from "./Password";
import Select from "./Select";
import Switch from "./Switch";
import DatePicker from "./DatePicker";
import Textarea from "./Textarea";
import UploadFile from "./UploadFile";
import EmbedField from "./EmbedField";
import Choice from "./Choice";
import Input from "./Input";

export default class Fields {
  static initComponent() {
    ColorPicker.initComponent();
    ClockPicker.initComponent();
    DatePicker.initComponent();

    Password.initComponent();
    Select.initComponent();
    Switch.initComponent();
    Choice.initComponent();
    EmbedField.initComponent();

    Textarea.initComponent();
    UploadFile.initComponent();

    Input.initComponent();
  }

  static initFields() {
    Debug.startGroup("Fields");

    if(document.querySelectorAll(".field-content.is-error").length > 0)
    {
      let scrollY = document.querySelectorAll(".field-content.is-error")[0].getBoundingClientRect().top + window.scrollY - 200;
      setTimeout(()=>{
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: 'smooth'
        });
      }, 10);
    }

    [].forEach.call(document.querySelectorAll("*[data-austral-tag]"), (field) => {
      if(field.dataset.componentUuid === undefined)
      {
        var tagify = new Tagify(field, {
          //  mixTagsInterpolator: ["{{", "}}"],
          mode: 'mix',  // <--  Enable mixed-content
          duplicates: true,
          pattern: /\%/,  // <--  Text starting with @ or # (if single, String can be used here)
          tagTextProp: 'text',  // <-- the default property (from whitelist item) for the text to be rendered in a tag element.
          whitelist: AustralVars.getVars().map(function(item){
            return { title: item.name, value: item.value, editable: false }
          }),
          enforceWhitelist: true,
          templates: {
            tag(tagData, tagify) {
              return `<tag title="${(tagData.title || tagData.value)}"
                contenteditable='false'
                spellcheck='false'
                tabIndex="${this.settings.a11y.focusableTags ? 0 : -1}"
                class="${this.settings.classNames.tag} ${tagData.class ? tagData.class : ""}"
                ${this.getAttributes(tagData)}>
              <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>
              <div>
                  <span class="${this.settings.classNames.tagText}">%${tagData.value}%</span>
              </div>
            </tag> `;
            },
            dropdownItem(tagData) {
              return `<div ${this.getAttributes(tagData)}
              class='tagify__dropdown__item ${tagData.class ? tagData.class : ""}'
              tabindex="0"
              role="option">
              <strong>${tagData.title}</strong>
              <span>${tagData.value}</span>
            </div>`;
            }
          },
          searchKeys: ['title'],
          dropdown : {
            maxItems: Infinity,
            searchKeys: ['title', "value"],
            enabled: 0,
            position: 'text', // <-- render the suggestions list next to the typed text ("caret")
            mapValueTo: 'text', // <-- similar to above "tagTextProp" setting, but for the dropdown items
            highlightFirst: true  // automatically highlights first sugegstion item in the dropdown
          },
          callbacks: {
            "keydown": (e) => {
              MiscEvent.dispatch("component::form.change", { field: tagify, key: field.getAttribute("id"), change: true}, field.closest("form"));
            }
          }
        });
        let uuid = uuidv4();
        Austral.Config.addComponent("tagify", uuid, tagify);
        field.dataset.componentUuid = uuid;
      }
    });


    [].forEach.call(document.querySelectorAll(".field-content > .field:not([data-field-init])"), ( field ) => {
      field.setAttribute("data-field-init", true);
      let fieldContent = field.closest(".field-content");
      let animateField = false;
      if(fieldContent)
      {
        animateField = fieldContent.classList.contains('animate');
        MiscEvent.addListener('mouseenter', () => {
          field.classList.add("hover");
        }, field);
        MiscEvent.addListener('mouseleave', () => {
          field.classList.remove("hover");
        }, field);
      }
      field.querySelectorAll("input, select, textarea").forEach((input) => {

        if(field.tagName === "SELECT") {
          if(field.parentNode.querySelector(".choices__list--multiple")) {
            if(field.parentNode.querySelectorAll(".choices__list--multiple .choices__item").length > 0) {
              fieldContent.classList.add('active');
            }
          }
          else if(field.parentNode.querySelector(".choices__list--single")) {
            if(field.parentNode.querySelector(".choices__list .choices__item").dataset.value) {
              fieldContent.classList.add('active');
            }
          }
        }
        else {
          if(input.value) {
            fieldContent.classList.add('active');
          }
        }

        MiscEvent.addListener('focus', () => {
          field.classList.add("focus");
          if(animateField) {
            fieldContent.classList.add('active');
          }
        }, input);

        MiscEvent.addListener('blur', () => {
          field.classList.remove("focus");
          if(animateField) {
            if(input.tagName === "SELECT" || input.classList.contains("choices__input")) {
              if(input.parentNode.querySelector(".choices__list--multiple")) {
                if(input.parentNode.querySelectorAll(".choices__list--multiple .choices__item").length === 0) {
                  fieldContent.classList.remove('active');
                }
              }
              else if(input.parentNode.querySelector(".choices__list--single")) {
                if(!input.parentNode.querySelector(".choices__list .choices__item").dataset.value) {
                  fieldContent.classList.remove('active');
                }
              }
            }
            else {
              if(!input.value) {
                fieldContent.classList.remove('active');
              }
            }
          }
        }, input);

        MiscEvent.addListener(['change', "keyup"], () => {
          if(input.tagName === "SELECT") {
            if(input.parentNode.querySelector(".choices__list--multiple")) {
              if(input.parentNode.querySelectorAll(".choices__list--multiple .choices__item").length > 0) {
                fieldContent.classList.add('active');
              }
              else {
                fieldContent.classList.remove('active');
              }
            }
            else if(input.parentNode.querySelector(".choices__list--single")) {
              if(input.parentNode.querySelector(".choices__list .choices__item").dataset.value) {
                fieldContent.classList.add('active');
              }
              else {
                fieldContent.classList.remove('active');
              }
            }
          }
          else {
            if(input.value) {
              fieldContent.classList.add('active');
            }
            else {
              fieldContent.classList.remove('active');
            }
          }
        }, input);

        if(input.disabled === true) {
          field.classList.add("disabled");
        }

      });
    });

    this.initComponent();
    Debug.stopGroup();
  }

}