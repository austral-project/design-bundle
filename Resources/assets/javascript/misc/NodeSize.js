export default class MiscNodeSize {

  static width (el, type = "full", accepted = "all") {
    let size = 0;
    if (type === 'inner' || type === "content") {
      size = el.clientWidth;
    }
    else if (type === 'outer' || type === "full") {
      size = el.offsetWidth;
    }
    if (type === 'content') {
      size = size - MiscNodeSize.getOffsetX(el, "padding", accepted);
    }
    else if (type === 'full') {
      size =  size + MiscNodeSize.getOffsetX(el, "margin", accepted);
    }
    return size;
  }

  static height (el, type = "full", accepted = "all") {
    let size = 0;
    if (type === 'inner' || type === "content") {
      size = el.clientHeight;
    }
    else if (type === 'outer' || type === "full") {
      size = el.offsetHeight;
    }
    if (type === 'content') {
      size = size - MiscNodeSize.getOffsetY(el, "padding", accepted);
    }
    else if (type === 'full') {
      size =  size + MiscNodeSize.getOffsetY(el, "margin", accepted);
    }
    return size;
  }

  static getOffsetX(el, name, accepted = "all") {
    let s = window.getComputedStyle(el, null);
    let offsetRight = (accepted === "all" || accepted === "right" || accepted === "middle") ? parseInt(s.getPropertyValue(name+'-right')) : 0
    let offsetLeft = (accepted === "all" || accepted === "left" || accepted === "middle") ? parseInt(s.getPropertyValue(name+'-left')) : 0
    let offset = offsetRight+offsetLeft;
    if(accepted === "middle") {
      offset = offset/2;
    }
    return offset;
  }

  static getOffsetY(el, name, accepted = "all") {
    let s = window.getComputedStyle(el, null);
    let offsetTop = (accepted === "all" || accepted === "top" || accepted === "middle") ? parseInt(s.getPropertyValue(name+'-top')) : 0
    let offsetBottom = (accepted === "all" || accepted === "bottom" || accepted === "middle") ? parseInt(s.getPropertyValue(name+'-bottom')) : 0
    let offset = offsetTop+offsetBottom;
    if(accepted === "middle") {
      offset = offset/2;
    }
    return offset;
  }

  static getContextMenuPostion(event, contextMenu) {

    var mousePosition = {};
    var menuPostion = {};
    var menuDimension = {};

    menuDimension.x = contextMenu.offsetWidth;
    menuDimension.y = contextMenu.offsetHeight;
    mousePosition.x = event.pageX;
    mousePosition.y = event.pageY;

    if (mousePosition.x + menuDimension.x > window.offsetWidth + window.scrollLeft) {
      menuPostion.x = mousePosition.x - menuDimension.x;
    } else {
      menuPostion.x = mousePosition.x;
    }

    if (mousePosition.y + menuDimension.y > window.offsetHeight + window.scrollTop) {
      menuPostion.y = mousePosition.y - menuDimension.y;
    } else {
      menuPostion.y = mousePosition.y;
    }

    return menuPostion;
  }

  static elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      (top + height) <= (window.pageYOffset + window.innerHeight) &&
      (left + width) <= (window.pageXOffset + window.innerWidth)
    );
  }

  static elementInViewportOverrunY(el) {
    var top = el.offsetTop;
    var height = el.offsetHeight;

    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
    }

    if((top + height) > (window.pageYOffset + window.innerHeight)) {
      return "bottom";
    }
    else if(top < window.pageYOffset) {
      return "top";
    }
    return null
  }

}