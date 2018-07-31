<template>
  <div class="login">
    <section>
      <div class="logoBox">
        <img class="logo" src="../../static/imgs/login/logo.png" alt="">
        <p class="welcome">欢迎来到润民网</p>
      </div>
    </section>
    <main>
      <div class="ipts">
        <!--第一步-->
        <div class="userName" v-show="showStep1">
          <input class="userIpt" v-model="submitFrom.phone" type="text" placeholder="请输入手机号码或登录名">
          <button type="button" class="step1Btn" :class="submitFrom.phone == '' ? '' : 'active'"  @click="validateStepOne">下一步</button>
        </div>
        <!--第二步-->
        <div class="step2" v-show="showStep2">
          <p class="step2P">验证码已发送至捆绑手机：{{submitFrom.phone}}
            <span class="phoneNo"></span>
          </p>
          <div style="position: relative;">
            <input class="step2picIpt" type="text" v-model="submitFrom.imgCode" placeholder="请输入图形验证码">
            <img class="getImgCode" :src="'data:image/jpg;base64,'+ imgCode.url" alt="" @click="getImgCode">
          </div>
          <div class="layout-flex" style="position: relative;">
            <input class="step2Ipt" type="text"  v-model="submitFrom.smsCode" placeholder="请输入验证码">
            <input class="getPhoneCode" type="button" :value="smsText" :class="isAbled ? '' : 'active'"  :disabled="isAbled"  @click="checkImgCode">
          </div> 
          <button class="step2Btn" :class="submitFrom.imgCode != '' &&  submitFrom.smsCode != '' ? 'active': ''" type="button" @click="validateStepTwo" >下一步</button>
        </div>
        <!--第三步-->
        <div class="step3" v-show="showStep3">
          <div class="pwd">
            <input class="pwdIpt" type="password" v-model="submitFrom.pwd" placeholder="请输入新的密码" maxlength="20">
            <div class="warn1" v-show="warnText1 != ''">
              <img src="../../static/imgs/forgetPwd/warn.png" alt="">
              <p class="warn1Pwd">{{warnText1}}</p>
            </div>
          </div>
          <div class="rePwd">
            <input class="rePwdIpt" type="password" v-model="submitFrom.rePwd" placeholder="请再次输入新密码" maxlength="20">
            <div class="warn2" v-show="warnText2 != ''">
              <img src="../../static/imgs/forgetPwd/warn.png" alt="">
              <p class="warn2Pwd">{{warnText2}}</p>
            </div>
          </div>
          <button class="step3Btn" type="button" :class="submitFrom.pwd != '' &&  submitFrom.rePwd != ''" :disabled="submitFrom.pwd != '' &&  submitFrom.rePwd != '' ? false : true"  @click="submitFromPassword">确定</button>
        </div>
      </div>
    </main>
    <footer>
      <p>客服热线：
        <span>400-107-1988</span>
      </p>
    </footer>
  </div>
</template>
<script>
  import CommomObj from '../utils/commom.js';
  export default {
    data() {
      return {
       showStep1: true,
       showStep2: false,
       showStep3: false,
       imgCode:{
         id:'',
         url: '',
       },
       submitFrom:{
         phone: '',
         imgCode: '',
         smsCode: '',
         pwd: '',
         rePwd: '',
       },
       isAbled: true,
       smsText: '获取验证码',
       warnText1: '',
       warnText2: '',
      }
    },
    watch:{
      "submitFrom.imgCode": {
        handler(newValue, oldValue) {
          if(newValue == '' ){
            this.isAbled = true;
          }else{
            this.isAbled = false;
          }
      　},deep: true
    　},
      "submitFrom.pwd": {
        handler(newValue, oldValue) {
          if(!CommomObj.regLoginPwd.test(newValue)){
            if(CommomObj.verifyNo.test(newValue)){
                this.warnText1 = "密码不能为纯数字";
            }else if(CommomObj.verifyLetter.test(newValue)){
              this.warnText1 = "密码不能为纯字母";
            }else if(CommomObj.delSpace.test(newValue)){
              this.warnText1 = "密码不能有空格";
            }else{
              this.warnText1 = "6-20为字符，由英文字母、数字、中文组成、纯数字除外";
            }
          }else{
            this.warnText1 = "";
          }
      　},deep: true
    　},
      "submitFrom.rePwd": {
        handler(newValue, oldValue) {
          if(!CommomObj.regLoginPwd.test(newValue)){
            if(CommomObj.verifyNo.test(newValue)){
                this.warnText1 = "密码不能为纯数字";
            }else if(CommomObj.verifyLetter.test(newValue)){
              this.warnText1 = "密码不能为纯字母";
            }else if(CommomObj.delSpace.test(newValue)){
              this.warnText1 = "密码不能有空格";
            }else{
              this.warnText1 = "6-20为字符，由英文字母、数字、中文组成、纯数字除外";
            }
          }else{
            if(this.submitFrom.pwd != newValue){
              this.warnText1 = "两次密码不一致,请重新输入!";
            }else{
              this.warnText1 = "";
            }
          }
      　},deep: true
    　},
    },
    computed: {},
    methods: {
      // 验证第一步
      validateStepOne(){
        if(this.submitFrom.phone.length == 11){
          CommomObj.$loading();
            this.$api.post(this.$interface.apiurl.getUserIsPart, {
              appid: this.$interface.$appid,
              loginKey: this.submitFrom.phone,
            }, res => {
              this.showStep1 = false;
              this.showStep2 = true;
              this.getImgCode();
              CommomObj.$closelayer();
            })
        }
      },
      // 获取图形验证码
      getImgCode(){
        this.$api.post(this.$interface.apiurl.getImgCodeBase64, null, res => {
          this.imgCode.id = res.data.validateCodeId;
          this.imgCode.url = res.data.buffImgBase64;
        })
      },
      // 检查图形验证码是否正确并发送短信
      checkImgCode(){
        this.$api.post(this.$interface.apiurl.checkImgCode, {
          validateCodeId: this.imgCode.id,
          validateCode: this.submitFrom.imgCode,
        }, res => {
            this.$getSmsCode(this.submitFrom.phone,this.imgCode.id,this.submitFrom.imgCode,3,0,res=>{ 
              if(res.code == 0){
                this.isAbled = true;
                CommomObj.$tips("发送成功，请注意查收!");
                let i = 60;
                this.smsText = i + 'S';
                const timer = setInterval(()=>{
                  i--;
                  if(i<0){
                    this.isAbled = false;
                    this.smsText = "重新发送";
                    clearInterval(timer);
                  }else{
                    this.smsText = i + 'S';
                  } 
                },1000)
              }else{
                this.getImgCode();
              }
            });
        },err=>{
            CommomObj.$tips(err.msg);
            setTimeout(()=>{
              this.getImgCode();
            },600);
        })
      },
      // 验证第二步
      validateStepTwo(){
        this.$api.post(this.$interface.apiurl.checkSmsCode, {
          PhoneOrEmail: this.submitFrom.phone,
          code: this.submitFrom.smsCode,
          codeType: 2,
          type: 0
        }, res => {
          this.showStep2 = false;
          this.showStep3 = true;
        })
      },
      submitFromPassword() {
        CommomObj.$loading();
        this.$api.post(this.$interface.apiurl.findPassWord, {
          appid: this.$interface.$appid,
          loginKey: this.submitFrom.phone,
          loginPwd: CommomObj.$arsEncrypt(this.submitFrom.pwd),
          reLoginPwd: CommomObj.$arsEncrypt(this.submitFrom.rePwd),
          phoneCode: this.submitFrom.smsCode,
          validateCodeId: this.imgCode.id,
          validateCode: this.submitFrom.imgCode,
          type: 0
        }, res => {
          CommomObj.$tips("密码修改成功,即将跳转到登录界面!");
          localStorage.clear();
          this.$route.push({path: '/login'});
        })
      }
    },
    mounted() {

    },
    activated() {

    }

  }

</script>
<style lang="scss">
  @import '@/base/forgetPwd.scss';

</style>
