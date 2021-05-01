<template>
	<view>
		<view class="uni-title uni-common-mt"style="background-color: #fff; margin: 10upx;">
			<text style="font-size: 40upx; font-weight: 1000;">推荐新音乐</text>
		</view>
		<view>
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="0" show-scrollbar='false'>
				<view id="demo1" class="scroll-view-item_H">
					<view class="Featured_wrap"  v-for="(item, i) in newSongsArr1" :key="item.id" :data-id ="item.id" style="width: 100%;" @click="goPlayer">
						<view class="Featured_header">
							<image :src="item.picUrl" mode="widthFix"></image>
						</view>
						<view class="Featured_body">
							<view class="Featured_name">
								<text class="text_name">{{item.name}}</text>
								<text class="text_author">-{{item.song.artists[0].name}}</text>
							</view>
						</view>
					</view>
				</view>
				<view id="demo2" class="scroll-view-item_H">
					<view class="Featured_wrap"  v-for="(item, i) in newSongsArr2" :key="item.id" :data-id ="item.id" style="width: 100%;" @click="goPlayer">
						<view class="Featured_header">
							<image :src="item.picUrl" mode="widthFix"></image>
						</view>
						<view class="Featured_body">
							<view class="Featured_name">
								<text class="text_name">{{item.name}}</text>
								<text class="text_author">-{{item.song.artists[0].name}}</text>
							</view>
						</view>
					</view>
				</view>
				<view id="demo3" class="scroll-view-item_H">
					<view class="Featured_wrap" v-for="(item, i) in newSongsArr3" :key="item.id" :data-id ="item.id" style="width: 100%;" @click="goPlayer">
						<view class="Featured_header">
							<image :src="item.picUrl" mode="widthFix"></image>
						</view>
						<view class="Featured_body">
							<view class="Featured_name">
								<text class="text_name">{{item.name}}</text>
								<text class="text_author">-{{item.song.artists[0].name}}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="uni-common-pb"></view>
	</view>
</template>
<script>
	import {
		request
	} from '../request/request.js'
	export default {
		name:"scrollView",
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				newSongsArr:[],
				newSongsArr1:[],
				newSongsArr2:[],
				newSongsArr3:[],
				songsPic:[]
			}
		},
		props: ['newSongs'],
		methods: {
			  getNewSongs() {
				 // console.log(this.newSongs)
			},
			// 获取推荐新歌曲
			async getNewSongInfo() {
				let res = await request({
					url: '/personalized/newsong'
				})
				this.newSongsArr = res.data.result
				this.newSongsArr1 = this.newSongsArr.slice(0,3)
				this.newSongsArr2 = this.newSongsArr.slice(3,6)
				this.newSongsArr3 = this.newSongsArr.slice(6,9)	
			},
			goPlayer (e) {
				uni.navigateTo({
					url:'../player/player?id='+e.currentTarget.dataset.id
				})
			},
			upper: function(e) {
				// console.log(e)
			},
			lower: function(e) {
				// console.log(e)
			},
			scroll: function(e) {
				// console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				uni.showToast({
					icon: "none",
					title: "纵向滚动 scrollTop 值已被修改为 0"
				})
			}
		},
		components:{
		},
		created() {
			this.getNewSongInfo()
		}
	}
</script>

<style lang="less">
	// 解决滚动条的 不要滚动条
	scroll-view::-webkit-scrollbar {
	    display: none;  
	    width: 0 !important;  
	    height: 0 !important;  
	    -webkit-appearance: none;  
	    background: transparent;  
	}
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}
	
	.scroll-view-item {
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}
	
	.scroll-view-item_H {
		display: inline-block;
		width: 100%;
		// height: 300rpx;
		// line-height: 300rpx;
		.Featured_wrap{
			width: 100%;
			display: flex;
			.Featured_header{
				width: 150upx;
				image{
					width: 100%;
					border-radius: 10upx;
				}
			}
			.Featured_body{
				width: 420upx;
				border-bottom: 1upx solid #ccc;
				.Featured_name{
					display: flex;
					line-height: 152upx;
					.text_name{
						display: block;
						width: 100%;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}
				}
			}
		}
	}
	
	
	// .scroll-view_H{
	// 	display: flex;
	// 	.scroll-view-item_H{
	// 		.Featured_wrap{
	// 			.Featured_header{
	// 				image{
						
	// 				}
	// 			}
	// 			.Featured_body{
	// 				.Featured_name{
	// 					.text_name{
	// 						.text_author{
								
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }
	.Featured_wrap:nth-child(3) .Featured_body{
		border-bottom: none !important;
	}

</style>
