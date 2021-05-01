<template>
	<view style="background-color: #F5F5F5; width: 100%; margin-bottom: 155upx; height: 100%;">
		<view class="popuplar_wrap">
			<view class="popular_search">
				<view class="search_volume">
					<text class="icon-volume iconfont" @click="showDrawerMethods" :hover-start-time="20"
						:hover-stay-time="70"></text>
				</view>
				<view class="search">
					<search></search>
				</view>
				<view class="search_listen">
					<text class="icon-fenxiang iconfont"></text>
				</view>
			</view>
			<view class="popular_swiper">
				<swiper autoplay>
					<swiper-item v-for="item in swiperArr" :key="item.id">
						<view class="swiper-item">
							<image :src="item.sPicUrl" mode="widthFix"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 推荐歌单 -->
			<uni-card>
				<view class="popuplar_recommoned">
					<view class="recommon_title" style="font-size: 35upx; font-weight: 1000; color: #888; padding: 26upx;">
						推荐歌单
					</view>
					<tabbar :tabs='tabs' ref='tabBarRef'></tabbar>
				</view>
			</uni-card>
		<!-- 精选音乐 -->
			<uni-card>
				<scrollView ref='scrollView'></scrollView>
			</uni-card>
		<drawer ref='showRightRef' id="showRightRef"></drawer>
		<uni-popup ref="popup" type="message">
		    <uni-popup-message type="success" :message="message" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import search from '../../components/search.vue'
	import tabbar from '../../components/tabbar.nvue'
	import scrollView from '../../components/scroll-view.vue'
	import drawer from '../../components/drawer/drawer.vue'
	const {
		request
	} = require('../../request/request.js')
	export default {
		data() {
			return {
				swiperArr: [],
				recommendArr: [],
				tabs: [],
				newSongsArr: [],
				message:''
			}
		},
		methods: {
			showDrawerMethods () {
				this.$refs["showRightRef"].showDrawer();
			},
			getData: function() {
					const query = uni.createSelectorQuery().in(this).select('#showRightRef')._component.$children
					query[0].showDrawer()
			    },
			async getSwiperInfo() {
				let res = await request({url: '/personalized/privatecontent/list?limit=3'})
				this.swiperArr = res.data.result
			},
			// 获取推荐歌单
			async getRecommendInfo() {
				let result = await request({url: '/personalized?limit=10'})
				this.tabs = result.data.result
			},
			getdropOut () {
				this.message = '账号已经退出'
				this.$refs.showRightRef.closeDrawer()
				this.$refs.popup.open()
			}
		},
		components: {
			search,
			tabbar,
			scrollView,
			drawer
		},
		created() {
			this.getSwiperInfo()
			this.getRecommendInfo()
		},
		mounted() {
		},
		watch:{
			
		}
	}
</script>

<style lang="less" scoped>
	.popular_search {
		display: flex;
		justify-content: space-around;

		.search_volume {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.search {
			flex: 3;
		}

		.search_listen {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.popular_swiper {
		margin: 0 auto;
		padding: 10upx;

		swiper {
			width: 675upx;
			height: 278upx;
			margin: 0 auto;

			.swiper-item {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				overflow: hidden;
				border-radius: 15upx;

				image {
					width: 100%;
					// border-radius: 15upx;
				}
			}
		}
	}

	.popuplar_recommoned {
		height: 320upx;
	}

	.Featured_wrap {
		height: 480upx;
	}
</style>
