<template>
<div class="x-scroll">
	<scroller 
		lock-x 
		scrollbar-y 
		style="background: #f7f7f7;" 
		ref="scrollerBottom" 
		:use-pulldown="true" 
		:pulldown-config="downobj" 
		@on-pulldown-loading="uploadStroeInfo"
		v-show="isShow" 
		v-model="scrollerStatus" 
		:bounce="false" 
		:use-pullup="showUp" 
		:pullup-config="upobj"
		@on-pullup-loading="selPullUp">
			<section class="purch pb30 bg-f7">
				<div class="purch-admin">
					<div class="purch-admin-item" v-for="(item, index) in qutoeListData" :key="index">
							<div class="item-header">
								<div>报价单号：{{item.quotation_no}}</div>
								<div><span :class="item.quotation_iSstop == 1 ? 'cr-999' : 'cr-pink'">{{item.quotation_iSstop == 0 ? "报价中" : "已停止" }}</span></div>
							</div>
							<div class="item-body">
								<router-link :to="'./qutoeListInfo?quotationid='
									+ item.quotation_id + '&purchaseid='
									+ item.purchase_id + '&isstop='
									+ item.quotation_iSstop">
									<h3>{{item.store_name}}</h3>
									<p>采购商品：<span class="cr-pink">{{item.purchase_name}}</span></p>
									<p>起售数量：<span class="cr-pink">{{item.quotation_selling_count}}</span></p>
									<p>供货单价：<span class="cr-pink">{{item.quotationPrice +'（元）'}}</span></p>
									<p>截止时间：<span>{{$timestampToTime(item.effective_time)}}</span></p>
								</router-link>
							</div>
							<div class="item-footer">
								<div>{{$timestampToTime(item.quotation_time)}}</div>
								<div class="f-right">
									<span :class="item.quotation_status != 1 ? '': 'hide'"  @click="delQutoeOrder(item.quotation_id)">删除</span>
									<span :class="(new Date()).valueOf() < item.effective_time &&  item.quotation_iSstop == 0 ? '': 'hide'" @click="stopQutoeOrder(item.quotation_id)">停止</span>
									<span :class="item.num>0 ? 'btn-bg-cheng': 'hide'" 
										data-quotationid="${item.quotation_id}"  
										data-gscid="${item.quotation_gscID}"  
										data-quotationsn="${item.quotation_no}"  
										data-ordername="${item.purchase_name}"  
										data-startTime="${item.purchase_name}"
										@click="submitQutoeOrder"
										class="btn-bg-cheng">成交订单</span>
								</div>
							</div>
						</div>
				</div>
			</section>
	</scroller>
</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	data(){
		return {
			downobj:{
					content: '请下拉刷新数据.',
					pullUpHeight: 60,
					height: 40,
					autoRefresh: false,
					downContent: '下拉刷新数据',
					upContent: '下拉刷新数据',
					loadingContent: `<img src="../../../static/imgs/loading-2.gif" />`,
					clsPrefix: 'xs-plugin-pullup-'
			},
			isShow: false,
			scrollerStatus: {
				pullupStatus: 'default'
			},
			showUp: true,
			upobj:{
					content: '请上拉刷新数据',
					pullUpHeight: 60,
					height: 40,
					autoRefresh: false,
					downContent: '请上拉刷新数据',
					upContent: '请上拉刷新数据',
					loadingContent: '加载中...',
					clsPrefix: 'xs-plugin-pullup-'
			},
			showDivider: false,
			page: 1,
			pagesize: 10,
      showNodata: false,
			qutoeListData: []
		}
	},
	computed:{
		...mapState({
			loginState: 'loginState',
			userInfo: "userInfo",
			storeInfo: "storeInfo"
		})
	},
	methods:{
		// 获取我的报价列表
		getQutoeList(isEmpty,status,page,pagesize){
			let params = {
					appid: this.$interface.$appid,
					mainKey: localStorage.$mainKey,
					tokenKey: localStorage.$tokenKey,
					page: page,
					pagesize: pagesize,
					type: status
			}
			this.$api.post(this.$interface.apiurl.getQutoeList,params,res=>{
				this.isShow = true;
          this.$vux.loading.hide();       
          if (!isEmpty) {
            if(res.data.rows < (this.page-1)*this.pagesize){
              this.showDivider = true;
              this.scrollerStatus.pullupStatus = 'disabled' // 禁用下拉          
              return;
            }
            for (let i  = 0; i < res.data.data.length; i++) {
              this.qutoeListData.push(res.data.data[i]);
            }
            this.showDivider = false;          
            this.scrollerStatus.pullupStatus = 'default'
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset()
            })
          }else{
            this.qutoeListData = res.data.data;
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset({top: 0})
            })
          }
			},err=>{
					this.$vux.toast.show({ text: err.errorMsg, type:'text',width: '180px'});        
          this.qutoeListData = [];
          this.$vux.loading.hide()
			})
		},
		 // 上拉加载数据
		selPullUp () {
			this.$vux.loading.show({text: 'loading...'})      
			this.page++;
			this.getQutoeList(false,0,this.page,this.pagesize)
		},
		// 下拉数据数据刷新
		uploadStroeInfo(){
			this.$vux.loading.show({text: 'loading'});
			if(this.loginState){
				this.page = 0;
				this.getQutoeList(false,0,this.page,this.pagesize)
			}
			this.$nextTick(() => {
		    this.$vux.loading.hide();
				this.$refs.scrollerBottom.reset()
				this.$refs.scrollerBottom.donePulldown();
			})
		},
		submitQutoeOrder(){},
		stopQutoeOrder(){},
		delQutoeOrder(){},
	},
	activated(){
		this.page = 1;
		this.getQutoeList(true,0,this.page,this.pagesize)
		if(this.loginState){
			this.$nextTick(()=>{
				this.$refs.scrollerBottom.reset({top:0})
			})
		}
	}
}
</script>
<style lang="less" scoped>
.btn-wode{
	position: absolute;
	right: -12px;
	top:1.6rem;
	background-color: #ff7d3b;
	border-radius: 20px;
	padding: 5px 30px 5px 25px;
	color: #fff;
	font-size: 12px;
	}
</style>
