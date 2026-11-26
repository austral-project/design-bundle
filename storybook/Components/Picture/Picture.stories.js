import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import { useArgs, useEffect } from '@storybook/preview-api'; // SB 9 : 'storybook/preview-api'
import { IllustrationParser } from "../../_helper/IllustrationParser";

const illustrations = (IllustrationParser.gets(true) ?? [])
  .map((item) => (typeof item === 'string' ? item : item.url))
  .filter(Boolean);

// Un seul endroit pour les breakpoints
const BREAKPOINTS = [
  "(max-width: 600px)",
  "(max-width: 1025px)",
  "(max-width: 1440px)",
  "(max-width: 1600px)",
];

const buildSources = (url) =>
  url ? BREAKPOINTS.map((media) => ({ srcset: url, media })) : [];

const argTypes = {
  lazyLoading: {
    name: 'Lazy loading',
    description: 'Lazy loading value for the picture',
    control: { type: 'boolean', required: false },
    table: { type: { summary: 'boolean' } }
  },
  lazyLoadingOffset: {
    name: 'Lazy loading offset',
    description: 'Lazy loading offset value for the picture',
    control: { type: 'text', required: false },
    table: { type: { summary: 'int' } }
  },
  scrollAnimate: {
    name: 'Scroll animate',
    description: 'Scroll animate value for the picture',
    control: { type: 'text', required: false },
    table: { type: { summary: 'text' } }
  },
  original: {
    name: 'Path picture',
    description: 'Path to the picture (miniature and sources follow automatically)',
    options: illustrations,
    control: { type: 'select', required: false },
    table: { type: { summary: 'string' }, defaultValue: { summary: 'null' } }
  },
  miniature: {
    name: 'Miniature',
    description: 'Synchronized with "Path picture"',
    control: false,
    table: { type: { summary: 'string' } }
  },
  sources: {
    name: 'Sources',
    description: 'Generated from "Path picture" for each breakpoint',
    control: false,
    table: { type: { summary: 'array<{srcset, media}>' } }
  },
  objectFit: {
    name: 'Object fit',
    description: '',
    options: ["default", "cover", 'contain'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'cover'}
    }
  },
  size: {
    name: 'Size',
    description: '',
    options: ["default",
      "height_auto",
      "height_100vh",
      "square",
      "classic",
      "photo",
      "widescreen",
      "classic_vertical",
      "photo_vertical",
      "story",
    ],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'default'}
    }
  },
  alt: {
    name: 'Alt',
    description: 'Alt value for the picture',
    control: { type: 'text', required: false },
    table: { type: { summary: 'string' } }
  }
};

const initial = illustrations[0] ?? null;

const args = {
  lazyLoading: false,
  lazyLoadingOffset: "",
  scrollAnimate: "",
  objectFit: "default",
  size: "default",
  original: initial,
  miniature: initial,
  sources: buildSources(initial),
  alt: "Alt picture"
};

// Recalcule miniature + sources quand "original" change
const syncPictureArgs = (Story) => {
  const [{ original }, updateArgs] = useArgs();

  useEffect(() => {
    updateArgs({ miniature: original, sources: buildSources(original) });
  }, [original]);

  return Story();
};

export default {
  title: 'Components/Picture',
  viewMode: 'canvas',
  tags: ['autodocs'],
  decorators: [syncPictureArgs],
  render: () => ({
    template: twig`
      <twig:Austral:Picture lazyLoading="{{ lazyLoading }}"
        lazyLoadingOffset="{{ lazyLoadingOffset }}"
        scrollAnimate="{{ scrollAnimate }}"
        objectFit="{{ objectFit }}"
        sources="{{ sources }}"
        original="{{ original }}"
        miniature="{{ miniature }}"
        alt="{{ alt }}"
        size="{{ size }}"
      />
    `
  })
};


export const Default = {
  argTypes: argTypes,
  args: args
};
