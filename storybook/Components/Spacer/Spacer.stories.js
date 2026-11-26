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
  size: {
    name: 'Size link',
    description: 'Size value',
    options: ["default", '3xl', '2xl', 'xl', 'lg', 'md'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'default'}
    }
  },
  theme: {
    name: 'Theme link',
    description: 'Theme value',
    options: ["transparent", 'visible'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'transparent'}
    }
  },
};

const args = {
  areaTheme: "default",
  size: "default",
  theme: "transparent",
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  argTypes,
  render: (args) => ({
    template: twig`
      <div class="area-container area-storybook-demo {{ areaTheme }}">
        <twig:Austral:Spacer
          size="{{ size }}"
          theme="{{ theme }}"
          ></twig:Austral:Spacer>
      </div>
      `
  }),
};

export const Default = {
  args: args
};
