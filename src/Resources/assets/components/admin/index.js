/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Admin components: each file registers itself on "component::initialize".
import ClickActions from './action/ClickActions';
import Aside from './aside/Aside';
import Collapse from './collapse/Collapse';
import Counter from './counter/Counter';
import Delete from './delete/Delete';
import Guideline from './guideline/Guideline';
import GuidelineComponents from './guideline/GuidelineComponents';
import MultiUser from './multi-user/MultiUser';
import RefreshValue from './refresh-value/RefreshValue';
import Search from './search/Search';
import StickyBandeauTop from './sticky/StickyBandeauTop';
import Tab from './tab/Tab';
import Toast from './toast/Toast';
import Toggle from './toggle/Toggle';
import ViewByChoice from './view-by-choice/ViewByChoice';
import Wysiwyg from './wysiwyg/Wysiwyg';
import Cropper from './cropper/Cropper';
import Animation from './Animation';
import { adminPage } from './AdminPage';
import { contextMenu } from './contextMenu/ContextMenu';

export {
  adminPage,
  contextMenu,
  Animation,
  Aside,
  ClickActions,
  Collapse,
  Counter,
  Cropper,
  Delete,
  Guideline,
  GuidelineComponents,
  MultiUser,
  RefreshValue,
  Search,
  StickyBandeauTop,
  Tab,
  Toast,
  Toggle,
  ViewByChoice,
  Wysiwyg
};
