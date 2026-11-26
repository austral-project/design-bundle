/*
 * This file is part of the Austral Form Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Select.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { baseFieldArgTypes } from './BaseField';

const choices = [
  {
    value:    "value-1",
    entitled: "Value 1",
    disabled: false
  },
  {
    value:    "value-2",
    entitled: "Value 2",
    disabled: false
  },
  {
    value:    "value-3",
    entitled: "Value 3",
    disabled: true
  },
  {
    value:    "value-4",
    entitled: "Value 4",
    disabled: false
  }
];

const argTypes = {
  ...baseFieldArgTypes,
  before: {
    table: {
      disable: true,
    },
  },
  after: {
    table: {
      disable: true,
    },
  },
  choices: {
    table: {
      disable: true,
    },
  },
  value: {
    table: {
      disable: true,
    },
  },
};

const args = {
  id: "select_demo",
  name: "select_demo",
  label: "Select",
  labelPosition: "external",
  disabled: false,
  required: false,
  value: "",
  choices: choices,
  before: "",
  after: "",
  helper: "",
  errorValue: "",
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div" name="{{ name }}" typeField="choice" required="{{ required }}" disabled="{{ disabled }}" errorValue="{{ errorValue }}">
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Select
            id="{{ id }}"
            name="{{ name }}"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="{{ value }}"
            choices="{{ choices }}"
          />
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
  args:     args,
};

const argsDefault = {
  id: "select",
  name: "select",
  label: "Select",
  labelPosition: "external",
  disabled: false,
  required: false,
  value: "",
  choices: choices,
  before: "",
  after: "",
  helper: "",
  errorValue: "",
};

export const Default = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsDefault
};

const argsWithDisabled = {
  id: "select_disable",
  name: "select_disable",
  label: "Select",
  labelPosition: "external",
  disabled: true,
  required: false,
  value: "",
  choices: choices,
  before: "",
  after: "",
  helper: "",
  errorValue: "",
};

export const WithDisabled = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsWithDisabled
};

const argsWithError = {
  id: "select_error",
  name: "select_error",
  label: "Select",
  labelPosition: "external",
  disabled: false,
  required: false,
  value: "",
  choices: choices,
  before: "",
  after: "",
  helper: "",
  errorValue: "Error message",
};

export const WithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsWithError
};
