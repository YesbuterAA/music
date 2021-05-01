<template>
	<view style="color: #F9F9F9;">
		<view class="user_wrap">
			<!-- 抽屉 -->
			<view class="user_volume">
				<text class="iconfont icon-volume" style="color: #030303;" @click="showDrawer"></text>
			</view>
			<view class="user_login">
				<view class="user_avater">
					<view class="avater_image" style="width: 150upx; height: 150upx;">
						<image :src="loginRes?loginRes.avatarUrl:staticSrc" mode="widthFix" style="width: 100%;border-radius: 50%;"></image>
					</view>
					<view class="login_text" v-if="!loginRes">
						<text class="userLogin_text">
							<navigator url="../login/login">
								立即登录>
							</navigator>
						</text>
					</view>
					<view class="login_text" v-else>
						<text class="userLogin_text">
								<text>{{loginRes.nickname}}</text>
						</text>
					</view>
				</view>
			</view>
			<view class="urer_card">
				<uni-card class="userCard">
					<view class="user_bar">
						<view class="userCard_top">
							<view class="userCard_icon">
								<text class="iconfont icon-yunyinle-xiazai"></text>
								<text class="userCard_text">本地/下载</text>
							</view>
							<view class="userCard_icon">
								<text class="iconfont icon-yunpan"></text>
								<text class="userCard_text">云盘</text>
							</view>
							<view class="userCard_icon">
								<text class="iconfont icon-yigou"></text>
								<text class="userCard_text">已购</text>
							</view>
						</view>
						<view class="userCard_bottom">
							<view class="userCard_icon">
								<text class="iconfont icon-zuijinbofang-xuanting"></text>
								<text class="userCard_text">最近播放</text>
							</view>
							<view class="userCard_icon">
								<text class="iconfont icon-wodehaoyou"></text>
								<text class="userCard_text">我的好友</text>
							</view>
							<view class="userCard_icon">
								<text class="iconfont icon-shoucangshixin"></text>
								<text class="userCard_text">收藏</text>
							</view>
						</view>
					</view>
				</uni-card>
			</view>
		</view>
		<!-- 我喜欢音乐 -->
		<view class="favorite">
			<uni-card>
				<view class="music_wrap">
					<view class="favorite_image" style="width: 150upx; height: 150upx;">
						<image src="../../static/icon/avatar.jpg" mode="widthFix" style="width: 100%;"></image>
					</view>
					<view class="favorite_r" @click="goToFavorites">
						<view class="favorite_text">
							<text>我喜欢的音乐</text>
							<text class="text_num">{{number}}首</text>
						</view>
						<view class="favorite_mode">
							<text>心动模式</text>
						</view>
					</view>
				</view>
			</uni-card>
		</view>
		<drawer ref='showRightRef'></drawer>
		<uni-popup ref="popup" type="message">
		    <uni-popup-message type="success" :message="message" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import drawer from '../../components/drawer/drawer.vue'
	import {request} from '../../request/request.js'
 	export default {
		data() {
			return {
				number: '',
				message:'',
				loginRes:'',
				staticSrc:'../../static/icon/avatar.jpg'
			}
		},
		methods: {
			showDrawer(){
				this.$refs.showRightRef.showDrawer()
			},
			getdropOut () {
				this.message = '账号已经退出'
				this.$refs.showRightRef.closeDrawer()
				this.$refs.popup.open()
			},
			// 点击前往收藏歌曲页面
			goToFavorites () {
				uni.navigateTo({
					url:'../favorites/favorites'
				})
			}
		},
		mounted() {
			let login = uni.getStorageSync('login')
			if(login){
				let loginResult = uni.getStorageSync('login')
				this.loginRes = loginResult.data.profile
			}
		},
		created() {
			console.log(uni.getStorageSync('favoritesMusic').length)
			this.number = uni.getStorageSync('favoritesMusic').length
		}
	}
</script>

<style lang="less">
	.user_wrap {
		padding: 20upx;
	  .user_volume {
	    .iconfont {
	
	    }
	  }
	
	  .user_login {
		  margin-top: 50upx;
	    .user_avater {
			display: flex;
			margin-left: 50upx;
			border-radius: 50%;
	      .avater_image {
			  border-radius: 50%;
	        image {
				display: block;
				border-radius: 50%;
	        }
	      }
	
	      .login_text {
	        .userLogin_text {
				line-height: 150upx;
				color: #0C0C0C;
				font-size: 45upx;
				font-weight: 900;
	        }
	      }
	    }
	  }
	
	  .urer_card {
	    .userCard {
			display: flex;
			.user_bar{
				display: flex;
				flex-wrap: wrap;
				padding: 10upx;
				.userCard_top{
					display: flex;
					justify-content: space-around;
					width: 100%;
					height: 150upx;

					.userCard_icon {
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						align-items: center;
						width: 130upx;
					  .iconfont {
						font-size: 60upx;
						margin-top: 20upx;
						color: #EB4F48;
					  }
						
					  .userCard_text {
						font-size: 20upx;
						color: #808080;
						font-weight: 900;
					  }
					}
				}
				.userCard_bottom{
					display: flex;
					justify-content: space-around;
					width: 100%;
					height: 150upx;
					.userCard_icon {
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						align-items: center;
					  .iconfont {
						font-size: 60upx;
						margin-top: 20upx;
						color: #EB4F48;

					  }
					  .userCard_text {
						font-size: 20upx;
						width: 100upx;
						height: 50upx;
						display: block;
						text-align: center;
						color: #808080;
						font-weight: 900;
					  }
					}
				}
			}
	    }
	  }

	}
	.favorite{
		padding: 20upx;
	.music_wrap{
			  display: flex;
			  .favorite_image{
				  
			  }
			  .favorite_r{
				  display: flex;
				  justify-content: space-between;
				  width: 100%;
				 .favorite_text{
				 	display: flex;
				 	flex-direction: column;
					margin-top: 18upx;
					text{
						color: #3C3C3D;
						font-size: 36upx;
						font-weight: 800;
					}
					.text_num{
						font-size:30upx;
						margin-top: 10upx;
					}
				 }
				 .favorite_mode{
				 	// float: right;		  
					// margin-left: 130upx;
					margin:auto 0;
					border: 1upx solid #ccc;
					padding:10upx 30upx;
					border-radius: 25upx;
				 } 
			  }
	}
	}
</style>
