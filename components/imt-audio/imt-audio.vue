<template>
	<view>
		<view class="audio_warp">
			<view class="audio_image"  :style="{backgroundImage: 'url(' + pic + ')'}">
				<text class="iconfont icon-bofang" v-if="paused" @click="play()" style="color: #fff;"></text>
				<text class="iconfont icon-zanting" v-else @click="audio.pause()" style="color: #fff;"></text>
			</view>
			<view class="audio_text" style="width: 100%;">
				<text class="audio_name">{{name}}</text>
				<text class="audio_author">{{author}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				audio: uni.createInnerAudioContext(),
				current: 0, //当前进度(s)
				duration: 0, //总时长(s)
				paused: true, //是否处于暂停状态
				loading: false, //是否处于读取状态
				seek: false, //是否处于拖动状态
				newSongPic:[],
			}
		},
		props: {
			src: String, //音频链接
			autoplay: Boolean, //是否自动播放
			continue: Boolean, //播放完成后是否继续播放下一首，需定义@next事件
			control: {
				type: Boolean,
				default: true
			}, //是否需要上一曲/下一曲按钮
			color: {
				type: String,
				default: '#169af3'
			}, //主色调
			src: String,
			pic: String,
			name: "",
			author:""
		},
		methods: {
			//返回prev事件
			prev() {
				this.$emit('prev')
			},
			//返回next事件
			next() {
				this.$emit('next')
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//点击播放按钮
			play() {
				this.audio.play()
				this.loading = true
			},
			getNewSongsInfo() {
				// this.newSongsPic = uni.getStorageSync('newSongs')
				// console.log(this.newSongsPic)
			}
		},
		created() {
			this.getNewSongsInfo()
			if (this.src) {
				this.audio.src = this.src
				this.autoplay && this.play()
			}
			this.audio.obeyMuteSwitch = false
			//音频进度更新事件
			this.audio.onTimeUpdate(() => {
				if (!this.seek) {
					this.current = this.audio.currentTime
				}
				if (!this.duration) {
					this.duration = this.audio.duration
				}
			})
			//音频播放事件
			this.audio.onPlay(() => {
				this.paused = false
				this.loading = false
			})
			//音频暂停事件
			this.audio.onPause(() => {
				this.paused = true
			})
			//音频结束事件
			this.audio.onEnded(() => {
				if (this.continue) {
					this.next()
				} else {
					this.paused = true
					this.current = 0
				}
			})
			//音频完成更改进度事件
			this.audio.onSeeked(() => {
				this.seek = false
			})
		},
		beforeDestroy(){
			this.audio.destroy()
		},
		watch: {
			src(src, old) {
				this.audio.src = src
				this.current = 0
				this.duration = 0
				if (old || this.autoplay) {
					this.play()
				}
			}
		}
	}
</script>

<style lang="less">
	uni-view:nth-child(3) > uni-view > uni-view > uni-view.audio_text {
		border-bottom: none;
	}
	.audio_warp {
		display: flex;
		padding: 20upx;
		background-color: #fff;
		.audio_image{
			width: 200upx;
			height: 130upx;
			background-size: 200upx 130upx;
			border-radius: 20upx;
			display: flex;
			justify-content: center;
			align-items: center;
			text{
				line-height: 100upx;
				font-size: 50upx;
			}
		}
		.audio_text{
			display:flex;
			justify-content: start;
			border-bottom: 1upx solid #F1F1F1;
			.audio_name{
				line-height: 130upx;
				font-size: 30upx;
				letter-spacing: 3upx;
				font-weight: 1000;
			}
		}
	}
</style>
