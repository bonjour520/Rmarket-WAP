<template>
  <div class="x-scroll purch">
    <scroller lock-x height="-44px" style="background: #f2f2f2;" ref="scrollerBottom">
      <div class="bg-f7">
        <div class="purch-admin">
          <!-- 采购 -->
          <box v-if="$route.query.type == 0">
            <div class="top-address layout-flex">
              <div><i class="iconfont icon-4"></i></div>
              <div class="flex1 address-right">
                <p class="rmt10">收货人：<span>{{IndexAddress.contacts}}</span> <span class="fr mr25">{{IndexAddress.phone}}</span></p>
                <div class="layout-flex rmt20">
                    <span>收货地址：</span>
                    <span class="flex1">{{ IndexAddress.add_province }} {{IndexAddress.add_city}} {{IndexAddress.add_area}} {{ IndexAddress.add_goods_field4}}</span>
                </div>
              </div>
            </div>
            <div class="body-shopInfo global">
              <div class="b-header"><img :src="orderData.qLogo" alt="" />{{ orderData.qStoreName }}</div>
              <div class="content">
                <img :src="orderData.qLogo" alt="" class="pic">
                <div class="info">
                  <p>{{orderData.purchase}}</p>
                  <p>起售数量：{{orderData.selling_count}}</p>
                  <p>
                    <span class="cr-pink">{{orderData.unitPrice}}元</span>
                    <span class="fr">x{{buyNumber}}</span>
                  </p>
                </div>
              </div>
              <group label-width="2.5em" label-margin-right="1em" label-align="right" class="rmt10">
                <x-textarea title="备注" :max="45" placeholder="请填写备注（45字以内）" :height="70" :rows="2" :cols="20" v-model="desInfo"></x-textarea>
              </group>
            </div>
            <div class="footer-info">
              <div class="layout-flex mb15 flex-jc-sb">
                <span>商品金额</span>
                <span class="cr-pink allMoneyNum">￥{{ Number.parseFloat(buyNumber * orderData.unitPrice).toFixed(2) }}</span>
              </div>
              <div class="layout-flex mb15 flex-jc-sb">
                <span>店铺优惠</span>
                <span class="">-￥0.00</span>
              </div>
              <div class="layout-flex mb15 flex-jc-sb">
                <span>运费</span>
                <span class="">+￥0.00</span>
              </div>
            </div>
          </box>
            <!-- 供应 -->
          <box v-else>
            <div class="top-address layout-flex">
              <div><i class="iconfont icon-4"></i></div>
              <div class="flex1 address-right" @click="$router.push('/setAddress')">
                <p class="rmt10">收货人：<span>{{IndexAddress.link_name}}</span> <span class="fr mr25">{{IndexAddress.link_phone}}</span></p>
                <div class="layout-flex rmt20">
                    <span>收货地址：</span>
                    <span class="flex1">{{IndexAddress.province}}  {{IndexAddress.city}}  {{ IndexAddress.area}}  {{IndexAddress.add_field4}}</span>
                    <i class="iconfont icon-xiangyou ml15"></i>
                </div>
              </div>
            </div>
            <div class="body-shopInfo global">
              <div class="b-header"><img :src="orderData.logo" alt="" />{{ orderData.storeInfo_name }}</div>
              <div class="content" v-if="orderData.showProduct_img != undefined">
                <img :src="orderData.showProduct_img[0]" alt="" class="pic">
                <div class="info">
                  <p>{{orderData.supply_name}}</p>
                  <p>起售数量：{{orderData.selling_count}}</p>
                  <p>
                    <span class="cr-pink">{{orderData.productUnivalent}}元</span>
                    <span class="fr">x{{buyNumber}}</span>
                  </p>
                </div>
              </div>
              <group label-width="2.5em" label-margin-right="1em" label-align="right" class="rmt10">
                <x-textarea title="备注" :max="45" placeholder="请填写备注（45字以内）" :height="70" :rows="2" :cols="20" v-model="desInfo"></x-textarea>
              </group>
            </div>
            <div class="footer-info">
              <div class="layout-flex mb15 flex-jc-sb">
                <span>商品金额</span>
                <span class="cr-pink allMoneyNum">￥{{ Number.parseFloat(buyNumber * orderData.productUnivalent).toFixed(2) }}</span>
              </div>
              <div class="layout-flex mb15 flex-jc-sb">
                <span>店铺优惠</span>
                <span class="">-￥0.00</span>
              </div>
              <div class="layout-flex mb15 flex-jc-sb">
                <span>运费</span>
                <span class="">+￥0.00</span>
              </div>
            </div>
          </box>
        </div>
      </div>
    </scroller>
    <div class="layout-flex flex-ai-c" style="position: fixed;bottom: 0; width: 100%; border-top: 1px solid #eee;	background: #fff;overflow: hidden;">
      <div style="width: 145%;text-align: right; padding: 0 10px; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">合计金额：<span class="cr-pink allMoneyNum">￥{{ Number.parseFloat(buyNumber * ($route.query.type == 0 ? orderData.unitPrice : orderData.productUnivalent)).toFixed(2)}}</span></div>
      <button class="btn-default btn-main" style="border-radius: 0; margin-top: 0; outline: none;" @click="getIsUserBank">提交订单</button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import CommomObj from '../../utils/commom';
  export default {
    data() {
      return {
        orderData: {},
        IndexAddress: {}, // 默认地址对象
        quotationID: '',
        purchaseID: '',
        gscID: '',
        buyNumber: '',
        desInfo: '',
        supplyOrderDetail: {},
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取收货地址
      getReceiveAddress(){
        this.$api.post(this.$interface.apiurl.getReceiveAddress,{
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          page:1,
          pagesize: 10
        },res=>{
          for (let i = 0; i < res.data.data.length; i++) {
            if(res.data.data[i].is_defa == 1){
              this.IndexAddress = res.data.data[i];
            }
          }
        },err=>{})
      },
      // 获取报价订单信息
      getOfferInfo(id,qid) {
        let params = {
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          id: id,
          qid: qid,
          type: 1
        }
        this.$api.post(this.$interface.apiurl.offerInfo, params, res => {
          this.orderData = res.data[0];
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
          })
          if(this.$route.query.type == 0){
            this.IndexAddress = res.data[1];
          }
        }, err => {
          this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          this.orderData = {};
        })
      },
      // 获取是否绑定银行
      getIsUserBank(){
        let vm = this;
        vm.$api.post(vm.$interface.apiurl.getUserBank,{
          appid: vm.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
        },res=>{
          if(res.data.bank_status == 0){
            vm.checkBindPayPwd();
          }else{
            CommomObj.$alertWarn("请先绑定银行卡信息!",function () {
              vm.$router.replace("/personnel");
            });
          }
        })
      },
      // 获取是否设置支付密码
      checkBindPayPwd(){
        let vm = this;
        vm.$api.post(vm.$interface.apiurl.checkBindPayPwd,{
          appid: vm.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
        },res=>{
            vm.submintOrder();
        },err=>{
          CommomObj.$alertWarn("请先绑定支付密码!",function () {
            vm.$router.replace("/setPaypwd?type=init");
          });
        })
      },
      // 查看收货地址是否在供应范围内
      checkScheule(){
        let _int = 0;
        let adrArr = this.orderData.supplyScheduleList;
        for(var i=0;i<adrArr.length;i++){
          if(adrArr[i].provinceId == '0'){
            return true;
          }else{
            if(adrArr[i].province == this.IndexAddress.province){
              return true;
            }else{
              _int++;
              if(_int == adrArr.length){
                return false;
              }
            }
          }
        }
      },
      // 提交订单
      submintOrder(){
         if(this.$route.query.type == 1){ // 供应买入 
          if(!this.checkScheule()){
            CommomObj.$tips('收货地区不在供应地区内');
            return;
          }
         }else{ // 采购买入
           if(this.orderData.is_stop != 0){
              CommomObj.$tips("已停止下单或已销售完!");
              return;
           }
         }
        this.$vux.loading.show({text:"Laoding..."});
        this.$api.post(this.$interface.apiurl.submintOrder,{
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          addressId: this.$route.query.type == 0 ? 0 : this.IndexAddress.address_id, // type==0 采购 1 供应
          logistics_type: 0,
          gscID: this.gscID,
          order_numb: this.buyNumber,
          desc: this.desInfo,
          redPacket: 0,
          quotationStoreId: this.orderData.store_id,
          type:  this.$route.query.type == 0 ? 1 : 2 // 1 采购 2 供应
        },res=>{
          this.$vux.loading.hide();
          this.$router.push({path: "/offlinePay", query: { 
            buyNumber: this.buyNumber,
            orderSn: res.data.order_sn, 
            orderId:  res.data.id,
            orderTypeCode: this.$route.query.type == 0 ? 'purchase' : 'supply',
            typeCode: "firstPayment"
          }})
        },err=>{
          this.$vux.toast.text(err.msg);
          this.$vux.loading.hide();
        })
        
      }
    },
    mounted() {},
    activated() {
      this.buyNumber = this.$route.query.buyNumber;
      this.gscID = this.$route.query.gscID;
      if(this.$route.query.type != 0) { // 地址可选 供应
        this.getReceiveAddress();
        this.orderData = localStorage.supplyOrderDetail ? JSON.parse(localStorage.supplyOrderDetail) : {};
      }else{ // 采购
        this.purchaseID = this.$route.query.purchaseID;
        this.quotationID = this.$route.query.quotationID;
        this.getOfferInfo(this.$route.query.purchaseID,this.$route.query.quotationID);

      }
    }
  }

</script>
<style lang="scss">
  @import "@/base/purchaseAreaDetail.scss";

</style>
