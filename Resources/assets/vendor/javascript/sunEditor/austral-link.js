import dialog from 'suneditor/src/plugins/modules/dialog'
import Select from "../../../javascript/components/fields/Select";
import Switch from "../../../javascript/components/fields/Switch";
import Choice from "../../../javascript/components/fields/Choice";
import Input from "../../../javascript/components/fields/Input";

export default {
  // @Required
  // plugin name
  name: 'australLink',

  // @Required
  // data display
  display: 'dialog',

  title: 'Link',

  innerHTML: '<span class="austral-picto-link"></span>',

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core) {

    // If you are using a module, you must register the module using the "addModule" method.
    core.addModule([dialog]);

    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const context = core.context;
    context.australLink = {
      linkType: null,

      linkUrl: null, // @Override // This element has focus when the dialog is opened.
      linkChoice: null,
      linkEmail: null,
      linkPhone: null,

      textContent: null,
      linkAnchor: null,
      targetIsBlank: false,
      australLinksList: {},
      _linkUpdate: null
    };

    /** link dialog */
    let link_dialog = this.setDialog(core, context);
    let link_controller = "";
    if(link_dialog)
    {
      context.australLink.modal = link_dialog;
      link_dialog.querySelector('*[data-choice-element-value="file"]').remove();
      context.australLink.linkType = link_dialog.querySelector('.list-option-container');
      context.australLink.linkUrl = link_dialog.querySelector('*[data-popin-update-input="field-link-url"]');
      context.australLink.linkChoice = link_dialog.querySelector('*[data-popin-update-input="field-link-choice"]');
      context.australLink.linkEmail = link_dialog.querySelector('*[data-popin-update-input="field-link-email"]');
      context.australLink.linkPhone = link_dialog.querySelector('*[data-popin-update-input="field-link-phone"]');
      context.australLink.textContent = link_dialog.querySelector('*[data-popin-update-input="field-text"]');
      context.australLink.linkAnchor = link_dialog.querySelector('*[data-popin-update-input="field-anchor"]');
      context.australLink.targetIsBlank = link_dialog.querySelector('*[data-popin-update-input="field-target-blank"]');

      /** link controller */
      let link_controller = this.setController_LinkButton(core);
      context.australLink.linkController = link_controller;

      /** add event listeners */
      link_dialog.querySelector('form').addEventListener('submit', this.submit.bind(core));
      link_dialog.querySelector('.delete-link').addEventListener('click', this.submit.bind(core));
      link_controller.addEventListener('click', this.onClick_linkController.bind(core));

      /** append html */
      context.dialog.modal.appendChild(link_dialog);

      Select.initComponent();
      Switch.initComponent();
      Choice.initComponent();
      Input.initComponent();

      /** append controller */
      context.element.relative.appendChild(link_controller);
    }

    /** empty memory */
    link_dialog = null, link_controller = null;
  },

  /** dialog */
  setDialog: function (core, context) {
    if(typeof PopinTemplate !== undefined && PopinTemplate.templateByKey("linkEditor")) {
      const lang = core.lang;
      const dialog = core.util.createElement('DIV');
      dialog.className = 'se-dialog-content';
      dialog.style.display = 'none';
      dialog.innerHTML = PopinTemplate.templateByKey("linkEditor");
      return dialog;
    }
  },

  /** modify controller button */
  setController_LinkButton: function (core) {
    const lang = core.lang;
    const icons = core.icons;
    const link_btn = core.util.createElement('DIV');

    link_btn.className = 'se-controller se-controller-link';
    link_btn.innerHTML = '' +
      '<div class="se-arrow se-arrow-up"></div>' +
      '<div class="link-content"><span><a target="_blank" href=""></a>&nbsp;</span>' +
      '<div class="se-btn-group">' +
      '<button type="button" data-popin-command="update" tabindex="-1" class="se-tooltip">' +
      icons.edit +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.edit + '</span></span>' +
      '</button>' +
      '<button type="button" data-popin-command="unlink" tabindex="-1" class="se-tooltip">' +
      icons.unlink +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.unlink + '</span></span>' +
      '</button>' +
      '<button type="button" data-popin-command="delete" tabindex="-1" class="se-tooltip">' +
      icons.delete +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.remove + '</span></span>' +
      '</button>' +
      '</div>' +
      '</div>';

    return link_btn;
  },

  // @Required, @Override dialog
  // This method is called when the plugin button is clicked.
  // Open the modal window here.
  open: function () {
    // open.call(core, pluginName, isModify)
    this.plugins.dialog.open.call(this, 'australLink', 'australLink' === this.currentControllerName);
  },

  submit: function (e) {
    this.showLoading();

    e.preventDefault();
    e.stopPropagation();

    const submitAction = function () {
      const contextLink = this.context.australLink;

      let linkTypeSelected = contextLink.linkType.querySelector("input[type=radio]:checked");
      if(linkTypeSelected === undefined || !linkTypeSelected)
      {
        return false;
      }
      let url = null;
      if(linkTypeSelected.value === "internal")
      {
        url = contextLink.linkChoice.value;
        let anchor = contextLink.linkAnchor.value;
        if(anchor)
        {
          if(anchor.indexOf("#") < 0)
          {
            anchor = "#"+anchor;
          }
          url = url+anchor;
        }
      }
      else if(linkTypeSelected.value === "external")
      {
        url = contextLink.linkUrl.value;
      }
      else if(linkTypeSelected.value === "email")
      {
        url = "mailto:"+contextLink.linkEmail.value;
      }
      else if(linkTypeSelected.value === "phone")
      {
        url = "tel:"+contextLink.linkPhone.value;
      }
      let textContent = contextLink.textContent;
      textContent = textContent.value.length === 0 ? url : textContent.value;

      // When opened for modification "this.context.dialog.updateModal" is true
      if (!this.context.dialog.updateModal) {
        const oA = this.util.createElement('A');
        oA.href = url;
        oA.textContent = textContent;
        oA.target = contextLink.targetIsBlank.checked ? "_blank" : null;

        const selectedFormats = this.getSelectedElements();
        if (selectedFormats.length > 1) {
          const oFormat = this.util.createElement(selectedFormats[0].nodeName);
          oFormat.appendChild(oA);
          this.insertNode(oFormat);
        } else {
          this.insertNode(oA);
        }
        this.setRange(oA.childNodes[0], 0, oA.childNodes[0], oA.textContent.length);
      } else {
        contextLink._linkUpdate.href = url;
        contextLink._linkUpdate.textContent = textContent;
        contextLink._linkUpdate.target = contextLink.targetIsBlank.checked ? "_blank" : null;
        // set range
        this.setRange(contextLink._linkUpdate.childNodes[0], 0, contextLink._linkUpdate.childNodes[0], contextLink._linkUpdate.textContent.length);
      }
      // history stack
      this.history.push(false);
      this.plugins.australLink.init.call(this);

    }.bind(this);

    try {
      submitAction();
    } finally {
      this.plugins.dialog.close.call(this);
      this.closeLoading();
      this.focus();
    }

    return false;
  },

  // @Override core
  // Plugins with active methods load immediately when the editor loads.
  // Called each time the selection is moved.
  active: function (element) {
    if (!element) {
      if (this.controllerArray.indexOf(this.context.australLink.linkController) > -1) {
        this.controllersOff();
      }
    } else if (this.util.isAnchor(element) && element.getAttribute('data-image-link') === null) {
      if(element.closest(".sun-editor-editable"))
      {
        if (this.controllerArray.indexOf(this.context.australLink.linkController) < 0) {
          this.plugins.australLink.call_controller.call(this, element);
        }
        return true;
      }
    }
    return false;
  },

  // @Override dialog
  // This method is called just before the dialog opens.
  // If "update" argument is true, it is not a new call, but a call to modify an already created element.
  on: function (update) {
    if (!update) {
      this.plugins.australLink.init.call(this);
      this.context.australLink.textContent.value = this.getSelection().toString();
      MiscEvent.dispatch("component::choice.delete", {}, this.context.australLink.linkType);
      this.context.australLink.linkChoice.value = null;
      MiscEvent.dispatch("choice", {choice: {value: null} }, this.context.australLink.linkChoice);
    } else if (this.context.australLink._linkUpdate) {
      // "update" and "this.context.dialog.updateModal" are always the same value.
      // This code is an exception to the "link" plugin.
      this.context.dialog.updateModal = true;

      // Init context value
      this.context.australLink.linkUrl.value = '';
      this.context.australLink.linkChoice.value = '';
      this.context.australLink.linkEmail.value = '';
      this.context.australLink.linkPhone.value = '';
      this.context.australLink.linkAnchor.value = '';
      this.context.australLink.textContent.value = '';
      this.context.australLink.targetIsBlank.checked = false;

      MiscEvent.dispatch("component::choice.delete", {}, this.context.australLink.linkType);
      MiscEvent.dispatch("choice", {choice: {value: null} }, this.context.australLink.linkChoice);
      let currentHref = this.context.australLink._linkUpdate.getAttribute("href");
      let linkType = null;
      if(AustralLinks.getLinkByKey(currentHref))
      {
        linkType = "internal";
        this.context.australLink.linkChoice.value = currentHref;
        MiscEvent.dispatch("choice", {choice: {value: currentHref} }, this.context.australLink.linkChoice);
      }
      else if(currentHref.indexOf("mailto:") >= 0)
      {
        linkType = "email";
        this.context.australLink.linkEmail.value = currentHref.replace("mailto:", "");;
      }
      else if(currentHref.indexOf("tel:") >= 0)
      {
        linkType = "tel";
        this.context.australLink.linkEmail.value = currentHref.replace("tel:", "");
      }
      else if(currentHref)
      {
        linkType = "external";
        this.context.australLink.linkUrl.value = currentHref;
      }
      let linkTypeElement = this.context.australLink.linkType.querySelector("input[value="+linkType+"]");
      if(linkTypeElement)
      {
        linkTypeElement.checked = true;
        setTimeout(()=>{
          MiscEvent.dispatch("change", {}, linkTypeElement.closest(".option-element"));
        }, 50);
      }
      this.context.australLink.textContent.value = this.context.australLink._linkUpdate.textContent;
      this.context.australLink.targetIsBlank.checked = this.context.australLink._linkUpdate.target === "_blank" ;
    }
    document.body.classList.add("popin-open");
  },

  call_controller: function (selectionATag) {
    this.editLink = this.context.australLink._linkUpdate = selectionATag;
    const linkBtn = this.context.australLink.linkController;
    const link = linkBtn.querySelector('a');

    link.href = selectionATag.getAttribute("href");
    link.title = selectionATag.textContent;
    link.textContent = selectionATag.textContent;

    const offset = this.util.getOffset(selectionATag, this.context.element.wysiwygFrame);
    linkBtn.style.top = (offset.top + selectionATag.offsetHeight + 10) + 'px';
    linkBtn.style.left = (offset.left - this.context.element.wysiwygFrame.scrollLeft) + 'px';

    linkBtn.style.display = 'block';

    const overLeft = this.context.element.wysiwygFrame.offsetWidth - (linkBtn.offsetLeft + linkBtn.offsetWidth);
    if (overLeft < 0) {
      linkBtn.style.left = (linkBtn.offsetLeft + overLeft) + 'px';
      linkBtn.firstElementChild.style.left = (20 - overLeft) + 'px';
    } else {
      linkBtn.firstElementChild.style.left = '20px';
    }

    // Show controller at editor area (controller elements, function, "controller target element(@Required)", "controller name(@Required)", etc..)
    this.controllersOn(linkBtn, selectionATag, 'australLink');
  },

  onClick_linkController: function (e) {
    e.stopPropagation();

    const command = e.target.getAttribute('data-popin-command');
    if (!command) return;

    e.preventDefault();

    if (/update/.test(command)) {
      const contextLink = this.context.australLink;

      let currentHref = contextLink._linkUpdate.getAttribute("href");
      let linkType = null;
      if(AustralLinks.getLinkByKey(currentHref))
      {
        linkType = "internal";
        contextLink.linkChoice.value = currentHref;
      }
      else if(currentHref.indexOf("mailto:") >= 0)
      {
        linkType = "email";
        contextLink.linkEmail.value = currentHref.replace("mailto:", "");;
      }
      else if(currentHref.indexOf("tel:") >= 0)
      {
        linkType = "tel";
        contextLink.linkEmail.value = currentHref.replace("tel:", "");
      }
      else if(currentHref)
      {
        linkType = "external";
        contextLink.linkUrl.value = currentHref;
      }
      contextLink.targetIsBlank.value = contextLink._linkUpdate.target === "_blank" ;
      let linkTypeElement = contextLink.linkType.querySelector("input[value="+linkType+"]");
      if(linkTypeElement)
      {
        linkTypeElement.checked = true;
        MiscEvent.dispatch("change", {}, linkTypeElement);
      }
      this.plugins.dialog.open.call(this, 'australLink', true);
    }
    else if (/unlink/.test(command)) {
      const sc = this.util.getChildElement(this.context.australLink._linkUpdate, function (current) { return current.childNodes.length === 0 || current.nodeType === 3; }, false);
      const ec = this.util.getChildElement(this.context.australLink._linkUpdate, function (current) { return current.childNodes.length === 0 || current.nodeType === 3; }, true);
      this.setRange(sc, 0, ec, ec.textContent.length);
      this.nodeChange(null, null, ['A'], false);
    }
    else {
      /** delete */
      this.util.removeItem(this.context.australLink._linkUpdate);
      this.context.australLink._linkUpdate = null;
      this.focus();
      // history stack
      this.history.push(false);
    }

    this.controllersOff();
  },

  // @Required, @Override dialog
  // This method is called when the dialog window is closed.
  // Initialize the properties.
  init: function () {
    document.body.classList.remove("popin-open");
    const contextLink = this.context.australLink;
    contextLink.linkController.style.display = 'none';
    contextLink._linkUpdate = null;

    contextLink.linkUrl.value = '';
    contextLink.linkChoice.value = '';
    contextLink.linkEmail.value = '';
    contextLink.linkPhone.value = '';
    contextLink.linkAnchor.value = '';
    contextLink.textContent.value = '';
    contextLink.targetIsBlank.checked = false;

  },

};