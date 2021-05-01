const request = (params) => {
	const baseUrl = 'http://lukiot.vipgz4.idcfengye.com'
	return new Promise((resolve,reject) =>{
		uni.request({
			...params,
			url: baseUrl+params.url,
			success:((res) => {
				resolve(res)
			}),
		})
	})
}
module.exports = {request}
