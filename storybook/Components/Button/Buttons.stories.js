/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Button.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    tags: ['autodocs'],
    template: twig`
      <twig:Austral:Buttons theme="{{ theme }}">
        <twig:block name="buttons">
          <twig:Austral:Button
            htmlTag="{{ children[0].htmlTag }}"
            entitled="{{ children[0].entitled }}"
            title="{{ children[0].title }}"
            href="{{ children[0].href }}"
            size="{{ children[0].size }}"
            align="{{ children[0].align }}"
            target="{{ children[0].target }}"
            theme="{{ children[0].theme }}"
            disabled="{{ children[0].disabled }}"
            full="{{ children[0].full }}"
            hideEntitled="{{ children[0].hideEntitled }}"
            pictoLoad="{{ children[0].pictoLoad }}"
            additional="{{ children[0].additional }}"
          >
            ${args.children[0].picto ? '<twig:block name="picto"><twig:Austral:Picto name="'+args.children[0].picto+'" /></twig:block>' : ''}
            ${args.children[0].pictoRight ? '<twig:block name="pictoRight"><twig:Austral:Picto name="'+args.children[0].pictoRight+'"/></twig:block>' : ''}
          </twig:Austral:Button>
          <twig:Austral:Button
            htmlTag="{{ children[1].htmlTag }}"
            entitled="{{ children[1].entitled }}"
            title="{{ children[1].title }}"
            href="{{ children[1].href }}"
            size="{{ children[1].size }}"
            align="{{ children[1].align }}"
            target="{{ children[1].target }}"
            theme="{{ children[1].theme }}"
            disabled="{{ children[1].disabled }}"
            full="{{ children[1].full }}"
            hideEntitled="{{ children[1].hideEntitled }}"
            pictoLoad="{{ children[1].pictoLoad }}"
            additional="{{ children[1].additional }}"
          >
            ${args.children[1].picto ? '<twig:block name="picto"><twig:Austral:Picto name="'+args.children[1].picto+'" /></twig:block>' : ''}
            ${args.children[1].pictoRight ? '<twig:block name="pictoRight"><twig:Austral:Picto name="'+args.children[1].pictoRight+'"/></twig:block>' : ''}
          </twig:Austral:Button>
        </twig:block>
      </twig:Austral:Buttons>
    `
  })
};

const argTypes = {
  theme: {
    name: 'Theme buttons',
    description: 'Theme value',
    options: ['', "center", "list", 'full', 'side'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: ''}
    }
  },
};

const args = {
  theme:  "",
  children: [
    {
      areaTheme: "default",
      htmlTag: "button",
      entitled: "Button CTA",
      additional: "",
      title: "",
      href: null,
      size: "medium",
      align: "center",
      target: "",
      theme: "solid",
      color: "primary",
      disabled: false,
      full: false,
      hideEntitled: false,
      pictoLoad: false,
      picto: "",
      pictoRight: "",
    },
    {
      areaTheme: "default",
      htmlTag: "button",
      entitled: "Button CTA 2",
      additional: "",
      title: "",
      href: null,
      size: "medium",
      align: "center",
      target: "",
      theme: "solid",
      color: "primary",
      disabled: false,
      full: false,
      hideEntitled: false,
      pictoLoad: false,
      picto: "",
      pictoRight: "",
    }
  ]
};

export const Default = {
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: args
};
