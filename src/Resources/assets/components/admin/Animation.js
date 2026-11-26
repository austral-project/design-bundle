/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config, Debug, DomEventManager, utils } from "@austral/design";
import { gsap } from "gsap";

export default class Animation {

  constructor() {
    this.timeline = gsap.timeline();
  }

}