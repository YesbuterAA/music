<template>
	<view>
1111
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:''
			}
		},
		methods: {
			
		},
		created() {
			uni.request({
				url:'http://39.105.38.10:8081/movie/playing?city=guangzhou',
				success: res => {
					console.log(res)
				}
			})
			
		},
		onLoad(e) {
			var test0 = {
				'test':'test',
				'test1':0
			}
			// this.detail = test0
			console.log(test0)
		}
	}
</script>

<style>

</style>
