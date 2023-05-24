import dialog from 'suneditor/src/plugins/modules/dialog'
import Select from "../../../javascript/components/fields/Select";
import Switch from "../../../javascript/components/fields/Switch";
import Choice from "../../../javascript/components/fields/Choice";
import Input from "../../../javascript/components/fields/Input";
import MiscEvent from "../../../../../../../../assets/front/javascript/misc/Event";

export default {
  // @Required
  // plugin name
  name: 'australVariables',

  // @Required
  // data display
  display: 'dialog',

  title: 'Variables',

  innerHTML: '<span class="austral-picto-percent"></span>',

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
    context.australVariables = {
      _selection: null,
    };

    /** link dialog */
    let link_dialog = this.setDialog(core, context);
    let link_controller = "";
    if(link_dialog)
    {
      context.australVariables.modal = link_dialog;
      context.australVariables.modal.classList.add('sun-editor-diag-link-choice');

      /** link controller */
      let link_controller = this.setController_LinkButton(core);
      context.australVariables.linkController = link_controller;

      /** add event listeners */
      link_dialog.querySelectorAll('*[data-variable-value]').forEach((variable) => {
        MiscEvent.addListener("click", this.variableChoice.bind(core, variable), variable);
      });
      link_dialog.querySelector('.popin-close').addEventListener('click', this.close.bind(core));
      link_controller.addEventListener('click', this.onClick_linkController.bind(core));

      /** append html */
      context.dialog.modal.appendChild(link_dialog);

      /** append controller */
      context.element.relative.appendChild(link_controller);

    }

    /** empty memory */
    link_dialog = null, link_controller = null;
  },

  /** dialog */
  setDialog: function (core, context) {
    if(typeof PopinTemplate !== undefined && PopinTemplate.templateByKey("variables")) {
      const lang = core.lang;
      const dialog = core.util.createElement('DIV');
      dialog.className = 'se-dialog-content';
      dialog.style.display = 'none';
      dialog.innerHTML = PopinTemplate.templateByKey("variables");
      return dialog;
    }
  },

  /** modify controller button */
  setController_LinkButton: function (core) {
    const lang = core.lang;
    const icons = core.icons;
    const link_btn = core.util.createElement('DIV');

    link_btn.className = 'se-controller se-controller-variables';
    link_btn.innerHTML = '' +
      '<div class="se-arrow se-arrow-up"></div>' +
      '<div class="variable-action"><span class="variable-value">&nbsp;</span>' +
      '<div class="se-btn-group">' +
      '<button type="button" data-popin-command="update" tabindex="-1" class="se-tooltip">' +
      icons.edit +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.edit + '</span></span>' +
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
    this.plugins.dialog.open.call(this, 'australVariables', 'australVariables' === this.currentControllerName);
  },

  // @Required, @Override dialog
  // This method is called when the plugin button is clicked.
  // Open the modal window here.
  close: function () {
    this.context.australVariables._selection = null;
    this.plugins.dialog.close.call(this);
    this.closeLoading();
  },

  variableChoice: function (variableChoice, e) {
    this.showLoading();
    e.preventDefault();
    e.stopPropagation();
    let currentTag = this.context.australVariables._selection;
    if (!currentTag)
    {
      const element = this.util.createElement('span');
      element.classList = "tag-content";
      element.textContent = variableChoice.getAttribute("data-variable-value");
      element.style.color = "inherit";
      element.setAttribute("data-tag-value", variableChoice.getAttribute("data-variable-value"));
      const selectedFormats = this.getSelectedElements();
      if (selectedFormats.length > 1) {
        const oFormat = this.util.createElement(selectedFormats[0].nodeName);
        oFormat.appendChild(element);
        this.insertNode(oFormat);
      } else {
        this.insertNode(element);
      }
      this.setRange(element.childNodes[0], 0, element.childNodes[0], element.textContent.length);
    }
    else
    {
      currentTag.textContent = variableChoice.textContent;
      currentTag.setAttribute("data-tag-value", variableChoice.getAttribute("data-variable-value"));
      this.setRange(currentTag.childNodes[0], 0, currentTag.childNodes[0], currentTag.textContent.length);
    }
    this.context.australVariables._selection = null;
    this.plugins.dialog.close.call(this);
    this.closeLoading();
    this.focus();
    return false;
  },

  // @Override core
  // Plugins with active methods load immediately when the editor loads.
  // Called each time the selection is moved.
  active: function (element) {
    if (!element) {
      if (this.controllerArray.indexOf(this.context.australVariables.linkController) > -1) {
        this.controllersOff();
      }
    } else {
      if (element.hasAttribute('data-tag-value')) {
        if(element.closest(".sun-editor-editable"))
        {
          if (this.controllerArray.indexOf(this.context.australVariables.linkController) < 0) {
            this.plugins.australVariables.call_controller.call(this, element);
          }
          return true;
        }
      }
      else
      {
        this.context.australVariables._selection = null;
      }
    }
    return false;
  },

  // @Override dialog
  // This method is called just before the dialog opens.
  // If "update" argument is true, it is not a new call, but a call to modify an already created element.
  on: function (update) {
    this.context.australVariables.modal.querySelectorAll("*[data-variable-value]").forEach((variableChoice) => {
      variableChoice.classList.remove("current");
    });

    if (!update) {
      this.plugins.australVariables.init.call(this);
    }
    let variableChoiceSelection = this.context.australVariables._selection;
    if(variableChoiceSelection)
    {
      let variableChoice = this.context.australVariables.modal.querySelector("*[data-variable-value='"+variableChoiceSelection.getAttribute('data-tag-value')+"']");
      if(variableChoice)
      {
        variableChoice.classList.add('current');
      }
    }
    document.body.classList.add("popin-open");
    this.context.australVariables.modal.classList.add("is-open");
  },

  call_controller: function (selectionATag) {
    this.context.australVariables._selection = selectionATag;
    const variableController = this.context.australVariables.linkController;
    const variableValue = variableController.querySelector('.variable-value');
    variableValue.textContent = selectionATag.textContent;


    const offset = this.util.getOffset(selectionATag, this.context.element.wysiwygFrame);
    variableController.style.top = (offset.top + selectionATag.offsetHeight + 10) + 'px';
    variableController.style.left = (offset.left - this.context.element.wysiwygFrame.scrollLeft) + 'px';

    variableController.style.display = 'block';

    const overLeft = this.context.element.wysiwygFrame.offsetWidth - (variableController.offsetLeft + variableController.offsetWidth);
    if (overLeft < 0) {
      variableController.style.left = (variableController.offsetLeft + overLeft) + 'px';
      variableController.firstElementChild.style.left = (20 - overLeft) + 'px';
    } else {
      variableController.firstElementChild.style.left = '20px';
    }
    // Show controller at editor area (controller elements, function, "controller target element(@Required)", "controller name(@Required)", etc..)
    this.controllersOn(variableController, selectionATag, 'australVariables');
  },

  onClick_linkController: function (e) {
    e.stopPropagation();

    const command = e.target.getAttribute('data-popin-command');
    if (!command) return;

    e.preventDefault();

    if (/update/.test(command)) {
      const contextVariables = this.context.australVariables;
      this.plugins.dialog.open.call(this, 'australVariables', true);
    }
    else {
      /** delete */
      this.focus();
      // history stack
      this.util.removeItem(this.context.australVariables._selection);
      this.context.australVariables._selection = null;
      this.history.push(false);
    }

    this.controllersOff();
  },

  // @Required, @Override dialog
  // This method is called when the dialog window is closed.
  // Initialize the properties.
  init: function () {
    document.body.classList.remove("popin-open");
    this.context.australVariables.modal.classList.remove("is-open");
    const australVariables = this.context.australVariables;
    australVariables.linkController.style.display = 'none';
  },

};