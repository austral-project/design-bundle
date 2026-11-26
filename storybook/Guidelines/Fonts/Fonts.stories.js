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
import { FontParser } from '../../_helper/FontParser';

export default {
  render: (args) => ({
    template: twig`
      <ul class="storybook-card-container full">
        ${args.fonts.map(font =>
          `<li class="storybook-card-content font-content" style="--tuile-width: 100%">
            <span class="storybook-card-title ">${font.classMaster}</span>
            <span class="${ font.classMaster } font-value">Lorem Ipsum</span>
            <div class="font-contexts">
              <div class="font-context">
                <span class="font-context-title">Desktop</span>
                <ul class="storybook-card-bottom">
                  <li data-clipboard data-clipboard-value='${ font.contexts.desktop.family }' data-clipboard-message="Font family is copied !"><span class="keyname">font-family :</span><span class="value">${font.contexts.desktop.family}</span></li>
                  <li data-clipboard data-clipboard-value="${ font.contexts.desktop.size }" data-clipboard-message="Font size is copied !"><span class="keyname">font-size :</span><span class="value">${font.contexts.desktop.size}</span></li>
                  <li data-clipboard data-clipboard-value="${ font.contexts.desktop["line-height"] }" data-clipboard-message="Line height is copied !"><span class="keyname">line-height :</span><span class="value">${font.contexts.desktop["line-height"] ? font.contexts.desktop["line-height"] : "normal"}</span></li>
                  <li data-clipboard data-clipboard-value="${ font.contexts.desktop.weight }" data-clipboard-message="Line height is copied !"><span class="keyname">font-weight :</span><span class="value">${font.contexts.desktop.weight ? font.contexts.desktop.weight : "400"}</span></li>
                  <li data-clipboard data-clipboard-value="${ font.contexts.desktop["letter-spacing"] }" data-clipboard-message="Line height is copied !"><span class="keyname">letter-spacing :</span><span class="value">${font.contexts.desktop["letter-spacing"] ? font.contexts.desktop["letter-spacing"] : "normal"}</span></li>
                </ul>
              </div>
              <div class="font-context">
                <span class="font-context-title">Mobile</span>
                <ul class="storybook-card-bottom">
                  <li data-clipboard data-clipboard-value="${ font.contexts.mobile.family }" data-clipboard-message="Font family is copied !"><span class="keyname">font-family :</span><span class="value">${font.contexts.mobile.family}</span></li>
                  <li data-clipboard data-clipboard-value="${ font.contexts.mobile.size }" data-clipboard-message="Font size is copied !"><span class="keyname">font-size :</span><span class="value">${font.contexts.mobile.size}</span></li>
                  <li data-clipboard data-clipboard-value="${ font.contexts.mobile["line-height"] }" data-clipboard-message="Line height is copied !"><span class="keyname">line-height :</span><span class="value">${font.contexts.mobile["line-height"] ? font.contexts.mobile["line-height"] : "normal"}</span></li>
                  <li data-clipboard data-clipboard-value="${ font.contexts.mobile.weight }" data-clipboard-message="Line height is copied !"><span class="keyname">font-weight :</span><span class="value">${font.contexts.mobile.weight ? font.contexts.mobile.weight : "400"}</span></li>
                  <li data-clipboard data-clipboard-value="${ font.contexts.mobile["letter-spacing"] }" data-clipboard-message="Line height is copied !"><span class="keyname">letter-spacing :</span><span class="value">${font.contexts.mobile["letter-spacing"] ? font.contexts.mobile["letter-spacing"] : "normal"}</span></li>
                </ul>
              </div>
            </div>
          </li>`
    ).join('')}
      </ul>
    `
  })
};
const argTypes = {
  fonts: {
    table: {
      disable: true
    }
  }
};
export const Font1 = {
  viewMode: 'docs',
  tags:     ['autodocs', "!dev"],
  argTypes: argTypes,
  args: {
    fonts: FontParser.gets("font", false, ["font-2", "font-button", "font-form"])
  }
};
export const Font2 = {
  viewMode: 'docs',
  tags:     ['autodocs', "!dev"],
  argTypes: argTypes,
  args: {
    fonts: FontParser.gets("font", false, ["font-1", "font-button", "font-form"])
  }
};
export const Button = {
  viewMode: 'docs',
  tags:     ['autodocs', "!dev"],
  argTypes: argTypes,
  args: {
    fonts: FontParser.gets("font", false, ["font-1", "font-2", "font-form"])
  }
};

export const Form = {
  viewMode: 'docs',
  tags:     ['autodocs', "!dev"],
  argTypes: argTypes,
  args: {
    fonts: FontParser.gets("font", false, ["font-1", "font-2", "font-button"])
  }
};
