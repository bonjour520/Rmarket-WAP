exports.install = function (Vue, options) {
  
  // 路由地址跳转
  Vue.prototype.$goRoterPage = function (path) {
    this.$router.push({
      path: "/" + path
    });
  };
  // 返回顶部
  Vue.prototype.$backTop = function () {
    let back = setInterval(() => {
      if (document.body.scrollTop || document.documentElement.scrollTop) {
        document.body.scrollTop -= 100;
        document.documentElement.scrollTop -= 100;
      } else {
        clearInterval(back)
      }
    });
  }
  // 获取一个地址的相对路径
  Vue.prototype.$getUrlRelativePath = function (url) {
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符
    if (relUrl.indexOf("?") != -1) {
      relUrl = relUrl.split("?")[0];
    }
    return relUrl;
  };

  //时间戳间隔转小时&分钟 stamp是时间戳
  Vue.prototype.$stampToTime = function (stamp) {
    if (!stamp) return '';
    var time = parseInt(stamp/1000);
    //除1000是转成秒
    var d = parseInt(time / (24*3600));
    var h = parseInt(time % (24*3600) / 3600);
    var m = parseInt(time % (24*3600) % 3600 / 60);
    var s = parseInt(time % (24*3600) % 3600 % 60);
    if(d > 0) {
        return d + '天';
    }else if(h > 0){
        return h + '小时';
    }else if(m > 0){
        return m + '分钟';
    }else if(s > 0){
        return s + '秒';
    }
  };

  // 时间戳转时间 格式 2018:01:01 00:02:32
  Vue.prototype.$timestampToTime = function (timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      Y = date.getFullYear() + '-';
      M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      D = (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()) + ' ';
      h = (date.getHours() < 10 ? '0'+ date.getHours() : date.getHours()) + ':';
      m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':';
      s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y+M+D+h+m+s;
  }
  // 获取用户信息
  Vue.prototype.$getMyInfo = function(){  
    this.$api.post(this.$interface.apiurl.getMyInfo, {
      appid: this.$interface.$appid,
      mainKey: localStorage.$mainKey,
      tokenKey: localStorage.$tokenKey,
    }, res => {
      this.$nextTick(()=>{
        this.myInfo = res.data;
      })     
    })
  }
  // 获取个人信息
  Vue.prototype.$getUserInfo = function(){  
    this.$api.post(this.$interface.apiurl.getUserInfo, {
      appid: this.$interface.$appid,
      mainKey: localStorage.$mainKey,
      tokenKey: localStorage.$tokenKey,
    }, res => {
      this.$store.commit("userSignin",res.data);       
    })
  }
  // 获取商户信息
  Vue.prototype.$getStoreInfo = function(){  
    this.$api.post(this.$interface.apiurl.getStoreInfo, {
      appid: this.$interface.$appid,
      mainKey: localStorage.$mainKey,
      tokenKey: localStorage.$tokenKey,
    }, res => {
      this.$store.commit("saveStoreInfo",res.data);
    })
  }
  // 获取省市列表
  Vue.prototype.$getProvinces = function(){  
    this.$api.post(this.$interface.apiurl.getProvinces, {
      appid: this.$interface.$appid,
    }, res => {this.provincesList = res.data;})
  }
  // 获取城市列表
  Vue.prototype.$getCitys = function(provkey){  
    this.$api.post(this.$interface.apiurl.getCitys, {
      appid: this.$interface.$appid,
      provinceid: provkey
    }, res => {
      this.$nextTick(()=>{
        this.citysList = res.data;
      })
    })
  }
  // 获取省区列表
  Vue.prototype.$getAreas = function(citykey){  
    this.$api.post(this.$interface.apiurl.getAreas, {
      appid: this.$interface.$appid,
      cityid: citykey
    }, res => {
      this.$nextTick(()=>{      
        this.areasList = res.data;
      })
    })
  }
  
  // 发送短信验证码
  Vue.prototype.$getSmsCode = function(phone,codeid,code,codetype,type,rb){
    let noop = ()=>{};    
    this.$api.post(this.$interface.apiurl.getSmsCode, {
      phone: phone,
      validateCodeId: codeid,
      validateCode: code,
      codeType: codetype,
      type: type
    }, res => {
       (rb || noop)(res);
    })
  }
  // 检查图形验证码
  Vue.prototype.$checkImgCode = function(id,code,rb){
    let noop = ()=>{};
    this.$api.post(this.$interface.apiurl.checkImgCode, {
      validateCodeId: id,
      validateCode: code,
    }, res => {
      if(0 == res.code){
        (rb || noop)(true);
      }else{
        (rb || noop)(false)
      }
    })
  }
 
};
