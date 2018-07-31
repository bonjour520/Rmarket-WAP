const $appid = localStorage.$appid || "wap";
const $tokenKey = localStorage.$tokenKey;
const $mainKey = localStorage.$mainKey;
const $orderSeverRoot = "http://192.168.1.112:8083/"; // 测试地址
// const $orderSeverRoot = "http://192.168.1.112:8080/"; // 调试地址
const $oldSeverRoot = "http://192.168.1.3:8081/RmarketShop"; // 测试地址
// const $oldSeverRoot = "http://rmwapi.runmin.shop/RmarketShop"; // 正式
// 公共的apiurl地址
const apiurl = {
  /**
   * 登录 注册 找回密码 个人信息一条龙
   */ 
  // userLogin: "account/userLoginApp.html",  // 用户APP登录
  // 用户APP登录
  userLogin: {type: "formData",baseUrl: $oldSeverRoot,api: "account/userLogin.html"},  
  // 获取用户信息
  getMyInfo: {type: "formData",baseUrl: $oldSeverRoot,api: "account/queryAccountInfo.html"},  
  // 查询用户信息-身份证-银行卡
  getUserBank: {type: "formData",baseUrl: $oldSeverRoot,api: "userBank/queryUser.html"},
  // 获取个人信息
  getUserInfo: {type: "formData",baseUrl: $oldSeverRoot,api: "userInfo/queryUserInfo.html"},
  // 获取商户信息
  getStoreInfo: {type: "formData",baseUrl: $oldSeverRoot,api: "storeInfo/findStoreInfo.html"},
  // 获取商户余额信息
  getStoreMoney: {type: "formData",baseUrl: $oldSeverRoot,api: "storeAccount/findStoreAccout.html"},
  // 获取用户绑定信息
  getUserIsPart: {type: "formData",baseUrl: $oldSeverRoot,api: "account/queryAccountInfoPart.html"},  
  // 图形验证码
  getImgCodeBase64: {type: "formData",baseUrl: $oldSeverRoot,api: "validatecode/codebase64.html"},  
  // 检查图形验证码
  checkImgCode: {type: "formData",baseUrl: $oldSeverRoot,api: "account/checkValidateCode.html"},  
  // 发送短信
  getSmsCode: { type: "formData",baseUrl: $oldSeverRoot,api: "sms/sendMessage.html"},  
  // 检查手机验证码
  checkSmsCode: {type: "formData",baseUrl: $oldSeverRoot,api: "account/checkCode.html"},  
  // 根据token检查手机验证码
  checkSmsCodeForKey: {type: "formData",baseUrl: $oldSeverRoot,api:"account/checkUserCode.html"},  
  // 找回密码
  findPassWord: {type: "formData",baseUrl: $oldSeverRoot,api: "account/forgetUserPwd.html" },  
  // 检查是否已经注册
  checkRegister: {type: "formData",baseUrl: $oldSeverRoot,api: "account/checkLoginkey.html"},
  // 注册
  userRegister: {type: "formData",baseUrl: $oldSeverRoot,api: "account/userRegister.html"}, 
  // 获取用户类型 
  getUserType: {type: "formData",baseUrl: $oldSeverRoot,api: "userInfo/userType.html"},

  /**
   * 设置中心
   */
  // 修改用户资料
  editUserInfo: {type: "formData",baseUrl: $oldSeverRoot,api: "userInfo/updateUserInfo.html"},
  // 获取用户收货地址
  getReceiveAddress:{type: "formData",baseUrl: $oldSeverRoot,api: "receiveAddress/findReceiveAddress.html"},
  // 设置用户默认收货地址
  editDefaultAddress:{type: "formData",baseUrl: $oldSeverRoot,api: "receiveAddress/updateAddressTodefa.html"},
  // 获取银行卡列表
  getBankList:{type: "formData",baseUrl: $oldSeverRoot,api: "userBank/queryBankList.html"},
  // 银行卡号输入显示对应的银行信息
  queryBankType:{type: "formData",baseUrl: $oldSeverRoot,api: "/userBank/queryBank.html"},
  // 添加用户收货地址
  addReceiveAddress:{type: "formData",baseUrl: $oldSeverRoot,api: "receiveAddress/addReceiveAddress.html"},
  // 修改用户收货地址
  editReceiveAddress:{type: "formData",baseUrl: $oldSeverRoot,api: "receiveAddress/updateReceiveAddress.html"},
  // 删除用户收货地址
  delReceiveAddress:{type: "formData",baseUrl: $oldSeverRoot,api: "receiveAddress/deleteReceiveAddress.html"},
  // 检查是否绑定身份证
  checkIdenity: {type: "formData",baseUrl: $oldSeverRoot,api: "userBank/queryIdentity.html" },
  // 检查是否绑定支付密码
  checkBindPayPwd: {type: "formData",baseUrl: $oldSeverRoot,api: "account/isPayment.html" },
  // 发送用户手机短信 新 用token
  sendMessageNew: {type: "formData",baseUrl: $oldSeverRoot,api: "sms/sendUserMessageNew.html"},
  // 发送用户手机短信 新 用手机号
  sendMessageNotValid: {type: "formData",baseUrl: $oldSeverRoot,api: "sms/sendMessageNotValid.html"} ,
  // 修改手机号码 新
  editPhoneNew:{type: "formData",baseUrl: $oldSeverRoot,api: "account/modifyBindPhoneNew.html"},
  // 绑定银行卡 新 
  bindUserBankNew: {type: "formData",baseUrl: $oldSeverRoot,api: "userBank/nameAuthenticationNew.html"},
  // 修改登录密码 新
  editUserLoginPwdNew: {type: "formData",baseUrl: $oldSeverRoot,api: "account/modifyPasswordNew.html"},
  // 修改支付密码 新
  editPaymentPwdNew:{type: "formData",baseUrl: $oldSeverRoot,api: "account/setPaymentNew.html"},

  /**
   * 获取城市地区等
   */
  // 省市列表
  getProvinces:{type: "formData",baseUrl: $oldSeverRoot,api: "address/findprovinces.html"},
  // 根据省市key请求城市列表
  getCitys:{type: "formData",baseUrl: $oldSeverRoot,api: "address/findCity.html"},
  // 根据城市key请求区列表
  getAreas:{type: "formData",baseUrl: $oldSeverRoot,api: "address/findAreas.html"},
  
  /**
   * 首页
   */
  // 获取采购区banner图
  getPurchaseBanner:{type: "formData",baseUrl: $oldSeverRoot,api: "information/findbanner.html"},
    // 获取公告
  getGonggao:{type: "formData",baseUrl: $oldSeverRoot,api: "information/findNotice.html"},
    // 获取交易信息
  getJiaoyi:{type: "formData",baseUrl: $oldSeverRoot,api: "newHomePage/findTurnover.html"},
  
  /**
   * 采购区
   */
  // 获取采购区采购列表
  getPurchaseList:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasingArea/findPurchasingArea.html"},
  // 获取采购区采购详情
  getPurchaseDetail:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasingArea/findPurchasingAreaById.html"},
  // 获取商家其他采购
  getPurchaseOther:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasingArea/findPurchasingArea.html"},
  // 查询时候报过价
  selectIsQuotation:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasingArea/quotation.html"},
  // 我要报价
  putQuotation:{type: "formData",baseUrl: $oldSeverRoot,api: "quotation/insert.html"},
  
  /**
   * 供应区
   */
  // 获取供应区供应列表
  getSupplyList: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/querySupply.html"},
  // 获取供应区供应详情
  getSupplyDetail: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/querySupplyById.html"},
  // 上传供应图片
  uploadImgV2_4: {type: "multipart",baseUrl: $oldSeverRoot,api: "uploadFile/v2/4/upload.html"},
  // 发布供应  
  putReleaseSupply: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/insertSupply.html"},
  // 获取我的供应列表
  getMySupply: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/findSupplyByStatus.html"},
  // 供应管理-提交供应订单
  submitSupplyList: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/release.html"},
  // 供应管理-删除供应订单
  delSupplyList: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/delete.html"},
  // 供应管理-停止供应订单
  stopSupplyList: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/update.html"},
  // 供应管理-取消供应订单
  cancelSupplyList: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/examine.html"},

  /**
   * 订单中心
   */
  //获取供应订单
  getSupplyOrder: {type: "formData",baseUrl: $oldSeverRoot,api: "sellerSupplyOrder/searchOrder.html"},
  //发货
  deliverGoods: {type: "formData",baseUrl: $oldSeverRoot,api: "sellerSupplyOrder/delivergoods.html"},
  //删除订单
  delelteOrder: {type: "formData",baseUrl: $oldSeverRoot,api: "purchasen/delete.html"},
  //获取报价订单
  getPriceOrder: {type: "formData",baseUrl: $oldSeverRoot,api: "quotation/selectPurchaseOrder.html"},
  //发货-报价订单
  deliverPriceGoods: {type: "formData",baseUrl: $oldSeverRoot,api: "quotation/updateOrderStatus.html"},
  //取消订单
  cancelOrder: {type: "formData",baseUrl: $oldSeverRoot,api: "ordertransaction/cancelOrder.html"},
  //确认收货
  acceptGoods: {type: "formData",baseUrl: $oldSeverRoot,api: "sellerPurchaseOrder/confirmOrder.html"},
  //获取供应买入订单
  getSupplyInOrder: {type: "formData",baseUrl: $oldSeverRoot,api: "ordertransaction/searchOrder.html"},
  //获取采购买入订单
  getPurchaseInOrder: {type: "formData",baseUrl: $oldSeverRoot,api: "sellerPurchaseOrder/searchOrder.html"},
  //获取报价订单详情
  getPriceOrderDetail: {type: "formData",baseUrl: $oldSeverRoot,api: "quotation/selectPurchaseOrderDetails.html"},

  /**
   * 采购管理
   */
  // 获取采购类别
  getShopCategory:{type: "formData",baseUrl: $oldSeverRoot,api: "company/businessScope.html"},
  // 根据类别获取采购分类
  getShopClassify:{type: "formData",baseUrl: $oldSeverRoot,api: "company/businessScopeById.html"},
  // 根据联系人方式
  getShopContact:{type: "formData",baseUrl: $oldSeverRoot,api: "Commodity/findStoreContact.html"},
  // 获取采购数量单位
  getPurchaseType:{type: "formData",baseUrl: $oldSeverRoot,api: "dictionaries/findbyType.html"},
  // 发布采购
  putReleasePurchase:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasen/insertSend.html"},
  // 采购管理列表
  getPurchaseAdminList:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasingArea/findPurchasingByStatus.html"},
  // 采购管理-提交订单
  putPurchaseRelease:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasen/release.html"},
  // 采购管理-停止发布
  putPurchaseStop:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasen/updateRelease.html"},
  // 采购管理-取消订单
  putPurchaseCancel:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasen/updateExamine.html"},
  // 采购管理-删除订单
  putPurchaseDelete:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasen/delete.html"},
  // 采购订单详情
  getPurchaseInfo:{type: "formData",baseUrl: $oldSeverRoot,api: "purchasingArea/findPurchasePreviewById.html"},
  // 采购订单-查看报价-列表
  getPurchaseOffer:{type: "formData",baseUrl: $oldSeverRoot,api: "quotation/selectPurchase.html"},
  
  
  /**
   * 申诉
   */
  //获取申诉列表
  appealList:{type: "json",baseUrl: $orderSeverRoot,api: "appeal/queryAppeal"},
  //提交申诉
  appealApply:{type: "json",baseUrl: $orderSeverRoot,api: "orderAppeal/insertOrderAppeal"},
  //查看订单当前的申诉状态
  appealStatus:{type: "formData",baseUrl: $orderSeverRoot,api: "appeal/queryOrderCurrAppealStatus"},
  //查看详情
  appealDetail:{type: "json",baseUrl: $orderSeverRoot,api: "appeal/queryAppealDetails"},

  //根据重量计算差价
  getDifference: {type: "formData",baseUrl: $oldSeverRoot,api: "supplyplus/getPriceSpread.html"}, 
  
  
  /**
   * 我的报价
   */
  //获取报价列表
  offerList:{type: "formData",baseUrl: $oldSeverRoot,api: "quotation/selectStatus.html"},
  //删除报价、改变报价状态（停止）
  updateOfferStatus:{type: "formData",baseUrl: $oldSeverRoot,api: "quotation/updateStatus.html"},
  //获取报价详情 / 采购订单-查看报价-列表-详情
  offerInfo:{type: "formData",baseUrl: $oldSeverRoot,api: "quotation/selectQuotation.html"},
  //采购订单-查看报价-列表-下单
  submintOrder:{type: "formData",baseUrl: $oldSeverRoot,api: "SupplyPurchase/supplyPurchase.html"},

  
  //帮助中心
  helpList: {type: "formData",baseUrl: $oldSeverRoot,api: "Article/query.html"},  //获取帮助问题列表

  /**
   * 线下打款
   */
  
  // 获取公司对公账户信息
  getOfflinePublicAccount: {type: "json",baseUrl: $orderSeverRoot,api: 'payOfflineCertificate/queryPublicAccount'},
  // 线下打款凭证查看
  getOfflineCertificate: {type: "formData",baseUrl: $orderSeverRoot,api: 'payOfflineCertificate/queryPayOfflineCertificate'},
  // 上传交易凭证
  uploadImgV2_8: {type: "multipart",baseUrl: $oldSeverRoot,api: "uploadFile/v2/8/upload.html"},  
  // 提交付款信息
  putPayOffline: {type: "json",baseUrl: $orderSeverRoot,api: "payOfflineCertificate/insertPayOffline"},  
  // 获取订单申诉成功的申诉详情（线下打款）
  querySuccessOrderAppeal: {type: "json",baseUrl: $orderSeverRoot,api: "appeal/querySuccessOrderAppealDetails"},  
  // 获取订单支付信息（采购和供应）
  getOrderDetail: {type: "formData",baseUrl: $oldSeverRoot,api: "SupplyPurchase/queryOrder.html"},


  /**
   * 充值
   */
  submitRechargeOrder: {type: "formData",baseUrl: $oldSeverRoot,api: "pay/storeRecharge.html"},  

  SelectRechargeResult: {type: "formData",baseUrl: $oldSeverRoot,api: "condition/order.html"},  

} 
// 返回在vue模板中的调用接口
export default {
  apiurl,
  $appid,
  $mainKey,
  $tokenKey
}