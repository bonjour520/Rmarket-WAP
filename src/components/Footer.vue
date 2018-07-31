<template>
<div>
  <tabbar class="footer" v-model="tabIndex" v-show="$route.name == 'index' || $route.name == 'purchase' || $route.name == 'supply' || $route.name == 'wode' || $route.name == 'personnel'">
    <tabbar-item link='/' :selected="$route.name == 'index'">
      <img slot="icon" src="../../static/imgs/purchaseArea/icon1.png">
      <img slot="icon-active" src="../../static/imgs/purchaseArea/icon01.png">
      <span slot="label">首页</span>
    </tabbar-item>
    <tabbar-item link='/purchase' :selected="$route.name == 'purchase'">
      <img slot="icon" src="../../static/imgs/purchaseArea/icon10.png">
      <img slot="icon-active" src="../../static/imgs/purchaseArea/icon11.png">
      <span slot="label">采购区</span>
    </tabbar-item>
    <tabbar-item class="fabu" @on-item-click="publish">
        <i slot="icon" class="icon-fabu iconfont"></i>
        <span slot="label">发布</span>
    </tabbar-item>
    <tabbar-item link="/supply" :selected="$route.name == 'supply'">
      <img slot="icon" src="../../static/imgs/purchaseArea/icon20.png">     
      <img slot="icon-active" src="../../static/imgs/purchaseArea/icon21.png">
      <span slot="label">供应区</span>
    </tabbar-item>
    <tabbar-item link="/personnel" :selected="$route.name == 'personnel'">
      <img slot="icon" src="../../static/imgs/purchaseArea/icon30.png">    
      <img slot="icon-active" src="../../static/imgs/purchaseArea/icon31.png">
      <span slot="label">我的</span>
    </tabbar-item>
  </tabbar>
  <div>
    <popup v-model="showPublish" height="100%" position="bottom">
      <div class="publish-wrap">
        <!-- 发布列表 -->
        <grid :show-lr-borders="false" :show-vertical-dividers="false">
          <grid-item :label="i.title" v-for="(i,index) in publishList" :key="index" >
            <img slot="icon" :src="i.img" @click="goto(i.url)">
          </grid-item>
        </grid>
          <x-icon type="ios-close-empty" size="45" @click="closePublish"></x-icon>
      </div>
    </popup>
  </div>
</div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    name: 'AppFooter',
    data() {
      return {
        msg: '',
        tabIndex: 0,
        showPublish:false,
        publishList: [{
					title: '发布供应',
					url: '/publishSupply',
          img: require("../../static/imgs/index/publish_apply.png"),
        }, {
					title: '发布采购',
					url: '/publishPurchase',
          img: require("../../static/imgs/index/publish_purchase.png"),
        }],
      }
    },
    computed:{
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods:{
      publish() {
        this.showPublish = true;
        
      },
      closePublish() {
        this.showPublish = false;
      },
      goto(url){
        if(this.loginState){
          this.$router.push(url);
        }else{
          this.$vux.toast.text("请先登录!");
          setTimeout(()=>{
            this.$router.push("/login")
          },1000)
        }
      }
    },
    mounted(){},
    watch: {
      $route(to) {
            this.showPublish = false;
        }
    }
  }
</script>
<style lang="scss">
@import "@/base/reset.scss";
.fabu{
  position: relative;
  .weui-tabbar__icon{
    border-radius: 50%;
    background: #00c55d;
    position: absolute;
    width: 50px;
    height: 95%;
    left: 50%;
    top: 2px;
    transform: translateX(-50%);
    i{
      color: #fff;
      font-size: 20px;
    }
  }
  .weui-tabbar__label{
    color: #fff;
    position: absolute;
    bottom: 5px;;
    left: 50%;
    transform: translateX(-50%);
  }
  &.weui-bar__item_on{
    .weui-tabbar__icon i{
      color: #fff!important;
    }
    .weui-tabbar__label{
      color: #fff!important;
    }
  }
}
.publish-wrap {
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;
  .weui-grids{
    margin-bottom: 8px;
    &:before{
    border-top:none;
   }
  }
  .weui-grid{
    padding-bottom: rem(250)
  }
  .weui-grid__icon{
     width: rem(132); 
     height: rem(132); 
  }
  .weui-grid__label{
    color: #333;
    font-size: 16px;
  }
  .vux-x-icon {
   fill: #333;
}
}
</style>

