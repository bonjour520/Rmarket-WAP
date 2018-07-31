<template>
  <div class="x-scroll purchase">
    <scroller lock-x height="-44px" style="background: #f2f2f2;" ref="scrollerBottom">
      	<section class="purch bg-f7 pb20">
          <div class="purch-admin">
            <div class="purch-admin-info" >
              <div class="line-item border_btm1">
                <label>类别 </label>
                <div class="flex-item ml10">{{supplyDetail.class_name1}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>分类 </label>
                <div class="flex-item ml10">{{supplyDetail.class_name2}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>商品名称 </label>
                <div class="flex-item ml10">{{supplyDetail.supply_name}}</div>
              </div>
              <div class="line-item">
                <label>补充说明 </label>
                <div class="flex-item ml10">{{supplyDetail.descInfo}}</div>
              </div>
            </div>
            <div class="purch-admin-info rmt30">
              <div class="line-item border_btm1">
                <label>货品单价 </label>
                <div class="flex-item ml10 cr-pink">{{supplyDetail.productUnivalent}}元</div>
              </div>
              <div class="line-item border_btm1">
                <label>供应库存 </label>
                <div class="flex-item ml10 cr-pink">{{supplyDetail.adequacy == 0 ? '充足' : supplyDetail.supply_inventory + supplyDetail.unit}}</div>
              </div>
              <div class="line-item border_btm1">
                <label>起售数量</label>
                <div class="flex-item ml10">{{supplyDetail.selling_count}}</div>
              </div>
              <div class="line-item border_btm1" v-if="supplyDetail.counterpoise != null">
                <label>标准均重</label>
                <div class="flex-item ml10">{{supplyDetail.counterpoise}}Kg</div>
              </div>
              <div class="line-item border_btm1">
                <label>截止时间 </label>
                <div class="flex-item ml10">{{supplyDetail.end_date}}</div>
              </div>
              <div class="line-item" style="flex-wrap: nowrap;align-items: center;" @click="$router.push('/showAddress')">
                <label>供应地区 </label>
                <div class="flex-item ml10" data-addressarr="" style="max-height: .85rem;overflow: hidden; line-height: 0.75rem; text-overflow: ellipsis;white-space: nowrap;">{{expectAddressStr}}</div>
                <i class="iconfont icon-xiangyou"></i>
              </div>
            </div>
            <div class="purch-admin-info rmt30">
                <div class="line-item border_btm1">
                  <label>收货地址 </label>
                  <div class="flex-item ml10">{{supplyDetail.province + supplyDetail.city + supplyDetail.area}}</div>
                </div>
                <div class="line-item border_btm1">
                  <label>详细地址 </label>
                  <div class="flex-item ml10">{{supplyDetail.soure_field4}}</div>
                </div>
                <div class="line-item border_btm1">
                  <label>物流方式 </label>
                  <div class="flex-item ml10">{{supplyDetail.logistics == "23" ? "运费买家承担" : supplyDetail.logistics == "24" ? "运费卖家承担" : "参数错误" }}</div>
                </div>
                <div class="line-item border_btm1">
                  <label>货品图片 </label>
                </div>
                <div class="line-item" v-if="supplyDetail.product_img != ''">
                  <div class="flex-item ml10">
                    <img :src="item" v-for="(item, index) in supplyImgList" :key="index">
                  </div>
                </div>
            </div>
            <div class="purch-admin-info rmt30">
              <div class="line-item border_btm1">
                <label>联系人 </label>
                <div class="flex-item ml10">{{supplyDetail.contacts}}</div>
              </div>
              <div class="line-item">
                <label>联系电话 </label>
                <div class="flex-item ml10">{{supplyDetail.phone}}</div>
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
        supplyDetail: {},
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
      // 获取采购列表
      getSupplyDetail(id) {
        let params = {
          supplyId: id
        }
        this.$api.post(this.$interface.apiurl.getSupplyDetail, params, res => {
          this.supplyDetail = res.data;
          this.expectAddressStr = '';
          for (let i = 0; i < res.data.supplyScheduleList.length; i++) {
            this.expectAddressStr += res.data.supplyScheduleList[i].province + '/'
            for (let j = 0; j < res.data.supplyScheduleList[i].citys.length; j++) {
              this.expectAddressStr += res.data.supplyScheduleList[i].citys[j];
            }
          }
          localStorage.setItem("showAddresArray",JSON.stringify(res.data.supplyScheduleList));
          this.supplyImgList = JSON.parse(this.supplyDetail.product_img);
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
          })

        }, err => {
          this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          this.supplyDetail = {};
        })
      },
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
