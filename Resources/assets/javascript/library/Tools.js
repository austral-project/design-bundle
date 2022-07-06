export default class Tools {

  constructor() {

  }

  /**
   * @param orrigineW
   * @param OrrigineH
   * @param maxW
   * @param maxH
   * @returns {{width: number, height}}
   */
  static calcFinalSize(orrigineW, OrrigineH, maxW, maxH) {
    var tailleFinalW = orrigineW,
      tailleFinalH = OrrigineH;
    if (orrigineW > OrrigineH)
    {
      if (orrigineW > maxW)
      {
        tailleFinalH *= maxW / orrigineW;
        tailleFinalW = maxW;
      }

      if(tailleFinalH > maxH)
      {
        tailleFinalH = maxH;
        tailleFinalW = orrigineW*maxH / OrrigineH;
      }
    }
    else
    {
      if (OrrigineH > maxH)
      {
        tailleFinalW *= maxH / OrrigineH;
        tailleFinalH = maxH;
      }
    }
    return { width: tailleFinalW, height: tailleFinalH };
  }

  /**
   * @param bytes
   * @param si
   * @returns {string}
   */
  static fileSizeHumanize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['Ko','Mo','Go','To','Po','Eo','Zo','Yo'];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
  }

  static getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  static offset(element)
  {
    var parentRect = element.parentElement.getBoundingClientRect(),
      elemRect = element.getBoundingClientRect();
    return {
      top: elemRect.top - parentRect.top,
      right: elemRect.right - parentRect.right,
      bottom: elemRect.bottom - parentRect.bottom,
      left: elemRect.left - parentRect.left
    };
  }

  static fileExists(url) {
    if(url){
      var req = new XMLHttpRequest();
      req.open('GET', url, false);
      req.send();
      return req.status === 200;
    } else {
      return false;
    }
  }

  static listAllEventListeners() {
    const all = {};
    for(let tag of document.querySelectorAll('*')) {
      console.log(tag);
    }
    return all
  }

}