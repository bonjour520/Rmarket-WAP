<template>
  <section class="x-scroll">
    <scroller lock-x style="background: #fff;"  ref="scrollerBottom">
      <box>
        <div class="g-sourse">
          <div class="sourse-title">已选期望货源地</div>
          <div class="sourse-list" style="max-height: 100vh;">
              <div class="list-item" v-for="(item, index) in selectAddresArray" :key="index">
                <span class="label">{{item.province}}</span>
                <div class="items">
                  <span v-for="(_item, _index) in item.citys" :key="_index">{{_item}}</span>
                </div>
              </div>
          </div>
        </div>
      </box>
    </scroller>
  </section>
</template>
<script>
  import {mapState} from 'vuex';
  export default {
    data() {
      return {
        selectAddresArray: [], // 选择城市列表
        addressProvData:[], // 省市列表
        addressCityData:[], // 城市列表
        isShowProv: true,
        nowIsCheckProvId: null,
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
     
    },
    mounted() {

    },
    activated() {
      this.selectAddresArray = JSON.parse(localStorage.showAddresArray);
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
    }
  }

</script>
<style lang="scss">

</style>
