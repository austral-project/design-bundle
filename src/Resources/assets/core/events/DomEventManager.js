/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {Debug} from "@austral/design";

/**
 * A utility class for managing custom DOM events. Provides methods for dispatching,
 * adding, and removing event listeners on DOM elements or the global document object.
 */
export default class DomEventManager {

  static _registry = new WeakMap();

  /**
   * Dispatches a custom event of the specified type with optional data and target.
   *
   * @param {string|null} type - The type of the event to dispatch. Defaults to null.
   * @param {Object} data - The data to include in the event's detail. Defaults to an empty object.
   * @param {EventTarget} target - The target on which to dispatch the event. Defaults to the document.
   * @return {void} - Does not return a value.
   */
  static dispatch(type = null, data ={}, target = document) {
    if (!type || !target) return;
    target.dispatchEvent(
      new CustomEvent(type, {
        detail: data,
        cancelable: true,
      })
    );
  }

  /**
   * Dispatches a custom event of the specified type with optional data and target.
   * Wraps the listener function in a try-catch block to handle errors gracefully.
   *
   * @param {string} type - The event listener function to wrap.
   * @param {Function} callback - The event listener function to wrap.
   * @return {Function} - The wrapped event listener function.
   */
  static _createSafeListener(type, callback) {
    return async (event) => {
      try {
        await callback(event);
      } catch (err) {
        Debug.log(`Error in listener for "${type}"`, err);
      }
    };
  }

  /**
   * Adds an event listener or multiple event listeners of the specified type(s) to a specific target element.
   *
   * @param {string|string[]} type - The type of the event(s) to listen for. Can be a string for a single event type
   * or an array of strings for multiple event types.
   * @param {Function} callback - The event handler function to call when the event occurs.
   * @param {EventTarget} [target=document] - The target object on which to add the event listener(s). Defaults to document.
   * @param {boolean|Object} [options=false] - Optional parameter that specifies characteristics about the event listener.
   * It can be a boolean that indicates whether to use capturing or an object with additional options.
   * @return {void} - Does not return a value.
   */
  static addListener (type, callback, target = document, options = false) {
    const events = Array.isArray(type) ? type : [type];

    if (!this._registry.has(target)) {
      this._registry.set(target, []);
    }

    events.forEach((eventName) => {
      const safeCallback = this._createSafeListener(eventName, callback);

      target.addEventListener(eventName, safeCallback, options);

      this._registry.get(target).push({
        event: eventName,
        original: callback,
        wrapped: safeCallback,
        options,
      });
    });

  }

  /**
   * Removes an event listener from the specified target (default is the document).
   *
   * @param {string} type - The type of the event to remove the listener for.
   * @param {Function} callback - The callback function that was added as the event listener.
   * @param {EventTarget} [target=document] - The target to remove the event listener from. Defaults to the document.
   * @return {void} Does not return any value.
   */
  static removeListener (type, callback, target = document) {
    if (!this._registry.has(target)) return;
    const listeners = this._registry.get(target);

    const remaining = listeners.filter((listener) => {
      if (listener.event === type && listener.original === callback) {
        target.removeEventListener(
          listener.event,
          listener.wrapped,
          listener.options
        );
        return false;
      }
      return true;
    });

    this._registry.set(target, remaining);
  }

  /**
   * Removes all event listeners from the specified target element. If no target is provided, defaults to `document`.
   *
   * @param {EventTarget} [target=document] The target object from which all event listeners are to be removed.
   * @return {void} Returns nothing.
   */
  static removeAllListeners(target = document, removeEvent = "all") {
    if (!this._registry.has(target)) return;

    this._registry.get(target).forEach(({ event, wrapped, options }) => {
      if(removeEvent === "all" || removeEvent === event)
      {
        target.removeEventListener(event, wrapped, options);
      }
    });

    this._registry.delete(target);
  }
}
