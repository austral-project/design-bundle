/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { DomEventManager, A11yHelpers, Config } from "@austral/design";

export default class FocusManager {

  static initDom() {
    document.querySelectorAll("*[aria-hidden=\"true\"]").forEach((element) => {
      FocusManager.removeFocus(element);
    });
  }

  static removeFocus(element) {
    if (!element) return;
    element.querySelectorAll(A11yHelpers.getEnabledElementsSelector())
      .forEach((subEl) => {
        if (subEl.hasAttribute('tabindex')) {
          subEl.setAttribute('data-bkp-tabindex', subEl.getAttribute('tabindex'));
        } else {
          subEl.setAttribute('data-bkp-tabindex', '');
        }
        subEl.setAttribute('tabindex', '-1');
      });
  }

  static addFocus(element) {
    if (!element) return;
    element.querySelectorAll(A11yHelpers.getEnabledElementsSelector())
      .forEach((subEl) => {
        subEl.removeAttribute('tabindex');
        if (subEl.hasAttribute('tabindex')) {
          subEl.setAttribute('data-bkp-tabindex', subEl.getAttribute('tabindex'));
        } else {
          subEl.setAttribute('data-bkp-tabindex', '');
        }
        subEl.removeAttribute('tabindex', '');
      });
  }

  static setFocus(element) {
    if (typeof element === 'string' ) {
      element = document.querySelector(element);
    }

    if (!element) return;

    if (element.hasAttribute('tabindex')) {
      element.setAttribute('data-old-tabindex', element.getAttribute('tabindex'));
    }

    element.focus();
    DomEventManager.addListener('blur', FocusManager.restoreFocus, element);
  }

  static restoreFocus(evt) {
    const element = evt.currentTarget;
    const oldTabindex = element.getAttribute('data-bkp-tabindex');

    if (oldTabindex === null) return;

    if(element.classList.contains("back-to-top-focus"))
    {
      element.remove();
      return;
    }

    if (oldTabindex === '' || oldTabindex === 'null') {
      element.removeAttribute('tabindex');
    } else {
      element.setAttribute('tabindex', oldTabindex);
    }
    element.removeAttribute('data-bkp-tabindex');
    DomEventManager.removeListener('blur', FocusManager.restoreFocus, element);
  }

  static restoreCurrentFocus()
  {
    if(Config.getCurrentFocus() || Config.getCurrentFocusPath())
    {
      let elementInNewDocument = null;
      if(Config.getCurrentFocus())
      {
        elementInNewDocument = A11yHelpers.getNode(Config.getCurrentFocus() ? A11yHelpers.getPath(Config.getCurrentFocus()) : null);
      }
      if(elementInNewDocument === null && Config.getCurrentFocusPath())
      {
        elementInNewDocument = document.querySelector(Config.getCurrentFocusPath());
      }
      if(elementInNewDocument) {
        if(elementInNewDocument.tagName === "SELECT")
        {
          FocusManager.setFocus(elementInNewDocument.closest(".choices"));
        }
        else
        {
          FocusManager.setFocus(elementInNewDocument);
        }
      }
      Config.setCurrentFocus(null);
    }
  }

}
