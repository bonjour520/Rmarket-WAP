import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import Api from '../api';
import Interface from '../api/apiurl.js'
Vue.use(Vuex)

import CommomObj from '../utils/commom.js';

// store中的全局变量，只在store中使用
const store = new Vuex.Store({
  state:{ // 状态
    isLoading: false,
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || {}, // 用户基本信息
    loginState: false || Boolean(localStorage.getItem("userInfo")),
    storeInfo: JSON.parse(localStorage.getItem("storeInfo")) || {}, // 商户基本信息
  },
  mutations:{ // 方法
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    // 改变登录状态
    userSignin(state, obj) {
      localStorage.setItem("userInfo", JSON.stringify(obj));
      state.loginState = true;
      Object.assign(state.userInfo, obj);
    },
    userSignout(state){
      // Object.keys(state).forEach(k => Vue.delete(state, k)); // 删除所有信息
      localStorage.clear();
      state.loginState = false;
      state.userInfo = {};
      state.storeInfo = {};
      router.replace('/');
    },
    saveStoreInfo(state,obj){
      localStorage.setItem("storeInfo", JSON.stringify(obj));
      Object.assign(state.storeInfo, obj);
    }

  },
  actions:{
    userSignin({ commit },obj){
      localStorage.setItem("$tokenKey",obj.tokenKey);
      localStorage.setItem("$mainKey",obj.mainKey);
      Api.post(Interface.apiurl.getUserInfo,{
        "appid": "wap",
        "mainKey": obj.mainKey,
        "tokenKey": obj.tokenKey
      },res=>{
        commit("userSignin",res.data);
        CommomObj.$tips("登录成功");
        setTimeout(()=>{
          router.go(-1);
          // router.replace({path: '/personnel'});
        },200);
        // Api.post(Interface.apiurl.getStoreInfo,{
        //   "appid": "wap",
        //   "mainKey": obj.mainKey,
        //   "tokenKey": obj.tokenKey
        // },response=>{
        //   commit("saveStoreInfo",response.data);
        // },error=>{
        //     CommomObj.$alertWarn("非常抱歉，微端暂不支持个人用户登录，请登录润民网PC版申请商家入驻，<a href='http://rmw.runmin.shop/'> http://rmw.runmin.shop </a>",function(){
        //       window.open("http://rmw.runmin.shop/");
        //     })
        // })
      });
    }
  }, // 动作
  modules: {} // 模块
})

export default store