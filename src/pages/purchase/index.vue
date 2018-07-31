<template>
  <div class="x-scroll purchase">
    <!--排序-->
    <div class="sort">
      <ul class="vux-1px-b">
        <li :class="sortState == 1?'active':''" class="vux-1px-r"  @click="getNewPriceList">最新</li>
        <li :class="sortState == 2?'active':''" class="vux-1px-r" @click="getPriceList(sort)">
          <p class="tabTit">价格</p>
          <p class="priceImgs">
            <img class="topImg" v-show="!priceUp" src="../../../static/imgs/purchaseArea/tangle10.png" alt="">
            <img class="topImg1" v-show="priceUp" src="../../../static/imgs/purchaseArea/tangle11.png" alt="">
            <img class="botmImg" v-show="priceUp" src="../../../static/imgs/purchaseArea/tangle20.png" alt="">
            <img class="botmImg1" v-show="!priceUp"  src="../../../static/imgs/purchaseArea/tangle21.png" alt="">
          </p>
        </li>
        <li :class="sortState == 3?'active':''">距离最近</li>
      </ul>
    </div>
    <scroller lock-x height="-50px" scrollbar-y v-show="isShow" v-model="scrollerStatus" style="background: #f2f2f2;"  ref="scrollerBottom" :bounce="false" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
      <section>
        <main style="margin-bottom: 1.8rem;">
            <ul class="contUl">
              <li v-for="(item, index) in purchaseList" :key="index">
                <div class="contList clearfix">
                    <div class="listTop">
                        <p class="listTit">
                          <i class="iconfont icon-dianpu3"></i>
                          <span class="proName">{{item.storeInfo_name}}</span>
                        </p>
                        <p class="pubTime">
                          {{$stampToTime(item.nearlyTime)}}前 | 1km以内
                        </p>
                    </div>
                    <div class="contLi">
                        <router-link class="cont_L" :to="'/purchaseDetail?purchaseID='+ item.purchase_id">
                            <img :src="item.logo" alt="">
                            <p></p>
                            <p class="price">期望单价：<span class="priceNum">{{item.hopePrice == 0 ? "面议" : item.hopePrice + '元'}}</span></p>
                            <p class="area">采购地区：<span class="areaShow">{{item.province}}/{{item.city}}</span></p>
                            <p class="shopper">采购商家：<span class="shopName">{{item.storeInfo_name}}</span></p>
                        </router-link>
                    </div>
                </div>
              </li>
              <divider v-show="showDivider" class="f12">没有更多数据了</divider>
            </ul>
            <div class="purch-admin" v-if="showNodata">
              <i class="iconfont icon-zizhishenhe"></i>
              <p>没有相关采购</p>
            </div>
        </main>
      </section>
    </scroller>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  export default {
    data() {
      return {
        isShow: false,
        scrollerStatus: {
          pullupStatus: 'default'
        },
        showUp: true,
        upobj:{
            content: '请上拉刷新数据',
            pullUpHeight: 60,
            height: 40,
            autoRefresh: false,
            downContent: '请上拉刷新数据',
            upContent: '请上拉刷新数据',
            loadingContent: '加载中...',
            clsPrefix: 'xs-plugin-pullup-'
        },
        showDivider: false,
        page: 1,
        pagesize: 10,
        showNodata: false,
        sort: 0,
        sortState: 1,
        priceUp: false,
        purchaseList:[],

      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取采购列表
      getPurchaseList(isEmpty,status,page,pagesize){
        let params = {
          page: page,
          pagesize: pagesize,
          saveTimeStart: '',
          saveTimeEnd: '',
          supply_name: '',
          supplyID: '',
          priceOrder: status,
          newesTime: status == -1 ? '0': '-1'
        } 
        this.$api.post(this.$interface.apiurl.getPurchaseList,params,res=>{
          this.isShow = true;
          this.$vux.loading.hide();       
          if (!isEmpty) {
            if(res.data.rows < (this.page-1)*this.pagesize){
              this.showDivider = true;
              this.scrollerStatus.pullupStatus = 'disabled' // 禁用下拉          
              return;
            }
            for (let i  = 0; i < res.data.data.length; i++) {
              this.purchaseList.push(res.data.data[i]);
            }
            this.showDivider = false;          
            this.scrollerStatus.pullupStatus = 'default'
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset()
            })
          }else{
            this.purchaseList = res.data.data;
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset({top: 0})
            })
          }
        },err=>{
          this.$vux.toast.show({ text: err.errorMsg, type:'text',width: '180px'});        
          this.purchaseList = [];
          this.$vux.loading.hide()
        })
      },
      // 上拉加载数据
      selPullUp () {
        this.$vux.loading.show({text: 'loading...'})      
        this.page++;
        if(this.sortState == 2){
          this.getPurchaseList(false,this.sort,this.page,this.pagesize)
        }else{  
          this.getPurchaseList(false,-1,this.page,this.pagesize)
        }
      },
      // 获取最新排序列表
      getNewPriceList(){
        this.page = 1;
        this.sortState = 1;
        this.showDivider = false;          
        this.scrollerStatus.pullupStatus = 'default';
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
          this.$refs.scrollerBottom.enablePullup(); // 启用上拉插件
        })
        this.getPurchaseList(true,-1,this.page,this.pagesize)
      },
      // 获取价格排序列表
      getPriceList(sort){
        this.page = 1;
        this.sort = 1^sort;
        this.priceUp = !this.priceUp;
        this.sortState = 2;
        this.showDivider = false;          
        this.scrollerStatus.pullupStatus = 'default';
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
          this.$refs.scrollerBottom.enablePullup(); // 启用上拉插件
        })
        this.getPurchaseList(true,this.sort,this.page,this.pagesize)
      }
    },
    mounted() {
      
    },
    activated() {
      this.getPurchaseList(true,-1,1,10);
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
    }
  }

</script>
<style lang="scss">
  @import "@/base/purchaseArea.scss";

</style>
