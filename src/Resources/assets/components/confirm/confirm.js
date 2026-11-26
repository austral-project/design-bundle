/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DomEventManager, utils } from "@austral/design";
import abstractComponent from "@austral/design/core/abstract/abstractComponent";

/**
 * Confirmation of a form before it is sent (delete, duplicate, truncate of the admin).
 *
 *   <form method="post" action="…" data-confirm="Delete this element?" data-confirm-yes="Confirm" data-confirm-no="Cancel">
 *
 * The submit is stopped, the popup of AlertSwal is shown, and the form is sent only when the user confirms. The
 * texts come from the template (translated by Twig): no inline script, compatible with a strict CSP.
 * Without JavaScript, the form is sent without confirmation: the action stays protected by POST + CSRF.
 */
export default class Confirm extends abstractComponent {

  static initComponent() {
    super.initComponent("confirm");
  }

  create() {
  }

  addEventListener() {
    this.element.addEventListener("submit", (event) => {
      event.preventDefault();
      utils.alert.showPopup({
        title: this.element.dataset.confirm,
        confirmButtonText: this.element.dataset.confirmYes ?? "OK",
        cancelButtonText: this.element.dataset.confirmNo ?? "Cancel",
      }, () => {
        // submit() does not dispatch the "submit" event again
        HTMLFormElement.prototype.submit.call(this.element);
      });
    });
  }

}
DomEventManager.addListener("component::initialize", () => {
  Confirm.initComponent();
});
