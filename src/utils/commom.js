import '../../static/js/layer.js';
import '../../static/js/jsencrypt.min.js'

var CommomObj = {
  pubkey: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCWcL4Gn57srgU8Z3+nG+2takey0q8LkI76lAtvoMJXC46HADIGg7qRrJQB1mBeL0TKYAnb/4SkXHiE/oCzu307gnhIc7WWOF+q8tc8qKySlR81qPo1S1Bq7eysvl+S3tcZcElQgOEX0sM0rhA1nQuA5p/s/L5IJZ6VeOMWNmErBwIDAQAB",
  loginUserName: /^(?![0-9]+$)[0-9A-Za-z]{5,25}|(?![0-9]+$)[0-9\u4e00-\u9fa5]{5,25}|(?![0-9]+$)[A-Za-z\u4e00-\u9fa5]{5,25}$/,//登录名
  regLoginPwd : /(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{6,20}$/, // 登录密码验证
  verifyNo : /^[0-9]*$/,             //纯数字验证
  verifyLetter : /^[A-Za-z]+$/,         //纯字母的验证
  verifyChines : /^[\u4E00-\u9FA5]$/,     //纯中文的验证
  delSpace: /\s+/g,           //空格的验证
  loadingIndex: null,
  // 加载中
  $loading: function() {
    this.loadingIndex = layer.open({
       type: 2
      ,content: 'Loading...'
      ,shadeClose: false
      ,shade: 'background-color: rgba(0,0,0,.5)' //自定义遮罩的透明度   
    });
    
  },
  // 提示
  $tips: function(text) {
    layer.open({
      content: text
      ,skin: 'msg'
      ,time: 2 //2秒后自动关闭
    });
  },
  // 消息框
  $alert: function (context,btntext){
    layer.open({
      shadeClose: false
      ,content: context
      ,btn: btntext
    });
  },
  // 消息警告框
  $alertWarn: function (context,conFun){
    layer.open({
      shadeClose: false
      ,content: context
      ,btn: "确定"
      ,yes: function(index){
        conFun();
        layer.close(index);
      }
    });
  },
  // 询问框
  $comfirm: function(context,conFun){
    layer.open({
      content: context
      ,shadeClose: false
      ,btn: ['确定', '取消']
      ,yes: function(index){
        conFun();
        layer.close(index);
      }
    });
  },
  // 询问框版本2
  $comfirm2: function(context,conFun){
    layer.open({
      content: context
      ,shadeClose: false
      ,btn: ['确定', '取消']
      ,yes: function(index){
        conFun();
        layer.close(index);
      }
      ,no: function(){
        window.history.back();
      }
    });
  },
  // 询问框版本3
  $comfirm3: function(context,conFun,conFun2){
    layer.open({
      content: context
      ,shadeClose: false
      ,btn: ['确定', '取消']
      ,yes: function(index){
        conFun();
        layer.close(index);
      }
      ,no: function(index){
        conFun2();
        layer.close(index);
      }
    });
  },
  $closelayer: function(){
    layer.closeAll();
  },
  // 字符串转utf-8
  str2UTF8:function(str){  
    var bytes = new Array();   
    var len,c;  
    len = str.length;  
    for(var i = 0; i < len; i++){  
        c = str.charCodeAt(i);  
        if(c >= 0x010000 && c <= 0x10FFFF){  
            bytes.push(((c >> 18) & 0x07) | 0xF0);  
            bytes.push(((c >> 12) & 0x3F) | 0x80);  
            bytes.push(((c >> 6) & 0x3F) | 0x80);  
            bytes.push((c & 0x3F) | 0x80);  
        }else if(c >= 0x000800 && c <= 0x00FFFF){  
            bytes.push(((c >> 12) & 0x0F) | 0xE0);  
            bytes.push(((c >> 6) & 0x3F) | 0x80);  
            bytes.push((c & 0x3F) | 0x80);  
        }else if(c >= 0x000080 && c <= 0x0007FF){  
            bytes.push(((c >> 6) & 0x1F) | 0xC0);  
            bytes.push((c & 0x3F) | 0x80);  
        }else{  
            bytes.push(c & 0xFF);  
        }  
    }
    return bytes;
  },
  // 密码加密
  $arsEncrypt: function(sRequestData){
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(CommomObj.pubkey);
    var str = '';
    var byteData = CommomObj.str2UTF8(sRequestData);
    if(byteData.length > 128) {
        var arr = Array();
        var arr1 = Array();
        for(var i = 0;i < sRequestData.length;i += 37){ //约定好的用37就算中文也不会超过长度
            arr.push(sRequestData.slice(i,i+37)); //slice比substring更好
        }
        for(var i in arr){
            arr1.push(encrypt.encrypt(arr[i]));
        }
        str = arr1.join(',');
    }else{
        str = encrypt.encrypt(sRequestData);
    }
    return str;
  }
  
}

export default CommomObj;