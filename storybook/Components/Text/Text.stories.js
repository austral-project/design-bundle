/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Text.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';

export default {
  render: (args) => ({
    tags: ['autodocs'],
    template: twig`
      <twig:Austral:Text
        value="{{ value }}"
        theme="{{ theme }}"
        size="{{ size }}"
        wysiwyg="{{ true }}"
      />
    `
  })
};

const argTypes = {
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
    options: ['lg', 'md', 'sm'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'md'}
    }
  },
  value: {
    name: 'Value',
    description: 'Value content',
    control: {type: 'text'},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
};

export const Demo = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: {
    theme: "default",
    size: "md",
    value: "<p>Le Lorem Ipsum est simplement du faux texte employé dans la <a href=''>composition</a> et la mise en page avant <strong>impression</strong>. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des <em>morceaux</em> de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum.</p>" +
      "<ul><li>Element 1</li><li>Element 2</li><li>Element 3</li><li>Element 4</li></ul>" +
      "<p>Le Lorem Ipsum est simplement du faux texte employé dans la <a href=''>composition</a> et la mise en page avant <strong>impression</strong>. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des <em>morceaux</em> de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum.</p>" +
      "<ol><li>Element 1</li><li>Element 2</li><li>Element 3</li><li>Element 4</li></ol>"
  }
};

export const Default = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: {
    theme: "default",
    size: "md",
    value: "<p>Le Lorem Ipsum est simplement du faux texte employé dans la <a href=''>composition</a> et la mise en page avant <strong>impression</strong>. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des <em>morceaux</em> de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum.</p>" +
      "<ul><li>Element 1</li><li>Element 2</li><li>Element 3</li><li>Element 4</li></ul>" +
      "<p>Le Lorem Ipsum est simplement du faux texte employé dans la <a href=''>composition</a> et la mise en page avant <strong>impression</strong>. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des <em>morceaux</em> de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum.</p>" +
      "<ol><li>Element 1</li><li>Element 2</li><li>Element 3</li><li>Element 4</li></ol>"
  }
};

export const SizeLg = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: {
    theme: "default",
    size: "lg",
    value: "<p>Le Lorem Ipsum est simplement du faux texte employé dans la <a href=''>composition</a> et la mise en page avant <strong>impression</strong>. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des <em>morceaux</em> de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum.</p>" +
      "<ul><li>Element 1</li><li>Element 2</li><li>Element 3</li><li>Element 4</li></ul>" +
      "<p>Le Lorem Ipsum est simplement du faux texte employé dans la <a href=''>composition</a> et la mise en page avant <strong>impression</strong>. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des <em>morceaux</em> de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum.</p>" +
      "<ol><li>Element 1</li><li>Element 2</li><li>Element 3</li><li>Element 4</li></ol>"
  }
};

export const SizeSm = {
  tags:     ['autodocs'],
  argTypes: argTypes,
  args: {
    theme: "default",
    size: "sm",
    value: "<p>Le Lorem Ipsum est simplement du faux texte employé dans la <a href=''>composition</a> et la mise en page avant <strong>impression</strong>. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des <em>morceaux</em> de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum.</p>" +
      "<ul><li>Element 1</li><li>Element 2</li><li>Element 3</li><li>Element 4</li></ul>" +
      "<p>Le Lorem Ipsum est simplement du faux texte employé dans la <a href=''>composition</a> et la mise en page avant <strong>impression</strong>. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des <em>morceaux</em> de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum.</p>" +
      "<ol><li>Element 1</li><li>Element 2</li><li>Element 3</li><li>Element 4</li></ol>"
  }
};
