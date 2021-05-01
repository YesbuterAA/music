<template>
	<view>
		<view class="search_warp">
			<view class="search_ipt">
				<view class="search_iptWarp">
					<input 
					type="text" 
					class="input" 
					placeholder-class="iconfont icon-xingtaiduICON_sousuo--"
					:placeholder="keyWords" 
					:value="inputClearValue" 
					@input='clearInput' />
					<text 
					class="iconfont icon-chuyidong1-copy" 
					v-if="showClearIcon" 
					@click="clearIcon">
					</text>
				</view>
				<text @click="clearMove">取消</text>
			</view>
			<view class="search_s" v-if="!showClearIcon">
				<view class="search_history">
					<text class="search_historyText">历史</text>
					<view class="tabs" style="height: 80upx; padding-right: 50upx;">
						<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false"
							:scroll-into-view="scrollInto">
							<view class="uni-tab-item">
								<text class="uni-tab-item-title search_hisText" v-for="(item,i) in historyText" :key='i'>
									{{item}}
								</text>
							</view>
						</scroll-view>
					</view>
					<view class="search_remove" @click="historyTextRemove">
						<text class="iconfont icon-shanchu"></text>
					</view>
				</view>
				<view class="search_hot">
					<text class="search_hWarp">热搜榜</text>
					<view class="search_keyword">
						<view class="search_text" v-for="(item,i) in hotSearch" :key ='item.score' @click="goToplayer" :data-hotText = 'item.searchWord'>
							<text class="hotSearch_number">{{i+1}}</text>
							<text class="hotSearch_searchWord">{{item.searchWord}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 输入框 输入文字时显示的搜索内容 -->
			<view class="search_l" v-else>
				<view v-for="item in keyWordArr">
					<view class="search_lKeywordsText iconfont icon-xingtaiduICON_sousuo--" @click="navigtorToPlayer" :data-id = 'item.id'>
						<text class="search_name">{{item.name}}</text>
						<text class="search_lKeywordsTextText">--{{item.ar[0].name}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		request
	} from '../../request/request.js'
	export default {
		data() {
			return {
				value: '',
				scrollInto: '',
				keyWords: '',
				showClearIcon: false,
				inputClearValue: '',
				keyWordArr:[],
				timeId:'',
				hotSearch:[],
				historyText:[]
			}
		},
		methods: {
			 async clearInput(event) {
				let value = event.detail.value
				clearTimeout(this.timeId)
				if(!event.detail.value){
					this.showClearIcon = false
					return
				}else{
					this.timeId = setTimeout(()=>{
						this.multimatch(value)
					},1000)
				}

				this.inputClearValue = event.detail.value;
				if (event.detail.value.length > 0) {
					this.showClearIcon = true;
				} else {
					this.showClearIcon = false;
				}
			},
			clearIcon: function() {
				this.inputClearValue = '';
				this.showClearIcon = false;
			},
			async getKeyWords() {
				let res = await request({
					url: '/search/default'
				})
				this.keyWords = res.data.data.showKeyword
			},
			// 对搜索进行数据请求
			async multimatch(data) {
				let res = await request({
					url: '/cloudsearch',
					data:{
						keywords:data,
						type:1
					}
				})
				this.historyText.unshift(data)
				this.keyWordArr = res.data.result.songs
			},
			navigtorToPlayer (e) {
				uni.navigateTo({
					url:'../player/player?id='+e.currentTarget.dataset.id
				})
			},
			async getHotSearch () {
				let res = await request({
					url:'/search/hot/detail'
				})
				this.hotSearch = res.data.data
			},
			historyTextRemove () {
				this.historyText = []
			},
			// 点击取消 清除文框中的数据
			clearMove () {
				this.clearIcon()
			},
			async goToplayer (e) {
				let res = await request({
					url:'/search/suggest',
					data:{
						keywords: e.currentTarget.dataset.hotText
					}
				})
				uni.navigateTo({
					url:'../player/player?id='+res.data.result.songs[0].id
				})
			}
		},
		created() {
			this.getKeyWords()
			this.getHotSearch()
		},
		components: {}
	}
</script>

<style lang="less">
	.search_warp {
		.search_ipt {
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding-left: 20upx;
			margin-top: 20upx;
			.search_iptWarp{
				background-color: #F4F4F4;
				border-radius: 1upx solid #ccc;
				border-radius: 15upx;
				display: flex;
				justify-content: flex-end;
				width: 100%;
				flex: 5;
				input {
					padding: 5upx;
					height: 60upx;
					width: 100%;
				}
				text {
					width: 30upx;
					display: block;
					height: 60upx;
					line-height: 60upx;
					padding-right: 20upx;
				}
			}
			text{
				flex: 1;
				margin-left: 42upx;
			}

		}

		.search_history {
			display: flex;
			padding: 0 30upx 0upx;

			.search_historyText {
				line-height: 80upx;
				search_hisText{
					padding: 20upx;
				}
			}

			.search_remove {
				width: 50upx;
				height: 80upx;
				position: relative;

				.icon-shanchu {
					display: block;
					line-height: 70upx;
					text-align: center;
					color: #888;
					padding-right:20upx ;
				}
			}

			.search_remove:after {
				content: "";
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				/* 从父元素继承 background 属性的设置 */
				background: inherit;
				filter: blur(20px);
				z-index: 2;
			}
		}
		.search_l{
			.search_lKeywordsText{
				padding: 20upx;
				border-bottom: 1upx solid #ccc;
				.icon-xingtaiduICON_sousuo--{
					
				}
				.search_name{
					font-size: 40upx;
					color: #0a0a0a;
					font-weight: 800;
				}
				.search_lKeywordsTextText{
					font-size: 32upx;
					color: #888;
				}
			}
		}

		.search_hot{
			.search_hWarp{
				border-bottom: 1upx solid #ccc;
				font-size: 40upx;
				font-weight: 800;
				margin-bottom: 30upx;
				padding: 30upx 0;
				display: block;
				color: #333334;
			}
			.search_keyword{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				.search_text{
					display: flex;
					flex: 1;
					width: 375upx;
					padding: 30upx 0;
					.hotSearch_number{
						font-size: 40upx;
						font-weight: 800;
						color: #989898;
						text-align: center;
						display: block;
						flex: 1;
					}
					.hotSearch_searchWord{
						width: 300upx;
						font-size: 40upx;
						font-weight: 800;
						color: #333334;
						display: block;
					}
				}
			}
		}
		.icon-xingtaiduICON_sousuo-- {
			// vertical-align: center;
			line-height: 42upx;
			font-size: 30upx;
		}
	}

	.tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #ffffff;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}

	.scroll-h {
		width: 750rpx;
		/* #ifdef H5 */
		width: 100%;
		/* #endif */
		height: 80rpx;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		/* flex-wrap: nowrap; */
		/* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
	}

	.line-h {
		height: 1rpx;
		background-color: #cccccc;
	}

	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 16rpx;
		padding-right: 15rpx;
	}

	.uni-tab-item-title {
		color: #555;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
		margin: 20upx;
		border: 1upx solid #CCCCCC;
		background-color: #ccc;
		color: #000;
		font-weight: 800;
		border-radius: 20upx;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		color: #007AFF;
	}
</style>
