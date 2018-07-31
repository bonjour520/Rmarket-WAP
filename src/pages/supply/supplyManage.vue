<template>
<div class="purch">
	<ul class="tab-lists">
		<li>
			<router-link to="/supplyOrder">
				<i class="cr-pink iconfont icon-fabu"></i>
				<span>发布采购</span>
				<i class="cr-666 iconfont icon-xiangyou"></i>
			</router-link>
		</li>
		<li>
			<router-link to="/supplyList">
				<i class="cr-qlan iconfont icon-gouwuche"></i>
				<span>采购管理</span>
				<i class="cr-666 iconfont icon-xiangyou"></i>
			</router-link>
		</li>
	</ul>
</div>
</template>
<script>
export default {
	data(){
		return {
			
		}
	},
	methods:{
		
	},
	
}
</script>
<style lang="less">
@cell-font-size:12px;
</style>
