<template>
  <div class="x-scroll purchase">
    <scroller lock-x height="-44px" style="background: #f2f2f2;" ref="scrollerBottom">
        <article style="margin-top: 0.2666666667rem;">
          <section>
            <div class="top" style="margin-bottom: .2rem;">
              <p style="margin-bottom: .2rem;">【采购商品】
                <span class="proName">{{purchaseDetail.purchase_name}}</span>
                <span class="proStatus" style="font-size: .2rem;padding: 0  0.2rem;">采购中</span>
              </p>
              <p style="padding-bottom: .3rem;">【期望单价】
                <span class="proPrice">{{ purchaseDetail.negotiable == 0 ? purchaseDetail.hopePrice + '元/' + purchaseDetail.unit : "面议" }}</span>
              </p>
            </div>
            <div class="info">
              <!--发布人-->
              <div class="lable pubPerson">
                <p class="infoTit">发布人</p>
                <p class="infoP person">{{ purchaseDetail.storeInfo_name }}</p>
              </div>
              <!--发布时间-->
              <div class="lable pubTime">
                <p class="infoTit">发布时间</p>
                <p class="infoP time">{{purchaseDetail.release_date}}</p>
              </div>
              <!--期望货源地-->
              <div class="lable expectAddr" style="flex-wrap: nowrap;align-items: center;position: relative;" id="infoExpAddressBox">
                <p class="infoTit">期望货源地</p>
                <p class="infoP addr1" id="infoExpAddress" data-addressarr="" style="max-height: .85rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  {{expectAddressStr}}
                </p>
                <a class="more" href="expectAddr.html">
                  <img style="width: .5rem;margin-top: .3rem;display: block;" src="../../../static/imgs/purchaseArea/right.png">
                </a>
              </div>
              <!--收货地址-->
              <div class="lable receiveAddr">
                <p class="infoTit">收货地址</p>
                <p class="infoP addr2">{{purchaseDetail.province+"/"+purchaseDetail.city}}</p>
              </div>
              <!--采购数量-->
              <div class="lable purchaseNum">
                <p class="infoTit">采购数量</p>
                <p class="infoP num">{{ purchaseDetail.purchase_number + purchaseDetail.unit }}</p>
              </div>
              <!--补充说明-->
              <div class="lable explain">
                <p class="infoTit">补充说明</p>
                <p class="infoP plain">{{purchaseDetail.descInfo}}</p>
              </div>
            </div>
          </section>
          <!--商家其他采购-->
          <section class="other">
            <div class="otherTit">
              <span class="tit_L" style="background: #7ec715;"></span>
              <p class="otherTitShow">商家其他采购</p>
            </div>
            <ul class="otherUl">
              <li style="margin:.3rem auto" v-for="(item, index) in purchaseOtherList" :key="index">
                <p class="otherName">【采购】<span class="oName">{{item.descInfo}}</span></p>
                <p class="otherNum">{{item.purchase_number + item.unit}}</p>
                <p class="otherArea">{{item.province + "/" + item.city}}</p>
              </li>
            </ul>
          </section>
        </article>
    </scroller>
    <footer id="baojiabtn">
      <a class="viewDetail" @click="selectIsQuotation">我要报价</a>
    </footer>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
import CommomObj from '../../utils/commom';
  export default {
    data() {
      return {
        purchaseDetail: {},
        expectAddressStr: '',
        purchaseOtherList: [],
        purchaseID: '',
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取采购列表
      getPurchaseDetail(id) {
        let params = {
          purchase_id: id
        }
        this.$api.post(this.$interface.apiurl.getPurchaseDetail, params, res => {
          this.purchaseDetail = res.data;
          for (let i = 0; i < res.data.expectAddress.length; i++) {
            for (let j = 0; j < res.data.expectAddress[i].citys.length; j++) {
              this.expectAddressStr += res.data.expectAddress[i].citys[j]+"、";	
            }
          }
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({
              top: 0
            })
          })
          
        }, err => {
          this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          this.purchaseDetail = {};
        })
      },
      // 获取其他商家采购列表
      getPurchaseOther() {
        this.$api.post(this.$interface.apiurl.getPurchaseOther, null, res => {
          console.log(res);
          this.purchaseOtherList = res.data.data;          
        }, err => {
          this.$vux.toast.show({
            text: err.errorMsg,
            type: 'text',
            width: '180px'
          });
          this.purchaseOtherList = [];
        })
      },
      // 查询是否报过价
      selectIsQuotation(){
        if(this.loginState){
          this.$vux.loading.show({text: "Loading..."});
          this.$api.post(this.$interface.apiurl.selectIsQuotation, {
            "appid": this.$interface.$appid,
            "mainKey":localStorage.$mainKey,
            "tokenKey": localStorage.$tokenKey,
            "purchase_id": this.purchaseID,
            "purchaseID": this.purchaseDetail.purchaseID
          }, res => {
             this.$vux.loading.hide();
             this.$router.push({path: "/quote", query: { "purchaseID": this.purchaseID }});            
          }, err => {
            this.$vux.loading.hide();
            this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          })
        }else{
          CommomObj.$tips("请先登录!");
          this.$router.push("/login");
        }
      },
    },
    mounted() {

    },
    activated() {
      this.getPurchaseOther();
      this.purchaseID = this.$route.query.purchaseID;
      this.getPurchaseDetail(this.$route.query.purchaseID);
    }
  }

</script>
<style lang="scss">
  @import "@/base/purchaseAreaDetail.scss";

</style>
