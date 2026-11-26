/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Entry of the compiled build: styles and initialisation of the design system.
import "@austral/design/styles/app.scss";
import { Loader, DomEventManager } from "@austral/design";

DomEventManager.addListener("DOMContentLoaded", async () => {
  await Loader.initialize();
});
