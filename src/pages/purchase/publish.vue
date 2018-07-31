<template>
  <div class="x-scroll global">
    <scroller lock-x style="background: #f7f7f7;"  ref="scrollerBottom">
      <section>
        <!-- 第一步 -->
        <div v-show="isShowTempOne">
          <group label-width="3.5em" label-margin-right="1em" label-align="right">
            <selector title="类别" :options="shopCategoryArray" placeholder="请选择类别"  :value-map="['store_id','class_name']" direction="rtl" v-model="shopCategoryValue" class="vux-1px-b"></selector>
            <selector title="分类" :options="shopClassifyArray" placeholder="请选择分类"  :value-map="['store_id','class_name']" direction="rtl" v-model="shopClassifyValue"></selector>
          </group>
          <box gap="0 10px">
           <x-button type="primary" class="rmt50" @click.native="nextTempFunc">下一步</x-button>
          </box>
        </div>
        <!-- 第二步 -->
        <div v-show="!isShowTempOne">
          <group label-width="4.5em" label-margin-right="1em" label-align="right">
            <x-input title="商品名称" v-model="formData.purchase_name" placeholder="请输入商品名称" class="vux-1px-b"></x-input>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="rmt10">
            <x-textarea title="补充说明" v-model="formData.descInfo" :max="30" placeholder="请输入补充说明" :height="60" :rows="2" :cols="20"></x-textarea>
          </group>
 
          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="rmt10">
            <flexbox class="vux-1px-b">
              <flexbox-item >
                <group label-width="4.5em" label-margin-right="1em" label-align="right" >
                  <x-input title="期望单价"  type="number" v-model="formData.money" placeholder="请输入期望单价" @on-focus="isFace = false"></x-input>
                </group>
              </flexbox-item>
              <flexbox-item :span="2" class="tc">
                或者
              </flexbox-item>
              <flexbox-item :span="2" class="mr10">
                  <x-button mini 
                    :type="isFace ? 'primary': 'default'"
                    @click.native="isFace = true">面议</x-button>
              </flexbox-item>
            </flexbox>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right">          
            <flexbox class="vux-1px-b">
              <flexbox-item>
                <group label-width="4.5em" label-margin-right="1em" label-align="right" >
                  <x-input title="采购数量" type="number" v-model="formData.purchase_number" placeholder="请输入采购数量"></x-input>
                </group>
              </flexbox-item>
              <flexbox-item :span="3">
                  <selector :options="purchaseType"  :value-map="['id','text']" direction="rtl" v-model="typeValue" class="down"></selector>
              </flexbox-item>
            </flexbox>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right">
            <datetime title="截止时间" 
              :start-date="StartTime" 
              :end-date="EndTime" 
              format="YYYY-MM-DD HH:mm"
              class="vux-1px-b" 
              v-model="formData.endTime"></datetime>
          </group>

          <group label-width="5em" label-margin-right="1em" label-align="right" class="vux-1px-b form-group">
            <cell title="期望货源地" :value="formData.expAddress" is-link link="/selectAddress"></cell>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right">          
            <flexbox class="vux-1px-b">
              <flexbox-item>
                <group label-width="4.5em" label-align="left" >
                  <selector title="收货地址" 
                    :options="provincesList"  
                    :value-map="['provinceid','province']" 
                    direction="rtl" 
                    v-model="proveValue" 
                    class="down" 
                    placeholder="请选择"></selector>
                </group>
              </flexbox-item>
              <flexbox-item :span="3">
                  <selector 
                    :options="citysList"  
                    :value-map="['cityid','city']" 
                    direction="rtl" 
                    v-model="cityValue" 
                    class="down" 
                    placeholder="请选择"
                    ></selector>
              </flexbox-item>
              <flexbox-item :span="3">
                  <selector 
                    :options="areasList"  
                    :value-map="['areaid','area']" 
                    direction="rtl" 
                    v-model="areaValue" 
                    class="down" 
                    placeholder="请选择"></selector>
              </flexbox-item>
            </flexbox>
          </group>
          <group label-width=".2em">          
              <x-input class="vux-1px-b" v-model="formData.add_goods_field4" placeholder="请输入详细地址"></x-input>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="rmt20">
            <x-input title="联系人" v-model="formData.contacts" placeholder="请输入联系人" class="vux-1px-b"></x-input>
          </group>
          <group label-width="4.5em" label-margin-right="1em" label-align="right">
            <x-input title="联系电话" v-model="formData.phone" placeholder="请输入联系电话" class="vux-1px-b"></x-input>
          </group>


          <box gap="0 10px">
            <flexbox>
              <flexbox-item>
                  <x-button type="primary" plain  class="rmt50" @click.native="submitPublish(1)">保存</x-button>
              </flexbox-item>
              <flexbox-item>
                  <x-button type="primary" class="rmt50" @click.native="submitPublish(0)">提交</x-button>
              </flexbox-item>
            </flexbox>
          </box>
        </div>
        
      </section>
    </scroller>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
import CommomObj from '../../utils/commom';
  export default {
    data() {
      return {
        // 类型属性
        shopCategoryArray: [],
        shopCategoryValue: '',
        shopClassifyArray: [],
        shopClassifyValue: '',
        // 步骤控制
        isShowTempOne: true,
        // 表单数据
        formData:{
          purchase_name: '',
          descInfo: '',
          money: '',
          purchase_number: '',
          expAddress: '',
          endTime: '',
          address: '',
          contacts: '',
          phone: '',
          add_goods_field4: '',
        },
        StartTime: '',
        EndTime: '',
        // 收货地址
        proveValue: '',
        cityValue: '',
        areaValue: '',
        provincesList: [],
        citysList: [],
        areasList: [],
        // 采购数量单位
        purchaseType: [],
        typeValue: '', 
        // 表单部分属性
        endTime: '',
        expAddress: '',
        isFace: false,
        expAddressList: [],
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState',
        storeInfo: 'storeInfo'
      })
    },
    watch:{
      'shopCategoryValue'(val,oldVal){
        if(val != '' && val != oldVal){
          this.getShopClassify(val);
        }
      },
      'proveValue'(val,oldVal){
        if(val != '' && val != oldVal){
          this.cityValue = '';
          this.areaValue = '';
          this.$getCitys(val);
        }
      },
      'cityValue'(val,oldVal){
        if(val != '' && val != oldVal){
          this.$getAreas(val);
        }
      },
    },
    methods: {
      // 获取类别
      getShopCategory(){
        this.$api.post(this.$interface.apiurl.getShopCategory,null,res=>{
          this.shopCategoryArray = res.data;
        })
      },
      // 获取分类
      getShopClassify(id){
        this.$api.post(this.$interface.apiurl.getShopClassify,{
            parentId:id
          },res=>{
          this.shopClassifyArray = res.data;
        })
      },
      // 采购数量单位 type=1
      getPurchaseType(){
        this.$api.post(this.$interface.apiurl.getPurchaseType,{
          type: 1
        },res=>{
          this.purchaseType = res.data;
          this.typeValue = res.data[0].id;
        })
      },
      // 下一步
      nextTempFunc(){
        if(this.shopCategoryValue == '') {
          this.$vux.toast.text("请选择类别","middle");
          return;
        }
        if(this.shopClassifyValue == '') {
          this.$vux.toast.text("请选择分类","middle");
          return;
        }
        this.$vux.loading.show({text:'Loading...'});
        setTimeout(()=>{
          this.isShowTempOne = false;
          this.$vux.loading.hide();
        },1000)
      },
      submitPublish(Type){

        let fo = this.formData;
        if(fo.purchase_name == ''){CommomObj.$tips("商品名称不能为空。");return;}
        if(fo.purchase_name.trim().length < 5 ){CommomObj.$tips("商品名称长度小于5");return;}
        if(fo.descInfo == '' ){CommomObj.$tips("请输入货品描述");return;}

        if(!this.isFace){
         if(fo.money == '' ){CommomObj.$tips("请输入期望单价");return;}else if(!(/^(d*.d{0,2}|d+).*$/.test(fo.money))){CommomObj.$tips("请输入正确的单价");return;}
        }

        if(fo.purchase_number == '' ){CommomObj.$tips("请输入采购数量");return;}else if(!(/(^\d{1,5}$)|(^\d{1,5}\.\d{1,4}$)/.test(fo.purchase_number))){CommomObj.$tips("采购数量在0-99999之间");return;}
      
        if(fo.endTime == '' ){CommomObj.$tips("请选择时间");return;}

        if(this.expAddressList.length == 0 ){CommomObj.$tips("请选择供应地区");return;}

        if(this.proveValue == '' || this.cityValue == '' || this.areaValue == '' || fo.add_goods_field4 == ''){CommomObj.$tips("请填写地址信息");return;}
        if(fo.contacts == '' ){CommomObj.$tips("请输入联系人");return;}else if(!(/[\u4E00-\u9FA5]/.test(fo.contacts))){CommomObj.$tips("请输入中文联系人");return;}
        if(fo.phone == '' ){CommomObj.$tips("请输入联系电话");return;}else if(fo.phone.length != 11){CommomObj.$tips("请输入正确的联系方式");return;}
      

        this.$api.post(this.$interface.apiurl.putReleasePurchase,{
          "appid": this.$interface.$appid,
          "mainKey":localStorage.$mainKey,
          "tokenKey": localStorage.$tokenKey,
          "store_id": this.storeInfo.store_id,
          "class_field1": this.shopCategoryValue,
          "class_field2": this.shopClassifyValue,
          "descInfo": fo.descInfo,
          "money": this.isFace ? 0 : fo.money,
          "negotiable": this.isFace ? 1 : 0,
          "address": JSON.stringify(this.expAddressList),
          "endTime": fo.endTime + ":00",
          "add_goods_field1": this.proveValue,
          "add_goods_field2": this.cityValue,
          "add_goods_field3": this.areaValue,
          "add_goods_field4": fo.add_goods_field4,
          "phone": fo.phone,
          "contacts": fo.contacts,
          "purchase_number": fo.purchase_number,
          "type": Type,
          "purchase_id":0,
          "purchase_name": fo.purchase_name
        },res=>{
          this.$vux.loading.hide();
          CommomObj.$tips("发布成功!")
          localStorage.removeItem("selectAddresArray");
          for(let k in this.formData){
            this.formData.k = '';
          }
          this.$router.go(-1);
        },err=>{
          this.$vux.loading.hide();
          CommomObj.$tips(err.msg);
        })
      }
      
    },
    mounted() {
      this.getShopCategory();
      this.getPurchaseType();
      // 获取城市列表
      this.$getProvinces();
      // 获取当前年月日 进行加减
      const _Date = new Date();
      this.StartTime = (_Date.getFullYear() - 10) + '-01-01';
      this.EndTime = (_Date.getFullYear() + 10) + '-12-12';
    },
    activated() {
      let addStorage = localStorage.selectAddresArray ? JSON.parse(localStorage.selectAddresArray) : null;
      if(addStorage){
        let str = '';
        let selectList = [];
        // 组装期望地址 和 汉字    
        for(let i =0 ; i< addStorage.length; i++){
          str += addStorage[i].porvs.province + "/";
          let obj = {};
          obj.provinceId = addStorage[i].porvs.provinceid;
          obj.cityIds = [];
          for(let j = 0; j< addStorage[i].citys.length; j++){
            str += addStorage[i].citys[j].city;
            obj.cityIds.push(addStorage[i].citys[j].cityid);
          }
          str += " ";
          selectList.push(obj);
        }
        str = str.substring(0,str.length-1);
        this.formData.expAddress = str;
        this.expAddressList = selectList;
      }
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
    }
  }

</script>
<style lang="scss">

</style>
