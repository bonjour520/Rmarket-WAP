<template>
  <div class="x-scroll offline">
    <scroller lock-x height="-48px" style="background: #f2f2f2;" ref="scrollerBottom">
      <section class="bg-f7 global">
        <group label-width="4.5em" class="rmt20" :class="orderObj.typeCode == 'difference' ? 'vux-1px-b': ''">
          <cell title="订单编号" :value="orderObj.orderSn" value-align="left"></cell>
        </group>
        <group label-width="7.5em" class="cr-pink cell-red">
          <cell title="超出重量（Kg）" :value="orderObj.weight" value-align="left" v-if="orderObj.typeCode == 'difference'">
          </cell>
        </group>
        <box>   
          <group label-width="4.5em" class="rmt20">
            <cell title="线下支付">
              <img slot="icon" width="30" style="display:block;margin-right:5px;" src="../../../static/imgs/offline/icon@2x.png">
              <img slot="child" width="30" style="display:block;" src="../../../static/imgs/offline/Cells_Editing_Select@2x.png">
            </cell>
            <div class="top-tips mb10">请用网银或者去银行向下方润民对公账户转账<span class="cr-pink">(选择及时到账)</span>,转账以后再在此页面提交打款信息!汇款时备注订单号 <span class="cr-pink">032989</span>可加快核准。</div>
            <div class="bank-box mb10">
                <p class="name">建设银行企业对公账户</p>
                <p class="banknum">{{offlinePublicData.bankAccount}} <img src="../../../static/imgs/offline/bank_copy@2x.png" alt=""></p>
                <p class="bankname">户名：{{offlinePublicData.bankAccountName}} <img src="../../../static/imgs/offline/bank_copy@2x.png" alt=""></p>
                <p class="kaifu">开户行：{{offlinePublicData.bankName}} <img src="../../../static/imgs/offline/bank_copy@2x.png" alt=""></p>
            </div>
          </group>
          <group class="rmt20">
            <cell title="打款信息">
              <img slot="child" width="30" style="display:block;" src="../../../static/imgs/offline/add@2x.png" @click="$router.push({path: '/offlineVoucher', query: { type: 'add'}})">
            </cell>
          </group>
          <!-- 订单信息板块 -->
          <swipeout class="order-lists" v-show="offlineVoucherList.length > 0">
            <swipeout-item :threshold=".5" underlay-color="#ccc" v-for="(item, index) in offlineVoucherList" :key="index">
              <div slot="right-menu">
                <swipeout-button @click.native="editOfflineVoucher(item.id)" background-color="#00c55d">修改</swipeout-button>
                <swipeout-button @click.native="delOfflineVoucher(item.id)" background-color="#D23934">删除</swipeout-button>
              </div>
              <div slot="content" class="list-content">
                <p><label>打款户名</label><span>{{item.name}}</span></p>
                <p><label>打款银行</label><span>{{item.bankName}}</span></p>
                <p><label>打款金额</label><span>{{Number.parseFloat(item.money).toFixed(2)}}</span></p>
                <p><label>打款时间</label><span>{{item.time}}</span></p>
                <p><label>打款凭证</label>
                  <span>
                    <img :src="i.src" alt="" v-for="(i, _index) in item.imgArr" :key="_index" @click="showImg(_index)">
                  </span>
                </p>
              </div>
            </swipeout-item>
          </swipeout>
        </box>
        <box class="bg-f cr-pink rmt20 pt20 pl15 pb20 pl15 rf-24">
          <p>1. 转账时请务必认准账号及户名； </p>
          <p>2. ATM转账可选择实时到账或立即到账； </p>
          <p>3. 润民网有效保障您的资金安全； </p>
          <p>4. 如有问题请及时联系客服：400-107-1988</p>
        </box>
      </section>
    </scroller>
    <flexbox class="foot-bar">
      <flexbox-item>
        <div class="txt">需支付: ￥<span>{{orderObj.buyNumber}}</span></div>
      </flexbox-item>
      <flexbox-item :span="4.4">
        <div class="btn" @click="putPayOffline">提交付款信息</div>
      </flexbox-item>
    </flexbox>
    <!-- 图片浏览 -->
    <previewer :list="imgArr" ref="previewer"></previewer>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex';
  export default {
    data() {
      return {
        offlinePublicData: {},
        orderObj: {},
        offlineVoucherList: [],
        imgArr: [],
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取公司对公账户信息
      getOfflinePublicAccount(){
        this.$api.get(this.$interface.apiurl.getOfflinePublicAccount,null,res=>{
          this.offlinePublicData = res.data;
        },err=>{})
      },
      // 获取订单支付信息（采购和供应）
      getOrderDetail() {
        this.$api.post(this.$interface.apiurl.getOrderDetail,{
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          orderId: this.orderObj.orderId,
          type: this.orderObj.orderTypeCode == 'purchase' ? 1 : 2,
        },res=>{
          this.$set(this.orderObj,'buyNumber',res.data.sumOrderPrice)
          this.$set(this.orderObj,'orderSn',res.data.order_sn)
        },err=>{
          this.$set(this.orderObj,'buyNumber',0)
          this.$vux.toast.text(err.msg);
        })
      },
      // 获取订单申诉成功的申诉详情
      querySuccessOrderAppeal() {
        this.$api.get(this.$interface.apiurl.querySuccessOrderAppeal,{
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          orderSn: this.orderObj.orderSn,
        },res=>{
          this.$set(this.orderObj,'buyNumber',res.data.amount)
          this.$set(this.orderObj,'weight',res.data.weight)
        },err=>{
          this.$set(this.orderObj,'weight',0)
          this.$set(this.orderObj,'buyNumber',0)
          this.$vux.toast.text(err.message);
        })
      },
      // 修改凭证
      editOfflineVoucher (id) {
        this.$router.push({ 
          path: "/offlineVoucher",
          query: {
            type: "edit",
            id: id
          }
        })
      },
      // 删除凭证
      delOfflineVoucher (id) {
        this.imgArr = [];
        for (let i = 0; i < this.offlineVoucherList.length; i++) {
          if(this.offlineVoucherList[i].id == id){
            this.offlineVoucherList.splice(i,1);
          }else{
            for (let j = 0;  j < this.offlineVoucherList[i].imgArr.length;  j++) {
              this.imgArr.push(this.offlineVoucherList[i].imgArr[j]);
            }
          }
        }
        localStorage.setItem("offlineVoucherList",JSON.stringify(this.offlineVoucherList));
      },
      // 显示图片
      showImg(index){this.$refs.previewer.show(index);},
      // 提交线下打款信息
      putPayOffline(){
        if(this.offlineVoucherList.length != 0){
          // 处理poc格式 报价下单（firstPayment）
          let _poc = [];
          for (let i = 0; i < this.offlineVoucherList.length; i++) {
            let _obj = {};
            _obj.amount = this.offlineVoucherList[i].money;
            _obj.bankCode = this.offlineVoucherList[i].bank;
            _obj.bankName = this.offlineVoucherList[i].bankName;
            _obj.img = this.offlineVoucherList[i].imgArr[0].src;
            _obj.payTime = (new Date(this.offlineVoucherList[i].time)).valueOf();
            _obj.userName = this.offlineVoucherList[i].name;
            _poc.push(_obj);
          }
          this.$vux.loading.show({text: "Loading..."});
          this.$api.post(this.$interface.apiurl.putPayOffline,{
            appid: this.$interface.$appid,
            tokenKey: localStorage.$tokenKey,
            mainKey: localStorage.$mainKey,
            orderId: this.orderObj.orderId,
            orderSn: this.orderObj.orderSn,
            orderTypeCode: this.orderObj.orderTypeCode,
            poc: _poc,
            typeCode: this.orderObj.typeCode
          },res=>{
            setTimeout(()=>{
              this.$vux.loading.hide();
              localStorage.removeItem("offlineVoucherList");
              this.offlineVoucherList = [];
              this.$router.push({
                path: '/offlineResult',
                query: {
                  orderSn: this.orderObj.orderSn,
                  typeCode: this.orderObj.typeCode,
                  orderTypeCode: this.orderObj.orderTypeCode
                }
              })
            },1000)
          },err=>{
            this.$vux.loading.hide();
            this.$vux.toast.text(err.message);
          })
        }else{
          this.$vux.toast.text("请先添加打款信息!");
        }
      }
    },
    mounted() {},
    activated() {
      this.orderObj = this.$route.query;
      this.getOfflinePublicAccount();
      if(this.orderObj.typeCode == 'difference'){ // 线下打款
        this.querySuccessOrderAppeal();
      }else{ // 采购 供应
        this.getOrderDetail();
      }
      if(localStorage.offlineVoucherList){
        this.offlineVoucherList = JSON.parse(localStorage.offlineVoucherList);
        this.imgArr = [];
        for (let i = 0; i < this.offlineVoucherList.length; i++) {
         for (let j = 0;  j < this.offlineVoucherList[i].imgArr.length;  j++) {
            this.imgArr.push(this.offlineVoucherList[i].imgArr[j]);
          }
        }
      }
    }
  }

</script>
<style lang="scss">
.global .cell-red .weui-cell .weui-cell__ft{
  color: red;
}
</style>
