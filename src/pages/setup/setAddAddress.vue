<template>
<div class="x-scroll purch">
	<scroller lock-x height="-50px" style="background: #fff" ref="scrollerBottom">
		<div class="bg-f7">
			<div class="purch-form">
				<div class="form-group border_btm1">
					<label for="colName">收货人</label>
					<input type="text" v-model="addressForm.name" placeholder="请输入收货人姓名">
				</div>
				<div class="form-group border_btm1">
					<label for="colNamePhone">联系电话</label>
					<input type="text" v-model="addressForm.phone" placeholder="请输入联系人电话">
				</div>
				<div class="form-group border_btm1" style="flex-wrap: nowrap;">
					<label for="shopAddrs">所在地区</label>
					<input type="text" placeholder="请选择收货地址" @click="$router.push('/mapSelectAdrss')">
					<img src="../../../static/imgs/iconleft.png" alt="">
					<!-- <select name="shopAddrs" v-model="addressForm.provide" style="width: 20%;">
						<option value="0">请选择省</option>
						<option :value="item.provinceid" v-for="(item, index) in provincesList" :key="index">{{item.province}}</option>
					</select>
					<select name="shopAddrs" v-model="addressForm.city" style="width: 20%;">
						<option value="0">请选择市</option>
						<option :value="item.cityid" v-for="(item, index) in citysList" :key="index">{{item.city}}</option>
					</select>
					<select name="shopAddrs" v-model="addressForm.area" style="width: 20%;">
						<option value="0">请选择区</option>
						<option :value="item.areaid" v-for="(item, index) in areasList" :key="index">{{item.area}}</option>
					</select> -->
				</div>
				<div class="form-group border_btm1" style="align-items: flex-start;">
					<label for="colAddrsInfo">所在地区</label>
					<textarea class="flex1 mt10 border_no" style="font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;" v-model="addressForm.desInfo" placeholder="请输入详细的地址信息，如道路、门牌号、小区、楼栋号、单元室等"></textarea>
				</div>
				<div class="form-group layout-flex flex-jc-sb " style="align-items: flex-start;">
					<div class="indexAddress">
						<h3>设为默认地址</h3>
						<p>注：每次下单时会默认使用默认地址</p>
					</div>
					<div class="form-switch on" v-if="switchOn" @click="switchOn = false">
						<em>ON</em>
						<i></i>
					</div>
					<div class="form-switch" v-else  @click="switchOn = true">
						<em>OFF</em>
						<i></i>
					</div>
				</div>
				<div class="layout-flex flex-ai-c mt20" style="width: 95%; margin: 0 auto;">
					<button class="btn-default" 
						@click.prevent="addReceiveAddress"
						:class="addressForm.name == '' || addressForm.phone == '' || addressForm.provide == 0 || addressForm.city == 0 || addressForm.area == 0 || addressForm.desInfo == ''  ? 'btn-light-main' : 'btn-main'"
						:disabled="addressForm.name == '' || addressForm.phone == '' || addressForm.provide == 0 || addressForm.city == 0 || addressForm.area == 0 || addressForm.desInfo == ''  ? true : false"
					>{{btnText}}</button>
				</div>
			</div>
		</div>
	</scroller>

</div>
</template>
<script>
import { mapState } from 'vuex';
import CommomObj from '../../utils/commom';
export default {
	data(){
		return {
			addressList:[],
			addressForm: {
				name: '',
				phone: '',
				provide: 0,
				city: 0,
				area: 0,
				desInfo: '',
			},
			provincesList:[],
			citysList:[],
			areasList:[],
			switchOn: true,
			btnText: '新增收货地址',
		}
	},
	computed:{
		...mapState({
			loginState: 'loginState',
			storeInfo: 'storeInfo',
			userInfo: 'userInfo'
		})
	},
	watch:{
		"addressForm.provide": {
			handler(newValue, oldValue) {
				if(newValue != 0){
					this.$getCitys(newValue)
				}
		　},deep: true
	　},
		"addressForm.city": {
			handler(newValue, oldValue) {
				if(newValue != 0){
					this.$getAreas(newValue)
				}
		　},deep: true
	　},
	},
	methods:{
		// 添加地址 或者 修改
		addReceiveAddress(){
			if(this.$route.query.addressId != undefined){
				let params = {
					appid: this.$interface.$appid,
					mainKey: localStorage.$mainKey,
					tokenKey: localStorage.$tokenKey,
					link_name: this.addressForm.name,
					link_phone: this.addressForm.phone,
					add_field1: this.addressForm.provide,
					add_field2: this.addressForm.city,
					add_field3: this.addressForm.area,
					add_field4: this.addressForm.desInfo,
					address_id: this.$route.query.addressId,
				}
				this.$api.post(this.$interface.apiurl.editReceiveAddress,params,res=>{

					if(this.switchOn){
						this.setDefault(this.$route.query.addressId)
					}
					this.$nextTick(()=>{
						CommomObj.$tips("修改成功!");
						this.$router.back();
					})
				})
			}else{
				let params = {
					appid: this.$interface.$appid,
					mainKey: localStorage.$mainKey,
					tokenKey: localStorage.$tokenKey,
					link_name: this.addressForm.name,
					link_phone: this.addressForm.phone,
					add_field1: this.addressForm.provide,
					add_field2: this.addressForm.city,
					add_field3: this.addressForm.area,
					add_field4: this.addressForm.desInfo,
				}
				console.log(params)
				this.$api.post(this.$interface.apiurl.addReceiveAddress,params,res=>{
					if(this.switchOn){
						this.setDefault(res.data.address_id)
					}
					this.$nextTick(()=>{
						CommomObj.$tips("添加成功!");
						this.$router.back();
					})
				})
			}

		},
		// 获取地址
		getReceiveAddress(id,page,pagesize){
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				page:page,
				pagesize: pagesize
			}
			this.$api.post(this.$interface.apiurl.getReceiveAddress,params,res=>{
				for (let index = 0; index < res.data.data.length; index++) {
					if(res.data.data[index].address_id == id){
						this.addressForm.name = res.data.data[index].link_name;
						this.addressForm.phone = res.data.data[index].link_phone;
						this.addressForm.provide = res.data.data[index].add_field1;
						this.addressForm.city = res.data.data[index].add_field2;
						this.addressForm.area = res.data.data[index].add_field3;
						this.addressForm.desInfo = res.data.data[index].add_field4;
					}
				}
			})
		},
		// 设为默认地址
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
		if(this.$route.query.addressId != undefined){ // 修改地址
			this.getReceiveAddress(this.$route.query.addressId,1,15);
			this.btnText = '保存';
		}else{ // 新增地址
			// 初始表单
			this.addressForm.name = '';
			this.addressForm.phone = '';
			this.addressForm.provide = 0;
			this.addressForm.city = 0;
			this.addressForm.area = 0;
			this.addressForm.desInfo = '';
		}
		this.$getProvinces();
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0})
		})
	},
}
</script>

<style lang="scss">

</style>
