/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Colors.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { ColorParser } from '../../_helper/ColorParser';

export default {
  render: (args) => ({
    template: twig`
      <ul class="storybook-card-container">
        ${args.colors.map(color => 
          `<li class="storybook-card-content" style="--tuile-width: calc((100% / 5) - (8rem / 5))">
            <span class="storybook-card-title">${color.entitled}</span>
            <span class="color" style="--background: var(${color.css})" data-clipboard data-clipboard-value="${ color.hexa }" data-clipboard-message="Color hexa is copied !"></span>
            <ul class="storybook-card-bottom with-background">
              <li data-clipboard data-clipboard-value="${ color.css }" data-clipboard-message="Var CSS is copied !"><span class="keyname">CSS :</span><span class="value">${color.css}</span></li>
              <li data-clipboard data-clipboard-value="${ color.sass }" data-clipboard-message="Var SASS is copied !"><span class="keyname">SASS :</span><span class="value">${color.sass}</span></li>
              <li data-clipboard data-clipboard-value="${ color.color }" data-clipboard-message="Color is copied !"><span class="keyname">Color :</span><span class="value">${color.color}</span></li>
              <li data-clipboard data-clipboard-value="${ color.hexa }" data-clipboard-message="Color hexa is copied !"><span class="keyname">Hexa :</span><span class="value">${color.hexa}</span></li>
            </ul>
          </li>`
        ).join('')}
      </ul>
    `
  })
};
const argTypes = {
  colors: {
    table: {
      disable: true
    }
  }
};
export const Default = {
  viewMode: 'docs',
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: {
    colors: ColorParser.gets("all", false, ["other", "base", "color-1", "color-2"])
  }
};
export const ColorBase = {
  viewMode: 'docs',
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: {
    colors: ColorParser.gets("base", false, ["base-opacity", "base-lg", "base-md", "base-sg"])
  }
};
export const Color1 = {
  viewMode: 'docs',
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: {
    colors: ColorParser.gets("color-1", false, ["color-1-opacity", "color-1-lg", "color-1-md", "color-1-sg"])
  }
};
export const Color2 = {
  viewMode: 'docs',
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: {
    colors: ColorParser.gets("color-2", false, ["color-2-opacity", "color-2-lg", "color-2-md", "color-2-sg"])
  }
};
export const Other = {
  viewMode: 'docs',
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: {
    colors: ColorParser.gets("other", false, ["others-black-opacity", "others-white-opacity"])
  }
};