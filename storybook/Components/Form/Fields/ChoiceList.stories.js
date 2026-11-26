/*
 * This file is part of the Austral Form Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/ChoiceList.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { baseFieldArgTypes } from './BaseField';

const argTypes = {
  ...baseFieldArgTypes,
  type: {
    name: 'Type field',
    description: 'Choice type field',
    options: ['checkbox', 'radio'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'default'}
    }
  },
  value: {
    table: {
      disable: true,
    },
  },
  labelPosition: {
    table: {
      disable: true,
    },
  },
  disabled: {
    table: {
      disable: true,
    },
  },
};

const args = {
  id: "choice_list_checkbox_demo",
  name: "choice_list_checkbox_demo",
  type: "checkbox",
  label: "Choice List",
  labelPosition: "external",
  required: false,
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[choice_list_checkbox_demo][value1]",
      id:       "form_choice_list_checkbox_demo_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[choice_list_checkbox_demo][value2]",
      id:       "form_choice_list_checkbox_demo_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[choice_list_checkbox_demo][value3]",
      id:       "form_choice_list_checkbox_demo_value3",
      label:    "Value 3",
    },
  ]
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div" name="{{ name }}" typeField="choice-list" errorValue="{{ errorValue }}">
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:ChoiceList choices="{{ choices }}" id="{{ id }}" name="{{ name }}" type="{{ type }}" />
        </twig:block>
        ${args.after ? '<twig:block name="after">'+args.after+'</twig:block>' : ''}
        ${args.before ? '<twig:block name="before">'+args.before+'</twig:block>' : ''}
        ${args.helper ? '<twig:block name="helper">'+args.helper+'</twig:block>' : ''}
      </twig:Austral:Form:Row>`
  })
};

export const Demo = {
  tags:     ['autodocs', '!dev'],
  viewMode: 'docs',
  argTypes: argTypes,
  args: args,
};

const argsDefault = {
  id: "choice_list_checkbox",
  name: "choice_list_checkbox",
  type: "checkbox",
  label: "Choice List",
  labelPosition: "external",
  required: false,
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[choice_list_checkbox][value1]",
      id:       "form_choice_list_checkbox_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[choice_list_checkbox][value2]",
      id:       "form_choice_list_checkbox_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[choice_list_checkbox][value3]",
      id:       "form_choice_list_checkbox_value3",
      label:    "Value 3",
    },
  ]
};

export const Default = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: argsDefault
};

const argsChoiceListCheckboxWithDisabled = {
  id: "choice_list_checkbox_with_disabled",
  name: "choice_list_checkbox_with_disabled",
  type: "checkbox",
  label: "Choice List Checkbox With Disabled",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  choices: [
    {
      value:    "value1",
      name:     "form[choice_list_checkbox_with_disabled][value1]",
      id:       "form_choice_list_checkbox_with_disabled_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[choice_list_checkbox_with_disabled][value2]",
      id:       "form_choice_list_checkbox_with_disabled_value2",
      label:    "Value 2",
      disabled: true,
    },
    {
      value:    "value3",
      name:     "form[choice_list_checkbox_with_disabled][value3]",
      id:       "form_choice_list_checkbox_with_disabled_value3",
      label:    "Value 3",
    },
  ]
};

export const ChoiceListCheckboxWithDisabled = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: argsChoiceListCheckboxWithDisabled
};

const argsChoiceListCheckboxWithError = {
  id: "choice_list_checkbox_with_error",
  name: "choice_list_checkbox_with_error",
  type: "checkbox",
  label: "Choice List Checkbox With Disabled",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "Error message",
  choices: [
    {
      value:    "value1",
      name:     "form[choice_list_checkbox_with_error][value1]",
      id:       "form_choice_list_checkbox_with_error_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[choice_list_checkbox_with_error][value2]",
      id:       "form_choice_list_checkbox_with_error_value2",
      label:    "Value 2"
    },
    {
      value:    "value3",
      name:     "form[choice_list_checkbox_with_error][value3]",
      id:       "form_choice_list_checkbox_with_error_value3",
      label:    "Value 3",
    },
  ]
};

export const ChoiceListCheckboxWithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: argsChoiceListCheckboxWithError
};

const argsChoiceListRadio = {
  id: "choice_list_radio",
  name: "choice_list_radio",
  label: "Choice List Radio",
  labelPosition: "external",
  type: "radio",
  before: "",
  after: "",
  errorValue: "",
  choices: [
    {
      value:    "value1",
      name:     "form[choice_list_radio][value1]",
      id:       "form_choice_list_radio_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[choice_list_radio][value2]",
      id:       "form_choice_list_radio_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[choice_list_radio][value3]",
      id:       "form_choice_list_radio_value3",
      label:    "Value 3",
    },
  ]
};

export const ChoiceListRadio = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: argsChoiceListRadio
};

const argsChoiceListRadioWithDisabled = {
  id: "choice_list_radio_with_disabled",
  name: "choice_list_radio_with_disabled",
  label: "Choice List Radio With Disabled",
  labelPosition: "external",
  type: "radio",
  before: "",
  after: "",
  errorValue: "",
  choices: [
    {
      value:    "value1",
      name:     "form[choice_list_radio_with_disabled][value1]",
      id:       "form_choice_list_radio_with_disabled_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[choice_list_radio_with_disabled][value2]",
      id:       "form_choice_list_radio_with_disabled_value2",
      label:    "Value 2",
      disabled: true,
    },
    {
      value:    "value3",
      name:     "form[choice_list_radio_with_disabled][value3]",
      id:       "form_choice_list_radio_with_disabled_value3",
      label:    "Value 3",
    },
  ]
};

export const ChoiceListRadioWithDisabled = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: argsChoiceListRadioWithDisabled
};

const argsChoiceListRadioWithError = {
  id: "choice_list_radio_with_error",
  name: "choice_list_radio_with_error",
  label: "Choice List Radio With Error",
  labelPosition: "external",
  type: "radio",
  before: "",
  after: "",
  errorValue: "Error message",
  choices: [
    {
      value:    "value1",
      name:     "form[choice_list_radio_with_error][value1]",
      id:       "form_choice_list_radio_with_error_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[choice_list_radio_with_error][value2]",
      id:       "form_choice_list_radio_with_error_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[choice_list_radio_with_error][value3]",
      id:       "form_choice_list_radio_with_error_value3",
      label:    "Value 3",
    },
  ]
};

export const ChoiceListRadioWithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: argsChoiceListRadioWithError
};
