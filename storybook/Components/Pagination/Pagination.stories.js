/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Link.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { PictoParser } from '../../_helper/PictoParser';

const argTypes = {
  areaTheme: {
    name: 'Area color theme',
    description: 'Change the area color',
    options: ["", 'area-secondary-theme', 'area-dark-theme'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: ''}
    }
  },
  currentPage: {
    name: 'Current Page',
    description: 'Current page number',
    control: {type: 'number'},
    table: {
      type: {summary: 'integer'},
      defaultValue: {summary: 1}
    }
  },
  nbPages: {
    name: 'Nb Pages',
    description: 'Number of pages',
    control: {type: 'number'},
    table: {
      type: {summary: 'integer'},
      defaultValue: {summary: 10}
    }
  },
};

const args = {
  areaTheme: "default",
  currentPage: 1,
  nbPages: 10,
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  argTypes,
  render: (args) => ({
    template: twig`
      <div class="area-container area-storybook-demo {{ areaTheme }}">
        <twig:Austral:Pagination
            totalPages="{{ nbPages }}"
            currentPage="{{ currentPage }}"
            path=""
            position="bottom"
            pathParameters="{{ {'key': 'value'} }}"
          ></twig:Austral:Pagination>
      </div>
      `
  }),
};

export const Default = {
  args: args
};
