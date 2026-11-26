/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const getCookie = (cname) => {
  const name = cname + "=";
  const decoded = decodeURIComponent(document.cookie);
  const ca = decoded.split(';');
  for(let c of ca) {
    c = c.trim();
    if (c.indexOf(name) === 0) return c.substring(name.length);
  }
  return "";
};

export const offset = (element) => {
  const parentRect = element.parentElement.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();
  return {
    top: elemRect.top - parentRect.top,
    right: elemRect.right - parentRect.right,
    bottom: elemRect.bottom - parentRect.bottom,
    left: elemRect.left - parentRect.left
  };
};

export const setClipPath = (elements, numRows, numCols) => {
  if(elements.length !== numRows * numCols) {
    console.error('clipInnerElements.length !== numRows * numCols');
    return;
  }
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const idx = i * numCols + j;
      const top = (100 / numRows) * i + '%';
      const bottom = (100 / numRows) * (i + 1) + '%';
      const left = (100 / numCols) * j + '%';
      const right = (100 / numCols) * (j + 1) + '%';
      elements[idx].style.clipPath = `polygon(${left} ${top}, ${right} ${top}, ${right} ${bottom}, ${left} ${bottom})`;
    }
  }
};

export const removeClassByPrefix = (node, prefix) => {
  const regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
  node.className = node.className.replace(regx, '');
  return node;
};

export const calcFinalSize = (origW, origH, maxW, maxH) => {
  let finalW = origW, finalH = origH;
  if (origW > origH) {
    if (origW > maxW) { finalH *= maxW / origW; finalW = maxW; }
    if(finalH > maxH){ finalH = maxH; finalW = origW * maxH / origH; }
  } else {
    if(origH > maxH){ finalW *= maxH / origH; finalH = maxH; }
  }
  return { width: finalW, height: finalH };
};

export const getScrollBarWidth = () => {
  const inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  const outer = document.createElement('div');
  Object.assign(outer.style, {
    position: "absolute",
    top: "0px",
    left: "0px",
    visibility: "hidden",
    width: "200px",
    height: "150px",
    overflow: "hidden"
  });
  outer.appendChild(inner);
  document.body.appendChild(outer);

  const w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 === w2) w2 = outer.clientWidth;
  document.body.removeChild(outer);
  return w1 - w2;
};

export const width = (el, type = "full", accepted = "all") => {
  let size = 0;
  if (type === 'inner' || type === "content") size = el.clientWidth;
  else if (type === 'outer' || type === "full") size = el.offsetWidth;

  if (type === 'content') size -= getOffsetX(el, "padding", accepted);
  else if (type === 'full') size += getOffsetX(el, "margin", accepted);

  return size;
};

export const height = (el, type = "full", accepted = "all") => {
  let size = 0;
  if (type === 'inner' || type === "content") size = el.clientHeight;
  else if (type === 'outer' || type === "full") size = el.offsetHeight;

  if (type === 'content') size -= getOffsetY(el, "padding", accepted);
  else if (type === 'full') size += getOffsetY(el, "margin", accepted);

  return size;
};

export const getOffsetX = (el, name, accepted = "all") => {
  const s = window.getComputedStyle(el);
  let offsetRight = (accepted === "all" || accepted === "right" || accepted === "middle") ? parseInt(s.getPropertyValue(name+'-right')) : 0;
  let offsetLeft  = (accepted === "all" || accepted === "left" || accepted === "middle") ? parseInt(s.getPropertyValue(name+'-left')) : 0;
  let offset = offsetRight + offsetLeft;
  return accepted === "middle" ? offset/2 : offset;
};

export const getOffsetY = (el, name, accepted = "all") => {
  const s = window.getComputedStyle(el);
  let offsetTop = (accepted === "all" || accepted === "top" || accepted === "middle") ? parseInt(s.getPropertyValue(name+'-top')) : 0;
  let offsetBottom = (accepted === "all" || accepted === "bottom" || accepted === "middle") ? parseInt(s.getPropertyValue(name+'-bottom')) : 0;
  let offset = offsetTop + offsetBottom;
  return accepted === "middle" ? offset/2 : offset;
};

export const coordinate = (elem, origin = window) => {
  const box = elem.getBoundingClientRect();
  return {
    top: box.top + (origin === window ? origin.scrollY : origin.scrollTop),
    right: box.right + (origin === window ? origin.scrollX : origin.scrollLeft),
    bottom: box.bottom + (origin === window ? origin.scrollY : origin.scrollTop),
    left: box.left + (origin === window ? origin.scrollX : origin.scrollLeft)
  };
};

export const getContextMenuPostion = (event, contextMenu) => {
  const mousePosition = { x: event.pageX, y: event.pageY };
  const menuDimension = { x: contextMenu.offsetWidth, y: contextMenu.offsetHeight };
  const menuPostion = {};

  menuPostion.x = (mousePosition.x + menuDimension.x > window.offsetWidth + window.scrollLeft)
    ? mousePosition.x - menuDimension.x
    : mousePosition.x;

  menuPostion.y = (mousePosition.y + menuDimension.y > window.offsetHeight + window.scrollTop)
    ? mousePosition.y - menuDimension.y
    : mousePosition.y;

  return menuPostion;
};

export const elementInViewport = (el) => {
  let top = el.offsetTop, left = el.offsetLeft, width = el.offsetWidth, height = el.offsetHeight;
  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }
  return top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    (top + height) <= (window.pageYOffset + window.innerHeight) &&
    (left + width) <= (window.pageXOffset + window.innerWidth);
};

export const elementInViewportOverrunY = (el) => {
  let top = el.offsetTop, height = el.offsetHeight;
  while(el.offsetParent) { el = el.offsetParent; top += el.offsetTop; }
  if ((top + height) > (window.pageYOffset + window.innerHeight)) return "bottom";
  if (top < window.pageYOffset) return "top";
  return null;
};

export const isTouchDevice = () => {
  try { document.createEvent("TouchEvent"); return true; }
  catch(e){ return false; }
};

export const isMobileSize = () => window.matchMedia("(max-width: 1024px)").matches;

export const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
