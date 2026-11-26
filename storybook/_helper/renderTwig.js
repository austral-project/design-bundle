/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { html as beautifyHtml } from 'js-beautify';
// Route of the Symfony application hosting the Storybook: renders a Twig template with the args of the story.
const RENDER_URL = '/storybook/render/';

export const fetchTwigComponentHtml = async (templatePath, args = {}) => {

  const response = await fetch(RENDER_URL+templatePath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      args
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twig rendering failed: ${error}`);
  }
  const { html } = await response.json();
  let cleanedHtml = beautifyHtml(html, {
    indent_size: 2,
    preserve_newlines: true,
    max_preserve_newlines: 1,
    wrap_line_length: 0,
    content_unformatted: [],
  });
  return cleanedHtml.trim();
};