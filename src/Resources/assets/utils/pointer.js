/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { utils } from "@austral/design";

export const getPointerPos = (event) => {
  const body = document.body;
  const docEl = document.documentElement;
  let posx = 0, posy = 0;
  if (!event) event = window.event;

  if(event.touches?.length) {
    posx = event.touches[0].pageX;
    posy = event.touches[0].pageY;
  } else if(event.pageX || event.pageY) {
    posx = event.pageX; posy = event.pageY;
  } else if(event.clientX || event.clientY) {
    posx = event.clientX + body.scrollLeft + docEl.scrollLeft;
    posy = event.clientY + body.scrollTop + docEl.scrollTop;
  }
  return { x: posx, y: posy };
};

export const getMouseDistance = (mousePos, lastMousePos) =>
  utils.math.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);
