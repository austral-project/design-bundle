/*
 * This file is part of the Austral Form Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Input.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { baseFieldArgTypes } from './BaseField';

const argTypes = {
  ...baseFieldArgTypes,
};

const args = {
  id: "counter_demo",
  name: "counter_demo",
  labelPosition: "external",
  label: "Label",
  disabled: false,
  required: true,
  value: "",
  before: "",
  after: "",
  helper: "",
  errorValue: null,
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div" name="{{ name }}" typeField="number" required="{{ required }}" disabled="{{ disabled }}" errorValue="{{ errorValue }}">
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Input
            type="text"
            id="{{ id }}"
            name="{{ name }}"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="1"
            data-number-min="1"
            inputmode="numeric"
          />
        </twig:block>
        <twig:block name="after">
          <twig:Austral:Button htmlTag="button" type="button" hideEntitled="{{ true }}" size="sm" theme="ghost" entitled="Incrémenter la valeur" data-number-add="">
            <twig:block name="picto">
              <twig:Austral:Picto name="plus"></twig:Austral:Picto>
            </twig:block>
          </twig:Austral:Button>
        </twig:block>
        <twig:block name="before">
          <twig:Austral:Button htmlTag="button" type="button" hideEntitled="{{ true }}" size="sm" theme="ghost" entitled="Décrémenter la valeur" data-number-subtract="">
            <twig:block name="picto">
              <twig:Austral:Picto name="minus"></twig:Austral:Picto>
            </twig:block>
          </twig:Austral:Button>
        </twig:block>
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
  id: "counter",
  name: "counter",
  labelPosition: "external",
  label: "Label",
  disabled: false,
  required: true,
  value: "",
  before: "",
  after: "",
  helper: "",
  errorValue: null,
};

export const Default = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: argsDefault
};

const argsWithError = {
  id: "name",
  name: "name",
  labelPosition: "external",
  label: "Label",
  disabled: false,
  required: false,
  value: "",
  before: "",
  after: "",
  errorValue: "Error message",
};

export const WithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsWithError
};
