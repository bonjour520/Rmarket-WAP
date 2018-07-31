<template>
	<div id="page" class="x-scroll">
			<!-- 地图容器 -->
			<div id="container" class="map" tabindex="0"></div>
			<!-- 搜索框-->
			<div id="searchBox">
					<input id="tipinput" type="input" placeholder="请输入关键字搜索" />
					<div id="clearSearchBtn">
							<div class="del">&#10005;</div>
					</div>
			</div>
			<!-- 结果面板 -->
			<div id="panel" class="hidden">
					<!-- 隐藏按钮 -->
					<a id="showHideBtn"></a>
					<div id="emptyTip">没有内容！</div>
					<!--搜索结果列表 -->
					<div id="poiList">
					</div>
			</div>
			<!-- loading -->
			<div id="loader"></div>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import CommomObj from '../../utils/commom';
import $ from 'jquery'
export default {
	data(){
		return {
			searchData:[],
			map: null
		}
	},
	computed:{
		...mapState({
			loginState: 'loginState',
			storeInfo: 'storeInfo',
			userInfo: 'userInfo'
		})
	},
	watch:{},
	methods:{
		ready() {
        //搜索框支持自动完成提示
        var auto = new AMap.Autocomplete({
            input: "tipinput"
        });
        //构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
            pageSize: 5,
            pageIndex: 1,
            map: this.map,
            panel: "poiList"
		});
        //监听搜索框的提示选中事件
        AMap.event.addListener(auto, "select", function(e) {
            //设置搜索的城市
            placeSearch.setCity(e.poi.adcode);
            //开始搜索对应的poi名称
            placeSearch.search(e.poi.name, function(status, results) {
                if (results.pois && results.pois.length > 0) {
                    $('#panel').toggleClass('empty');
                }
                //显示结果列表
                $('#panel').removeClass('hidden');
                //隐藏loading状态
                $(document.body).removeClass('searching');
            });
            //显示loading状态
            $(document.body).addClass('searching');
        });
        //检查结果列表是否为空， 为空时显示必要的提示，即#emptyTip
        function checkPoiList() {
            $('#panel').toggleClass('empty', !($.trim($('#poiList').html())));
        }
        checkPoiList();
        //监听搜索列表的渲染完成事件
        AMap.event.addListener(placeSearch, 'renderComplete', function() {
            checkPoiList();
        });
        //监听marker/列表的选中事件
        AMap.event.addListener(placeSearch, 'selectChanged', (results)=>{
            //获取当前选中的结果数据
            console.log(results.selected.data);
            localStorage.setItem("mapSelectAddress",JSON.stringify(results.selected.data));
            this.$router.go(-1);
        });
        $('#showHideBtn').click(function() {
            $('#panel').toggleClass('hidden');
        });
        $('#clearSearchBtn').click(function() {
            //清除搜索框内容
            $('#tipinput').val('');
            //清除结果列表
            placeSearch.clear();
            $('#panel').addClass('hidden');
            checkPoiList();
				});
		},
		 //解析定位结果
		onComplete(data) {
				var str=['定位成功'];
				str.push('经度：' + data.position.getLng());
				str.push('纬度：' + data.position.getLat());
				if(data.accuracy){
						str.push('精度：' + data.accuracy + ' 米');
				}//如为IP精确定位结果则没有精度信息
				str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
				// 保存定位信息（上面是说明）
                localStorage.setItem("mapLocationAddress",JSON.stringify(data));
		},
		//解析定位错误信息
		onError(data) {
				localStorage.setItem("mapLocationAddress",JSON.stringify(data));
		}
	},
	mounted(){
		var vm = this;
		if(!this.loginState){
			CommomObj.$alertWarn("警告！非法链接操作，请重新登陆！",function () {
					vm.$router.replace('/login');
			})
		}
	},
	activated(){
		var vm = this;
		
		//创建地图
    vm.map = new AMap.Map('container', {
        zoom: 9,
        resizeEnable: true				
		});
		
    //调用浏览器定位服务
		var geolocation = new AMap.Geolocation({
				enableHighAccuracy: true,//是否使用高精度定位，默认:true
				timeout: 10000,          //超过10秒后停止定位，默认：无穷大
				buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				buttonPosition:'RB'
		});
		vm.map.addControl(geolocation);
		geolocation.getCurrentPosition();
		AMap.event.addListener(geolocation, 'complete', vm.onComplete);//返回定位信息
		AMap.event.addListener(geolocation, 'error', vm.onError);//返回定位出错信息

    //加载PlaceSearch和Autocomplete插件
    AMap.service(["AMap.PlaceSearch", "AMap.Autocomplete", 'AMap.Geolocation'], function() {
        try {
            vm.ready();
        } catch (e) {
            console.error(e);
        }
    });
	},
	
}
</script>

<style lang="scss">
 #page {
     width: 100%;
     height: 100%;
     position: fixed;
     display: -webkit-flex;
     -webkit-flex-direction: column;
     overflow: hidden;
 }
 #container {
     -webkit-flex: 1;
 }
 #panel {
		 height: 43%;
     -webkit-flex: 0 0 auto;
     overflow: visible;
     border-top: 1px solid #ccc;
     position: fixed;
		 z-index: 999;
		 bottom: 0;
		 width: 100%;
     -webkit-transition: all 0.2s;
 }
 #showHideBtn {
     display: block;
     position: absolute;
     width: 63px;
     height: 32px;
     text-align: center;
     margin: 0 auto;
     left: 0;
     right: 0;
     top: -25px;
 }
 
 #showHideBtn:after,
 #showHideBtn:before {
     content: "";
     width: 0;
     height: 0;
     position: absolute;
     left: 0;
     right: 0;
     margin: auto;
     cursor: pointer;
 }
 
 #showHideBtn:before {
     width: 60px;
     height: 30px;
     background: rgba(255, 255, 255, 0.9);
     top: 0;
     border-radius: 30px 30px 0 0;
     border: 1px solid #ccc;
     border-bottom: 0;
 }
 
 #showHideBtn:after {
     content: "";
     top: 7px;
     border: 10px solid rgba(255, 0, 0, 0);
     z-index: 99999;
     border-top-color: #ccc;
     /* -webkit-transition: all 0.2s;*/
 }
 
 #poiList {
     -webkit-overflow-scrolling: touch;
     width: 100%;
     height: 100%;
     overflow: scroll;
     position: relative;
     background: #fff;
	.amap_lib_placeSearch {
			border: none;
	}
	
 }
 
 #panel.hidden {
     height: 0;
     bottom: 0;
 }
 
 #panel.hidden #showHideBtn:after {
     /*  -webkit-transform: rotate(180deg);
    -webkit-transform-origin: 50% 4px;*/
     top: -5px;
     border-bottom-color: #ccc;
     border-top-color: transparent;
 }
 
 #panel .amap_lib_placeSearch .pageLink {
     font-size: 120%;
     margin: 0 3px;
 }
 
 #searchBox {
     position: fixed;
     width: 90%;
     margin: 0 auto;
     left: 0;
     right: 0;
     z-index: 999;
     top: 15px;
     height: 30px;
 }
 
 #tipinput {
     width: 100%;
     height: 30px;
     border: 1px solid #ccc;
     border-radius: 5px;
     font-size: 16px;
     line-height: 30px;
     padding: 0 7px;
     box-sizing: border-box;
 }
 
 #clearSearchBtn {
     position: absolute;
     right: 0;
     top: 6px;
     margin: auto;
     width: 20px;
     height: 20px;
     padding: 5px;
     text-align: center;
     vertical-align: middle;
     font-size: 14px;
     color: #999;
 }
 
 #clearSearchBtn .del {
     background: #eee;
     border-radius: 12px;
     width: 100%;
		 height: 100%;
 }
 
 #page.searching #clearSearchBtn {
     display: none;
 }
 
 #loader {
     position: absolute;
     left: 50%;
     top: 50%;
     z-index: 1;
     margin: -75px 0 0 -75px;
     border: 16px solid #eee;
     border-radius: 50%;
     border-top: 16px solid #0b83ea;
     width: 120px;
     height: 120px;
     -webkit-animation: spin 2s linear infinite;
     animation: spin 2s linear infinite;
     display: none;
 }
 
 @-webkit-keyframes spin {
     0% {
         -webkit-transform: rotate(0deg);
     }
     100% {
         -webkit-transform: rotate(360deg);
     }
 }
 
 @keyframes spin {
     0% {
         transform: rotate(0deg);
     }
     100% {
         transform: rotate(360deg);
     }
 }
 
 .searching #loader {
     display: block;
 }
 
 .searching #page {
     filter: grayscale(1);
     opacity: 0.5;
 }
 
 #panel.empty #showHideBtn {
     opacity: 0.5;
 }
 
 #emptyTip {
     display: none;
 }
 
 #panel.empty #emptyTip {
     display: block;
     position: relative;
     background: #fff;
     width: 100%;
     text-align: center;
     padding: 30px 0;
     color: #666;
 }

 .poi-more{
    display: none!important;
 }

</style>
