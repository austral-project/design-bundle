/*
 * This file is part of the Austral Form Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Textarea.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { baseFieldArgTypes } from './BaseField';

const argTypes = {
  ...baseFieldArgTypes,
  reverse: {
    name: 'Reverse',
    description: 'Reverse field',
    control: {type: 'boolean'},
  },
};

const args = {
  id: "checkbox_demo",
  name: "checkbox_demo",
  labelPosition: "default",
  label: "Checkbox",
  disabled: false,
  required: false,
  reverse: false,
  value: "",
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
      <twig:Austral:Form:Row tag="div" name="{{ name }}" typeField="checkbox" required="{{ required }}" disabled="{{ disabled }}" reverse="{{ reverse }}" errorValue="{{ errorValue }}">
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Input
            id="{{ id }}"
            name="{{ name }}"
            type="checkbox"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="{{ value }}"
          />
        </twig:block>
        ${args.after ? '<twig:block name="after">'+args.after+'</twig:block>' : ''}
        ${args.before ? '<twig:block name="before">'+args.before+'</twig:block>' : ''}
        ${args.helper ? '<twig:block name="helper">'+args.helper+'</twig:block>' : ''}
      </twig:Austral:Form:Row>
        `
  })
};

export const Demo = {
  tags:     ['autodocs', '!dev'],
  viewMode: 'docs',
  argTypes: argTypes,
  args:     args,
};

const argsDefault = {
  id: "checkbox",
  name: "checkbox",
  labelPosition: "default",
  label: "Checkbox",
  disabled: false,
  required: false,
  reverse: false,
  value: "",
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

const argsWithError = {
  reverse: false,
  id: "checkbox_error",
  name: "checkbox_error",
  labelPosition: "default",
  label: "Checkbox",
  disabled: false,
  required: false,
  value: "",
  helper: "",
  errorValue: "Error message",
};

export const WithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsWithError
};
