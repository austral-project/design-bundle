/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractComponent, DomEventManager, LibLoader, utils} from "@austral/design";

export default class ButtonAnimate extends abstractComponent {

  static initComponent() {
    super.initComponent("button-animate");
  }

  async create() {
    LibLoader.addGSAPPlugin('SplitText', async () => {
      const { SplitText } = await import(/* webpackChunkName: "gsap-splitText" */ 'gsap/SplitText');
      return SplitText;
    });
    this.gsap = await LibLoader.gsap();
    await LibLoader.loadGSAPPlugin('SplitText');

    if(!utils.dom.isMobileSize()) {

      let duplicate = document.createElement("span");
      duplicate.classList.add("button-content-duplicate");
      duplicate.innerHTML = this.element.querySelector(".button-content").innerHTML;
      this.element.querySelector(".button-content").after(duplicate);

      this.timeline = this.gsap.timeline({
        clearProps: true,
        onComplete: () => {
          this.timeline.time(0).kill();
        }
      });
      this.timeline.pause();

      let buttonContentSplit;
      let buttonContentDuplicateSplit;
      this.element.querySelectorAll(".button-content span.entitled").forEach((subElement) => {
        buttonContentSplit = new SplitText(subElement, {
          preserveWhitespace: true,
          absolute: true,
          type: "chars",
          tag: "span",
          linesClass: "line-animate",
          charsClass: "char-animate",
          wordsClass: "word-animate"
        });
      });
      this.element.querySelectorAll(".button-content-duplicate span.entitled").forEach((subElement) => {
        buttonContentDuplicateSplit = new SplitText(subElement, {
          preserveWhitespace: true,
          absolute: true,
          type: "chars",
          tag: "span",
          linesClass: "line-animate",
          charsClass: "char-animate",
          wordsClass: "word-animate"
        });
      });
      this.timeline.to(buttonContentSplit.chars, {
        marginTop: (this.element.offsetHeight / 2.5) * -1,
        stagger: 0.008,
        duration: 0.8,
        ease: "power4.out"
      }, "anim");
      this.timeline.to(buttonContentSplit.chars, {
        opacity: 0,
        stagger: 0.007,
        duration: 0.6,
        ease: "power4.out"
      }, "anim");
      this.timeline.to(buttonContentDuplicateSplit.chars, {
        top: 0,
        opacity: 1,
        stagger: 0.008,
        duration: 0.8,
        ease: "power4.out",
      }, "anim");
      DomEventManager.addListener("mouseenter", (event) => {
        if (!utils.dom.isMobileSize()) {
          this.timeline.time(0).play();
        }
      }, this.element);

    }
  }

  addEventListener() {
  }

}
DomEventManager.addListener("component::initialize", () => {
  ButtonAnimate.initComponent();
});
