/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Switcher.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { baseFieldArgTypes } from './BaseField';

const argTypes = {
  ...baseFieldArgTypes,
  theme: {
    name: 'Theme Switcher',
    description: 'Choice theme for switcher',
    options: ['solid', 'soft', "underline"],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'solid'}
    }
  },
  size: {
    name: 'Size Switcher',
    description: 'Choice size for switcher',
    options: ['full', 'compact'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'full'}
    }
  },
  labelPosition: {
    table: {
      disable: true,
    },
  },
  value: {
    table: {
      disable: true,
    },
  },
  disabled: {
    table: {
      disable: true,
    },
  },
  required: {
    table: {
      disable: true,
    },
  },
};

const args = {
  id: "switcher_demo",
  name: "switcher_demo",
  theme: "solid",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_demo][value1]",
      id:       "form_switcher_demo_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_demo][value2]",
      id:       "form_switcher_demo_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[switcher_demo][value3]",
      id:       "form_switcher_demo_value3",
      label:    "Value 3",
    },
  ]
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    template: twig`
      <twig:Austral:Form:Row tag="div" name="{{ name }}" typeField="switcher" errorValue="{{ errorValue }}">
        ${args.labelPosition === "external" ? '<twig:block name="label_external"><twig:Austral:Form:Label tag="label" entitled="{{ label }}" for="{{ id }}"/></twig:block>' : ''}
        <twig:block name="field">
          <twig:Austral:Form:Fields:Switcher choices="{{ choices }}" id="{{ id }}" theme="{{ theme }}" name="{{ name }}" size="{{ size }}" />
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

const argsThemeSolid = {
  id: "switcher_solid",
  name: "switcher_solid",
  theme: "solid",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_solid][value1]",
      id:       "form_switcher_solid_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_solid][value2]",
      id:       "form_switcher_solid_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[switcher_solid][value3]",
      id:       "form_switcher_solid_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeSolid = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeSolid
};

const argsThemeSolidCompact = {
  id: "switcher_solid_compact",
  name: "switcher_solid_compact",
  theme: "solid",
  size: "compact",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_solid_compact][value1]",
      id:       "form_switcher_solid_compact_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_solid_compact][value2]",
      id:       "form_switcher_solid_compact_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[switcher_solid_compact][value3]",
      id:       "form_switcher_solid_compact_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeSolidCompact = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeSolidCompact
};

const argsThemeSolidWithDisabled = {
  id: "switcher_solid_with_disabled",
  name: "switcher_solid_with_disabled",
  theme: "solid",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_solid_with_disabled][value1]",
      id:       "form_switcher_solid_with_disabled_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_solid_with_disabled][value2]",
      id:       "form_switcher_solid_with_disabled_value2",
      label:    "Value 2",
      disabled: true
    },
    {
      value:    "value3",
      name:     "form[switcher_solid_with_disabled][value3]",
      id:       "form_switcher_solid_with_disabled_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeSolidWithDisabled = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeSolidWithDisabled
};

const argsThemeSolidWithError = {
  id: "switcher_solid_with_error",
  name: "switcher_solid_with_error",
  theme: "solid",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "Error Message",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_solid_with_error][value1]",
      id:       "form_switcher_solid_with_error_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_solid_with_error][value2]",
      id:       "form_switcher_solid_with_error_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[switcher_solid_with_error][value3]",
      id:       "form_switcher_solid_with_error_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeSolidWithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeSolidWithError
};

const argsThemeSoft = {
  id: "switcher_soft",
  name: "switcher_soft",
  theme: "soft",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_soft][value1]",
      id:       "form_switcher_soft_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_soft][value2]",
      id:       "form_switcher_soft_value2",
      label:    "Value 2"
    },
    {
      value:    "value3",
      name:     "form[switcher_soft][value3]",
      id:       "form_switcher_soft_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeSoft = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeSoft
};

const argsThemeSoftCompact = {
  id: "switcher_soft_compact",
  name: "switcher_soft_compact",
  theme: "soft",
  size: "compact",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_soft_compact][value1]",
      id:       "form_switcher_soft_compact_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_soft_compact][value2]",
      id:       "form_switcher_soft_compact_value2",
      label:    "Value 2"
    },
    {
      value:    "value3",
      name:     "form[switcher_soft_compact][value3]",
      id:       "form_switcher_soft_compact_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeSoftCompact = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeSoftCompact
};

const argsThemeSoftWithDisabled = {
  id: "switcher_soft_disabled",
  name: "switcher_soft_disabled",
  theme: "soft",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_soft_disabled][value1]",
      id:       "form_switcher_soft_disabled_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_soft_disabled][value2]",
      id:       "form_switcher_soft_disabled_value2",
      label:    "Value 2",
      disabled: true
    },
    {
      value:    "value3",
      name:     "form[switcher_soft_disabled][value3]",
      id:       "form_switcher_soft_disabled_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeSoftWithDisabled = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeSoftWithDisabled
};

const argsThemeSoftWithError = {
  id: "switcher_soft_error",
  name: "switcher_soft_error",
  theme: "soft",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "Error message",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_soft_error][value1]",
      id:       "form_switcher_soft_error_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_soft_error][value2]",
      id:       "form_switcher_soft_error_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[switcher_soft_error][value3]",
      id:       "form_switcher_soft_error_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeSoftWithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeSoftWithError
};

const argsThemeUnderline = {
  id: "switcher_underline",
  name: "switcher_underline",
  theme: "underline",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_underline][value1]",
      id:       "form_switcher_underline_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_underline][value2]",
      id:       "form_switcher_underline_value2",
      label:    "Value 2"
    },
    {
      value:    "value3",
      name:     "form[switcher_underline][value3]",
      id:       "form_switcher_underline_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeUnderline = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeUnderline
};

const argsThemeUnderlineCompact = {
  id: "switcher_underline_compact",
  name: "switcher_underline_compact",
  theme: "underline",
  size: "compact",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_underline_compact][value1]",
      id:       "form_switcher_underline_compact_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_underline_compact][value2]",
      id:       "form_switcher_underline_compact_value2",
      label:    "Value 2"
    },
    {
      value:    "value3",
      name:     "form[switcher_underline_compact][value3]",
      id:       "form_switcher_underline_compact_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeUnderlineCompact = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeUnderlineCompact
};

const argsThemeUnderlineWithDisabled = {
  id: "switcher_underline_with_disabled",
  name: "switcher_underline_with_disabled",
  theme: "underline",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_underline_with_disabled][value1]",
      id:       "form_switcher_underline_with_disabled_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_underline_with_disabled][value2]",
      id:       "form_switcher_underline_with_disabled_value2",
      label:    "Value 2",
      disabled: true
    },
    {
      value:    "value3",
      name:     "form[switcher_underline_with_disabled][value3]",
      id:       "form_switcher_underline_with_disabled_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeUnderlineWithDisabled = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeUnderlineWithDisabled
};

const argsThemeUnderlineWithError = {
  id: "switcher_underline_with_error",
  name: "switcher_underline_with_error",
  theme: "underline",
  size: "full",
  label: "Switcher",
  labelPosition: "external",
  before: "",
  after: "",
  errorValue: "Error message",
  helper: "",
  choices: [
    {
      value:    "value1",
      name:     "form[switcher_underline_with_error][value1]",
      id:       "form_switcher_underline_with_error_value1",
      label:    "Value 1",
    },
    {
      value:    "value2",
      name:     "form[switcher_underline_with_error][value2]",
      id:       "form_switcher_underline_with_error_value2",
      label:    "Value 2",
    },
    {
      value:    "value3",
      name:     "form[switcher_underline_with_error][value3]",
      id:       "form_switcher_underline_with_error_value3",
      label:    "Value 3",
    },
  ]
};

export const ThemeUnderlineWithError = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args:     argsThemeUnderlineWithError
};
