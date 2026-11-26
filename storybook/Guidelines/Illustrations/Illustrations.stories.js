/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import {IllustrationParser} from "../../_helper/IllustrationParser";
export default {
  render: (args) => ({
    tags: ['autodocs'],
    template: twig`
      <ul class="storybook-card-container">
      ${args.illustrations.map(illustration =>
        `<li class="storybook-card-content">
            <div class="picture-content ${illustration.background}"><img src="${illustration.url}" alt="" ></div>
            <a class="link" target="_blank" href="${illustration.url}">Télécharger</a>
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
};
export const Default = {
  viewMode: 'docs',
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: {
    illustrations: IllustrationParser.gets( "all")
  }
};