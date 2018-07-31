<template>
  <div class="x-scroll purchase">
    <scroller lock-x height="-50px" style="background: #f2f2f2;" ref="scrollerBottom">
        <section class="purch bg-f7 js-eliHeight">
          <div class="purch-admin">
            <div class="purch-admin-info" >
              <div class="panle">
                <div>【采购商品】<span>{{offerInfo.purchase}}</span></div>
                <div>【供货单价】<span>{{offerInfo.unitPrice}}元</span></div>
              </div>
              <div class="line-item border_btm1">
                <label>起售数量：</label>
                <div class="flex-item">{{offerInfo.selling_count}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>供应数量：</label>
                <div class="flex-item">{{offerInfo.supply_number}}</div>
              </div>
              <div class="line-item border_btm1" v-if="offerInfo.counterpoise != null">
                <label>标准均重：</label>
                <div class="flex-item">{{offerInfo.counterpoise}} Kg</div>
              </div>
              <div class="line-item border_btm1">
                <label>截止时间：</label>
                <div class="flex-item">{{$timestampToTime(offerInfo.effective_time)}}</div>
              </div>
              <div class="line-item">
                <label>发货地址：</label>
                <div class="flex-item">{{offerInfo.addressProvince +' '+ offerInfo.addressCity + ' ' + offerInfo.addressArea  }}</div>
              </div>
            </div>
            <div class="purch-admin-info rmt30">
              <div class="line-item border_btm1">
                <label>采购ID：</label>
                <div class="flex-item">{{offerInfo.gscID}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>报价单号：</label>
                <div class="flex-item">{{offerInfo.quotation_no}}</div>
              </div>
              <div class="line-item">
                <label>报价时间：</label>
                <div class="flex-item">{{$timestampToTime(offerInfo.quotation_time)}}</div>
              </div>
            </div>
            <div class="purch-admin-info rmt30">
                <div class="purch-admin-item">
                  <div class="item-header border_btm1">
                    <div><img :src="offerInfo.qLogo"/><span>{{offerInfo.qStoreName}}</span></div>
                  </div>
                  <div class="layout-flex mt10">联系人：<span>{{offerInfo.contacts}}</span></div>
                  <div class="layout-flex mt10">联系电话：<span>{{offerInfo.phone}}</span></div>
                </div>
            </div>
          </div>
        </section>
    </scroller>
    <footer>
      <a class="viewDetail" @click="showOrder = true" v-if="offerInfo.is_stop == 0">下单</a>
      <a class="viewDetail" @click="$router.go(-1)" v-else>返回</a>
    </footer>
    <!-- 提交下单 -->
    <popup v-model="showOrder" class="bg-f">
      <box gap="10px">
        <h3 class="f16 pl15">{{offerInfo.purchase}}</h3>
        <div class="layout-flex flex-jc-sb border_btm1 rmt30 f14 pb10">
          <span class="cr-pink pl20">￥{{offerInfo.unitPrice}}元</span>
          <span class="cr-999">剩余库存：{{offerInfo.supply_number}}</span>
        </div>
        <group>
          <x-number v-model="buyNum" :min="offerInfo.selling_count" :max="offerInfo.supply_number" title="购买数量" fillable width="80px"></x-number>
        </group>
        <group>
          <x-button type="primary" @click.native="checkOrderSubmit">确定</x-button>
        </group>
      </box>
    </popup> 
  </div>
</template>
<script>
  import {mapState} from 'vuex';
import CommomObj from '../../utils/commom';
  export default {
    data() {
      return {
        offerInfo: {},
        expectAddressStr: '',
        purchaseOtherList: [],
        purchaseID: '',
        quotationID: '',
        showOrder: false,
        buyNum: "",
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取采购列表
      getOfferInfo() {
        let params = {
          appid: this.$interface.$appid,
          tokenKey: localStorage.$tokenKey,
          mainKey: localStorage.$mainKey,
          id: this.purchaseID,
          qid: this.quotationID,
          type: 0
        }
        this.$api.post(this.$interface.apiurl.offerInfo, params, res => {
          console.log(res);
          this.offerInfo = res.data;
          this.buyNum = this.offerInfo.supply_number > 1 ? this.offerInfo.selling_count : 0;
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
          })
        }, err => {
          this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          this.offerInfo = {};
        })
      },
      checkOrderSubmit(){
        this.$router.push({path: '/orderIndex',query: { 
          'buyNumber': this.buyNum,
          'purchaseID': this.purchaseID,
          'quotationID': this.quotationID,
          'gscID': this.offerInfo.gscID,
          'type': '0'
        }})
      }
    },
    mounted() {

    },
    activated() {
      this.purchaseID = this.$route.query.purchaseID;
      this.quotationID = this.$route.query.quotationID;
      this.getOfferInfo();
    }
  }

</script>
<style lang="scss">
  @import "@/base/purchaseAreaDetail.scss";

</style>
