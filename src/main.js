// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './stores'
import router from './router'
import App from './App'
import FastClick from 'fastclick' // 快速点击
import infiniteScroll from 'vue-infinite-scroll'; // 下拉刷新
Vue.use(infiniteScroll)

import Utils from './utils'
Vue.use(Utils);

import { 
  Tabbar,
  TabbarItem,
  Group,
  Cell, 
  Box,
  XHeader, 
  Actionsheet, 
  TransferDom,
  ButtonTab,
  ButtonTabItem,
  Swiper,
  SwiperItem,
  Search,
  Flexbox,
  FlexboxItem,
  XButton,
  Toast,
  XInput,
  XTextarea,
  Card,
  Grid,
  GridItem,
  Selector,
  XTable,
  Popup,
  LoadMore,
  Scroller,
  Checklist,
  Checker,
  CheckerItem,
  Divider,
  Badge,
  Tab,
  TabItem,
  Blur,
  PopupRadio,
  PopupPicker,
  Datetime,
  Marquee, 
  MarqueeItem,
  Previewer,
  Masker,
  Confirm,
  ToastPlugin,
  LoadingPlugin,
  XNumber,
  Swipeout, 
  SwipeoutItem, 
  SwipeoutButton
} from 'vux';

Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)
Vue.component('group', Group)
Vue.component('cell', Cell)
Vue.component('box', Box)
Vue.component('x-header', XHeader)
Vue.component('actionsheet', Actionsheet)
Vue.component('transfer-dem', TransferDom)
Vue.component('buttin-tab', ButtonTab)
Vue.component('button-tab-item', ButtonTabItem)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
Vue.component('search', Search)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('x-button', XButton)
Vue.component('toast', Toast )
Vue.component('x-input', XInput)
Vue.component('x-textarea', XTextarea)
Vue.component('card', Card)
Vue.component('grid', Grid)
Vue.component('grid-item', GridItem)
Vue.component('selector', Selector)
Vue.component('x-table', XTable)
Vue.component('popup', Popup)
Vue.component('load-more', LoadMore)
Vue.component('scroller', Scroller)
Vue.component('checklist', Checklist)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('divider', Divider)
Vue.component('badge', Badge)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('blur', Blur)
Vue.component('popup-radio', PopupRadio)
Vue.component('popup-picker', PopupPicker)
Vue.component('datetime', Datetime)
Vue.component('marquee', Marquee)
Vue.component('marquee-item', MarqueeItem)
Vue.component('previewer', Previewer)
Vue.component('masker', Masker)
Vue.component('confirm', Confirm)
Vue.component('x-number', XNumber)
Vue.component('swipeout', Swipeout)
Vue.component('swipeout-item', SwipeoutItem)
Vue.component('swipeout-button', SwipeoutButton)

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)


// 引入vue-amap
import VueAMap from 'vue-amap';

Vue.use(VueAMap);
 
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 申请的高德key
  key: 'd1a5ecacfe40f3d189c5e422a8a13309',
  // 插件集合
  plugin: ['AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Autocomplete','AMap.ToolBar'],
  uiVersion: '1.0', // ui库版本，不配置不加载,
  v: '1.4.4'
})



import Footer from './components/Footer'
Vue.component('app-footer', Footer)

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 导入公共scss文件
import './base/lancer_index.scss';

// 引用API文件
import api from './api/index'
// 将API方法绑定到全局
Vue.prototype.$api = api;
// 引用apiurl公共文件接口，并挂在到全局
import apiurl from './api/apiurl.js'
Vue.prototype.$interface = apiurl;

FastClick.attach(document.body)
Vue.config.productionTip = false;
Vue.prototype.$devicePixelRatio = 2

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

