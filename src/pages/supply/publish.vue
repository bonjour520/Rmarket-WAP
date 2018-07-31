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
        <div v-show="!isShowTempOne" class="purch-form">
          <group label-width="4.5em" label-margin-right="1em" label-align="right">
            <x-input title="商品名称" v-model="formData.supply_name" placeholder="请输入商品名称" class="vux-1px-b"></x-input>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="rmt10">
            <x-textarea title="货品描述" :max="30" placeholder="请填写货品描述（最多输入30字）" v-model="formData.descInfo"  :height="60" :rows="2" :cols="20"></x-textarea>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right">
            <x-input type="number" title="货品单价" v-model="formData.univalent" placeholder="请输入货品单价" class="vux-1px-b"></x-input>
          </group>


          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="rmt10">
            <flexbox class="vux-1px-b">
              <flexbox-item >
                <group label-width="4.5em" label-margin-right="1em" label-align="right" >
                  <x-input  type="number" title="供应库存" v-model="formData.supply_inventory" placeholder="请输入数字" @on-focus="isFace = false"></x-input>
                </group>
              </flexbox-item>
              <flexbox-item :span="2" class="tc">
                或者
              </flexbox-item>
              <flexbox-item :span="3" class="mr10">
                  <x-button mini 
                    :type="isFace ? 'primary': 'default'"
                    @click.native="changeInput">货源充足</x-button>
              </flexbox-item>
            </flexbox>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right" v-show="CounterpoiseID == shopCategoryValue">          
              <x-input  type="number"  title="标准均重" class="vux-1px-b" v-model="formData.counterpoise" placeholder="请输入标准均重">
                <span slot="right">Kg</span>
              </x-input>
          </group>
          <group label-width="4.5em" label-margin-right="1em" label-align="right">          
              <x-input  type="number"  title="起售数量" class="vux-1px-b" v-model="formData.selling_count" placeholder="请输入起售数量"></x-input>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right">
            <datetime title="截止时间" 
              :start-date="StartTime" 
              :end-date="EndTime" 
              format="YYYY-MM-DD HH:mm"
              class="vux-1px-b" 
              v-model="formData.endTime"></datetime>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="vux-1px-b formGroup">
            <cell title="供应地区" :value="formData.expAddress" is-link link="/selectAddress"></cell>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right">          
            <flexbox class="vux-1px-b">
              <flexbox-item>
                <group label-width="4.5em" label-align="left" >
                  <selector title="发货地址" 
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
              <x-input class="vux-1px-b" v-model="formData.soure_field4" placeholder="请输入详细地址"></x-input>
          </group>

          
         <group label-width="4.5em" label-margin-right="1em" label-align="right" class="formGroup rmt20">          
            <flexbox class="vux-1px-b flex-item">
              <flexbox-item :span="2.5">
                物流方式
              </flexbox-item>
              <flexbox-item v-for="(item, index) in byType" :key="index">
                  <x-button :type="formData.logistics_type == item.id ? 'primary' : 'default'" mini @click.native="logistChange(item.id)">{{item.text}}</x-button>                
              </flexbox-item>
            </flexbox>
          </group>

          <div class="form-group rmt20 border_btm1" id="uploadImg">
            <label for="file">货品图片</label>
            <div class="z_photo">
                <div class="z_addImg" v-for="(item, index) in imgArr" :key="index" v-if="imgArr.length>0" @click="delImg(index)"><img :src="item"></div>
                <div class="z_file" v-if="imgArr.length != 9">
                    <input type="file" name="file" id="file" accept="image/*" multiple @change="imgChange();" />
                </div>
            </div>
            <p class="f12 flex1 cr-999">最多上传9张图片,至少上传一张图片</p>
          </div>

          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="rmt20">
            <x-input title="联系人" v-model="formData.contacts" placeholder="请输入联系人" class="vux-1px-b"></x-input>
          </group>
          <group label-width="4.5em" label-margin-right="1em" label-align="right">
            <x-input  type="tel"  title="联系电话" v-model="formData.phone" placeholder="请输入联系电话" class="vux-1px-b"></x-input>
          </group>


          <box gap="0 10px">
            <flexbox>
              <flexbox-item>
                  <x-button type="primary" plain  class="rmt50" @click.native="submitFormData(1)">保存</x-button>
              </flexbox-item>
              <flexbox-item>
                  <x-button type="primary" class="rmt50" @click.native="submitFormData(0)">发布</x-button>
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
  import axios from 'axios'
import CommomObj from '../../utils/commom';
  export default {
    data() {
      return {
        // 类型属性
        shopCategoryArray: [],
        shopCategoryValue: '',
        CounterpoiseID: '',
        shopClassifyArray: [],
        shopClassifyValue: '',
        // 步骤控制
        isShowTempOne: true,
        // 表单数据
        formData:{
          supply_name: '',
          descInfo: '',
          money: '',
          negotiable: '',
          supply_inventory: '',
          selling_count: '',
          image: '',
          logistics_type:'',
          expAddress: '',
          endTime: '',
          address: '',
          contacts: '',
          phone: '',
          soure_field4: '',
          counterpoise:''
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
        // 物流方式
        byType: [],
        // 图片上传数组
        imgArr:[],
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
          for (let i = 0; i < res.data.length; i++) {
            if(res.data[i].class_spell == "huochu"){
              this.CounterpoiseID = res.data[i].store_id;
            }
          }
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
      // 供应物流方式 type=4
      getByType(){
        this.$api.post(this.$interface.apiurl.getPurchaseType,{
          type: 4
        },res=>{
          this.byType = res.data;
          this.formData.logistics_type = res.data[0].id;
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
      changeInput(){
        this.isFace = true;
        this.formData.supply_inventory = '';
      },  
      // 物流方式选择
      logistChange(id){this.formData.logistics_type = id;},
      // 图片上传
      imgChange(){
        var self = this
        let file = document.getElementById("file").files[0];
        let param = new FormData()  // 创建form对象
        param.append('file', file, file.name)  // 通过append向form对象添加数据
        param.append('chunk', '0') // 添加form表单中其他数据
        // 添加请求头
        self.$vux.loading.show({text: "上传中..."});
        self.$api.post(self.$interface.apiurl.uploadImgV2_4, param,res => {
          self.imgArr.push(res.data.relativeUrl);
            self.$vux.loading.hide();
        },err=>{
          CommomObj.$tips(err.msg)
          self.$vux.loading.hide();

        })
      
      },
      // 删除图片
      delImg(index){
        let self = this;
        CommomObj.$comfirm("是否删除图片?",function () {
          for(let i = 0; i< self.imgArr.length ; i++){
            if(i == index){
              self.imgArr.splice(i,1);
            }
          }
        })
      },
      // 提交表单
      submitFormData(Type){
        let fo = this.formData;
        if(fo.supply_name == ''){CommomObj.$tips("商品名称不能为空。");return;}
        if(fo.supply_name.trim().length < 5 ){CommomObj.$tips("商品名称长度小于5");return;}
        if(fo.descInfo == '' ){CommomObj.$tips("请输入货品描述");return;}
        if(fo.univalent == '' ){CommomObj.$tips("请输入单价");return;}else if(!(/^(d*.d{0,2}|d+).*$/.test(fo.univalent))){CommomObj.$tips("请输入正确的单价");return;}

        if(!this.isFace){
          if(fo.supply_inventory == '' ){CommomObj.$tips("请输入供应库存");return;}else if(!(/(^\d{1,5}$)|(^\d{1,5}\.\d{1,4}$)/.test(fo.supply_inventory))){CommomObj.$tips("库存在0-99999之间");return;}
        }

        // 判断是否是活畜
        for (let i = 0; i < this.shopCategoryArray.length; i++) {
          if(this.shopCategoryValue == this.shopCategoryArray[i].store_id && this.shopCategoryArray[i].class_spell == 'huochu'){
            if(fo.counterpoise == '' ){CommomObj.$tips("请输入均重");return;}else if(!(/^(\d|[1-9]\d|[1-4]\d{2}|500)$/.test(fo.counterpoise))){CommomObj.$tips("均重在0-500之间");return;}
          }
        }

        if(fo.selling_count == '' ){CommomObj.$tips("请输入起售数量");return;}else if(!(/(^\d{1,5}$)|(^\d{1,5}\.\d{1,4}$)/.test(fo.selling_count))){CommomObj.$tips("起售数量在0-99999之间");return;}
      
        if(fo.endTime == '' ){CommomObj.$tips("请选择时间");return;}

        if(this.expAddressList.length == 0 ){CommomObj.$tips("请选择供应地区");return;}

        if(this.proveValue == '' || this.cityValue == '' || this.areaValue == '' || fo.soure_field4 == ''){CommomObj.$tips("请填写地址信息");return;}
        if(this.imgArr.length == 0){CommomObj.$tips("上传图片地址");return;}
        if(fo.contacts == '' ){CommomObj.$tips("请输入联系人");return;}else if(!(/[\u4E00-\u9FA5]/.test(fo.contacts))){CommomObj.$tips("请输入中文联系人");return;}
        if(fo.phone == '' ){CommomObj.$tips("请输入联系电话");return;}else if(fo.phone.length != 11){CommomObj.$tips("请输入正确的联系方式");return;}

        this.$vux.loading.show({text: "Loading..."});
        this.$api.post(this.$interface.apiurl.putReleaseSupply,{
          "appid": this.$interface.$appid,
          "mainKey":localStorage.$mainKey,
          "tokenKey": localStorage.$tokenKey,
          "class_field1": this.shopCategoryValue,
          "class_field2": this.shopClassifyValue,
          "descInfo": fo.descInfo,
          "univalent": fo.univalent,
          "selling_count": fo.selling_count,
          "logistics": fo.logistics_type,
          "logistics_type": 0,
          "image": JSON.stringify(this.imgArr),
          "supply_inventory": this.isFace ? 0 : fo.supply_inventory,
          "adequacy": this.isFace ? 0 : -1,
          "address": JSON.stringify(this.expAddressList),
          // "startTime": '',
          "endTime": fo.endTime + ":00",
          "add_goods_field1": this.proveValue,
          "add_goods_field2":this.cityValue,
          "add_goods_field3": this.areaValue,
          "soure_field4": fo.soure_field4,
          "phone": fo.phone,
          "contacts": fo.contacts,
          "negotiable": fo.supply_inventory == fo.selling_count ? 1 : 0 ,
          "type": Type,
          "supply_id":0,
          "supply_name": fo.supply_name,
          "counterpoise": fo.counterpoise
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
      this.getByType();
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
    },
    beforeRouteEnter (to, from, next) {
      if(from.name == "supplyAdmin"){
        localStorage.removeItem("selectAddresArray");
        next(vm=>{
          for(let k in vm.formData){
            if(k != 'logistics_type'){
              vm.formData[k] = '';
            }
          };
          vm.isShowTempOne = true;
          vm.shopCategoryValue = '';
          vm.shopClassifyValue = '';
        });
      }else{
        next();
      }
    }
  }

</script>
<style lang="scss">

</style>
