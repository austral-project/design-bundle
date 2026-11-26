/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// stories/Homepage.stories.js
import { twig } from '@sensiolabs/storybook-symfony-webpack5';
import LibLoader from "@austral/design/core/LibLoader";

LibLoader.addGSAPPlugin('ScrollTrigger', async () => {
  const { ScrollTrigger } = await import(/* webpackChunkName: "gsap-scrollTrigger" */ 'gsap/ScrollTrigger');
  return ScrollTrigger;
});
LibLoader.addGSAPPlugin('SplitText', async () => {
  const { SplitText } = await import(/* webpackChunkName: "gsap-splitText" */ 'gsap/SplitText');
  return SplitText;
});
LibLoader.addGSAPPlugin('InertiaPlugin', async () => {
  const { InertiaPlugin } = await import(/* webpackChunkName: "gsap-inertiaPlugin" */ 'gsap/InertiaPlugin');
  return InertiaPlugin;
});
await LibLoader.gsap();
await LibLoader.loadGSAPPlugin('SplitText');
await LibLoader.loadGSAPPlugin('ScrollTrigger');
await LibLoader.loadGSAPPlugin('InertiaPlugin');
await LibLoader.clipboard();
await LibLoader.sweetalert();

export default {
  render: (args) => ({
    template: twig`
    `
  })
};

export const Default = {
  viewMode: 'docs',
  tags:     ['autodocs', '!dev'],
};