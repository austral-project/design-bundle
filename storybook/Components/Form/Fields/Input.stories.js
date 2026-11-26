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
import { Phone } from '@austral/design/components/form/fields/input';

import { baseFieldArgTypes } from './BaseField';

const argTypes = {
  ...baseFieldArgTypes,
  type: {
    name: 'Type',
    description: 'Type',
    options: ['text', 'number'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    },
    value: "text",
  }
};

const args = {
  id: "input_demo",
  name: "input_demo",
  labelPosition: "external",
  label: "Label",
  type: "text",
  disabled: false,
  required: true,
  value: "",
  beforeValue: "",
  beforeBackground: false,
  afterValue: "",
  afterBackground: false,
  helperValue: "",
  errorValue: null,
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div"
      name="{{ name }}"
      typeField="{{ type }}"
      required="{{ required }}"
      disabled="{{ disabled }}"
      errorValue="{{ errorValue }}"
      beforeValue="{{ beforeValue }}"
      beforeBackground="{{ beforeBackground }}"
      afterValue="{{ afterValue }}"
      afterBackground="{{ afterBackground }}"
      helperValue="{{ helperValue }}"
      >
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Input
            type="{{ type }}"
            id="{{ id }}"
            name="{{ name }}"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="{{ value }}"
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
  args: args,
};

const argsDefault = {
  id: "input",
  name: "input",
  labelPosition: "external",
  label: "Label",
  type: "text",
  disabled: false,
  required: true,
  value: "",
  beforeValue: "",
  beforeBackground: false,
  afterValue: "",
  afterBackground: false,
  helperValue: "",
  errorValue: null,
};

export const Default = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsDefault
};

const argsPrice = {
  id: "price",
  name: "price",
  labelPosition: "external",
  label: "Price",
  type: "text",
  disabled: false,
  required: false,
  value: "",
  beforeValue: "",
  beforeBackground: false,
  afterValue: "€",
  afterBackground: false,
  helperValue: "",
  errorValue: null,
}

export const Price = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsPrice,
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div"
      name="{{ name }}"
      typeField="{{ type }}"
      required="{{ required }}"
      disabled="{{ disabled }}"
      errorValue="{{ errorValue }}"
      beforeValue="{{ beforeValue }}"
      beforeBackground="{{ beforeBackground }}"
      afterValue="{{ afterValue }}"
      afterBackground="{{ afterBackground }}"
      helperValue="{{ helperValue }}"
      >
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Input
            type="{{ type }}"
            id="{{ id }}"
            name="{{ name }}"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="{{ value }}"
            inputmode="decimal"
          />
        </twig:block>
        ${args.after ? '<twig:block name="after">'+args.after+'</twig:block>' : ''}
        ${args.before ? '<twig:block name="before">'+args.before+'</twig:block>' : ''}
        ${args.helper ? '<twig:block name="helper">'+args.helper+'</twig:block>' : ''}
      </twig:Austral:Form:Row>`
  })
};


const argsPassword = {
  id: "password",
  name: "password",
  labelPosition: "external",
  label: "Password",
  type: "password",
  disabled: false,
  required: false,
  value: "",
  beforeValue: "",
  beforeBackground: false,
  afterValue: "",
  afterBackground: false,
  helperValue: "",
  errorValue: null,
};

export const Password = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsPassword
};

const argsHTTP = {
  id: "website",
  name: "website",
  labelPosition: "external",
  label: "Website",
  type: "text",
  disabled: false,
  required: false,
  value: "",
  beforeValue: "",
  beforeBackground: true,
  afterValue: "",
  afterBackground: false,
  helperValue: "",
  errorValue: null,
};

export const HTTP = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsHTTP,
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div"
        name="{{ name }}"
        typeField="{{ type }}"
        required="{{ required }}"
        disabled="{{ disabled }}"
        errorValue="{{ errorValue }}"
        beforeValue="{{ beforeValue }}"
        beforeBackground="{{ beforeBackground }}"
        afterValue="{{ afterValue }}"
        afterBackground="{{ afterBackground }}"
        helperValue="{{ helperValue }}"
      >
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Input
            type="{{ type }}"
            id="{{ id }}"
            name="{{ name }}"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="{{ value }}"
          />
        </twig:block>
        <twig:block name="before">
          <twig:Austral:Picto name="map"></twig:Austral:Picto>
          <span class="value">https://</span>
        </twig:block>
        ${args.after ? '<twig:block name="after">'+args.after+'</twig:block>' : ''}
        ${args.helper ? '<twig:block name="helper">'+args.helper+'</twig:block>' : ''}
      </twig:Austral:Form:Row>`
  })
};

const argsPhone = {
  id: "phone",
  name: "phone",
  labelPosition: "external",
  label: "Phone",
  type: "text",
  disabled: false,
  required: false,
  value: "",
  beforeValue: "",
  beforeBackground: true,
  afterValue: "",
  afterBackground: false,
  helperValue: "",
  errorValue: null,
};

export const PhoneInput = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsPhone,
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div"
        name="{{ name }}"
        typeField="{{ type }}"
        required="{{ required }}"
        disabled="{{ disabled }}"
        errorValue="{{ errorValue }}"
        beforeValue="{{ beforeValue }}"
        beforeBackground="{{ beforeBackground }}"
        afterValue="{{ afterValue }}"
        afterBackground="{{ afterBackground }}"
        helperValue="{{ helperValue }}"
      >
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Input
            type="{{ type }}"
            id="{{ id }}"
            name="{{ name }}"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="{{ value }}"
            data-phone="{{ id }}"
          />
          <twig:Austral:Form:Fields:Input
            type="{{ type }}"
            id="{{ id }}-full"
            name="{{ name }}-full"
            required="{{ required }}"
            disabled="{{ disabled }}"
            hidden="{{ true }}"
            value=""
            data-phone-full="{{ id }}"
          />
          <twig:Austral:Form:Fields:Input
            type="{{ type }}"
            id="{{ id }}-country"
            name="{{ name }}-country"
            required="{{ required }}"
            disabled="{{ disabled }}"
            hidden="{{ true }}"
            value=""
            data-phone-country="{{ id }}"
          />
          ${args.after ? '<twig:block name="after">'+args.after+'</twig:block>' : ''}
          ${args.before ? '<twig:block name="before">'+args.before+'</twig:block>' : ''}
          ${args.helper ? '<twig:block name="helper">'+args.helper+'</twig:block>' : ''}
        </twig:block>
      </twig:Austral:Form:Row>`
  })
};

const argsDatepicker = {
  id: "datepicker",
  name: "datepicker",
  labelPosition: "external",
  label: "Datepicker",
  type: "text",
  disabled: false,
  required: false,
  value: "",
  beforeValue: "",
  beforeBackground: true,
  afterValue: "",
  afterBackground: false,
  helperValue: null,
  errorValue: null,
};
export const Datepicker = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsDatepicker,
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div"
        name="{{ name }}"
        typeField="datepicker"
        required="{{ required }}"
        disabled="{{ disabled }}"
        errorValue="{{ errorValue }}"
        beforeValue="{{ beforeValue }}"
        beforeBackground="{{ beforeBackground }}"
        afterValue="{{ afterValue }}"
        afterBackground="{{ afterBackground }}"
        helperValue="{{ helperValue }}"
      >
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Input
            type="{{ type }}"
            id="{{ id }}"
            name="{{ name }}"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="{{ value }}"
            data-datepicker=""
            data-datepicker-options="{}"
            inputmode="numeric"
            maxlength="10"
          />
          ${args.after ? '<twig:block name="after">'+args.after+'</twig:block>' : ''}
          ${args.before ? '<twig:block name="before">'+args.before+'</twig:block>' : ''}
          ${args.helper ? '<twig:block name="helper">'+args.helper+'</twig:block>' : ''}
        </twig:block>
      </twig:Austral:Form:Row>`
  })
};

const argsTimepicker = {
  id: "timepicker",
  name: "timepicker",
  labelPosition: "external",
  label: "Timepicker",
  type: "text",
  disabled: false,
  required: false,
  value: "",
  beforeValue: "",
  beforeBackground: true,
  afterValue: "",
  afterBackground: false,
  helperValue: null,
  errorValue: null,
};
export const Timepicker = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsTimepicker,
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div"
        name="{{ name }}"
        typeField="timepicker"
        required="{{ required }}"
        disabled="{{ disabled }}"
        errorValue="{{ errorValue }}"
        beforeValue="{{ beforeValue }}"
        beforeBackground="{{ beforeBackground }}"
        afterValue="{{ afterValue }}"
        afterBackground="{{ afterBackground }}"
        helperValue="{{ helperValue }}"
      >
        ${args.labelPosition !== "external" ? '<twig:block name="label"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Input
            type="{{ type }}"
            id="{{ id }}"
            name="{{ name }}"
            required="{{ required }}"
            disabled="{{ disabled }}"
            value="{{ value }}"
            data-timepicker=""
            data-timepicker-options="{}"
            inputmode="numeric"
            maxlength="5"
          />
          ${args.after ? '<twig:block name="after">'+args.after+'</twig:block>' : ''}
          ${args.before ? '<twig:block name="before">'+args.before+'</twig:block>' : ''}
          ${args.helper ? '<twig:block name="helper">'+args.helper+'</twig:block>' : ''}
        </twig:block>
      </twig:Austral:Form:Row>`
  })
};

const argsWithError = {
  id: "input_error",
  name: "input_error",
  labelPosition: "external",
  label: "Label",
  type: "text",
  disabled: false,
  required: false,
  value: "",
  beforeValue: "",
  beforeBackground: false,
  afterValue: "",
  afterBackground: false,
  helperValue: "",
  errorValue: "Error message",
};

export const WithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsWithError
};
