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
import {PictoParser} from "../../_helper/PictoParser";

const argTypes = {
  picto: {
    name: 'Picto left & center',
    description: 'Picto to the left of the entitled or replace the entitled',
    options: PictoParser.getsKey("all", true),
    control: {type: 'select', required: false},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  size: {
    name: 'Size',
    description: 'Size value',
    options: ['lg', 'md', 'sm'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'md'}
    }
  },
};
const args = {
  picto: "",
  size: "md"
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    tags: ['autodocs'],
    template: twig`
      <twig:Austral:Picto name="{{ picto }}" size="{{ size }}" />
    `
  })
};

export const Default = {
  argTypes: argTypes,
  args: args
};
