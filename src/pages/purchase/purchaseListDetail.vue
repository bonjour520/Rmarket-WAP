<template>
  <div class="x-scroll purchase">
    <scroller lock-x height="-44px" style="background: #f2f2f2;" ref="scrollerBottom">
      	<section class="purch bg-f7 pb20">
          <div class="purch-admin">
            <div class="purch-admin-info" >
              <div class="line-item border_btm1">
                <label>类别 </label>
                <div class="flex-item ml10">{{detailData.class_name1}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>分类 </label>
                <div class="flex-item ml10">{{detailData.class_name2}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>商品名称 </label>
                <div class="flex-item ml10">{{detailData.purchase_name}}</div>
              </div>
              <div class="line-item">
                <label>补充说明 </label>
                <div class="flex-item ml10">{{detailData.descInfo}}</div>
              </div>
            </div>
            <div class="purch-admin-info rmt30">
              <div class="line-item border_btm1">
                <label>期望价格 </label>
                <div class="flex-item ml10 cr-pink">{{detailData.hopePrice == 0 ? '面议' : detailData.hopePrice + '元'}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>采购数量 </label>
                <div class="flex-item ml10 cr-pink">{{detailData.purchase_number}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>单位</label>
                <div class="flex-item ml10">{{detailData.unit}}</div>
              </div>
              <div class="line-item border_btm1" v-if="detailData.counterpoise != null">
                <label>标准均重</label>
                <div class="flex-item ml10">{{detailData.counterpoise}}Kg</div>
              </div>
              <div class="line-item border_btm1">
                <label>截止时间 </label>
                <div class="flex-item ml10">{{detailData.expiry_date}}</div>
              </div>
              <div class="line-item" style="flex-wrap: nowrap;align-items: center;" @click="$router.push('/showAddress')">
                <label>期望地区 </label>
                <div class="flex-item ml10" data-addressarr="" style="max-height: .85rem;overflow: hidden; line-height: 0.75rem; text-overflow: ellipsis;white-space: nowrap;">{{expectAddressStr}}</div>
                <i class="iconfont icon-xiangyou"></i>
              </div>
            </div>
            <div class="purch-admin-info rmt30">
                <div class="line-item border_btm1">
                  <label>收货地址 </label>
                  <div class="flex-item ml10">{{detailData.province + detailData.city + detailData.area}}</div>
                </div>
                <div class="line-item">
                  <label>详细地址 </label>
                  <div class="flex-item ml10">{{detailData.add_goods_field4}}</div>
                </div>
            </div>
            <div class="purch-admin-info rmt30">
              <div class="line-item border_btm1">
                <label>联系人 </label>
                <div class="flex-item ml10">{{detailData.contacts}}</div>
              </div>
              <div class="line-item">
                <label>联系电话 </label>
                <div class="flex-item ml10">{{detailData.phone}}</div>
              </div>
            </div>
          </div>
        </section>
    </scroller>
    <footer>
      <a class="viewDetail" @click="$router.go(-1)">返回</a>
    </footer>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex';
  export default {
    data() {
      return {
        detailData: {},
        expectAddressStr: '',
        supplyImgList: [],
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      getPurchaseInfo(id) {
        let params = {
          appid: this.$interface.$appid,
          tokenKey: localStorage.$tokenKey,
          mainKey: localStorage.$mainKey,
          purchase_id: id
        }
        this.$api.post(this.$interface.apiurl.getPurchaseInfo, params, res => {
          this.detailData = res.data;
          this.expectAddressStr = '';
          for (let i = 0; i < res.data.expectAddress.length; i++) {
            this.expectAddressStr += res.data.expectAddress[i].province + '/'
            for (let j = 0; j < res.data.expectAddress[i].citys.length; j++) {
              this.expectAddressStr += res.data.expectAddress[i].citys[j];
            }
          }
          localStorage.setItem("showAddresArray",JSON.stringify(res.data.expectAddress));
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
          })

        }, err => {
          this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          this.detailData = {};
        })
      },
    },
    mounted() {

    },
    activated() {
      this.getPurchaseInfo(this.$route.query.purchaseID);
    }
  }

</script>
<style lang="scss">
  @import "@/base/purchaseAreaDetail.scss";

</style>
