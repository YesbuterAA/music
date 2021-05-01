<template>
	<view>
		<view class="music_body" v-for="(item,i) in favoritesMusic" @click="navigatePlayer"
			:data-index='item.data.songs[0].id'>
			<view class="musicPlay_header">
				<text class="music_number">{{i+1}}</text>
				<view class="music_name">
					<text class="musicName">{{item.data.songs[0].name}}</text>
					<text class="music_author">{{item.data.songs[0].ar[0].name}}--{{item.data.songs[0].al.name}}</text>
				</view>
			</view>
			<view class="musicPlay_footer">
				<text class="iconfont icon-bofang2"></text>
				<text class="iconfont icon-sandian"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import {request} from '../../request/request.js'
	export default {
		data() {
			return {
				favoritesMusic:[]
			}
		},
		methods: {
			// 获取缓存中的收藏歌曲数据
			async getFavoritesMusic () {
				let favoritesMusic = uni.getStorageSync('favoritesMusic')
				for( let i = 0; i<favoritesMusic.length; i++) {
					let res = await request({
						url:'/song/detail',
						data:{
							ids:favoritesMusic[i]
						}
					})
					this.favoritesMusic.push(res)
				}
			},
			// 点击到达播放页面
			navigatePlayer(e) {
				uni.navigateTo({
					url: '../player/player?id=' + e.currentTarget.dataset.index
				})
			}
		},
		created() {
			this.getFavoritesMusic()
		}
	}
</script>

<style lang="less">
	.music_body {
		display: flex;
		justify-content: space-between;
		margin-top: 20upx;
		.musicPlay_header {
			display: flex;
			.music_number {
				display: block;
				font-size: 45upx;
				font-weight: 600;
				color: #999;
				margin: auto 0;
				padding-right: 30upx;
			}
	
			.music_name {
				display: flex;
				flex-direction: column;
	
				.musicName {
					font-size: 35upx;
					font-weight: 800;
					color: #39393A;
					// font-size: 20upx !important;
					overflow: hidden !important;
					text-overflow: ellipsis !important;
					display: -webkit-box !important;
					-webkit-line-clamp: 1; //文字上限行
					-webkit-box-orient: vertical;
				}
	
				.music_author {
					font-size: 25upx;
					font-weight: 800;
					color: #999;
					overflow: hidden !important;
					text-overflow: ellipsis !important;
					display: -webkit-box !important;
					-webkit-line-clamp: 1; //文字上限行
					-webkit-box-orient: vertical;
				}
			}
		}
	
		.musicPlay_footer {
			margin-top: 20upx;
	
			.icon-bofang2 {
				font-size: 45upx;
				padding: 30upx;
				color: #404040;
				margin: auto 0;
			}
	
			.icon-sandian {
				font-size: 45upx;
				color: #404040;
				margin: auto 0;
			}
		}
	}
</style>
