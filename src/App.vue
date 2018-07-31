<template>
  <div id="app">
    <loading v-model="isLoading"></loading>
    <!-- <app-header></app-header>	   -->
    <!-- <app-back></app-back> -->
    <transition>
      <div>
          <keep-alive>
              <router-view class="p-footer" v-if="!$route.meta.refresh"></router-view>
          </keep-alive>
          <router-view class="p-footer" v-if="$route.meta.refresh"></router-view>
      </div>
    </transition>
    <app-footer></app-footer>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'
export default {
  components: {
    Loading
  },
  computed: {
    ...mapState({
      isLoading: 'isLoading',
    })
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/reset.less';
@import './base/wuiedit.less';
@import './base/base.less';
@import '~vux/src/styles/1px.less';
@import '../static/js/need/layer.css';
html, body, #app {
  height: 100%;
  width: 100%;
  max-width: 750px;
  min-width: 320px;
  overflow-x: hidden;
  background: #fff;
  position: relative;
}
</style>

