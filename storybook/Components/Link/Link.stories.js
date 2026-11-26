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
  htmlTag: {
    name: 'Html Tag',
    description: 'Html Tag value',
    options: ['a', 'span', 'button'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'button'}
    }
  },
  size: {
    name: 'Size link',
    description: 'Size value',
    options: ['lg', 'md', 'sm'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'medium'}
    }
  },
  theme: {
    name: 'Theme link',
    description: 'Theme value',
    options: ["default", 'reverse'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: "default"}
    }
  },
  entitled: {
    name: 'Entitled',
    description: 'Entitled',
    control: {type: 'text'},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  title: {
    name: 'Title',
    description: 'Title',
    control: {type: 'text'},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  href: {
    name: 'URL',
    description: 'Link url',
    control: {type: 'text', required: false},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  disabled: {
    name: 'Disabled',
    description: 'Disabled button',
    control: {type: 'boolean'},
  },
  isInternal: {
    name: 'Internal',
    description: 'Link is internal ?',
    control: {type: 'boolean'},
  },
  target: {
    name: 'Target',
    description: 'Target attribute',
    options: ['', '_blank'],
    control: {type: 'select', required: false},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
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
  pictoRight: {
    name: 'Picto right',
    description: 'Picto to the right of the entitled',
    options: PictoParser.getsKey("all", true),
    control: {type: 'select', required: false},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
};

const args = {
  areaTheme: "default",
  htmlTag: "a",
  entitled: "Link Value",
  size: "md",
  theme: "default",
  title: "",
  href: "/url",
  target: "",
  disabled: false,
  isInternal: true,
  picto: "",
  pictoRight: "",
};

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  argTypes,
  render: (args) => ({
    template: twig`
      <div class="area-container area-storybook-demo {{ areaTheme }}">
        <twig:Austral:Link
          htmlTag="{{ htmlTag }}"
          size="{{ size }}"
          entitled="{{ entitled }}"
          title="{{ title }}"
          href="{{ href }}"
          target="{{ target }}"
          theme="{{ theme }}"
          disabled="{{ disabled }}"
        >
          ${args.picto ? '<twig:block name="picto"><twig:Austral:Picto name="'+args.picto+'" /></twig:block>' : ''}
          ${args.pictoRight ? '<twig:block name="pictoRight"><twig:Austral:Picto name="'+args.pictoRight+'"/></twig:block>' : ''}
        </twig:Austral:Link>
      </div>
      `
  }),
};

export const Default = {
  args: args
};
