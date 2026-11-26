/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Title.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';

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
    options: ['h1', 'h2', 'h3', 'h4', 'h5', "span"],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'h2'}
    }
  },
  theme: {
    name: 'Theme',
    description: 'Theme value',
    options: ['default'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'default'}
    }
  },
  size: {
    name: 'Size',
    description: 'Size value',
    options: ['default', 'xl', 'lg', 'md', 'sm', "xs"],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'default'}
    }
  },
};

const args = {
  sectionTheme: "section-theme-primary",
  htmlTag: "h2",
  size: "default",
  theme: "default",
  before: "",
  value: "This is title",
  after: "",
  center: false,
  text: "",
  link: "",
}

export default {
  viewMode: 'canvas',
  tags: ['autodocs'],
  render: (args) => ({
    tags: ['autodocs'],
    template: twig`
      <div class="area-container area-storybook-demo {{ sectionTheme }}">
        <twig:Austral:Title
          htmlTag="{{ htmlTag }}"
          size="{{ size }}"
          theme="{{ theme }}"
          value="{{ value }}"
          center="{{ center }}"
          text="{{ text }}"
        >
          ${args.before ? '<twig:block name="before">'+args.before+'</twig:block>' : ''}
          ${args.after ? '<twig:block name="after">'+args.after+'</twig:block>' : ''}
          ${args.link ? '<twig:block name="link"><twig:Austral:Link htmlTag="a" entitled="{{ link }}"></twig:Austral:Link></twig:block>' : ''}
        </twig:Austral:Title>
      </div>
    `
  })
};

export const Demo = {
  tags:     ['autodocs', '!dev'],
  viewMode: 'docs',
  argTypes: argTypes,
  args: args
};

const argsDefault = {
  sectionTheme: "section-theme-primary",
  htmlTag: "h2",
  size: "default",
  theme: "default",
  before: "",
  value: "This is title",
  after: "",
  center: false,
  text: "",
  link: "",
}

export const Default = {
  argTypes: argTypes,
  args: argsDefault
};

const argsWithBefore = {
  sectionTheme: "section-theme-primary",
  htmlTag: "h2",
  size: "default",
  theme: "default",
  value: "Title",
  before: "Sup title",
  center: false,
  text: "",
  link: "",
}

export const WithBefore = {
  argTypes: argTypes,
  args: argsWithBefore
};

const argsWithAfter = {
  sectionTheme: "section-theme-primary",
  htmlTag: "h2",
  size: "default",
  theme: "default",
  value: "Title",
  after: "Sub title",
  center: false,
  text: "",
  link: "",
}

export const WithAfter = {
  argTypes: argTypes,
  args: argsWithAfter
};

export const TitlesList = {
  argTypes: argTypes,
  args: argsWithAfter,
  render: (args) => ({
    tags: ['autodocs'],
    template: twig`
      <div class="area-container mb20 area-storybook-demo {{ sectionTheme }}">
        <twig:Austral:Title
          htmlTag="h1"
          theme="title-xl"
          value="This is a title H1 - theme XL"
          center="{{ false }}"
          headline=""
        >
        </twig:Austral:Title>
      </div>
      <div class="area-container mb20 area-storybook-demo {{ sectionTheme }}">
        <twig:Austral:Title
          htmlTag="h1"
          theme="default"
          value="This is a title H1"
          center="{{ false }}"
          headline=""
        >
        </twig:Austral:Title>
      </div>
      <div class="area-container mb20 area-storybook-demo {{ sectionTheme }}">
        <twig:Austral:Title
          htmlTag="h2"
          theme="default"
          value="This is a title H2"
          center="{{ false }}"
          headline=""
        >
        </twig:Austral:Title>
      </div>
      <div class="area-container mb20 area-storybook-demo {{ sectionTheme }}">
        <twig:Austral:Title
          htmlTag="h3"
          theme="default"
          value="This is a title H3"
          center="{{ false }}"
          headline=""
        >
        </twig:Austral:Title>
      </div>
      <div class="area-container mb20 area-storybook-demo {{ sectionTheme }}">
        <twig:Austral:Title
          htmlTag="h4"
          theme="default"
          value="This is a title H4"
          center="{{ false }}"
          headline=""
        >
        </twig:Austral:Title>
      </div>
      <div class="area-container area-storybook-demo {{ sectionTheme }}">
        <twig:Austral:Title
          htmlTag="h5"
          theme="default"
          value="This is a title H5"
          center="{{ false }}"
          headline=""
        >
        </twig:Austral:Title>
      </div>
    `
  })
};
