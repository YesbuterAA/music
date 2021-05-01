<template>
	<view class="search_wrap">
		<navigator url="/pages/search/search">
			<input type="text" value="" :placeholder="keyWords" confirm-type="search" />
		</navigator>
	</view>
</template>

<script>
	import {request} from '../request/request.js'
	export default{
		data () {
			return {
				keyWords:''
			}
		},
		methods:{
			showDrawer(e) {
				this.$refs[e].open()
			},
			async getKeyWords(){
				let res = await request({url:'/search/default'})
				this.keyWords = res.data.data.showKeyword
			}
		},
		created() {
			this.getKeyWords()
		}
	}
</script>

<style scoped>
	.search_wrap{
		display: flex;
		justify-content: space-around;
		background-color: #F5F5F5;
		padding: 20upx;
	}
	.search_volume{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: certer;
	}
	.search_wrap>navigator{
		flex: 5;
		border: 1upx solid #ccc;
		border-radius: 15upx;
	}
	.search_wrap>navigator>input{
		text-align: center;
		font-size:20upx;
		position: relative;
		height: 50upx;
		line-height: 50upx;
	}
	.search_listen{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
