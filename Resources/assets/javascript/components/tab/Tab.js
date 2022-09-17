import abstractOpenClose from "../abstractOpenClose";
import Animation from "./../../animation/Animation";
import abstract from "../abstract";

export default class Tab extends abstract {

  static initComponent() {
    super.initComponent("tabs");
  }

  create() {
    this.animation = {};
    this.tabs = {};
    this.choicesTab = this.element.querySelectorAll("*[data-tab-choice]");
    let tabs = this.element.querySelectorAll("*[data-tab]");

    [].forEach.call(tabs, (tab)=>{
      this.tabs[tab.dataset.tab] = tab;
      this.animation[tab.dataset.tab] = new Animation();
      this.animation[tab.dataset.tab].timeline.to(tab, {
        opacity: 1,
        ease: "none",
        duration: 0.2,
        height: tab.querySelector(".height").clientHeight+"px",
        onComplete: () => {
        },
        onReverseComplete: () => {
        }
      }, "#anime-"+tab.dataset.tab).pause();
    });

  }

  addEventListener() {
    super.addEventListener();


    MiscEvent.addListener("component::action.open", (event) => {
      [].forEach.call(Object.entries(this.tabs), (tab)=>{
        if(tab[0] !==  event.detail.tabId)
        {
          MiscEvent.dispatch("component::action.close", {tabId : tab[0]}, this.element);
        }
        [].forEach.call(this.choicesTab, (choiceTab)=>{
          if(choiceTab.dataset.tabChoice ===  event.detail.tabId)
          {
            choiceTab.classList.add('is-open');
          }
          else
          {
            choiceTab.classList.remove('is-open');
          }
        });
      });
      this.open(event);
    }, this.element);
    MiscEvent.addListener("component::action.close", (event) => {
      this.close(event);
    }, this.element);

    [].forEach.call(this.choicesTab, (choiceTab)=>{
      MiscEvent.addListener("click", (e) => {
        MiscEvent.dispatch("component::action.open", {tabId : choiceTab.dataset.tabChoice}, this.element);
      }, choiceTab);
    });

  }

  open(event) {
    Debug.log("-- -- Component - Open : "+this.componentName+" -> "+this.uuid);
    //this.animation[event.detail.tabId].timeline.timeScale(1).play();
    this.tabs[event.detail.tabId].classList.add("open");
    MiscEvent.dispatch("component::open.finish", {"componentName": this.componentName, "component": this});
  }

  close(event) {
    Debug.log("-- -- Component - Close : "+this.componentName+" -> "+this.uuid);
    //this.animation[event.detail.tabId].timeline.timeScale(2).reverse();
    this.tabs[event.detail.tabId].classList.remove("open");
    MiscEvent.dispatch("component::close.finish", {"componentName": this.componentName, "component": this});
  }
}