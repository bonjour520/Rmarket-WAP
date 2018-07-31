<template>
  <div class="search-page">
    <div class="checkClass">
      <span @click="isShowClassList = true">{{type == 1 ? '采购' : '供应'}} <i class="iconfont icon-xiangxia"></i></span>
      <div class="classList" v-show="isShowClassList">
        <p @click="changeType(1)">采购</p>
        <p @click="changeType(2)">供应</p>
      </div>
    </div>
    <search @result-click="resultClick" :results="results" v-model.trim="value"  auto-scroll-to-top top="0" @on-focus="onFocus"
      @on-cancel="onCancel" @on-submit="onSubmit" ref="search" class="vux-search-fixed"></search>
    <div v-if="!showSearchHistory" class="mt5"  ref="mt5">
      <div v-if="type == 1" class="purchase">
          <main>
             <ul class="contUl">
              <li v-for="(item, index) in purchaseList" :key="index">
                <div class="contList clearfix">
                    <div class="listTop">
                        <p class="listTit" style="width: 80%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">【采购】
                          <span class="proName">{{item.purchase_name}}</span>
                          <span class="proNum">（{{item.purchase_number}}{{item.unit}}）</span>
                        </p>
                        <p class="pubTime">
                          {{$stampToTime(item.nearlyTime)}}前
                        </p>
                    </div>
                    <div class="contLi">
                        <div class="cont_L">
                            <p class="price">期望单价：<span class="priceNum">{{item.hopePrice == 0 ? "面议" : item.hopePrice + '元'}}</span></p>
                            <p class="area">采购地区：<span class="areaShow">{{item.province}}/{{item.city}}</span></p>
                            <p class="shopper">采购商家：<span class="shopName">{{item.storeInfo_name}}</span></p>
                        </div>
                        <router-link class="viewDetail" :to="'/purchaseDetail?purchaseID='+ item.purchase_id">查看详情</router-link>
                    </div>
                </div>
              </li>
            </ul>
          </main>
      </div>
      <div v-else class="supply">
        <main>
          <ul class="contUl" v-show="supplyList.length > 0">
          <li v-for="(item, index) in supplyList" :key="index">
          	<router-link :to="'/supplyDetail?supplyID='+ item.supply_id">
              <div class="contLi">
                <img class="proImg" :src="item.showProduct_img[0]" alt="">
                <p class="price">￥{{item.productUnivalent}}元/{{item.unit}}</p>
                <p class="proName">{{item.supply_name}}</p>
                <div class="proAddr">
                  <p class="farm" style="width:2.3rem">{{item.storeInfo_name}}</p>
                  <p class="addr" style="width:2rem">{{item.province}}/{{item.city}}</p>
                </div>
              </div>
						</router-link>
          </li>
        </ul>
        </main>
      </div>
      <div v-show="isEmptyData" class="search-empty">
        <img src="../../static/imgs/index/search-empty.png" alt="">
        <p>没有找到相关符合信息</p>
      </div>
    </div>
    <!-- 搜索历史 -->
    <div v-show="showSearchHistory && searchData.length>0" style="margin-top:50px;">
      <group title="历史搜索">
        <cell :title="item.value" v-for="(item, index) in searchData" :key="index" @click.native="historySearch(item.value)"></cell>
      </group>
      <box gap="10px 10px" class="box-delBtn" v-show="searchData.length > 0">
        <x-button plain @button-plain-default-border-color="rgba(242,242,242,1)" @click.native="claerHistorySearch"><i class="iconfont icon-delete"></i> 删除历史搜素记录</x-button>
      </box>
      <div>
    </div>
    </div>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex';
  import CommomObj from '../utils/commom';
  export default {
    data() {
      return {
        results: [],
        value: '',
        searchData: [],
        type: '1', // 区分采购或者是供应,
        showSearchHistory: true,
        isShowClassList: false,
        purchaseList: [],
        supplyList: [],
        showDivider: false,
        isEmptyData:false,
        clearConfirm:false,
        page:1,
        pageSize:3
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取采购列表
      getPurchaseList(isEmpty,name,status,page,pagesize){
        let params = {
          page: page,
          pagesize: pagesize,
          name: name,
          priceOrder: status,
          newesTime: status == -1 ? '0': '-1'
        }
        this.$api.post(this.$interface.apiurl.getPurchaseList,params,res=>{
          console.log(res); 
          if (!isEmpty) {
            if(res.data.rows < (this.page-1)*this.pageSize){
              return;
            }
            for (let i  = 0; i < res.data.data.length; i++) {
              this.purchaseList.push(res.data.data[i]);
            }
          }else{
            this.purchaseList = res.data.data;
            this.isEmptyData =this.purchaseList && this.purchaseList.length>0?false:true; 
          }
        },err=>{
          this.$vux.toast.show({ text: err.errorMsg, type:'text',width: '180px'});        
          this.purchaseList = [];
        })
      },
      // 获取供应列表
      getSupplyList(isEmpty, name,status, page, pagesize) {
        let params = {
          page: page,
          pagesize: pagesize,
          name: name,
          priceOrder: status,
          newesTime: status == -1 ? '0' : '-1'
        }
        this.$api.post(this.$interface.apiurl.getSupplyList, params, res => {
          if (!isEmpty) {
            if (res.data.rows < (this.page - 1) * this.pageSize) {
              return;
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.supplyList.push(res.data.data[i]);
            }
          } else {
            this.supplyList = res.data.data;
            this.isEmptyData =this.supplyList && this.supplyList.length>0?false:true; 
            //this.$nextTick(() => {
             // this.$refs.scrollerBottom.reset({
               // top: 0
              //})
            //})
          }
        }, err => {
          this.$vux.toast.show({
            text: err.errorMsg,
            type: 'text',
            width: '180px'
          });
          this.supplyList = [];
        })
      },
      setFocus() {
        this.$refs.search.setFocus()
      },
      resultClick(item) {
        window.alert('you click the result item: ' + JSON.stringify(item))
      },
      onSubmit() {
        if(this.value == '' ){
          this.$vux.toast.text('请输入内容')
          return;
        }
        this.$refs.search.setBlur();
        this.$vux.loading.show({text: 'Loading'})
        let searchObj = []
        if(localStorage.searchData != undefined){
          searchObj = JSON.parse(localStorage.searchData);
        }
        let obj = {};
        obj.value = this.value;
        obj.type = this.type;
        searchObj.push(obj)
        localStorage.setItem("searchData",JSON.stringify(searchObj));
        
        this.showSearchHistory = false; // 隐藏搜索历史
        
        if(this.type == '1'){ // 采购
          this.getPurchaseList(true,this.value,-1,this.page,this.pageSize);
        }else{
          this.getSupplyList(true,this.value,-1,this.page,this.pageSize);
        }
        this.$vux.loading.hide();
      
      },
      onFocus() {
        this.isShowClassList = false;
        this.showSearchHistory = false;
      },
      onCancel() {
        this.showSearchHistory = true;
        if(localStorage.searchData != undefined){
          this.searchData = JSON.parse(localStorage.searchData) || [];
        }
      },
      claerHistorySearch(){
        var _this = this;
        CommomObj.$comfirm("确定清空历史搜索吗？",function(){
           _this.searchData = [];
           localStorage.removeItem("searchData");
           _this.showSearchHistory = false;
          });
      },
      changeType(type){
        this.isShowClassList = false;
        this.type = type;
        this.isEmptyData = false;
      },
      historySearch(val) {
        this.value = val;
        this.showSearchHistory = false; // 隐藏搜索历史
        this.$vux.loading.show({text: 'Loading'})
        this.page = 1;
        if(this.type == '1'){ // 采购
          this.getPurchaseList(true,this.value,-1,this.page,this.pageSize);
        }else{
          this.getSupplyList(true,this.value,-1,this.page,this.pageSize);
        }
        this.$vux.loading.hide();
      },
      handleScroll() {
        //滚动条滚动时，距离顶部的距离
   	    var scrollTop = document.getElementById("app").scrollTop;
   	    //可视区的高度
   	    var windowHeight = document.documentElement.clientHeight;
        //滚动条的总高度
        var scrollHeight = this.$refs.mt5 && this.$refs.mt5.clientHeight;
        var searchHeight = this.$refs.search.$el.clientHeight;
        if(scrollHeight &&  scrollTop + windowHeight ==  scrollHeight + searchHeight){
          this.$vux.loading.show({text: 'Loading'})
          this.page ++ ;
          if(this.type == '1'){ // 采购
            this.getPurchaseList(false,this.value,-1,this.page,this.pageSize);
          }else{
            this.getSupplyList(false,this.value,-1,this.page,this.pageSize);
          }
          this.$vux.loading.hide();
        }   
      }
    },
    mounted() {
      document.getElementById("app").addEventListener('scroll', this.handleScroll)
    },
    activated() {
      if(localStorage.searchData != undefined){
        this.searchData = JSON.parse(localStorage.searchData) || [];
      }
    }
  }

</script>
<style lang="scss">
  @import '@/base/reset.scss';
  @import "@/base/purchaseArea.scss";
  @import "@/base/supplyArea.scss";
  #app{
    background: #f7f7f7;
  }
  .search-page{
     main{
      padding-top: 0!important;
    }
    .vux-search-box{
     position: fixed!important;
     top:0;
    }
  }
  .mt5{
    position: absolute;
    top:rem(88)
  }
  .checkClass{
    position: fixed;
    z-index: 101;
    width: rem(130);
    height: rem(88);
    font-size: rem(28);
    left: rem(15);
    top: 0;
    line-height: rem(84);
    color: $color_main;
    vertical-align: top;
    .classList{
      position: absolute;
      width: rem(178);
      height: rem(200);
      top: rem(75);
      left: 0;
      background: url('../../static/imgs/index/classlist.png') no-repeat top center/100% 100%;
      p{
        color: #fff;
        text-align: right;
        padding:  rem(6) rem(30);
        line-height: rem(71);
        &:first-child{
          margin-top: rem(25);
        }
      }
    }
  }
  .weui-search-bar__form{
    margin-left: 1.5rem;
  }
  .weui-search-bar {
    font-size: rem(28);
  }
  .box-delBtn{
    .weui-btn {
      border-radius: 25px;
      font-size: rem(28);
    }
  }
  .search-empty{
    text-align: center;
    margin-top: rem(170);
    img{
      width: rem(128);
      height: auto;
    }
    p{
      font-size: rem(30);
      color:#222;
    }
  }

</style>
