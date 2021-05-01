<template>
	<view>
		<!-- 导航栏 -->
		<uniNavBar left-text="返回" right-text="我的" title="登录" @clickLeft="handleLeftBack" @clickRight="handeRightHome">
		</uniNavBar>
		<!-- 登录页面 -->
		<!-- 登录导航 -->
		<view class="login_phone">
			<view class="">
				<view class="login_from">
					<input type="text"  placeholder="手机号码" placeholder-class="placeholder" @input="handlePhoneValue" />
				</view>
				<view class="login_from">
					<input type="text" :value="loginPassword" placeholder-class="placeholder" placeholder="密码" password="true" @input='handlePasswordValue'/>
				</view>
			</view>
		</view>
		<view class="login_bar">
			<button type="default" size="mini" @click="loginPhone" style="font-size: 30upx;font-weight: 1000;color: #3B4144;">手机登录</button>
			<button type="default" size="mini" @click="loginEami" style="font-size: 30upx;font-weight: 1000;color: #3B4144;">邮箱登录</button>
		</view>
		<!-- 没有账号点击注册 -->
		<!-- -->
		<view class="login_registered">
			<navigator url="../register/register">
				<text>点击注册</text>
			</navigator>
		</view>
		
		<uni-popup ref="popup" type="message">
			<uni-popup-message type="error" :message="message" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import uniNavBar from '../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
	import {request} from '../../request/request.js'
	export default {
		data() {
			return {
				status: false,
				loginValue: '',
				loginPassword: '',
				message:''
			}
		},
		methods: {
			handleLeftBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			handeRightHome() {
				uni.switchTab({
					url: '../homePage/homePage'
				})
			},
			/**
			 * 登录前需要对数据进行验证 手机号码 点击邮箱登录 进行弹出信息 邮箱登录一样
			 * 
			 */
			handlePhoneValue (e) {
				// console.log(e.detail)
				this.loginValue = e.detail.value
			},
			handlePasswordValue(e){
				this.loginPassword = e.detail.value
			},
			PhoneNum(value) {
				return /^1[3-9]\d{9}$/.test(value);
			},
			async loginPhone() {
				let res = this.PhoneNum(this.loginValue)
				if(!res){
					this.message = '请输入正确的账号'
					this.open()
				}else{
					let result = await request({url:'/login/cellphone',data:{
						phone:this.loginValue,
						password:this.loginPassword
					}})
					console.log(result)
					console.log(result.data.code)
					console.log(this)
					if(result.data.code === 501){
						this.message = result.data.message
						this.open()
					}else if(result.data.code == 502) {
						this.message = result.data.message
						this.open()
					}else if(result.data.code === 200) {
						await request({url:'/login/refresh'})
						uni.setStorageSync('login',result)
						uni.setStorageSync('status','true')
						uni.switchTab({
							url:'../homePage/homePage'
						})
					}else {
						this.message = '出现未知错误，请联系技术员'
						this.open()
					}
				}
			},
			open() {
				// 通过组件定义的ref调用uni-popup方法
				this.$refs.popup.open()
			}
		},
		components: {
			uniNavBar
		}
	}
</script>

<style lang="less">
	.login_bar {
		display: flex;
		// justify-content: flex-start;
		justify-content: flex-end;
		padding-right: 126upx;
		margin-top: 20upx;

		button {
			margin: 0;
			padding: 0;
			margin-left: 30upx;
			width: 150upx;
		}
	}

	.placeholder {
		color: #888;
		margin-left: 15upx;
		font-size: 30upx;
		font-weight: 800;
	}

	.login_from {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 20upx;

		input {
			flex: 3;
			border: 1upx solid #ccc;
			width: 500upx;
			height: 40upx;
			border-radius: 20upx;
		}
	}
	.login_registered {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-right: 126upx;
		margin-top: 30upx;
		navigator{
			text{
				display: block;
				border: 1upx solid #ccc;
				width: 150upx;
				background-color: #F8F8F8;
				border-radius: 10upx;
				padding: 10upx;
				text-align: center;
				font-size: 30upx;
				font-weight: 1000;
				color: #3B4144;
			}
		}
	}
</style>
