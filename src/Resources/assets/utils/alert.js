/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DomEventManager from "@austral/design/core/events";

// Shortcuts to the AlertSwal module (SweetAlert2), loaded by the page. Without the module, nothing is shown.
export const showToast = async (options) => {
  DomEventManager.dispatch("alertSwal::showToast", options);
};

export const showPopup = async (options, callbackConfirm = null, callbackOther = null) => {
  DomEventManager.dispatch("alertSwal::showPopup", Object.assign({}, options, {callbackConfirm, callbackOther}));
};
