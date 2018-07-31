<template>
  <div class="back" @click="$router.go(-1)" v-if="$route.name != 'index' && $route.name != 'zhiyuan' && $route.name != 'xuewen' && $route.name != 'my'">
    <span></span>
  </div> 
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="less">
.back{
  position: fixed;
  top: 2px;
  z-index: 10000;
  span{
    display: block;
    border-radius: 50%;
    background: rgba(0,0,0,.2);
    width: 2.5rem;
    height: 2.5rem;
    &::after{
      content: " ";
      display: inline-block;
      height: 6px;
      width: 6px;
      border-width: 0 0 2px 2px;
      border-color: #000;
      border-style: solid;
      -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      position: relative;
      top: -2px;
      position: absolute;
      top: 50%;
      margin-top: -4px;
      left: 50%;
      margin-left: -2px;
    }
  }
  
}
</style>
