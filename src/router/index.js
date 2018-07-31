import Vue from 'vue'
import store from '../stores'
import Router from 'vue-router'

import CommomObj from '@/utils/commom.js';

// 首页
import Index from '@/pages/index';
import Search from '@/pages/search';

// 采购区
import Purchase from '@/pages/purchase/index'; // 采购区-首页
import PurchaseDetail from '@/pages/purchase/purchaseDetail' // 采购区-采购详情
import Quote from '@/pages/purchase/quote' // 采购区-采购详情-我要报价
import PurchaseAdmin from '@/pages/purchase/admin'  // 商家中心-采购管理
import PublishPurchase from '@/pages/purchase/publish' // 商家中心-采购管理-发布采购
import PurchaseList from '@/pages/purchase/purchaseList'; // 商家中心-采购管理-采购管理列表
import PurchaseListDetail from '@/pages/purchase/purchaseListDetail'; // 商家中心-采购管理-采购管理列表
import PurchaseQuote from '@/pages/purchase/purchaseQuote'; // 商家中心-采购管理-采购管理列表-查看报价列表
import PurchaseQuoteDetail from '@/pages/purchase/purchaseQuoteDetail'; // 商家中心-采购管理-采购管理列表-查看报价列表

// 供应区
import Supply from '@/pages/supply/index'; // 供应区-首页
import SupplyDetail from '@/pages/supply/supplyDetail'; // 供应区-详情
import SupplyAdmin from '@/pages/supply/admin'; // 商家中心-供应管理
import PublishSupply from '@/pages/supply/publish'; // 商家中心-供应管理-发布供应
import SupplyList from '@/pages/supply/supplyList'; // 商家中心-供应管理 - 供应管理列表
import SupplyListDetail from '@/pages/supply/supplyListDetail'; // 商家中心-供应管理 - 供应管理列表-详情

// 卖家中心
import Wode from '@/pages/wode/index';
import QutoeList from '@/pages/wode/qutoeList';
import QutoeListInfo from '@/pages/wode/qutoeListInfo';

//个人中心
import Personnel from '@/pages/personnel/index';

//订单中心
import orderCenter from '@/pages/orderCenter/index'
import supplyOrder from '@/pages/orderCenter/supplyOrder'
import offerOrder from '@/pages/orderCenter/offerOrder'
import purchaseIn from '@/pages/orderCenter/purchaseIn'
import supplyIn from '@/pages/orderCenter/supplyIn'
import orderDetail from '@/pages/orderCenter/orderDetail'

//订单申诉
import orderAppeal from '@/pages/appeal/index'
import appealDetail from '@/pages/appeal/appealDetail'
import appealApply from '@/pages/appeal/appealApply'

//我的报价
import myOffer from '@/pages/myOffer/index'
import myOfferDetail from '@/pages/myOffer/myOfferDetail'

//帮助中心
import Help from '@/pages/help/index'
import HelpDetail from '@/pages/help/helpDetail'


// 设置中心
import Setup from '@/pages/setup/index';
import SetData from '@/pages/setup/setData';
import SetNickName from '@/pages/setup/setNickName';
import SetAddress from '@/pages/setup/setAddress';
import SetAddAddress from '@/pages/setup/setAddAddress';
import MapSelectAdrss from '@/pages/setup/mapSelectAdrss';
import MapLoactionAdrss from '@/pages/setup/mapLoactionAdrss';
import SetSafe from '@/pages/setup/setSafe';
import SetPhone from '@/pages/setup/setPhone';
import SetRealname from '@/pages/setup/setRealname';
import SetLoginPwd from '@/pages/setup/setLoginPwd';
import SetPaypwd from '@/pages/setup/setPaypwd';


// 登录
import Login from '@/pages/login';
import Agreement from '@/pages/agreement';
import ShopAgreement from '@/pages/shopAgreement';
import Register from '@/pages/register';
import ForgetPassword from '@/pages/forgetPassword';

// 地址管理
import SelectAddress from '@/pages/address/selectAddress';
import ShowAddress from '@/pages/address/showAddress';

// 订单板块
import OrderIndex from '@/pages/order/index'  // 提交订单页面
import OfflinePay from '@/pages/order/offlinePay'  // 线下支付
import OfflineVoucher from '@/pages/order/offlineVoucher'  // 凭证表单
import OfflineResult from '@/pages/order/offlineResult'  // 提交线下打款表单凭证结果

// 充值
// import Recharge from '@/pages/recharge/index'  // 充值页面
// import RechargeResult from '@/pages/recharge/result'  // 充值页面

import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {path: '/dome',name: 'HelloWorld',component: HelloWorld,meta: { title: 'dome'}},
    {path: '/',name: 'index',component: Index,meta: { title: '首页'}},
    {path: '/search',name: 'search',component: Search,meta: { title: '搜索'}},
    // 采购区
    {path: '/purchase',name: 'purchase',component: Purchase,meta: { title: '采购区'}},
    {path: '/purchaseDetail',name: 'purchaseDetail',component: PurchaseDetail,meta: { title: '采购详情'}},
    {path: '/quote',name: 'quote',component: Quote,meta: { title: '我要报价'}},
    {path: '/purchaseAdmin',name: 'purchaseAdmin',component: PurchaseAdmin,meta: { title: '采购管理'}},
    {path: '/publishPurchase',name: 'publishPurchase',component: PublishPurchase,meta: { title: '发布采购'}},
    {path: '/purchaseList',name: 'purchaseList',component: PurchaseList,meta: { title: '采购管理'}},
    {path: '/purchaseListDetail',name: 'purchaseListDetail',component: PurchaseListDetail,meta: { title: '采购订单详情'}},
    {path: '/purchaseQuote',name: 'purchaseQuote',component: PurchaseQuote,meta: { title: '查看报价'}},
    {path: '/purchaseQuoteDetail',name: 'purchaseQuoteDetail',component: PurchaseQuoteDetail,meta: { title: '报价详情'}},

    // 供应区
    {path: '/supply',name: 'supply',component: Supply,meta: { title: '供应区'}},
    {path: '/supplyDetail',name: 'supplyDetail',component: SupplyDetail,meta: { title: '供应详情'}},
    {path: '/supplyAdmin',name: 'supplyAdmin',component: SupplyAdmin,meta: { title: '供应管理'}},
    {path: '/publishSupply',name: 'publishSupply',component: PublishSupply,meta: { title: '发布供应'}},
    {path: '/supplyList',name: 'SupplyList',component: SupplyList,meta: { title: '供应管理'}},
    {path: '/supplyListDetail',name: 'supplyListDetail',component: SupplyListDetail,meta: { title: '供应管理'}},

    // 卖家中心
    {path: '/wode',name: 'wode',component: Wode,meta: { title: '卖家中心'}},
    {path: '/qutoeList',name: 'qutoeList',component: QutoeList,meta: { title: '我的报价'}},
    {path: '/qutoeListInfo',name: 'qutoeListInfo',component: QutoeListInfo,meta: { title: '我的报价详情',refresh:true}},
    
    // 个人中心
    {path: '/personnel',name: 'personnel',component: Personnel,meta: { title: '个人中心'}},


    //订单中心
    {path: '/orderCenter',name: 'orderCenter',component: orderCenter,meta: { title: '订单中心'}},
    {path: '/supplyOrder',name: 'supplyOrder',component: supplyOrder,meta: { title: '供应订单'}},
    {path: '/offerOrder',name: 'offerOrder',component: offerOrder,meta: { title: '报价订单'}},
    {path: '/purchaseIn',name: 'purchaseIn',component: purchaseIn,meta: { title: '采购买入'}},
    {path: '/supplyIn',name: 'supplyIn',component: supplyIn,meta: { title: '供应买入'}},
    {path: '/orderDetail',name: 'orderDetail',component: orderDetail,meta: { title: '订单详情'}},

    //订单申诉
    {path: '/orderAppeal',name: 'orderAppeal',component: orderAppeal,meta: { title: '订单申诉',refresh:true}},
    {path: '/appealDetail',name: 'appealDetail',component: appealDetail,meta: { title: '订单申诉'}},
    {path: '/appealApply',name: 'appealApply',component: appealApply,meta: { title: '订单申诉'}},

    //我的报价
    {path: '/myOffer',name: 'myOffer',component: myOffer,meta: { title: '我的报价'}},
    {path: '/myOfferDetail',name: 'myOfferDetail',component: myOfferDetail,meta: { title: '报价详情'}},

    //帮助中心
    {path: '/help',name: 'Help',component: Help,meta: { title: '帮助中心'}},
    {path: '/helpDetail',name: 'HelpDetail',component: HelpDetail,meta: { title: '查看解决方法'}},

    // 设置
    {path: '/setup',name: 'setup',component: Setup,meta: { title: '安全中心'}},
    {path: '/setData',name: 'setData',component: SetData,meta: { title: '我的资料'}},
    {path: '/setNickName',name: 'setNickName',component: SetNickName,meta: { title: '设置昵称'}},
    {path: '/setAddress',name: 'setAddress',component: SetAddress,meta: { title: '设置默认地址'}},
    {path: '/setAddAddress',name: 'setAddAddress',component: SetAddAddress,meta: { title: '设置地址'}},
    {path: '/mapSelectAdrss',name: 'mapSelectAdrss',component: MapSelectAdrss,meta: { title: '地址选择'}},
    {path: '/mapLoactionAdrss',name: 'mapLoactionAdrss',component: MapLoactionAdrss,meta: { title: '定位地址'}},
    {path: '/setSafe',name: 'setSafe',component: SetSafe,meta: { title: '安全中心'}},
    {path: '/setPhone',name: 'setPhone',component: SetPhone,meta: { title: '修改手机号'}},
    {path: '/setRealname',name: 'setRealname',component: SetRealname,meta: { title: '真实认证'}},
    {path: '/setLoginPwd',name: 'setLoginPwd',component: SetLoginPwd,meta: { title: '修改登录密码'}},
    {path: '/setPaypwd',name: 'setPaypwd',component: SetPaypwd,meta: { title: '修改支付密码'}},
    
    // 登录 注册 找回密码 一条龙
    {path: '/login',name: 'login',component: Login,meta: { title: '登录'}},
    {path: '/agreement',name: 'agreement',component: Agreement,meta: { title: '注册协议'}},
    {path: '/shopAgreement',name: 'shopAgreement',component: ShopAgreement,meta: { title: '入驻协议'}},
    {path: '/register',name: 'register',component: Register,meta: { title: '注册'}},
    {path: '/forgetPassword',name: 'forgetPassword',component: ForgetPassword,meta: { title: '找回密码'}},
    
    // 地址管理
    {path: '/selectAddress',name: 'selectAddress',component: SelectAddress,meta: { title: '选择期望地址'}},
    {path: '/showAddress',name: 'showAddress',component: ShowAddress,meta: { title: '查看期望地址'}},
  
    // 提交订单管理
    {path: '/orderIndex',name: 'orderIndex',component: OrderIndex,meta: { title: '提交订单'}},
    {path: '/offlinePay',name: 'offlinePay',component: OfflinePay,meta: { title: '线下打款'}},
    {path: '/offlineVoucher',name: 'offlineVoucher',component: OfflineVoucher,meta: { title: '填写凭证'}},
    {path: '/offlineResult',name: 'offlineResult',component: OfflineResult,meta: { title: '填写凭证'}},
    
    // 充值
    // {path: '/recharge',name: 'recharge',component: Recharge,meta: { title: '充值'}},

  ]
})

router.beforeEach((to, from,next) => {
  let documentTitle ='';
  // path 是多级的，遍历
  to.matched.forEach((path) => {
    if (path.meta.title) {
      // documentTitle +=` - ${path.meta.title}`;
      documentTitle +=`${path.meta.title}`;
    }
  });
  document.title = documentTitle;
  // store.commit('updateLoadingStatus', {isLoading: true})
  CommomObj.$loading();

  let back = setInterval(() => {
      if(document.body.scrollTop || document.documentElement.scrollTop){
        document.body.scrollTop-=10;
        document.documentElement.scrollTop-=10;
      }else {
        clearInterval(back)
      }
  });
  next();
});

router.afterEach(route => {
  // 注释为vux的加载loading
  setTimeout(() => {
    // store.commit('updateLoadingStatus', {isLoading: false})
    layer.close(CommomObj.loadingIndex);
  }, 500);
});

export default router;


