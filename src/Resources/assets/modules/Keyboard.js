/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {abstractModule, DomEventManager, Config } from "@austral/design";

/**
 * The Keyboard class is an extension of the abstractModule class
 */
export default class Keyboard extends abstractModule {

  /**
   * Initializes event listeners for keyup, keypress, and keydown events.
   * The method binds the corresponding event handling functions to the current context.
   *
   * @return {void} Does not return a value.
   */
  async load() {
    if(!this.isInitialise)
    {
      this.isInitialise = true;
      DomEventManager.addListener('keyup', this.keyUp.bind(this));
      DomEventManager.addListener('keypress', this.keyPress.bind(this));
      DomEventManager.addListener('keydown', this.keyDown.bind(this));
    }
  }

  /**
   * Handles keyDown events and performs actions based on the pressed key.
   * Space and enter keys trigger mouse click events, invalid characters are suppressed,
   * and custom event dispatches are performed for supported keys.
   *
   * @param {KeyboardEvent} evt - The keyboard event triggered by a key down action.
   * @return {boolean|undefined} Returns `false` if the event was handled and default actions were prevented, or `undefined` otherwise.
   */
  keyDown (evt) {
    if (!evt.key) {
      return;
    }

    // Keyboard shortcut of a link or a button (data-keyboard-shortcut="CTRL+MAJ+S", list-bundle)
    if (this.keyboardShortcut(evt)) {
      return false;
    }

    // Make the space bar or enter act like a mouse click
    const clickableElement = this.getClickableElement(evt);
    if (clickableElement) {
      clickableElement.dispatchEvent(new MouseEvent('mousedown', {
        'bubbles': true,
        'cancelable': true
      }));
      clickableElement.dispatchEvent(new MouseEvent('mouseup', {
        'bubbles': true,
        'cancelable': true
      }));
      clickableElement.dispatchEvent(new MouseEvent('click', {
        'bubbles': true,
        'cancelable': true
      }));

      evt.stopPropagation();
      evt.preventDefault();

      return false;
    }

    // Prevent non valid characters from being entered in inputs
    if (!this.isValid(evt)) {
      evt.stopPropagation();
      evt.preventDefault();

      return false;
    }

    const initialActiveElement = document.activeElement;
    const keyName = (evt.key === ' ' ? 'Spacebar' : evt.key);
    DomEventManager.dispatch('keyDown:*');
    DomEventManager.dispatch('keyDown:' + keyName.toLowerCase());
    if (evt.shiftKey) {
      DomEventManager.dispatch('keyDown:shift' + keyName.substr(0, 1).toUpperCase() + keyName.substr(1).toLowerCase());
    }

    DomEventManager.dispatch('keyDown:*', {}, initialActiveElement);
    DomEventManager.dispatch('keyDown:' + keyName.toLowerCase(), {}, initialActiveElement);
    if (evt.shiftKey) {
      DomEventManager.dispatch('keyDown:shift' + keyName.substr(0, 1).toUpperCase() + keyName.substr(1).toLowerCase(), {}, initialActiveElement);
    }

    // Cancel specific events
    if (this.needCancel(evt, initialActiveElement)) {
      evt.stopPropagation();
      evt.preventDefault();

      return false;
    }
  }

  /**
   * Handles key*/
  keyPress (evt) {
    if (!evt.key) {
      return;
    }

    const clickableElement = this.getClickableElement(evt);
    if (clickableElement) {
      evt.stopPropagation();
      evt.preventDefault();

      return false;
    }

    const initialActiveElement = document.activeElement;
    const keyName = (evt.key === ' ' ? 'Spacebar' : evt.key);
    DomEventManager.dispatch('keyPress:*');
    DomEventManager.dispatch('keyPress:' + keyName.toLowerCase());
    if (evt.shiftKey) {
      DomEventManager.dispatch('keyPress:shift' + keyName.substr(0, 1).toUpperCase() + keyName.substr(1).toLowerCase());
    }

    DomEventManager.dispatch('keyPress:*', {}, initialActiveElement);
    DomEventManager.dispatch('keyPress:' + keyName.toLowerCase(), {}, initialActiveElement);
    if (evt.shiftKey) {
      DomEventManager.dispatch('keyPress:shift' + keyName.substr(0, 1).toUpperCase() + keyName.substr(1).toLowerCase(), {}, initialActiveElement);
    }

    // Cancel specific events
    if (this.needCancel(evt, initialActiveElement)) {
      evt.stopPropagation();
      evt.preventDefault();

      return false;
    }
  }

  /**
   * Handles the "keyup" event, performs specific actions based on the event key,
   * and dispatches custom events*/
  keyUp (evt) {
    if (!evt.key) {
      return;
    }

    const clickableElement = this.getClickableElement(evt);
    if (clickableElement) {
      evt.stopPropagation();
      evt.preventDefault();

      return false;
    }

    const initialActiveElement = document.activeElement;
    const keyName = (evt.key === ' ' ? 'Spacebar' : evt.key);
    DomEventManager.dispatch('keyUp:*');
    DomEventManager.dispatch('keyUp:' + keyName.toLowerCase());
    if (evt.shiftKey) {
      DomEventManager.dispatch('keyUp:shift' + keyName.substr(0, 1).toUpperCase() + keyName.substr(1).toLowerCase());
    }

    DomEventManager.dispatch('keyUp:*', {}, initialActiveElement);
    DomEventManager.dispatch('keyUp:' + keyName.toLowerCase(), {}, initialActiveElement);
    if (evt.shiftKey) {
      DomEventManager.dispatch('keyUp:shift' + keyName.substr(0, 1).toUpperCase() + keyName.substr(1).toLowerCase(), {}, initialActiveElement);
    }

    // Cancel specific events
    if (this.needCancel(evt, initialActiveElement)) {
      evt.stopPropagation();
      evt.preventDefault();

      return false;
    }
  }

  /**
   * Identifies and returns the closest clickable element based on the provided event's key.
   *
   * @param {KeyboardEvent} evt The keyboard event containing the key data used to determine the clickable element.
   * @return {Element|null} The closest clickable element to the active element, or null if none is found or the active element does not exist.
   */
  getClickableElement (evt) {
    if (!document.activeElement) {
      return null;
    }

    if (evt.key === ' ' || evt.key === 'Spacebar') {
      return document.activeElement.closest('a') ||
        document.activeElement.closest('button') ||
        document.activeElement.closest('[tabindex="0"]');
    }

    if (evt.key === 'Enter') {
      return document.activeElement.closest('[role="option"]');
    }

    return null;
  }

  /**
   * Validates whether the key pressed in the currently active element is allowed for numeric inputs.
   *
   * @param {KeyboardEvent} evt - The keyboard event triggered by the user's key press.
   * @return {boolean} Returns true if the active element is not numeric or the key pressed is allowed; otherwise, returns false.
   */
  isValid (evt) {
    if (!document.activeElement) {
      return true;
    }

    const numericElement = document.activeElement.closest('[inputmode="numeric"]');
    if (numericElement) {
      const allowedCharacters = '0123456789';

      if (
        evt.key.length === 1 &&
        allowedCharacters.indexOf(evt.key) === -1
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Determines if the event should trigger a cancel action based on the event type and the initial active element.
   *
   * @param {KeyboardEvent} evt - The keyboard event to evaluate.
   * @param {Element} initialActiveElement - The element that was active when the event occurred.
   * @return {boolean} Returns true if the cancel action should be triggered, otherwise false.
   */
  needCancel (evt, initialActiveElement) {
    if (!initialActiveElement) {
      return false;
    }

    if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {

      const selector = Config.needCancelKeybordArrow.map((selector) => selector.trim()).join(", ");
      const withOptionElement = initialActiveElement.closest(selector);
      if (withOptionElement) {
        return true;
      }
    }

    if (evt.key === 'Tab' && evt.shiftKey) {
      if (initialActiveElement.closest('h2.visually-hidden')) {
        return true;
      }
    }
    return false;
  }

  /**
   * keyboardShortcut
   * Clicks the link or the button whose data-keyboard-shortcut matches the keys (ex. "CTRL+MAJ+S"; CTRL is also
   * the Cmd key of macOS).
   *
   * @param {KeyboardEvent} evt
   * @return {boolean} true when a shortcut is found
   */
  keyboardShortcut (evt) {
    let shortcut = (evt.ctrlKey || evt.metaKey) ? "CTRL+" : "";
    shortcut += evt.shiftKey ? "MAJ+" : "";
    shortcut += evt.altKey ? "ALT+" : "";
    shortcut += evt.key.toUpperCase();
    const action = document.querySelector('*[data-keyboard-shortcut="' + shortcut.replace(/["\\]/g, "\\$&") + '"]');
    if (!action || (action.tagName !== "A" && action.tagName !== "BUTTON")) {
      return false;
    }
    evt.preventDefault();
    evt.stopPropagation();
    action.click();

    return true;
  }
}
