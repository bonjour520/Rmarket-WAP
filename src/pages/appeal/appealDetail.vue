<template>
<div class="appealDetail x-scroll">
    <scroller lock-x ref="scrollerBottom">
      <div class="detail-top">
     <img v-if="dataList.statusCode!='fail'" src="../../../static/imgs/appeal/appeal-success.png" alt="" class="status-icon">
     <img v-if="dataList.statusCode=='fail'" src="../../../static/imgs/appeal/appeal-fail.png" alt="" class="status-icon">
     <div>
       <div class="appeal-status" :class="dataList.statusCode=='fail'?'fail':''">{{ dataList.statusName }} <span class="time">{{ dataList.auditTime?$timestampToTime(dataList.auditTime):'' }}</span></div>
       <div class="audit-status" v-if="queryObj.appealType=='sellAppeal'&&dataList.statusCode=='success'">{{ dataList.execStatusName }}</div>
       <div class="audit-status" v-if="queryObj.appealType=='sellAppeal'&&dataList.statusCode=='ing'">商家已提交申诉，请等待工作人员审核</div>
       <div class="appeal-info" v-if="queryObj.appealType=='buyAppeal'&&dataList.statusCode=='success'">差价会从商家账户冻结余额内扣除，同时退至买家账户余额，请注意查看 </div>
       <div class="appeal-info" v-if="queryObj.appealType=='buyAppeal'&&dataList.statusCode=='ing'">如有疑问请及时联系客服：400-107-1988 </div>
     </div>
   </div>
   <div class="fail-info" v-if="queryObj.appealType=='buyAppeal'&&dataList.statusCode=='fail'">
     <div>原因：与商家核准，缺重与实际不符</div>
     <div class="tip">如有疑问请及时联系客服：400-107-1988</div>
   </div>
   <div class="fail-info" v-if="queryObj.appealType=='sellAppeal'&&dataList.statusCode=='fail'">
     <div>原因：与买家核准，超重与实际不符</div>
     <div class="tip">如有疑问请及时联系客服：400-107-1988</div>
   </div>
   <ul class="detail-content">
     <li class="flex">
       <span class="info-title">申诉类型</span>
       <span class="info-value">{{appealTitle}}</span>
     </li>
     <li class="flex">
       <span class="info-title">申诉时间</span>
       <span class="info-value">{{ $timestampToTime(dataList.createTime) }}</span>
     </li>
     <li class="flex">
       <span class="info-title">缺少重量</span>
       <span class="info-value">{{ dataList.weight }}（KG）</span>
     </li>
     <li class="flex">
       <span class="info-title">需退差价</span>
       <span class="info-value">{{ dataList.amount }}</span>
     </li>
     <li class="flex">
       <span class="info-title">备注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
       <span class="info-value">{{ dataList.remark }}</span>
     </li>
     <li>
       <div class="info-title">凭证</div>
       <div class="voucher">
         <img v-for="(item,index) in dataList.imgs" :src="item" :key="index" alt="" @click="showImg(index)" class="voucher-img">
         <div v-transfer-dom>
            <previewer :list="lists" ref="previewer" :options="options"></previewer>
         </div>
       </div>
     </li>
   </ul>
    </scroller>
    <div v-if="queryObj.appealType=='sellAppeal'&&queryObj.userType=='buy'&&dataList.statusCode=='success'&&dataList.execStatusCode!='notExect'" class="layout-flex" style="position: fixed;bottom: 0; width: 100%;">
			<button @click="toAuditDetail()" class="btn-default btn-main" style="border-radius: 0;">查看补差价</button>
	  </div>
    <div v-if="queryObj.appealType=='sellAppeal'&&queryObj.userType=='buy'&&dataList.statusCode=='success'&&dataList.execStatusCode=='notExect'" class="layout-flex" style="position: fixed;bottom: 0; width: 100%;">
			<button @click="toRefund()" class="btn-default btn-main" style="border-radius: 0;">补差价</button>
	  </div>
</div>
</template>
<script>
import { Previewer, TransferDom } from 'vux'
export default {
  data() {
    return {
      dataList:{},
      appealTitle:"",
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.voucher-img')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      },
      lists:[],
      queryObj:{}
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Previewer
  },
  methods: {
    getData() {
      this.$vux.loading.show({
        text: "loading"
      });
      let params = {
        appealId:this.queryObj.appealId,
        appid: this.$interface.$appid,
        mainKey: localStorage.$mainKey,
        tokenKey: localStorage.$tokenKey,
      };
      this.$api.get(
        this.$interface.apiurl.appealDetail,
        params,
        res => {
          this.$vux.loading.hide();
          this.dataList = res.data;
          this.dataList.imgs.forEach(element => {
            this.lists.push({src:element})
          });
        },
        err => {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: err.msg,
            type: "text",
            width: "180px"
          });
        }
      );
    },
    showImg (index) {
      this.$refs.previewer.show(index)
    },
    toRefund(){
      this.$router.push({
        path:'/offlinePay',
        query:{
          orderSn:this.queryObj.orderSn,
          orderId:this.queryObj.orderId,
          orderTypeCode:this.queryObj.orderType,
          typeCode:'difference',
        }
      });
    },
    toAuditDetail(){
      //补差价结果
      this.$router.push({
        path:'/offlineResult',
        query:{
          orderSn:this.queryObj.orderSn,
          orderId:this.queryObj.orderId,
          orderTypeCode:this.queryObj.orderType,
          typeCode:'difference',
        }
      });
    }
  },
  activated() {
    this.queryObj = this.$route.query;
    this.getData();
    if(this.queryObj.appealType=='sellAppeal'){
      this.appealTitle = '交易申请补差价';
    } else{
      this.appealTitle = '交易申请退差价';
    }
    
  },
  filters:{
    getAuitStatus(code){
      if(code=='notExect'){
        return '待买家补差价'
      }
    }
  }
};
</script>
<style lang="scss">
@import '@/base/reset.scss';
.appealDetail{
  font-size: rem(32);
  color: #666;
  .detail-top{
    padding: rem(40) rem(30);
    -webkit-display: flex;
    display: flex;
    align-items: center;
    font-size: rem(24);
    border-bottom:1px solid #eee;
    .status-icon{
      width: rem(104);
      height: rem(104);
      margin-right: rem(20);
    }
    .appeal-status{
      color: #00C55D;
      font-size: rem(40);
      margin-right: rem(20);
      &.fail{
        color: #F5A623
      }
    }
    .audit-status{
      font-size: rem(24);
      color: #F5A623
    }
    .time{
      color: #9B9B9B;
      font-size: rem(24);
      position: relative;
      top:-3px;
    }
    .appeal-info{
      color: #F5A623
    }
  }
  .fail-info{
    font-size: rem(24);
    text-align: center;
    padding: rem(30);
    border-bottom: 1px solid #eee;
    color: #000;
    .tip{
      color: #F5A623;
      margin-top: 5px;
    }
  }
  .detail-content{
    padding: rem(40) rem(30);
    
    .flex{
      -webkit-display: flex;
        display: flex;
        justify-content: flex-start;
        margin-bottom: rem(20);
      .info-title{
        margin-right: rem(40);
        flex: none;
      }
    }
    .voucher{
      img{
        width: rem(160);
        height: rem(168);
        margin: rem(30) rem(15)
      }
        
      }
  }
}
</style>
