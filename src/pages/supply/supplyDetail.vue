<template>
  <div class="x-scroll purchase">
    <scroller lock-x height="-44px" style="background: #f2f2f2;" ref="scrollerBottom">
      <article>
        <swiper loop auto class="indexH-175 bg-f" dots-position="center" :show-desc-mask="false">
          <swiper-item v-for="(item, index) in supplyDetail.showProduct_img" :key="index" :style="{'background' : 'url('+ item +') no-repeat center center/100% 170%'}">
            <!-- <img :src="item" alt="" width="100%"> -->
          </swiper-item>
        </swiper>
        <div class="purch bg-f7" style="margin-bottom: 1.5rem;width:100%;border-radius: .2rem .2rem 0 0;overflow: hidden;margin-top: 0;position: absolute;top: 4.5rem;">
          <div class="purch-admin">
            <div class="purch-admin-info" style="margin-top: 0;">
              <div class="panle" style="height: auto;">
                <div style="overflow: hidden;">
                  <span style="float: left;color: red;"> ￥{{ supplyDetail.productUnivalent }}/{{ supplyDetail.unit }}</span>
                  <span style="float: right;color: #999;font-size:0.32rem ;">剩余库存:{{ supplyDetail.adequacy == 0 ? '充足' : supplyDetail.surplus_inventory }}
                    <br>
                  </span>
                </div>
                <div style="margin-left: -0.1rem;">【采购商品】
                  <span>{{supplyDetail.supply_name}}</span>
                </div>
                <div style="margin-left: -0.1rem;">【起售数量】
                  <span>{{supplyDetail.selling_count + supplyDetail.unit }}</span>
                </div>
              </div>
              <div class="line-item border_btm1">
                <label>发布人：</label>
                <div class="flex-item">{{supplyDetail.contacts}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>发布时间：</label>
                <div class="flex-item">{{supplyDetail.release_date}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>商品描述：</label>
                <div class="flex-item">{{supplyDetail.descInfo}}</div>
              </div>
              <div class="line-item border_btm1" v-if="supplyDetail.counterpoise != null">
                <label>标准均重：</label>
                <div class="flex-item">{{supplyDetail.counterpoise}}</div>
              </div>
              <div class="line-item border_btm1 lable expectAddr" style="position: relative;">
                <p class="infoTit">期望货源地：</p>
                <p class="infoP addr1" data-addressarr="" style="max-height: .85rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{expectAddressStr}}</p>
                <a class="more" style="position: absolute;right:.2rem" href="expectAddr.html">
                  <img style="width: .5rem;margin-top: .1rem;display: block;height: .5rem;" src="../../../static/imgs/purchaseArea/right.png">
                </a>
              </div>
              <div class="line-item border_btm1">
                <label>发货地址：</label>
                <div class="flex-item">{{supplyDetail.province + supplyDetail.city}}</div>
              </div>
              <div class="line-item">
                <label>物流方式：</label>
                <div class="flex-item">{{supplyDetail.logistics == "23" ? '运费买家承担' : supplyDetail.logistics_type == 24 ? "运费卖家承担" : '参数错误' }}</div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </scroller>
    <footer>
      <a class="viewDetail" style="width:50%;background:#fff;color:#00c55d;border-top:1px solid #d6d6d6;" :href="'tel:' + supplyDetail.phone">拨打电话</a>
      <a class="viewDetail" style="width:50%;left:50%;border-top:1px solid #00c55d;" @click="showOrder = true">立即购买</a>
    </footer>
    <!-- 提交下单 -->
    <popup v-model="showOrder" class="bg-f">
      <box gap="10px">
        <h3 class="f16 pl15">{{supplyDetail.supply_name}}</h3>
        <div class="layout-flex flex-jc-sb border_btm1 rmt30 f14 pb10">
          <span class="cr-pink pl20">￥{{ supplyDetail.productUnivalent }}/{{ supplyDetail.unit }}</span>
          <span class="cr-999">剩余库存：{{supplyDetail.adequacy == 0 ? '充足' : supplyDetail.surplus_inventory}}</span>
        </div>
        <group>
          <x-number v-model="buyNum" :min="supplyDetail.selling_count" :max="(supplyDetail.adequacy == 0 ? 99999 :supplyDetail.surplus_inventory)" title="购买数量" fillable width="80px"></x-number>
        </group>
        <group>
          <x-button type="primary" @click.native="checkOrderSubmit">确定</x-button>
        </group>
      </box>
    </popup>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex';
  export default {
    data() {
      return {
        supplyDetail: {},
        expectAddressStr: '',
        supplyImgList: [],
        showOrder: false,
        buyNum: '',
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取采购列表
      getSupplyDetail(id) {
        let params = {
          supplyId: id
        }
        this.$api.post(this.$interface.apiurl.getSupplyDetail, params, res => {
          this.supplyDetail = res.data;
          this.buyNum = this.supplyDetail.selling_count;
          this.expectAddressStr = '';
          for (let i = 0; i < res.data.supplyScheduleList.length; i++) {
            this.expectAddressStr += res.data.supplyScheduleList[i].province + '/';
            for (let j = 0; j < res.data.supplyScheduleList[i].citys.length; j++) {
              this.expectAddressStr += res.data.supplyScheduleList[i].citys[j];
            }
          }

          localStorage.setItem("showAddresArray",JSON.stringify(res.data.supplyScheduleList));
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
          })

        }, err => {
          this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          this.supplyDetail = {};
        })
      },
      checkOrderSubmit(){
        this.$router.push({path: '/orderIndex',query: { 
          'buyNumber': this.buyNum,
          'gscID': this.supplyDetail.supplyID,
          'type': '1'
        }})
        localStorage.setItem("supplyOrderDetail",JSON.stringify(this.supplyDetail))
      }
    },
    mounted() {

    },
    activated() {
      this.getSupplyDetail(this.$route.query.supplyID);
    }
  }

</script>
<style lang="scss">
  @import "@/base/purchaseAreaDetail.scss";

</style>
