<template>
	<view>
		<view class="player_warp">
			<view class="player_header">
				<view>
					
				</view>
				<view class="player_detail">
					<text>{{musicDetailObj.name}}</text>
					<text>{{musicDetailObj.author}}</text>
				</view>
				<text class="iconfont icon-sandianshuzhuode"></text>
			</view>
			<view class="player_avatar" @click="getLyrics">
				<view class="player_avatarImg" v-if="showLycrics">
					<image :src="musicDetailObj.imgSrc" mode="widthFix"></image>
				</view>
				<view class="player_lycric" v-else>
						<view class="lycric_scroll" >
							<!-- <view class="lycric_scrollmove" :style="lyricMove"> -->
							<scroll-view scroll-y="true" style="height: 100%; width: 100%; touch-action: none;" @scroll="scroll" ref = 'scrollMove' :scroll-top = 'scrollTop' >
									<view v-for='(item,index) in lyric' :key = 'index' :style="[{'color':(index == currentRow? '#ccc':'')},lyricMove]" style="text-align: center; padding: 20upx 0;">
										{{item.text}}
									</view>
							</scroll-view>
							<!-- </view> -->
						</view>
					<view>
					</view>
				</view>
			</view>
			<view class="features_warp">
				<view class="features_l">
					<view class="featuresl_xihuang" @click="favoritesMusicInfo">
						<text class="iconfont icon-xihuan--" v-if="favorites"></text>
						<text class="iconfont icon-xihuan1" v-else></text>

					</view>
					<text class="iconfont icon-xiazai-copy"></text>
					<text class="iconfont icon-changge1"></text>
					<text class="iconfont icon-pinglun"></text>
					<text class="iconfont icon-sandianshuzhuode"></text>
				</view>
			</view>

			<view class="player_footer">
				<view class="player_slider">
					<text>{{current1}}</text>
					<slider block-size='12' activeColor="#ccc" backgroundColor='#A4A4A4' :value='current'
						:max="duration" @changing="seek = true, current=$event.detail.value"
						@change="audio.seek($event.detail.value)" />
					<text>{{duration1}}</text>
				</view>
				<view class="player_audio">
					<view class="cycle">
						<text class="iconfont icon-list-loop" v-show="index == 1" :data-index='1'
							@click="audioLoop"></text>
						<text class="iconfont icon-danquxunhuan" v-show="index == 2" :data-index='2'
							@click="audioCycle"></text>
						<text class="iconfont icon-suiji-copy" v-show="index == 3" :data-index='3'
							@click="stochastic"></text>
					</view>
					<view class="player_previous">
						<text class="iconfont icon-shangyishoushangyige"></text>
					</view>
					<view class="player_broadcast">
						<text class="iconfont icon-bofang7" v-if="paused" @click="audioPlay"></text>
						<text class="iconfont icon-zantingtingzhi" v-else @click="audioPause"></text>
					</view>
					<view class="player_next">
						<text class="iconfont icon-xiayishou"></text>
					</view>
					<view class="plaryer_currentlyPlaying">
						<text class="iconfont icon-jiaru"></text>
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
				audio: uni.getBackgroundAudioManager(),
				current: 0, //当前进度(s)
				duration: 0, //总时长(s)
				paused: true, //是否处于暂停状态
				loading: false, //是否处于读取状态
				seek: false, //是否处于拖动状态
				current1: '00:00', //当前进度(s)
				duration1: '00:00', //总时长(s)
				index: 1,
				id: '',
				musicDetail: '',
				musicUrl: '',
				musicDetailObj: {
					name: '',
					author: '',
					imgSrc: ''
				},
				src:'',
				activeTranform: 'activeTranform',
				marquee:'scrollText',
				lyric:[],
				showLycrics:true,
				lyric1:[],
				lyricMove:'',
				currentRow:'',
				s:'',
				scrollTop: 0,
				old: {
				    scrollTop: 0
				},
				favorites: false ,//是否收藏
				favoritesMusic: [] //收藏的歌曲
			}
		},
		methods: {
			audioPlay() {
				this.audio.play()
				this.loading = true
				this.paused = false
				if(!this.audio.src){
					this.audio.title = this.musicDetailObj.name
					this.audio.src = this.src
				}
			},
			audioPause() {
				this.audio.pause()
				this.paused = true
			},
			// 点击事件单曲循环
			audioLoop(e) {
				this.index = 2
			},
			audioCycle(e) {
				this.index = 3
			},
			stochastic(e) {
				this.index = 1
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 -
					String(Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			// 请求头像和歌曲url
			async getMusicDetail() {
				try{
					let musicDetail = await request({
						url: "/song/detail",
						data: {
							ids: this.id
						}
					})
					this.musicDetail = musicDetail.data.songs[0]
					let musicUrl = await request({
						url: '/song/url',
						data: {
							id: this.id
						}
					})
					this.musicDetailObj.name = this.musicDetail.name
					this.musicDetailObj.author = this.musicDetail.ar[0].name
					this.musicDetailObj.imgSrc = this.musicDetail.al.picUrl
					let src = musicUrl.data.data[0].url
					this.src = src
					this.audio.title = this.musicDetail.name
					this.audio.src = src
				}catch(e){
					if(e){
						uni.switchTab({
							url:'../popular/popular'
						})
					}
				}
			},
			async getLyrics(){
				let res = await request({url:'/lyric',data:{
					id:this.id
				}})
				
				// this.lycric = res.data.lrc.lyric.replace(/\s*\n*\[.*?\]\s*/g,'\n')
				// this.lycric = res.data.lrc.lyric
				this.showLycrics = !this.showLycrics
				this.formatLyric(res.data.lrc.lyric)
			},
			//传入初始歌词文本text
			formatLyric(text) {
			      let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
			      let row = arr.length; //获取歌词行数
				  // console.log(arr)
			      for (let i = 0; i < row; i++) {
			        let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
			        let temp_arr = temp_row.split("]");//我们可以通过“]”对时间和文本进行分离
			        let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
			        //再对剩下的歌词时间进行处理
			        temp_arr.forEach(element => {
			          let obj = {};
			          let time_arr = element.substr(1, element.length - 1).split(":");//先把多余的“[”去掉，再分离出分、秒
					  // console.log(time_arr)
			          let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
					  // console.log(s)
					  this.s = s
			          obj.time = s;
			          obj.text = text;
			          this.lyric.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
			        });
			       }
			      this.lyric.sort(this.sortRule); //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
			      // this.$store.commit("setLyric", this.lyric); s//把歌词提交到store里，为了重新进入该组件时还能再次渲染
				  // console.log(this.lyric)
			    },
			    sortRule(a, b) { //设置一下排序规则
			      return a.time - b.time;
			    },
				scroll (e) {
					// this.scrollTop = e.detail.scrollTop;
				},
				// 点击收藏事件
				favoritesMusicInfo () {
					let cartMusic = uni.getStorageSync('favoritesMusic') || []
					let index = cartMusic.findIndex(v => v === this.id)
					if(index === -1) {
						cartMusic.push(this.id)
						this.favorites = true
						uni.showToast({
							title:'已经收藏'
						})
					}else {
						cartMusic.splice(index,1,)
						this.favorites = false
						uni.showToast({
							title:'已经取消收藏'
						})
					}
					uni.setStorageSync('favoritesMusic',cartMusic)	
				}
 		},
		created() {
			// #ifdef MP-WEIXIN
				this.audio =  uni.getBackgroundAudioManager()
			// #endif
			
			// #ifdef H5 || APP-PLUS
				this.audio = uni.createInnerAudioContext()
			// #endif
			
			this.audio.onPlay(() => {
				this.loading = false
				this.paused = false
			})
			//音频停止事件
			this.audio.onStop(() => {
				this.paused = true
			})
			// 音频暂停事件
			this.audio.onPause(() => {
				this.paused = true
			})
			this.audio.onEnded(() => {
				this.paused = true
			})
			// #ifdef H5
				this.audio.onTimeUpdate(() => {
					if (!this.seek) {
						this.current = parseInt(this.audio.currentTime)
						// console.log(this.current)s
						this.current1 = this.format(this.audio.currentTime)
						// console.log(this.current1)
					}
					if (!this.duration) {
						this.duration = this.audio.duration
						this.duration1 = this.format(this.audio.duration)
					}
				})
				this.audio.onSeeked(() => {
					this.seek = false
				})
				//音频完成更改进度事件
				this.audio.onSeeked(() => {
					this.seek = false
				})
			// #endif
			// 判断此歌曲是否被收藏
			let favoritesInfo =  uni.getStorageSync('favoritesMusic')||[]
			let index = favoritesInfo.findIndex(v => v === this.id)
			if(!(index === -1)){
				this.favorites = true
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getMusicDetail()
			//音频进度更新事件
			this.audio.onTimeUpdate(() => {
				if (!this.seek) {
					this.current = this.audio.currentTime
					// console.log(this.audio.currentTime)
					this.current1 = this.format(this.audio.currentTime)
					// console.log(this.current1)
					this.lyricCurrent()
				}
				if (!this.duration) {
					this.duration = this.audio.duration
					this.duration1 = this.format(this.audio.duration)
				}
			})
		},
		beforeDestroy() {
			// #ifdef H5
				this.audio.destroy()
			// #endif
		},
		watch:{
			    current: function() {
			    this.lyric.forEach((element, index) => {
			        if (this.current == element.time) {
						// this.scrollTop = this.old.scrollTop
						// this.$refs.scrollMove["scroll-Top"] = -index *16
						this.scrollTop = index * 34
					  // this.lyricMove = 'top:' + -index * 16 + 'upx'
					  // console.log(this.scrollTop)
					  // console.log(index)
			          this.currentRow = index; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
			        }
			      })
			    }
		}
	}
</script>

<style lang="less">
	.player_warp {
		background-color: #7F7F7F;
		height: 10%vh;
		.player_header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.icon-fanhui2-copy {}
			
			.player_detail {
				display: flex;
				flex-direction: column;
				align-items: center;
				text:nth-child(1){
					width: 100%;
					color: #FEFEFE;
					font-size: 40upx;
					font-weight: 1000;
						overflow: hidden !important;
						text-overflow: ellipsis !important;
						display: -webkit-box !important;
						-webkit-line-clamp: 1; //文字上限行
						-webkit-box-orient: vertical;
				}
				text:nth-child(2){
					color: #E6E6E6;
					font-size: 25upx;
				}
				
			}
		}

		.player_avatar {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 742upx;
			.player_lycric{
				width: 100%;
				height: 100%;
				white-space: pre-wrap;
				.lycric_scroll{
					width: 100%;
					height: 100%;
					position: relative;
					.lycric_scrollmove{
						width: 100%;
						text-align: center;
						position: absolute;
						overflow: scroll;
						height: 100%;
					}
				}
			}
			.player_avatarImg {
				width: 300upx;
				height: 300upx;
				display: flex;
				align-items: center;
				image {
					width: 100%;
				}
			}
		}

		.features_warp {
			padding: 50upx 0;
			height: 10%vh;
			.features_l {
				display: flex;
				justify-content: space-around;
				.featuresl_xihuang{
					.icon-xihuan--{
						color: #F76260;
					}
				}
				.iconfont {}
			}
		}

		.player_footer {
			height: 10%vh;
			.player_slider {
				display: flex;
				justify-content: space-around;
				align-items: center;

				slider {
					width: 400upx;
					margin: 0 auto;
					padding: 20upx;
				}

				text {
					padding: 0 30upx;
				}

			}

			.player_audio {
				display: flex;
				justify-content: space-around;
				align-items: center;
				height: 200upx;

				.cycle {
					.iconfont {}
				}

				.player_broadcast {
					.iconfont {
						font-size: 50upx;
					}
				}
			}
		}

	}
	.activeTranform{
		animation: rotate 10s infinite linear;
	}
.marquee {
	white-space: nowrap;
	overflow: -webkit-marquee;
	-webkit-marquee-direction:left;
	-webkit-marquee-speed:nomal;
	-webkit-marquee-style:scroll;
	-webkit-marquee-repetition:infinite;
// 　　white-space: nowrap;　　/* 文字不折行 */
// 　　overflow:-webkit-marquee;　　/* 只有设置为marquee才有滚动效果 */
// 　　width: 170px;　/* 不是必须的 */
// 　　-webkit-marquee-direction:left;　　/* 文字滚动方向 可选值为left | right | up | down */
// 　　-webkit-marquee-speed:normal;　　/* 文字滚动速度 可选值为slow | normal | fast */
// 　　-webkit-marquee-style:scroll;　　/* 文字滚动方式 可选值为scroll | slide | alternate */
// 　　-webkit-marquee-repetition:1; 　　/* 文字滚动次数 number | infinite ， infinite即无限次循环滚动 */
}
	.scrollText{
		animation: myfirst 5s infinite linear;
		float: left;
	}
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
}
@keyframes myfirst {
	0% {
	left:0px;
}
25% {
	left:60px;
}
50% {
	left:120px;
}
75% {
	left:-120px;
}
100% {
	left:0px;
}
}
</style>
