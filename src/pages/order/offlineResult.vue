<template>
  <div class="x-scroll offline">
    <scroller lock-x height="-48px" style="background: #f2f2f2;" ref="scrollerBottom">
      <section class="bg-f7 global">

        <!-- 顶部订单状态 -->
        <!-- 审核中 -->
        <flexbox class="top-result" v-if="offlineResultData.statusCode == 'ing'">
          <flexbox-item :span="2.4">
            <div class="img"><img src="../../../static/imgs/offline/face_suc@2x.png" alt=""></div>
          </flexbox-item>
          <flexbox-item>
            <div class="txt">
              <p>您<span>已成功提交</span>打款信息</p>
              <p>请等待工作人员核准</p>
            </div>
          </flexbox-item>
        </flexbox>
        <!-- 审核失败 -->
        <box v-else-if="offlineResultData.statusCode == 'fail'">
          <flexbox class="top-result vux-1px-b">
            <flexbox-item :span="2.4">
              <div class="img"><img src="../../../static/imgs/offline/face_err@2x.png" alt=""></div>
            </flexbox-item>
            <flexbox-item>
              <div class="txt">
                <p>非常抱歉</p>
                <p>您的打款信息 <span class="cr-pink">未通过</span>核准请重</p>
              </div>
            </flexbox-item>
          </flexbox>
          <group class="formGroup">
             <cell class="tc rf-24">
               <span slot="title">
                 原因：未查询到打款信息打款
                 <br>
                 <b class="cr-cheng rmt10">提示：需重新提交本订单所有打款信息</b>
               </span>
             </cell>
          </group>
        </box>

        <!-- 审核成功 -->
        <flexbox class="top-result" v-else-if="offlineResultData.statusCode == 'success'">
          <flexbox-item :span="2.4">
            <div class="img"><img src="../../../static/imgs/offline/face_suc@2x.png" alt=""></div>
          </flexbox-item>
          <flexbox-item>
            <div class="txt">
              <p>恭喜！您的打款信息<span>已通过</span>核准！</p>
            </div>
          </flexbox-item>
        </flexbox>


        <group label-width="4.5em" class="rmt20 formGroup">
          <cell class="tc vux-1px-b">
            <span slot="title">付款信息</span>
          </cell>
          <cell title="订单编号" class="vux-1px-b" :value="offlineResultData.orderSn" value-align="left"></cell>
          <cell title="付款金额" class="vux-1px-b" value-align="left">
            <span slot="value" class="cr-pink">{{Number.parseFloat(offlineResultData.orderAmount).toFixed(2) +'元'}}</span>
          </cell>
        </group>   
        <!-- 订单信息板块 -->
        <swipeout class="order-lists">
          <swipeout-item :threshold=".5" underlay-color="#ccc" v-for="(item, index) in offlineResultData.certificateList" :key="index" disabled>
            <div slot="content" class="list-content">
              <p class="vux-1px-b rpb20">打款信息 {{index + 1}}</p>
              <p class="cr-666"><label>打款户名</label><span>{{item.userName}}</span></p>
              <p class="cr-666"><label>打款银行</label><span>{{item.bankName}}</span></p>
              <p class="cr-666"><label>打款金额</label><span>{{Number.parseFloat(item.amount).toFixed(2)}}</span></p>
              <p class="cr-666"><label>打款时间</label><span>{{ $timestampToTime(item.payTime)}}</span></p>
              <p class="cr-666"><label>打款凭证</label>
                <span>
                  <img :src="_i.src" v-for="(_i, _index) in item.img" :key="_index" @click="showImg(_index)">
                </span>
              </p>
            </div>
          </swipeout-item>
        </swipeout>
        <div class="rmb100"></div>
      </section>
    </scroller>
    <flexbox v-if="offlineResultData.statusCode == 'fail'" class="foot-bar" :gutter="0">
      <flexbox-item>
        <div class="a-block" @click="toRefund">重新提交</div>
      </flexbox-item>
    </flexbox>
    <flexbox v-else class="foot-bar" :gutter="0">
      <flexbox-item>
        <router-link :to="orderObj.orderTypeCode == 'purchase' ? '/purchaseIn' : '/supplyIn'" class="a-light">查看订单</router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link to="/" class="a-block">返回首页</router-link>
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
        offlineResultData: {},
        orderObj: {},
        imgArr: [],
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取线下打款凭证结果
      getOfflineCertificate() {
        this.$api.post(this.$interface.apiurl.getOfflineCertificate,{
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          orderSn: this.orderObj.orderSn,
          payType: this.orderObj.typeCode
        },res=>{
          this.offlineResultData = res.data; 
          // 组装图片格式
          let imgArr = [];
          this.imgArr = [];
          for (let i = 0; i < res.data.certificateList.length; i++) {
            let obj = {};
            obj.w = '100%';
            obj.h = '0';
            obj.src = res.data.certificateList[i].img;
            obj.msrc = res.data.certificateList[i].img;
            imgArr.push(obj);
            this.imgArr.push(obj);
            this.offlineResultData.certificateList[i].img = imgArr;
          }
        },err=>{
          this.$vux.toast.text(err.message);
        })
      },
      // 显示图片
      showImg(index){
        console.log(index);
        this.$refs.previewer.show(index);
      },
      toRefund(item){
        //重新提交
      this.$router.push({
        path:'/offlinePay',
        query:{
          orderSn:this.orderObj.orderSn,
          orderId:this.orderObj.orderId,
          orderTypeCode:this.orderObj.orderTypeCode,
          typeCode:this.orderObj.typeCode,
        }
      });
    }
    },
    mounted() {},
    activated() {
      this.orderObj = this.$route.query;
      this.getOfflineCertificate();
    }
  }

</script>
<style lang="scss">

</style>
