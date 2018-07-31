<template>
  <div class="x-scroll offline">
    <scroller lock-x height="-50px" style="background: #f2f2f2;" ref="scrollerBottom">
      <section class="bg-f7 global">
        <group label-width="5em" label-margin-right="1em" label-align="right" class="rmt20">
          <x-input title="打款户名 <sup class='cr-pink'>*</sup>" v-model="form.name" placeholder="请输入转账账户名称" class="vux-1px-b"></x-input>
          <selector title="打款银行 <sup class='cr-pink'>*</sup>" :options="bankList" placeholder="请输入转账账户名称" :value-map="['id','bank_name']" direction="rtl" class="vux-1px-b pl10" v-model="form.bank"></selector>
          <x-input title="打款金额 <sup class='cr-pink'>*</sup>" type="number" v-model="form.money" placeholder="请输入打款金额（元）" class="vux-1px-b"></x-input>
          <datetime title="打款时间 <sup class='cr-pink'>*</sup>" 
            :start-date="StartTime" 
            :end-date="EndTime" 
            format="YYYY-MM-DD HH:mm"
            class="vux-1px-b"
            placeholder="请选择打款时间"
            v-model="form.time">
            </datetime>
            <cell style="padding-left: 5px">
              <span slot="title">打款凭证<sup class='cr-pink' slot="title">*</sup></span>
            </cell>
            <box gap="20px" class="">
              <div class="upload-box" v-if="imgArr.length > 0">
                <div class="img-item" v-for="(item, index) in imgArr" :key="index" >
                  <img :src="item.src" alt="" 
                    @click="showImg(index)"
                    @touchstart="showDeleteButton(index)" 
                    @touchend="clearLoop(index)">
                </div>
              </div>
              <div class="upload-btn" v-if="imgArr.length != 1">
                <img src="../../../static/imgs/offline/upbtn@2x.png" alt="">
                <input type="file" name="file" id="file" accept="image/*" multiple @change="imgChange();" />
                <p class="tips">请上传打款凭证（汇款回执单/汇款流水单号）<span style="display:block" class="rpt10">PS：长按图片删除,点击查看大图</span></p>
              </div>
            </box>
        </group>
      </section>
    </scroller>
    <flexbox class="foot-bar">
      <flexbox-item>
        <div class="btn" @click="submintForm">确定</div>
      </flexbox-item>
    </flexbox>
    <!-- 图片浏览 -->
    <previewer :list="imgArr" ref="previewer"></previewer>
  </div>
</template>
<script>
  import { mapState} from 'vuex';
  import CommomObj from '../../utils/commom';
  export default {
    data() {
      return {
        bankList: [],
        form:{
          name:'',
          bank: '',
          money: '',
          time:'',
        },
        imgArr: [],
        StartTime: '',
        EndTime: '',
        Loop: null,
      }
    },
    computed: {
      ...mapState({
        loginState: 'loginState'
      })
    },
    methods: {
      // 获取银行地址
      getBankList(){
        this.$api.post(this.$interface.apiurl.getBankList,{
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
        },res=>{
          this.bankList = res.data;
        },err=>{})
      },
      // 上传图片
      imgChange(){
        var self = this
        let file = document.getElementById("file").files[0];
        let param = new FormData()  // 创建form对象
        param.append('file', file, file.name)  // 通过append向form对象添加数据
        param.append('chunk', '0') // 添加form表单中其他数据
        self.$vux.loading.show({text: "上传中..."});
        self.$api.post(self.$interface.apiurl.uploadImgV2_8,param,res=>{
          let obj = {
            src: res.data.relativeUrl
          }
          self.imgArr.push(obj);
          self.$vux.loading.hide();
        },err=>{
          CommomObj.$tips(err.msg)
          self.$vux.loading.hide();
        })
      },
      // 显示图片
      showImg(index){
        this.$refs.previewer.show(index);
      },
      showDeleteButton(index){
        clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
        this.Loop = setTimeout(function() {
          CommomObj.$comfirm("是否要删除该图片？",function () {
            this.imgArr.splice(index,1);
          }.bind(this))
        }.bind(this), 1000);
      },
      clearLoop(e) {
        clearInterval(this.Loop);
      },
      // 获取订单信息
      getOfferInfo(id,qid) {
        let params = {
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          id: id,
          qid: qid,
          type: 1
        }
        this.$api.post(this.$interface.apiurl.offerInfo, params, res => {
          this.orderData = res.data[0];
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
          })
          if(this.$route.query.type == 0){
            this.IndexAddress = res.data[1];
          }
        }, err => {
          this.$vux.toast.show({text: err.msg,type: 'text',width: '180px'});
          this.orderData = {};
        })
      },
      submintForm(){
        if(this.form.name == ''){CommomObj.$tips("请输入打款户名");return}
        if(this.form.bank == ''){CommomObj.$tips("请选择打款银行");return}
        if(this.form.money == ''){CommomObj.$tips("请输入打款金额");return}
        if(this.form.time == ''){CommomObj.$tips("请输入打款时间");return}
        if(this.imgArr.length == 0){CommomObj.$tips("请上传打印凭证");return}
        this.$vux.loading.show({text: "Loading..."});
        
        let fo = this.form;
        fo.imgArr = this.imgArr;
        for (const key in this.bankList) {
          if (this.bankList[key].id == this.form.bank) {
            fo.bankName = this.bankList[key].bank_name;
          }
        }
        setTimeout(() => {
          let objArr = [];
          if(this.$route.query.type == "add"){ // 增加保存
            fo.id = (new Date()).valueOf();
            if(localStorage.offlineVoucherList){
              objArr = JSON.parse(localStorage.offlineVoucherList);
              objArr.push(fo);
            }else{
              objArr.push(fo);
            }
            localStorage.setItem("offlineVoucherList",JSON.stringify(objArr));
          }else{ // 修改保存
            let obj = JSON.parse(localStorage.offlineVoucherList);
            for (let i = 0; i < obj.length; i++) {
              if(obj[i].id == this.$route.query.id){
                obj[i].name = fo.name;
                obj[i].bank = fo.bank;
                obj[i].time = fo.time;
                obj[i].bankName = fo.bankName;
                obj[i].money = fo.money;
                obj[i].imgArr = this.imgArr;
              }
            }
            localStorage.setItem("offlineVoucherList",JSON.stringify(obj));
          }
          this.$vux.loading.hide();
          this.$router.go(-1);
        }, 1000);
      },
    },
    mounted() {},
    activated() {
      this.getBankList();
       // 获取当前年月日 进行加减
      const _Date = new Date();
      this.StartTime = (_Date.getFullYear() - 10) + '-01-01';
      this.EndTime = (_Date.getFullYear() + 10) + '-12-12';
      if(this.$route.query.type === "add"){ // 添加
        for(let k in this.form){
          this.form[k] = '';
        };
        this.imgArr = [];
      }else if(this.$route.query.type === "edit"){ // 修改
        let obj = JSON.parse(localStorage.offlineVoucherList);
        for (let i = 0; i < obj.length; i++) {
          if(obj[i].id == this.$route.query.id){
            for(let k in this.form) {
              this.form[k] = obj[i][k];
            };
            this.imgArr = obj[i].imgArr;
          }
        }
      }
    }
  }

</script>
<style lang="scss"></style>
