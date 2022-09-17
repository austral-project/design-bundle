import MultiUser from "./multi-user/MultiUser";
import Toggle from "./toggle/Toggle";
import Aside from "./aside/Aside";
import Toast from "./toast/Toast";
import Button from "./action/Button";
import StickyBandeauTop from "./sticky/StickyBandeauTop";
import Counter from "./counter/Counter";
import RefreshValue from "./changeValue/RefreshValue";
import Fields from "./fields/Fields";
import Form from "./form/Form";
import Delete from "./delete/Delete";
import Sortable from "./sortable/Sortable";
import Popin from "./popin/Popin";
import Guideline from "./guideline/Guideline";
import Collapse from "./collapse/Collapse";
import Tab from "./tab/Tab"

export default class Components {

  static loadComponent() {
    Debug.startGroup("Component");
    Debug.startGroup("Init");
    MiscEvent.dispatch("component::load.start");
    Form.initComponent();
    Delete.initComponent();
    Sortable.initComponent();
    Guideline.initComponent();

    MultiUser.initComponent();
    Toggle.initComponent();
    Tab.initComponent();
    Aside.initComponent();
    Collapse.initComponent();
    Toast.initComponent();
    Counter.initComponent();
    RefreshValue.initComponent();
    StickyBandeauTop.initComponent();

    Popin.initComponent();
    Fields.initFields();

    Button.initComponent();
    Debug.stopGroup();

    Debug.startGroup("Finish");
    MiscEvent.dispatch("component::load.finish");
    Debug.stopGroup();
    Debug.stopGroup();
    Debug.log(Austral.Config.getComponents());
  }

  checkPopinElement(el) {
    return el.closest(".popin-fields-container") === null;
  }

}