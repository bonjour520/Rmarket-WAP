<template>    
  <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true">{{title}}</x-header>
</template>  
<style>
</style>  
<script>  
export default {
  name: 'AppHeader',  
  data(){  
    return{  
        title:''  
    }  
  },  
  methods: {  

  },  
}
</script>  