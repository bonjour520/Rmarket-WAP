<template>
  <div class="x-scroll global">
    <scroller lock-x style="background: #f7f7f7;"  ref="scrollerBottom">
      <section>
        <div class="purch-form">
          <group label-width="4.5em" label-margin-right="1em" label-align="right">          
              <x-input  type="number"  title="货品单价" class="vux-1px-b" v-model="formData.price" placeholder="请输入货品单价">
                <span slot="right">元</span>
              </x-input>
          </group>
          <group label-width="4.5em" label-margin-right="1em" label-align="right">          
              <x-input  type="number"  title="起售数量" class="vux-1px-b" v-model="formData.selling_count" placeholder="请输入起售数量">
                <span slot="right">{{purchaseDetail.unit}}</span>
              </x-input>
          </group>
          <group label-width="4.5em" label-margin-right="1em" label-align="right" v-if="purchaseDetail.class_name1 == '活畜'">          
              <x-input  type="number"  title="标准均重" class="vux-1px-b" v-model="formData.counterpoise" placeholder="请输入标准均重">
                <span slot="right">Kg</span>
              </x-input>
          </group>
          <group label-width="4.5em" label-margin-right="1em" label-align="right">          
              <x-input  type="number"  title="供应数量" class="vux-1px-b" v-model="formData.supply_number" placeholder="请输入供应数量">
                <span slot="right">{{purchaseDetail.unit}}</span>
              </x-input>
          </group>

          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="rmt20">          
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
              <x-input class="vux-1px-b" v-model="formData.address" placeholder="请输入详细地址"></x-input>
          </group>

          <group label-width="3.5em" label-margin-right="1em" label-align="right" class="rmt10">
            <x-textarea title="备注" :max="30" placeholder="请填写备注（最多输入30字）" v-model="formData.remarks"  :height="60" :rows="2" :cols="20"></x-textarea>
          </group>
          <group label-width="5em" label-margin-right="1em" label-align="right" class="vux-1px-b rmt20">
            <datetime title="报价有效期" 
              :start-date="StartTime" 
              :end-date="EndTime" 
              format="YYYY-MM-DD HH:mm"
              v-model="formData.effectiveTime"></datetime>
              <p class="f12 pb10 pl10 cr-lan">采购有效期截止：{{purchaseDetail.expiry_date}}</p>
          </group>
          <group label-width="4.5em" label-margin-right="1em" label-align="right" class="rmt20">
            <x-input title="联系人" v-model="formData.contacts" placeholder="请输入联系人" class="vux-1px-b"></x-input>
          </group>
          <group label-width="4.5em" label-margin-right="1em" label-align="right">
            <x-input  type="tel"  title="联系电话" v-model="formData.phone" placeholder="请输入联系电话" class="vux-1px-b"></x-input>
          </group>


          <box gap="0 10px">
            <x-button type="primary" class="rmt50" @click.native="submitFormData(0)">我要报价</x-button>
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
        purchaseID: '',
        purchaseDetail:{},
        // 表单数据
        formData:{
          phone: '',
          effectiveTime: '',
          price: '',
          selling_count: '',
          address: '',
          contacts: '',
          supply_number: '',
          remarks:'',
          purchase_id: '',
          counterpoise: '',
        },
        StartTime: '',
        EndTime: '',
        // 地址
        proveValue: '',
        cityValue: '',
        areaValue: '',
        provincesList: [],
        citysList: [],
        areasList: [],
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState',
        storeInfo: 'storeInfo'
      })
    },
    watch:{
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
      // 获取采购列表
      getPurchaseDetail(id) {
        let params = {
          purchase_id: id
        }
        this.$api.post(this.$interface.apiurl.getPurchaseDetail, params, res => {
          this.purchaseDetail = res.data;
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({
              top: 0
            })
          })
          
        }, err => {
          this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          this.purchaseDetail = {};
        })
      },
      // 提交表单
      submitFormData(){
        let fo = this.formData;
        if(fo.price == '' ){CommomObj.$tips("请输入单价");return;}else if(!(/^(d*.d{0,2}|d+).*$/.test(fo.univalent))){CommomObj.$tips("请输入正确的单价");return;}
        if(this.isFace){
          if(fo.supply_number == '' ){CommomObj.$tips("请输入供应数量");return;}else if(!(/(^\d{1,5}$)|(^\d{1,5}\.\d{1,4}$)/.test(fo.supply_number))){CommomObj.$tips("库存在0-99999之间");return;}
        }

        // 判断是否是活畜
        if("活畜" == this.purchaseDetail.class_name1){
          if(fo.counterpoise == '' ){CommomObj.$tips("请输入均重");return;}else if(!(/^(\d|[1-9]\d|[1-4]\d{2}|500)$/.test(fo.counterpoise))){CommomObj.$tips("均重在0-500之间");return;}
        }

        if(fo.selling_count == '' ){CommomObj.$tips("请输入起售数量");return;}else if(!(/(^\d{1,5}$)|(^\d{1,5}\.\d{1,4}$)/.test(fo.selling_count))){CommomObj.$tips("起售数量在0-99999之间");return;}
        if(fo.effectiveTime == '' ){CommomObj.$tips("请选择时间");return;}
        if(this.proveValue == '' || this.cityValue == '' || this.areaValue == '' || fo.soure_field4 == ''){CommomObj.$tips("请填写地址信息");return;}
        if(fo.contacts == '' ){CommomObj.$tips("请输入联系人");return;}else if(!(/[\u4E00-\u9FA5]/.test(fo.contacts))){CommomObj.$tips("请输入中文联系人");return;}
        if(fo.phone == '' ){CommomObj.$tips("请输入联系电话");return;}else if(fo.phone.length != 11){CommomObj.$tips("请输入正确的联系方式");return;}
      

        this.$vux.loading.show({text: "Loading..."});
        this.$api.post(this.$interface.apiurl.putQuotation,{
          "appid": this.$interface.$appid,
          "mainKey":localStorage.$mainKey,
          "tokenKey": localStorage.$tokenKey,
          "purchase_id": this.purchaseID,
          "price": fo.price,
          "selling_count": fo.selling_count,
          "supply_number": fo.supply_number,
          "area": this.areaValue,
          "address": fo.address,
          "remarks": fo.remarks,
          "effectiveTime": fo.effectiveTime + ":00" ,
          "contacts": fo.contacts,
          "phone": fo.phone,
          "counterpoise": fo.counterpoise
        },res=>{
          this.$vux.loading.hide();
          CommomObj.$tips("报价成功!")
          this.$router.go(-1);
        },err=>{
          this.$vux.loading.hide();
          CommomObj.$tips(err.msg);
        })
      }
      
    },
    mounted() {
      // 获取城市列表
      this.$getProvinces();
      // 获取当前年月日 进行加减
      const _Date = new Date();
      this.StartTime = (_Date.getFullYear() - 10) + '-01-01';
      this.EndTime = (_Date.getFullYear() + 10) + '-12-12';
    },
    activated() {
      this.purchaseID = this.$route.query.purchaseID;
      this.getPurchaseDetail(this.$route.query.purchaseID);
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
    },
    beforeRouteEnter (to, from, next) {
      if(from.name == "purchaseDetail"){
        next(vm=>{
          for(let k in vm.formData){
              vm.formData[k] = '';
          };
        });
      }else{
        next();
      }
    }
  }

</script>
<style lang="scss">

</style>
