/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { A11yHelpers, DomEventManager, FocusManager } from "@austral/design";

export default class ModalFocusTrap {

  static addFocusLoop(container, autoFocus = true) {
    if (!container) return;

    ModalFocusTrap.removeFocusLoop(container);

    const focusableElements = container.querySelectorAll(A11yHelpers.getEnabledElementsSelector());
    if (!focusableElements.length) return;

    // Mark first and last visible focusable elements
    let first, last;
    for (const el of focusableElements) {
      if (A11yHelpers.isDisplayed(el)) {
        first = el; break;
      }
    }
    for (const el of Array.from(focusableElements).reverse()) {
      if (A11yHelpers.isDisplayed(el)) {
        last = el; break;
      }
    }
    if (first) first.classList.add('loop-firstFocus');
    if (last) last.classList.add('loop-lastFocus');

    // Add hidden focusable elements at start and end
    const fakeFirst = document.createElement('span');
    fakeFirst.classList.add('loop-focusHidden');
    fakeFirst.setAttribute('tabindex', '0');
    container.prepend(fakeFirst);

    const fakeLast = document.createElement('span');
    fakeLast.classList.add('loop-focusHidden');
    fakeLast.setAttribute('tabindex', '0');
    container.appendChild(fakeLast);

    // Add events to loop
    DomEventManager.addListener('focus', () => FocusManager.setFocus(last), fakeFirst);
    DomEventManager.addListener('focus', () => FocusManager.setFocus(first), fakeLast);

    if (autoFocus && first) {
      window.setTimeout(() => FocusManager.setFocus(first), 50);
    }
  }

  static removeFocusLoop(container) {
    if (!container) return;

    container.querySelectorAll('.loop-focusHidden').forEach(el => el.remove());
    const first = container.querySelector('.loop-firstFocus');
    if (first) first.classList.remove('loop-firstFocus');

    const last = container.querySelector('.loop-lastFocus');
    if (last) last.classList.remove('loop-lastFocus');
  }
}
