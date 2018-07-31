<template>
<div class="bg-f7 js-eliHeight x-scroll applyPage">
  <scroller lock-x style="background: #f7f7f7" ref="scrollerBottom">
    <div>
      <div class="top">
        <div class="price">￥<span class="number">{{ Number.parseFloat(amount).toFixed(2) }}</span></div>
        <div>需补差价</div>
      </div>
      <div class="middle">
        <group>
            <x-input title="申诉类型" :placeholder="appealTitle" disabled></x-input>
            <x-input type="number" title="超出重量（KG）" v-model.number="weight" placeholder="" :min="1" :max="8"></x-input>
            <x-input title="备注" v-model.trim="remark" placeholder="" :max="50"></x-input>
        </group>
        <group>
            <div class="voucher">
              <div>凭证</div>
              <div class="z_photo">
                <div class="z_file" v-show="imgArr.length<3">
                    <input type="file" name="file" id="file" accept="image/*" multiple  @change="imgChange()"/>
                </div>
                <div class="z_addImg" v-for="(item, index) in imgArr" :key="index" v-if="imgArr.length>0">
                  <img :src="item" @click="showImg(index)" class="voucher-img">
                  <icon type="clear" class="btn-del" @click.native="delAction(index)"></icon>
                  <div v-transfer-dom>
                      <previewer :list="lists" ref="previewer"></previewer>
                 </div>
                </div>
            
            </div>
            </div>
        </group>
        <group>
            <div class="tip">注：每订单仅限申诉一次，如申诉失败最多可重新提交3次，如申诉成功，差价将退回您的账户余额</div>
        </group>
        
      </div>
    </div>
  </scroller>
  <div class="layout-flex" style="position: fixed;bottom: 0; width: 100%;">
			<button class="btn-default btn-main" style="border-radius: 0;" @click="applyAction('sell')">提交</button>
	</div>
</div>
</template>
<script>
import CommomObj from '../../utils/commom';
import { Icon,Previewer, TransferDom } from 'vux'
export default {
  data() {
    return {
      orderSn:"",
      userType:"",
      orderType:"",
      amount:0.00,
      weight:"",
      remark:"",
      imgArr:[],
      appealTitle:"",
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.voucher-img')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      },
      lists:[]
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Icon,
    Previewer
  },
  methods: {
    // 上传图片
    imgChange(){
        var self = this
        let file = document.getElementById('file').files[0];
        let param = new FormData()  // 创建form对象
        param.append('file', file, file.name)  // 通过append向form对象添加数据
        param.append('chunk', '0') // 添加form表单中其他数据
        
        self.$vux.loading.show({text: "上传中..."});
        self.$api.post(self.$interface.apiurl.uploadImgV2_8, param,res => {
          self.imgArr.push(res.data.relativeUrl);
          self.lists.push({src:res.data.relativeUrl});
          self.$vux.loading.hide();
        },err=>{
          CommomObj.$tips(err.msg)
          self.$vux.loading.hide();

        })
    },
    // 删除
    delAction(idx) {
        let self = this;
        CommomObj.$comfirm("是否删除图片?",function () {
          self.imgArr.splice(idx,1);
          self.lists.splice(idx,1);
        })
    },
    applyAction() {  //提交申诉
      if(!this.weight){
        CommomObj.$tips('请填写超出重量');
        return;
      }
      if(this.imgArr.length==0){
        CommomObj.$tips('请至少上传1张凭证');
        return;
      }
      let params = {
        appid: this.$interface.$appid,
        mainKey: localStorage.$mainKey,
        tokenKey: localStorage.$tokenKey,
        orderSn: this.orderSn, 
        amount: this.amount,
        fromUserTypeCode:this.userType,
        orderTypeCode:this.orderType,
        imgs:this.imgArr,
        remark:this.remark,
        weight:this.weight
      };
      
      this.$api.post(
        this.$interface.apiurl.appealApply,
        params,
        res => {
          this.$vux.loading.hide();
          if(res.code==0){
            CommomObj.$tips("提交成功!");
            setTimeout(()=>{
              this.$router.go(-1);
            },300)
          }
        },
        err => {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: err.message,
            type: "text",
            width: "180px"
          });
        }
      );
    },
    showImg (index) {
      this.$refs.previewer[0].show(index);
    },
    getPrice() {
      //获取差价
      let params = {
        appid: this.$interface.$appid,
        mainKey: localStorage.$mainKey,
        tokenKey: localStorage.$tokenKey,
        orderSn: this.orderSn, 
        type:this.orderType,
        weight:this.weight
      }
      this.$api.get(
        this.$interface.apiurl.getDifference,
        params,
        res => {
          this.$vux.loading.hide();
          this.amount = res.data.counterpoise;
        },
        err => {
          this.$vux.loading.hide();
          this.amount = 0.00;
        }
      );
    }
    
  },
  watch:{
    weight() {
      this.getPrice();
    }
  },
  activated() {
    this.orderSn = this.$route.query.orderSn;
    this.userType = this.$route.query.userType;
    this.orderType = this.$route.query.orderType;
    if(this.userType=='sell'){
      this.appealTitle = '交易申请补差价';
    } else{
      this.appealTitle = '交易申请退差价';
    }
    
  }
};
</script>
<style lang="scss">
@import '@/base/reset.scss';
.applyPage{
  .top{
    height: rem(174);
    background-color: #EEB31A;
    text-align: center;
    color: #fff;
    font-size: rem(28);
    .price{
      padding-top: rem(20);
      .number{
        font-size: rem(48);
      }
    }
  }
  .weui-label,.weui-input{
    font-size: rem(28);
  }
  .voucher{
    font-size: rem(28);
    padding: rem(30);
    .z_file{
      width: rem(130);
      margin: 4px .2rem 4px 0;
     // height: rem(168);
      background: url(../../../static/imgs/appeal/voucher.png) no-repeat;
      background-size: 100% 100%;
    }
    .z_photo{
      margin: rem(30) 0;
    }
    .z_addImg{
      position: relative;
      padding: 4px;
    }
    .z_addImg .btn-del{
      position: absolute;
      top:0;
      right: 2px;
    }
    .z_photo img {
      width: rem(160);
      //height: rem(168);
      margin-right: .2rem;
    }
  }
  .tip{
    font-size: rem(24);
    color:#F5A623;
    padding: rem(30)
  }
}
</style>
