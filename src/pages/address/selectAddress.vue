<template>
  <section class="x-scroll">
    <scroller lock-x style="background: #fff;"  ref="scrollerBottom">
      <box>
        <div class="g-sourse">
          <div class="sourse-title">已选期望货源地</div>
          <div class="sourse-list">
              <div class="list-item" v-for="(item, index) in selectAddresArray" :key="index">
                <span class="label">{{item.porvs.province}}</span>
                <div class="items">
                  <span v-for="(_item, _index) in item.citys" :key="_index">{{_item.city}}</span>
                </div>
              </div>
          </div>
        </div>
        <div class="g-sourse-body">
          <div class="body-tab">
            <span :class="isShowProv ? 'on' : '' " @click="tabProvClick">省份</span>
            <span  :class="!isShowProv ? 'on' : '' ">城市</span>
          </div>
          <div class="body-cont" v-if="isShowProv">
            <span :class="item.checked ? 'on' : ''" 
                v-for="(item, index) in addressProvData" :key="index"
                @click="selectProv(item.provinceid)">{{item.province}}</span>
          </div>
          <div class="body-cont" v-else>
            <span :class="item.checked ? 'on' : ''" 
                v-for="(item, index) in addressCityData" :key="index"
                @click="selectCity(item.cityid)">{{item.city}}</span>
          </div>
          <div class="g-formgroup mt40">
            <button type="default" class="btn-default"  @click="cancelTap" style="width: 46%;"> 取消 </button>
            <button type="default" class="btn-default btn-main ml40" @click="saveTap" style="width: 46%;"> 保存 </button>
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
      // 获取省市列表
      getProvinces(){
        let arr = {
          id: 0,
          provinceid: 0,
          province: "全国",
          checked: false,
        }
        this.$api.post(this.$interface.apiurl.getProvinces,null,res=>{
          for(let i= 0; i<res.data.length;i++){
            res.data[i].checked = false;
          }
          res.data.unshift(arr);
          this.addressProvData = res.data;
          
          // 获取storage地址数据
          let addStorage = localStorage.selectAddresArray ? JSON.parse(localStorage.selectAddresArray) : null;
          if(addStorage){
             let adrArr = JSON.parse(localStorage.selectAddresArray);
              /**
              *  1. 判断是否是选择了全国
                    true:
                      a.选中全部状态
                    false:
                      a.选择部分状态
              */
              for(let i = 0 ; i< adrArr.length;i++){
                if(adrArr[i].porvs.provinceid == 0){ // 1.true
                  // 取消原先选择状态
                  for(let j = 0; j< this.addressProvData.length;j++){
                    this.addressProvData[j].checked = true;
                  };
                }else{  // 1.false
                  for(let j = 0; j< this.addressProvData.length;j++){
                    if(adrArr[i].porvs.provinceid == this.addressProvData[j].provinceid){
                      this.addressProvData[j].checked = true;
                    }
                  };
                }
              }
              this.isShowProv = true;
              this.selectAddresArray = adrArr;
          }else{
            this.selectAddresArray = [];
          }
        })
      },
      // 获取城市列表
      getCitys(id){
        let arr = {
          id: 0,
          cityid: 0,
          city: "全省",
          checked: false,      
        }
        this.$api.post(this.$interface.apiurl.getCitys,{
          provinceid: id
        },res=>{
          for(let i= 0; i<res.data.length;i++){
            res.data[i].checked = false;
          }
          res.data.unshift(arr);
          this.addressCityData = res.data;
        })
      },
      // 省份选择
      selectProv(PID){
        // 一、判断是否选择是全国
        if(PID == 0){ // 一、true
          // 1、判断是否是被选中
          let adrArr = this.selectAddresArray;
          if(this.addressProvData[0].checked){  // 1、true
            /**
             * 1、删除全国期望地址
             * 2、取消全部的省份选择状态
             */
            let adrArr = this.selectAddresArray;
            for(let i=0; i< adrArr.length;i++){
              if(PID == adrArr[i].porvs.provinceid){
                adrArr.splice(i,1);
                this.selectAddresArray = adrArr;
              }
            };
            for(let i=0;i<this.addressProvData.length;i++){
              this.addressProvData[i].checked = false;
            }


          }else{ // 1、false
            /**
             * 1、添加全国期望地址
             * 2、选中全部的省份状态
             */
            let obj = {
              porvs: {
                id: 0,
                provinceid: 0,
                province: "全国",
                checked: true
              },
              citys: [{
                id: 0,
                cityid: 0,
                city: "全国",
                checked: true
              }]
            };
            adrArr = [];
            adrArr.push(obj);
            this.selectAddresArray = adrArr;
            for(let i=0;i<this.addressProvData.length;i++){
              this.addressProvData[i].checked = true;
            }

          }
        }else{ // 一、false 
          /** 
          * 1、找到对应的省市数据
          * 2、判断当前是否被选中
          *    true: 
          *      1)循环判断是否选中了全国
                    true: 
                        1.删除其他选项选中状态
                        2.删除全国在列表中的数据
                        3.将该项的数据添加到selectAddresArray中
                        4.保存当前被点击的provinceid
                    false:
                        1. 判断selectAddresArray中是否含有当前城市
                          true:
                            A: 循环对应的数组citys,添加对应的样式
                          false:
                            A:      
          *    false: 
          *      1.加载获取城市的数据
          *      2.改变tab选择的状态
                3. 将该项的数据添加到selectAddresArray中
          */
          // 获取城市数据
          this.getCitys(PID);
          setTimeout(()=>{
            for(let i=0;i<this.addressProvData.length;i++){
              if(this.addressProvData[i].provinceid == PID){ // 1、true
                if(this.addressProvData[i].checked){  // 2、true            
                  let adrArr = this.selectAddresArray;
                  
                  for(let o=0;o<adrArr.length;o++){
                    if(adrArr[o].porvs.provinceid == 0){ // 1) true 有全国
                      adrArr.splice(o,1);
                      let obj = {
                        porvs: {
                          id: this.addressProvData[i].id,
                          provinceid: this.addressProvData[i].provinceid,
                          province: this.addressProvData[i].province,
                          checked: true
                        },
                        citys:[]
                      }
                      adrArr.push(obj);
                      for(let j=0; j<this.addressProvData.length;j++){
                        this.addressProvData[j].checked = !this.addressProvData[j].checked;
                        this.nowIsCheckProvId = this.addressProvData[i].provinceid;
                        this.selectAddresArray = adrArr;
                        this.isShowProv = false;
                      }
                    }else{ // 1) false
                      if(adrArr[o].porvs.provinceid == PID){ // 1.true
                        // A: 判断是否所有的城市都已经选择
                        //  true: 选中全部的状态
                        //  false: 循环城市列表和已选择城市列表添加对应的样式
                        if(this.addressCityData.length - 1 == adrArr[o].citys.length){
                          for(let z= 0; z< this.addressCityData.length;z++){
                            this.addressCityData[z].checked = true;
                            this.isShowProv = false;
                          }                    
                        }else{
                                        
                          for(let z= 0; z< this.addressCityData.length;z++){
                            for(let x = 0; x < adrArr[o].citys.length;x++){
                              if(this.addressCityData[z].cityid == adrArr[o].citys[x].cityid){
                                this.addressCityData[z].checked = true;
                                this.isShowProv = false;
                              }
                              // 判断所选城市是否全部选择
                              if(this.addressCityData[z].length -1 == adrArr[o].citys[x].length){
                                this.addressCityData[0].checked = true;
                              }
                            }
                          }
                        };

                      };

                    }
                  }


                }else{ // 2、false
                  let adrArr = this.selectAddresArray;              
                  let obj = {
                    porvs: {
                      id: this.addressProvData[i].id,
                      provinceid: this.addressProvData[i].provinceid,
                      province: this.addressProvData[i].province,
                      checked: true
                    },
                    citys:[]
                  }
                  adrArr.push(obj);
                  this.nowIsCheckProvId = this.addressProvData[i].provinceid;
                  this.selectAddresArray = adrArr;
                  this.isShowProv = false;
                  this.addressProvData[i].checked = !this.addressProvData[i].checked;
                };
              }
            };
          },100)
        }
      },
      // 城市选择
      selectCity(CID){
        // 一、判断当前是否是全省判断
        if(CID == 0){ // 一、true
          // 1、判断全省是否被选中
          let cityDataArr = this.addressCityData;
          let adrArr = this.selectAddresArray;    
          if(this.addressCityData[0].checked){ // 1、true
            /**
             * 1、删除对应的已选择期望地址
             * 2、取消全部的选中状态
             */
            for(let i=0; i< adrArr.length ; i++){
              if(adrArr[i].porvs.provinceid == this.nowIsCheckProvId){ // 判断当前是那个省份
                for(let j= 0; j< adrArr[i].citys.length;j++){
                    for(let z=0;z<this.addressCityData.length;z++){
                      if(adrArr[i].citys[j].cityid == this.addressCityData[z].cityid){
                        adrArr[i].citys.splice(j,1);
                      }
                      this.addressCityData[z].checked = false;
                    }
                }
              }
            };
            this.selectAddresArray = adrArr;
          }else{ //1、false
            /**
             * 1、添加对应的已选择期望地址
                  1.循环判断citys数据为空的索引
                  2.判断当前省市id是否对应的选择id
                  3.循环添加数据（将全省排除）
            * 2、选中全部的状态
            */
            
            let adrArr = this.selectAddresArray;
            for(let i=0; i< adrArr.length ; i++){
              if(adrArr[i].porvs.provinceid == this.nowIsCheckProvId){ 
                adrArr[i].citys = [];
                for(let j=0;j<this.addressCityData.length;j++){
                  if(j>0){ // 3. true
                    adrArr[i].citys.push(this.addressCityData[j]);
                  }
                  this.addressCityData[j].checked = true;
                }
                this.selectAddresArray = adrArr;
              }
            }
          }

        }else{ // 一、false

            /**
             A: 判断当前是否被选中
                true: 
                  1.取消当前的选中状态
                  2.删除selectAddresArray中citys对应的字段
                false:
                  1.添加selectAddresArray中citys字段
                  2.选中当前状态
            B:判断selectAddresArray的citys中长度是否等于addressCityData的字段长度-1
                true:
                  a.取消全省选中状态
            */
          let cityDataArr = this.addressCityData;
          let adrArr = this.selectAddresArray;
          for(let i = 0 ; i < cityDataArr.length;i++){
            if(cityDataArr[i].cityid == CID){ // 找到对应的点击的对象
              if(cityDataArr[i].checked){ // A true
                
                for(let j = 0; j< adrArr.length; j++){
                  for(let z = 0; z < adrArr[j].citys.length; z++){
                    if(adrArr[j].citys[z].cityid == cityDataArr[i].cityid){
                      adrArr[j].citys.splice(z,1); 
                      this.addressCityData[i].checked = false;
                      this.selectAddresArray = adrArr;
                    }
                  }
                }
                // 将第一个状态删除
                this.addressCityData[0].checked = false;
              }else{ // A false

                for(let j = 0; j< adrArr.length; j++){
                  if(adrArr[j].porvs.provinceid == this.nowIsCheckProvId){
                    adrArr[j].citys.push(cityDataArr[i]);
                    
                    // 判断如果选择的长度 等于 总城市长度-1 
                    if(adrArr[j].citys.length == cityDataArr.length -1){
                      // 将第一个状态加上
                      this.addressCityData[0].checked = true;
                    }
                    this.addressCityData[i].checked = true;
                    this.selectAddresArray = adrArr;
                  };
                }
              }
            };
          }
        }
      },
      // tab省份选择
      tabProvClick(){
        let adrArr = this.selectAddresArray;
        for(let i = 0 ; i< adrArr.length;i++){
          if(adrArr[i].citys.length == 0){
            // 取消原先选择状态
            for(let j = 0; j< this.addressProvData.length;j++){
              if(adrArr[i].porvs.provinceid == this.addressProvData[j].provinceid){
                this.addressProvData[j].checked = false;
              }
            };
            // 删除空余数组
            adrArr.splice(i,1);
          }
        }
        this.isShowProv = true;
        this.selectAddresArray = adrArr;
      },
      // 保存
      saveTap(){
        this.$vux.loading.show({text: 'Loading...'});
        localStorage.setItem("selectAddresArray",JSON.stringify(this.selectAddresArray))
        setTimeout(()=>{
          this.$router.go(-1);
          this.$vux.loading.hide();
        },1000);
      },
      // 取消
      cancelTap(){
        this.$router.go(-1);
      }
    },
    mounted() {

    },
    activated() {
      this.getProvinces();
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
    }
  }

</script>
<style lang="scss">

</style>
