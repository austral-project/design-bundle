/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Picto.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { PictoParser } from '../../_helper/PictoParser';

export default {
  render: (args) => ({
    tags: ['autodocs'],
    template: twig`
      <ul class="storybook-card-container">
        ${args.pictos.map(picto =>
      `<li class="storybook-card-content" data-clipboard data-clipboard-value="${ picto.keyname }" data-clipboard-message="Picto name is copied !">
            <span class="storybook-card-title">${ picto.entitled }</span>
            <twig:Austral:Picto name="${ picto.keyname }"/>
          </li>`
    ).join('')}
      </ul>
    `
  })
};

const argTypes = {
  size: {
    name: 'size',
    description: 'Size picto',
    options: [""],
    control: {
      type: 'select',
      required: true,
    },
    table: {
      type: {summary: 'string'}
    }
  },
  pictos: {
    table: {
      disable: true
    }
  }
};
export const Austral = {
  viewMode: 'docs',
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: {
    pictos: PictoParser.gets()
  }
};
