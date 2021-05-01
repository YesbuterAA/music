<template>
	<view>
		<view class="playlist_wrap">
			<view class="playlist_header">
				<text class="iconfont icon-fanhui1" @click="backPreviousPage"></text>
				<text>歌单</text>
				<text class="iconfont icon-sandianshuzhuode"></text>
			</view>
			<view class="playlist_description">
				<view class="playlist_image">
					<image :src="playList.coverImgUrl" mode="widthFix"></image>
				</view>
				<view class="description">
					<view class="description_text">
						<text>{{playList.name}}</text>
					</view>
					<view class="description_username">
						<view class="creator_image">
							<image :src="playList.avatarUrl" mode="widthFix" style="width: 100%;"></image>
						</view>
						<text class="description_usernameText">{{playList.nickname}}</text>
					</view>
					<view class="description_detailed">
						<text class="description_detailedText">{{playList.description}}</text>
					</view>
				</view>
			</view>
			<!-- 歌单详情动态 -->
			<view class="dynamic">
				<view class="Favorites">
					<text class="iconfont icon-jiaru1"></text>
					<view class="Favorites_number">
						<text>{{dynamic.bookedCount}}</text>
						<text class="VerticalLine">|</text>
					</view>
				</view>
				<view class="comment">
					<text class="iconfont icon-pinglun"></text>
					<view class="Favorites_number">
						<text>{{dynamic.commentCount}}</text>
						<text class="VerticalLine">|</text>
					</view>
				</view>
				<view class="share">
					<text class="iconfont icon-fenxiang1"></text>
					<view class="Favorites_number">
						<text>{{dynamic.shareCount}}</text>
					</view>
				</view>
			</view>
			<uni-card style="padding: 0;">
				<view class="music_header">
					<view class="music_play">
						<text class="iconfont icon-bofang1"></text>
						<text>播放全部</text>
						<text>({{songsNumber}})</text>
					</view>
					<view class="music_footer">
						<text class="iconfont icon-xiazai-copy"></text>
						<text class="iconfont icon-dui"></text>
					</view>
				</view>
				<view class="music_body" v-for="(item,i) in musicDetail" @click="navigatePlayer"
					:data-index='item.id'>
					<view class="musicPlay_header">
						<text class="music_number">{{i+1}}</text>
						<view class="music_name">
							<text class="musicName">{{item.name}}</text>
							<text class="music_author">{{item.ar[0].name}}--{{item.al.name}}</text>
						</view>
					</view>
					<view class="musicPlay_footer">
						<text class="iconfont icon-bofang2"></text>
						<text class="iconfont icon-sandian"></text>
					</view>
				</view>
			</uni-card>
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
				playListId: '',
				trakIds: [],
				playList: {
					name: '',
					avatarUrl: '',
					nickname: '',
					description: '',
					coverImgUrl: ''
				},
				creator: '',
				dynamic: {
					commentCount: 0,
					shareCount: 0,
					bookedCount: 0
				},
				musicDetail: [],
				musicDetailId: [],
				songsNumber: 0,
				total: 1,
				trakids:[],
				musicIds:[],
				paused:true,
				timeId:''
			}
		},
		methods: {
			// 点击返回上一页
			backPreviousPage() {
				uni.navigateBack({
					delta: 1
				})
			},
			//请求数据 根据id 获取歌单详情
			async getPlayListDetail() {
				if(this.paused){
						let res = await request({
							url: '/playlist/detail',
							data: {
								id: this.playListId
							}
						})
						this.playList.name = res.data.playlist.name
						this.playList.avatarUrl = res.data.playlist.creator.avatarUrl
						this.playList.nickname = res.data.playlist.creator.nickname
						this.playList.description = res.data.playlist.description.replace(/\n/g, ',')
						this.playList.coverImgUrl = res.data.playlist.coverImgUrl
						// 获取歌单动态详情
						let dynamicRes = await request({
							url: '/playlist/detail/dynamic',
							data: {
								id: this.playListId
							}
						})
						this.dynamic.commentCount = dynamicRes.data.commentCount
						this.dynamic.shareCount = dynamicRes.data.shareCount
						this.dynamic.bookedCount = dynamicRes.data.bookedCount
						this.trakids = res.data.playlist.trackIds
						this.musicIds = this.trakids.map(item => item.id)
						this.songsNumber = this.musicIds.length-1
					}
					if(this.musicIds.length-1<20){
							let res =[]
						for(let j=0;j<this.musicIds.length-1;j++){
							let musicDetail = await request({url:'/song/detail',data:{ids:this.musicIds[j]}})
							res.push(musicDetail.data.songs[0])
							this.paused = false
						}
						this.paused = false
						this.musicDetail.push(...res)
						console.log(this.musicDetail)
					}else{
						let res =[]
						for(let j=0;j<=20;j++){
							let musicDetail = await request({url:'/song/detail',data:{ids:this.musicIds[j]}})
							res.push(musicDetail.data.songs[0])	
						}
						this.pasued = false
						this.musicDetail.push(...res)
					}
			},
			async getSongs() {
			},
			navigatePlayer(e) {
				uni.navigateTo({
					url: '../player/player?id=' + e.currentTarget.dataset.index
				})
			}

		},
		created() {},
		onLoad(options) {
			this.playListId = options.id
			this.getPlayListDetail()
		},
		computed: {},
		onReachBottom() {
			// 防抖的应用
			if(this.musicIds.length-1>20){
				uni.showToast({
					title:'正在加载更多'
				})
					if(this.timeId){
						return
					}else{
						this.timeId = setTimeout(()=>{
						this.musicIds.splice(0,20)
						this.getPlayListDetail()
						this.timeId = null
					},1000)
					}
			}else{
				uni.showToast({
					title:'已经到低了'
				})
			}
		},
		beforeDestroy() {
			this.pasued = true
		}
	}
</script>

<style lang="less">
	.playlist_wrap {
		.playlist_header {
			display: flex;
			justify-content: space-between;
			padding: 20upx;
			background-color: #777377;

			.icon-fanhui1 {
				font-size: 45upx;
			}

			text {
				font-size: 45upx;
				font-weight: 800;
				color: #fff;
			}

			.icon-sandianshuzhuode {
				font-size: 45upx;
			}
		}

		.playlist_description {
			display: flex;
			background-color: #777377;
			padding-top: 30upx;

			.playlist_image {
				width: 300upx;
				height: 300upx;
				border-radius: 20upx;
				padding: 20upx;

				image {
					width: 100%;
					border-radius: 20upx;
				}
			}

			.description {
				.description_text {
					height: 140upx;

					text {
						font-size: 35upx;
						font-weight: 900;
						color: #F1F1F1;
						line-height: 80upx;
					}
				}

				.description_username {
					display: flex;
					padding: 36upx 0;

					.creator_image {
						width: 50upx;
						height: 50upx;

						image {
							width: 100%;
							border-radius: 50%;
						}
					}

					.description_usernameText {
						display: block;
						width: 400upx;
						padding-left: 18upx;
						color: #fff;
					}
				}

				.description_detailed {
					height: 50upx;

					.description_detailedText {
						width: 440upx;
						font-size: 20upx !important;
						overflow: hidden !important;
						text-overflow: ellipsis !important;
						display: -webkit-box !important;
						-webkit-line-clamp: 1; //文字上限行
						-webkit-box-orient: vertical;
						color: #fff;
					}
				}
			}
		}

		.dynamic {
			display: flex;
			justify-content: center;
			border: 1upx solid #ccc;
			width: 600upx;
			padding: 20upx;
			border-radius: 40upx;
			margin: -20upx auto 20upx;
			background-color: #fff;

			.Favorites {
				display: flex;

				.icon-jiaru1 {
					align-self: center;
				}

				.Favorites_number {
					display: flex;
					text-align: center;

					text:nth-child(1) {
						padding: 0 10upx;
					}

					.VerticalLine {
						padding: 0 20upx;
						color: #C0C0C0;
					}
				}

				text {}
			}

			.comment {
				display: flex;

				.icon-pinglun {
					align-self: center;
				}

				.Favorites_number {
					display: flex;

					text:nth-child(1) {
						padding: 0 10upx;
					}

					.VerticalLine {
						padding: 0 20upx;
						color: #C0C0C0;
					}
				}
			}

			.share {
				display: flex;

				.icon-fenxiang1 {
					align-self: center;
				}

				.Favorites_number {
					display: flex;

					text:nth-child(1) {
						padding: 0 10upx;
					}

					.VerticalLine {
						padding: 0 20upx;
					}
				}
			}
		}


		.music_header {
			display: flex;
			justify-content: space-between;

			.music_play {
				.icon-bofang1 {
					color: #EB4D44;
					font-size: 45upx;
				}

				text:nth-child(2) {
					font-size: 45upx;
					font-weight: 800;
					color: #404040;
					padding: 0 20upx;
				}

				text:nth-child(3) {
					font-size: 20upx;
					font-weight: 800;
				}
			}

			.music_footer {
				.icon-xiazai-copy {
					font-size: 45upx;
					padding: 0 30upx;
					color: #404040;
				}

				.icon-dui {
					font-size: 45upx;
					color: #404040;
				}
			}
		}

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
	}
</style>
