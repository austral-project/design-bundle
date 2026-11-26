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
import { PictoParser } from '../../_helper/PictoParser';

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    tags: ['autodocs'],
    template: twig`
      <div class="section-container section-storybook-demo {{ sectionTheme }}">
        <twig:Austral:Button
          htmlTag="{{ htmlTag }}"
          entitled="{{ entitled }}"
          title="{{ title }}"
          href="{{ href }}"
          size="{{ size }}"
          align="{{ align }}"
          target="{{ target }}"
          theme="{{ theme }}"
          color="{{ color }}"
          disabled="{{ disabled }}"
          full="{{ full }}"
          hideEntitled="{{ hideEntitled }}"
          additional="{{ additional }}"
        >
          ${args.picto ? '<twig:block name="picto"><twig:Austral:Picto name="'+args.picto+'" /></twig:block>' : ''}
          ${args.pictoRight ? '<twig:block name="pictoRight"><twig:Austral:Picto name="'+args.pictoRight+'"/></twig:block>' : ''}
        </twig:Austral:Button>
      </div>
    `
  })
};

const argTypes = {
  sectionTheme: {
    name: 'Section color theme',
    description: 'Change the area color',
    options: ['section-theme-primary', 'section-theme-secondary'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'section-theme-primary'}
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
  theme: {
    name: 'Theme',
    description: 'Theme element',
    options: ["solid", "soft", "outline", "ghost", "link"],
    control: {type: 'radio', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'default'}
    }
  },
  color: {
    name: 'Color',
    description: 'Color element',
    options: ['primary', 'secondary', "tertiary"],
    control: {type: 'radio', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'default'}
    }
  },
  size: {
    name: 'Size',
    description: 'Size element',
    options: ['lg', 'md', 'sm'],
    control: {type: 'radio', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'large'}
    }
  },
  align: {
    name: 'Align',
    description: 'Align element',
    options: ['centered', 'extended'],
    control: {type: 'radio', required: true },
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'center'}
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
  additional: {
    name: 'Additional Text',
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
  full: {
    name: 'Full',
    description: 'Is full button',
    control: {type: 'boolean'},
  },
  hideEntitled: {
    name: 'Hide entitled',
    description: 'Is full button',
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
  sectionTheme: "section-theme-primary",
  htmlTag: "button",
  entitled: "Button CTA",
  additional: "",
  title: "",
  href: null,
  size: "md",
  align: "centered",
  target: "",
  theme: "solid",
  color: "primary",
  disabled: false,
  full: false,
  hideEntitled: false,
  picto: "",
  pictoRight: "",
};

export const Default = {
  tags:     ['autodocs', '!dev'],
  argTypes: argTypes,
  args: args
};

const argsTypeTheme = { ...argTypes };
argsTypeTheme.theme = {
  table: {
    disable: true,
  },
};
export const ThemeSolidDefault = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "solid",
    color: "primary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeSolidSecondary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "solid",
    color: "secondary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeSolidTertiary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "solid",
    color: "tertiary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};

export const ThemeSoftDefault = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "soft",
    color: "primary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeSoftSecondary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "soft",
    color: "secondary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeSoftTertiary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "soft",
    color: "tertiary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};

export const ThemeOutlineDefault = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "outline",
    color: "primary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeOutlineSecondary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "outline",
    color: "secondary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeOutlineTertiary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "outline",
    color: "tertiary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};

export const ThemeGhostDefault = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "ghost",
    color: "primary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeGhostSecondary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "ghost",
    color: "secondary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeGhostTertiary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "ghost",
    color: "tertiary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeLinkDefault = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "link",
    color: "primary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeLinkSecondary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "link",
    color: "secondary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
export const ThemeLinkTertiary = {
  argTypes: argsTypeTheme,
  args: {
    sectionTheme: "section-theme-primary",
    htmlTag: "button",
    entitled: "Button CTA",
    additional: "",
    title: "",
    href: null,
    size: "md",
    align: "centered",
    target: "",
    theme: "link",
    color: "tertiary",
    disabled: false,
    full: false,
    hideEntitled: false,
    picto: "",
    pictoRight: "",
  }
};
