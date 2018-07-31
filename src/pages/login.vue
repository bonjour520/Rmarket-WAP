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
        <!--用户名-->
        <div class="userName">
          <input class="userIpt" type="text" placeholder="请输入手机号码或登录名" v-model="userIpt">
        </div>
        <!--密码-->
        <div class="pwd">
          <input type="password" class="pwdIpt" placeholder="请输入密码" v-model="pwdIpt">
        </div>
        <button class="loginBtn" :class="userIpt.trim() != '' && pwdIpt.trim() != '' ? 'active': ''" @click="login">登录</button>
        <router-link class="forget fl" to="/agreement">免费注册</router-link>
        <router-link class="forget" to="/forgetPassword">忘记密码</router-link>
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
        userIpt: '',
        pwdIpt: '',
      }
    },
    computed: {},
    methods: {
      login() {
        if (this.userIpt.trim() != '' && this.pwdIpt.trim() != '') {
          this.$api.post(this.$interface.apiurl.userLogin, {
            appid: this.$interface.$appid,
            loginKey: this.userIpt,
            loginPwd: CommomObj.$arsEncrypt(this.pwdIpt),
            type: 0
          }, res => {
            localStorage.setItem("$tokenKey",res.data.tokenKey);
            localStorage.setItem("$mainKey",res.data.mainKey);
            this.$store.dispatch("userSignin", res.data);
          })
        }
      }
    },
    mounted() {

    },
    activated() {

    }

  }

</script>
<style lang="scss">
  @import '@/base/login.scss';

</style>
