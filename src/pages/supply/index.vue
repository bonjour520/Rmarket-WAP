<template>
  <div class="x-scroll supply">
    <!--排序-->
    <div class="sort">
      <ul>
        <li id="newest" :class="sortState?'':'active'" @click="getNewPriceList">最新</li>
        <li id="pricechange" :class="sortState?'active':''" @click="getPriceList(sort)">
          <p class="tabTit">价格</p>
          <p class="priceImgs">
            <img class="topImg" v-show="!priceUp" src="../../../static/imgs/purchaseArea/tangle10.png" alt="">
            <img class="topImg1" v-show="priceUp" src="../../../static/imgs/purchaseArea/tangle11.png" alt="">
            <img class="botmImg" v-show="priceUp" src="../../../static/imgs/purchaseArea/tangle20.png" alt="">
            <img class="botmImg1" v-show="!priceUp" src="../../../static/imgs/purchaseArea/tangle21.png" alt="">
          </p>
        </li>
      </ul>
    </div>
    <scroller lock-x height="-50px" scrollbar-y v-show="isShow" v-model="scrollerStatus" style="background: #f2f2f2;" ref="scrollerBottom"
      :bounce="false" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
      <main style="margin-bottom: 1.8rem;">
        <!--内容展示-->
        <ul class="contUl" v-show="supplyList.length > 0">
          <li v-for="(item, index) in supplyList" :key="index">
          	<router-link :to="'/supplyDetail?supplyID='+ item.supply_id">
              <div class="contLi">
                <img class="proImg" :src="item.showProduct_img[0]" alt="">
                <p class="price">￥{{item.productUnivalent}}元/{{item.unit}}</p>
                <p class="proName">{{item.supply_name}}</p>
                <div class="proAddr">
                  <p class="farm" style="width:2.3rem">{{item.storeInfo_name}}</p>
                  <p class="addr" style="width:2rem">{{item.province}}/{{item.city}}</p>
                </div>
              </div>
						</router-link>
          </li>
        </ul>
        <divider v-show="showDivider" class="f12">没有更多数据了</divider>
				<div class="purch-admin" v-if="showNodata">
					<i class="iconfont icon-zizhishenhe"></i>
					<p>没有相关供应</p>
				</div>
      </main>
    </scroller>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        isShow: false,
        scrollerStatus: {
          pullupStatus: 'default'
        },
        showUp: true,
        upobj: {
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
        sortState: false,
        priceUp: false,
        supplyList: [],
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取采购列表
      getSupplyList(isEmpty, status, page, pagesize) {
        let params = {
          page: page,
          pagesize: pagesize,
          saveTimeStart: '',
          saveTimeEnd: '',
          supply_name: '',
          supplyID: '',
          priceOrder: status,
          newesTime: status == -1 ? '0' : '-1'
        }
        this.$api.post(this.$interface.apiurl.getSupplyList, params, res => {
          this.isShow = true;
          this.$vux.loading.hide()
          if (!isEmpty) {
            if (res.data.rows < (this.page - 1) * this.pagesize) {
              this.showDivider = true;
              this.scrollerStatus.pullupStatus = 'disabled' // 禁用下拉          
              return;
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.supplyList.push(res.data.data[i]);
            }
            this.showDivider = false;
            this.scrollerStatus.pullupStatus = 'default'
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset()
            })
          } else {
            this.supplyList = res.data.data;
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset({
                top: 0
              })
            })
          }
        }, err => {
          this.$vux.toast.show({
            text: err.errorMsg,
            type: 'text',
            width: '180px'
          });
          this.supplyList = [];
          this.$vux.loading.hide()
        })
      },
      // 上拉加载数据
      selPullUp() {
        this.$vux.loading.show({
          text: 'loading'
        })
        this.page++;
        if (this.sortState) {
          this.getSupplyList(false, this.sort, this.page, this.pagesize)
        } else {
          this.getSupplyList(false, -1, this.page, this.pagesize)
        }
      },
      // 获取最新排序列表
      getNewPriceList() {
        this.page = 1;
        this.sortState = false;
        this.showDivider = false;
        this.scrollerStatus.pullupStatus = 'default';
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
          this.$refs.scrollerBottom.enablePullup(); // 启用上拉插件
        })
        this.getSupplyList(true, -1, this.page, this.pagesize)
      },
      // 获取价格排序列表
      getPriceList(sort) {
        this.page = 1;
        this.sort = 1 ^ sort;
        this.priceUp = !this.priceUp;
        this.sortState = true;
        this.showDivider = false;
        this.scrollerStatus.pullupStatus = 'default';
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
          this.$refs.scrollerBottom.enablePullup(); // 启用上拉插件
        })
        this.getSupplyList(true, this.sort, this.page, this.pagesize)
      }
    },
    mounted() {
			
    },
    activated() {
      this.getSupplyList(true,-1,1,10)
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
    }

  }

</script>
<style lang="scss" scoped>
  @import "@/base/supplyArea.scss";

</style>
