<template>
<div class="x-scroll purch bg-f7">
	<scroller lock-x height="-50px" style="background: #fff" ref="scrollerBottom">
		<div>
			<div class="col-list bg-f7" v-show="addressList.length > 0">
					<div class="item" v-for="(item, index) in addressList" :key="index">
						<div class="flex1">
							<h4>{{item.link_name}} <span class="fr">{{item.link_phone}}</span></h4>
							<p>{{item.province + item.city + item.area + item.add_field4}}</p>
							<div class="item-footer">
								<span @click="setDefault(item.address_id)">
									<i class="iconfont iconright" :class="item.is_defa == 1 ? 'icon-queren1' : 'icon-xuanze'"></i> {{item.is_defa == 1 ? "默认地址" : "设为默认"}}
								</span>
								<div class="tr flex1 cr-666">
									<span class="mr10" @click="editAddress(item.address_id)"><i class="iconfont icon-fabu"></i> 编辑</span>
									<span @click="delAddress(item.address_id)"><i class="iconfont icon-shanchu"></i> 删除</span>
								</div>
							</div>
						</div>
					</div>
			</div>
			<div class="purch-admin notMore" v-show="addressList.length == 0">
					<i class="iconfont icon-zizhishenhe"></i>
					<p>暂无地址~</p>
				</div>
		</div>
	</scroller>
	
	<router-link to="/setAddAddress" class="layout-flex flex-ai-c" style="position: fixed;bottom: 3px; width: 95%; left: 2.5%;">
			<button class="btn-default" 
			:class="addressList.length == 10 ? 'btn-light-main' : 'btn-main'"
			:disabled="addressList.length == 10 ? true : false">新增收货地址</button>
	</router-link>

</div>
</template>
<script>
import { mapState } from 'vuex';
import CommomObj from '../../utils/commom';
export default {
	data(){
		return {
			addressList:[]
		}
	},
	computed:{
		...mapState({
			loginState: 'loginState',
			storeInfo: 'storeInfo',
			userInfo: 'userInfo'
		})
	},
	methods:{
		// 获取地址
		getReceiveAddress(page,pagesize){
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				page:page,
				pagesize: pagesize
			}
			this.$api.post(this.$interface.apiurl.getReceiveAddress,params,res=>{
				this.addressList = res.data.data;
			})
		},
		// 设置默认地址
		setDefault(id){
			CommomObj.$loading();
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				addressId: id
			}
			this.$api.post(this.$interface.apiurl.editDefaultAddress,params,res=>{
				this.addressList.forEach(item => {
					item.is_defa = 0;
					if(item.address_id == id){
						item.is_defa = 1;
						layer.close(CommomObj.loadingIndex);
						return;
					}
				});
			})

		},
		// 修改地址
		editAddress(id){
			this.$router.push({path: '/setAddAddress', query: {"addressId": id}})
		},
		// 删除地址
		delAddress(id){
			let _this = this;
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				addressId: id
			}
			CommomObj.$comfirm("您确定要删除该地址吗？",function () {
				_this.$api.post(_this.$interface.apiurl.delReceiveAddress,params,res=>{
					_this.getReceiveAddress(1,10);
				})
			});
		},
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
		this.getReceiveAddress(1,10);
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0})
		})
	},
}
</script>

<style lang="scss" scoped>
.notMore{
	background-color: #fff;
}
</style>
