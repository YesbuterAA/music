<template>
	<view>
		<uniNavBar left-text="返回" right-text="我的" title="注册账号" @clickLeft="handleLeftBack" @clickRight="handeRightHome">
		</uniNavBar>
		<uni-card>
			<uni-forms :value="formData" ref="form">
			    <uni-forms-item label="手机号码" name="name">
			        <uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号码" />
			    </uni-forms-item>
			    <uni-forms-item label="验证码" name="VerificationCode">
					<uni-easyinput type="text" v-model="formData.VerificationCode" placeholder="请输入验证码" />
					<text class="forms_code" @click="getVerificationCode">点击获取验证码</text>
			    </uni-forms-item>
				<uni-forms-item label="密码" name="name">
				    <uni-easyinput type="text" v-model="formData.password" placeholder="请输入密码" password/>
				</uni-forms-item>
				<uni-forms-item label="昵称" name="name">
				    <uni-easyinput type="text" v-model="formData.name" placeholder="请输入昵称" />
				</uni-forms-item>
			    <button @click="submitForm">注册</button>
			</uni-forms>
		</uni-card>
		<!-- 弹出信息 -->
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
	            formData:{
	                phone:'',
	                password:'',
					name:'',
					VerificationCode:''
	            },
				message:'',
				code:''
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
			async getVerificationCode() {
				let phone = this.formData.phone
				let result = await request({url:'/captcha/sent',data:{phone}})
			},
	        async submitForm(form) {
				if(this.formData.name&&this.formData.phone&&this.formData.password&&this.formData.VerificationCode){
					let regisered = await request({url:'/cellphone/existence/check',data:{
						phone:this.formData.phone
					}})
					if(regisered.data.name){
						console.log(2)
						this.message = '账号已注册'
						this.$refs.popup.open()
					}else{
						let VerificationCodeRes = await request({url:'/captcha/verify',data:{
							phone:this.formData.phone,
							captcha:this.formData.VerificationCode
						}})
						if(!VerificationCodeRes.data.data){
							// consoel.log(3)
							this.message = VerificationCodeRes.data.message
							// this.open()
							this.$refs.popup.open()
						}else{
								let result = await request({url:'/register/cellphone',data:{
									phone:this.formData.phone,
									captcha:this.formData.VerificationCode,
									password:this.formData.password,
									nickName:this.formData.name
								}})
								// console.log(result)
								uni.navigateTo({
									url:'../login/login'
								})
						}
					}
				}else{
					this.message = '请输入完整'
					this.$refs.popup.open()
				}
	        }
	    },
		components:{
			uniNavBar
		}
	}
</script>

<style lang="less">
	uni-froms{
		margin-top: 10upx;
	}
	.forms_code{
		display: block;
		width: 230upx;
		height: 50upx;
		border: 1upx solid #ccc;
		margin-top: 20upx;
		background-color: #F8F8F8;
		border-radius: 10upx;
		text-align: center;
		line-height: 50upx;
	}
</style>
