<template>
	<view>
		<view>
			<uni-drawer ref="showRight" id="showRight" mode="left" :mask-click="true" style="height: 100%;" :visible = 'visible'>
				<view class="scroll-view">
					<scroll-view class="scroll-view-box" scroll-y="fasle" style="background-color: #F8F8F8; height: 1334upx;">
					<uni-card>
						<view  v-if="loginRes.nickname" class="login_avarat">
							<image :src="loginRes.avatarUrl" mode="widthFix" style="width: 100%;"></image>
							<text>{{loginRes.nickname}}</text>
						</view>
						<view class="login" v-else>
							<text>{{loginRes.nickname}}</text>
							<navigator url="../login/login">立即登录</navigator>
						</view>
						</uni-card>
					<uni-card class="card_box1">
						<view class="card_text">
							<text class="iconfont icon-xinxi"></text>
							<text>信息中心</text>
							<text>></text>
						</view>
							<view class="card_text">
								<text class="iconfont icon-zhongxinfuzhi"></text>
								<text>云贝中心</text>
								<text>></text>
							</view>
						</uni-card>
					<uni-card class="card_box1">
						<view class="card_box_title">
							<text>音乐服务</text>
						</view>
						<view class="card_text">
							<text class="iconfont icon-yanchu"></text>
							<text>演出</text>
							<text>></text>
						</view>
						<view class="card_text">
							<text class="iconfont icon-shangcheng"></text>
							<text>商城</text>
							<text>></text>
						</view>
						<view class="card_text">
							<text class="iconfont icon-cailing"></text>
							<text>口袋彩铃</text>
							<text>></text>
						</view>
						<view class="card_text">
							<text class="iconfont icon-youxi"></text>
							<text>游戏专区</text>
							<text>></text>
						</view>
					</uni-card>
					<uni-card class="card_box1">
						<view class="card_text">
							<text class="iconfont icon-kefu"></text>
							<text>我的客服</text>
							<text>></text>
						</view>
						<view class="card_text">
							<text class="iconfont icon-ding_dan"></text>
							<text>我的订单</text>
							<text>></text>
						</view>
						<view class="card_text">
							<text class="iconfont icon-youhuiquan"></text>
							<text>优惠卷</text>
							<text>></text>
						</view>
						<view class="card_text">
							<text class="iconfont icon-fenxiang1"></text>
							<text>分享网易云音乐</text>
							<text>></text>
						</view>
						<view class="card_text">
							<text class="iconfont icon-guanyu"></text>
							<text>关于</text>
							<text>></text>
						</view>
					</uni-card>
					<uni-card>
						<view class="card_text">
							<navigator url="../homePage/homePage">
								<text @click="dropOut()">退出登录</text>
							</navigator>
						</view>
					</uni-card>
					</scroll-view>
				</view>
			</uni-drawer>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				message:'',
				loginRes:'',
				status:true,
				visible:false
			}
		},
		methods: {
			showDrawer() {
				// #ifdef MP-WEIXIN
					const query = uni.createSelectorQuery().in(this).select('#showRightRef')._component.$children
					console.log(query[0].$children)
					query[0].open()
				// #endif
				// #ifdef H5
					this.$refs.showRight.open()
				// #endif
			},
			closeDrawer() {
				this.visible = false
				this.$refs.showRight.close();
			},
			dropOut () {
				// console.log(1)
				uni.setStorageSync('login','')
				this.$parent.$parent.getdropOut()
				this.loginRes = ''
			},
			showData: function() {
			      console.log('子组件');
			
			 }
		},
		mounted(){
			let login = uni.getStorageSync('login')
			if(login){
				let loginResult = uni.getStorageSync('login')
				this.loginRes = loginResult.data.profile
				// console.log(this.loginRes.nickName)
				this.status = true
			}
			this.$nextTick(()=>{
				this.$on('showDrawerS',function(){
					this.$refs.showRight.open();
				})
			})
		}
	}
</script>

<style lang="less">
	.login_avarat{
	display: flex;
	width: 200upx;
		text{
			display: block;
			margin: auto 0;
			padding-left: 30upx;
			font-size: 40upx;
			font-weight: 800;
		}
	}
	.iconfont{
		color: #888;
		padding: 10upx;
	}
	.card_box1 {
		display: flex;
	}
	
	.card_text {
		font-size: 30upx;
		font-weight: 400;
		padding: 30upx;
		
	}
	.card_text text:nth-child(1){
		padding-left: 10upx;
	}
	
	.card_box1 .card_text:nth-child(1) {
		border-bottom: 1upx solid #F1F1F1;
	}
	
	.card_box1 .card_text text:nth-child(3) {
		float: right;
	}
	
</style>
