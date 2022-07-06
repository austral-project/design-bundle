export default class MiscEvent {
  static dispatch (type, data, target = document) {
    const options = { cancelable: true };
    if (data) {
      options.detail = data;
    }
    if(target) {
      target.dispatchEvent(new CustomEvent(type, options));
    }
  }
  static addListener (type, callback, target = document) {
    if(target) {
      if(Array.isArray(type))
      {
        type.forEach((event) => {
          target.addEventListener(event, callback, false);
        });
      }
      else
      {
        target.addEventListener(type, callback, false);
      }
    }
  }
  static removeListener (type, callback, target = document) {
    target.removeEventListener(type, callback, false);
  }
}